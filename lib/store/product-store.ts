import type { StoreProduct, StoreProductImage, StoreProductVariant } from "@medusajs/types"
import { create } from "zustand"
import { devtools } from "zustand/middleware"
import { addToCart } from "@/lib/action/cart"
import { getProductPrice, type ProductCalculatedPrice } from "@/lib/util/get-product-price"

export type VariantOptions = Record<string, string | undefined>

type ProductState = {
    product: StoreProduct | null
    countryCode: string
    options: VariantOptions
    quantity: number
    isPending: boolean
    lastError: string | null

    // derived - recomputed inline whenever product/options change
    selectedVariant?: StoreProductVariant
    isValidVariant: boolean
    inStock: boolean
    availableQuantity: number | null
    cheapestPrice: ProductCalculatedPrice
    variantPrice: ProductCalculatedPrice

    setProduct: (product: StoreProduct, countryCode: string) => void
    setOption: (optionId: string, value: string) => void
    setQuantity: (quantity: number) => void
    incrementQuantity: () => void
    decrementQuantity: () => void
    handleAddToCart: (metadata?: Record<string, unknown>) => Promise<boolean>
    reset: () => void
}

export const optionsAsKeymap = (variantOptions: StoreProductVariant["options"]): VariantOptions =>
    (variantOptions ?? []).reduce((acc: VariantOptions, v: any) => {
        // option_id may not be in the API response when only `variants.options.option`
        // is requested — fall back to the nested relation's id
        const key = v.option_id ?? v.option?.id
        if (key) acc[key] = v.value
        return acc
    }, {})

const areOptionsEqual = (a: VariantOptions, b: VariantOptions) => {
    const aKeys = Object.keys(a)
    const bKeys = Object.keys(b)
    if (aKeys.length !== bKeys.length) return false
    // Both empty → match (single-variant product with no options)
    if (aKeys.length === 0) return true
    return aKeys.every((k) => a[k] !== undefined && a[k] === b[k])
}

export function isVariantInStock(v?: StoreProductVariant | null): boolean {
    if (!v) return false
    if (!v.manage_inventory) return true
    if (v.allow_backorder) return true
    return (v.inventory_quantity ?? 0) > 0
}

/**
 * Checks whether selecting `value` for `optionId` (given `currentOptions`)
 * matches at least one variant that is in stock.
 */
export function isOptionValueInStock(
    product: StoreProduct | null | undefined,
    currentOptions: VariantOptions,
    optionId: string,
    value: string
): boolean {
    if (!product?.variants?.length) return true
    const testOptions = { ...currentOptions, [optionId]: value }
    // Check if there is an exact match with current other options that is in stock
    const exactMatch = product.variants.find((v) => {
        const map = optionsAsKeymap(v.options)
        return Object.entries(testOptions).every(([k, val]) => !val || map[k] === val)
    })
    if (exactMatch) return isVariantInStock(exactMatch)

    // Otherwise check if any variant with this option value is in stock
    return product.variants.some((v) => {
        const map = optionsAsKeymap(v.options)
        return map[optionId] === value && isVariantInStock(v)
    })
}

/**
 * Computes derived state (selected variant, pricing, stock) from current
 * product and selected options. Called inline within setProduct/setOption
 * to produce a single atomic state update instead of two sequential ones.
 */
function computeDerived(product: StoreProduct, options: VariantOptions, currentQuantity: number) {
    const variants = product.variants ?? []

    // For products with no options, auto-select the first variant
    let selectedVariant: StoreProductVariant | undefined
    if (variants.length === 1 && Object.keys(options).length === 0) {
        selectedVariant = variants[0]
    } else {
        selectedVariant = variants.find((v) =>
            areOptionsEqual(optionsAsKeymap(v.options), options)
        )
    }

    const { cheapestPrice, variantPrice } = getProductPrice({
        product,
        variantId: selectedVariant?.id,
    })

    let inStock = false
    let availableQuantity: number | null = null

    if (selectedVariant) {
        if (!selectedVariant.manage_inventory) {
            inStock = true
        } else if (selectedVariant.allow_backorder) {
            inStock = true
            availableQuantity = selectedVariant.inventory_quantity ?? null
        } else {
            availableQuantity = selectedVariant.inventory_quantity ?? 0
            inStock = availableQuantity > 0
        }
    }

    return {
        selectedVariant,
        isValidVariant: Boolean(selectedVariant),
        cheapestPrice,
        variantPrice,
        inStock,
        availableQuantity,
        quantity: Math.min(currentQuantity, Math.max(1, availableQuantity ?? 99)),
    }
}

const DEFAULT_SLICE = {
    product: null as StoreProduct | null,
    countryCode: "",
    options: {} as VariantOptions,
    quantity: 1,
    isPending: false,
    lastError: null as string | null,
    selectedVariant: undefined as StoreProductVariant | undefined,
    isValidVariant: false,
    inStock: false,
    availableQuantity: null as number | null,
    cheapestPrice: null as ProductCalculatedPrice,
    variantPrice: null as ProductCalculatedPrice,
}

export const useProductStore = create<ProductState>()(
    devtools(
        (set, get) => ({
            ...DEFAULT_SLICE,

            setProduct: (product, countryCode) => {
                const autoOptions: VariantOptions = {}

                // Pre-fill from the first in-stock variant (or first variant by rank)
                const sortedVariants = [...(product.variants ?? [])].sort(
                    (a, b) => ((a as any).variant_rank ?? Infinity) - ((b as any).variant_rank ?? Infinity)
                )
                const defaultVariant =
                    sortedVariants.find((v) => isVariantInStock(v)) ?? sortedVariants[0]

                if (defaultVariant?.options) {
                    const mapped = optionsAsKeymap(defaultVariant.options)
                    for (const [k, v] of Object.entries(mapped)) {
                        if (v) autoOptions[k] = v
                    }
                }

                // Ensure any single-value option is also populated
                product.options?.forEach((option) => {
                    if (option.values?.length && !autoOptions[option.id]) {
                        autoOptions[option.id] = option.values[0].value
                    }
                })

                const derived = computeDerived(product, autoOptions, 1)
                set({
                    ...DEFAULT_SLICE,
                    product,
                    countryCode,
                    options: autoOptions,
                    ...derived,
                })
            },

            setOption: (optionId, value) => {
                const state = get()
                const nextOptions = { ...state.options, [optionId]: value }

                if (!state.product) {
                    set({ options: nextOptions, lastError: null })
                    return
                }

                const derived = computeDerived(state.product, nextOptions, state.quantity)
                set({
                    options: nextOptions,
                    lastError: null,
                    ...derived,
                })
            },

            setQuantity: (quantity) => {
                const max = get().availableQuantity ?? 99
                set({ quantity: Math.min(Math.max(1, Math.trunc(quantity) || 1), Math.max(1, max)) })
            },

            incrementQuantity: () => {
                const { quantity, availableQuantity } = get()
                const max = availableQuantity ?? 99
                if (quantity < max) set({ quantity: quantity + 1 })
            },

            decrementQuantity: () => {
                const { quantity } = get()
                if (quantity > 1) set({ quantity: quantity - 1 })
            },

            handleAddToCart: async (metadata?: Record<string, unknown>) => {
                const { selectedVariant, countryCode, quantity, isPending } = get()
                if (!selectedVariant?.id || isPending) return false

                set({ isPending: true, lastError: null })
                try {
                    await addToCart({
                        variantId: selectedVariant.id,
                        quantity,
                        countryCode,
                        metadata,
                    })
                    return true
                } catch (error) {
                    set({ lastError: error instanceof Error ? error.message : "Could not add this item to your bag." })
                    return false
                } finally {
                    set({ isPending: false })
                }
            },

            reset: () => set(DEFAULT_SLICE),
        }),
        { name: "ProductStore", enabled: process.env.NODE_ENV === "development" }
    )
)

// ─── Cached first-variant lookup ───

const firstVariantCache = new WeakMap<StoreProduct, StoreProductVariant | null>()

function getFirstVariant(product: StoreProduct): StoreProductVariant | null {
    if (firstVariantCache.has(product)) return firstVariantCache.get(product)!
    const variants = product.variants ?? []
    if (variants.length === 0) {
        firstVariantCache.set(product, null)
        return null
    }
    const sorted = [...variants].sort(
        (a, b) => ((a as any).variant_rank ?? Infinity) - ((b as any).variant_rank ?? Infinity)
    )
    firstVariantCache.set(product, sorted[0])
    return sorted[0]
}

export function getDisplayImages(product: StoreProduct, selectedVariant?: StoreProductVariant): StoreProductImage[] {
    const productImages = product.images ?? []

    if (selectedVariant) {
        const variantImages = selectedVariant.images
        return variantImages && variantImages.length > 0 ? variantImages : productImages
    }

    const firstVariant = getFirstVariant(product)
    if (firstVariant?.images && firstVariant.images.length > 0) {
        return firstVariant.images
    }

    return productImages
}

// ─── Swatch URL lookup ───

const swatchMapCache = new WeakMap<StoreProduct, Map<string, string>>()

function getSwatchMap(product: StoreProduct): Map<string, string> {
    if (swatchMapCache.has(product)) return swatchMapCache.get(product)!

    const map = new Map<string, string>()
    const variants = product.variants ?? []

    for (const v of variants) {
        const colorOpt = v.options?.find((o) => {
            const title = (o as any).option?.title?.toLowerCase?.() ?? ""
            return title === "color" || title === "colour"
        })
        if (colorOpt && colorOpt.value && !map.has(colorOpt.value)) {
            const url = v.thumbnail ?? (v.images && v.images.length > 0 ? v.images[0].url : null)
            if (url) {
                map.set(colorOpt.value, url)
            }
        }
    }

    swatchMapCache.set(product, map)
    return map
}

export function getSwatchUrl(product: StoreProduct, colorValue: string): string | null {
    const map = getSwatchMap(product)
    return map.get(colorValue) ?? product.images?.[0]?.url ?? null
}
