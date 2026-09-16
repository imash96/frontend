"use client"

import { create } from "zustand"
import { devtools } from "zustand/middleware"
import type { StoreProduct, StoreProductVariant } from "@medusajs/types"
import { addToCart } from "@/lib/action/cart"
import { getProductPrice, type ProductCalculatedPrice } from "@/lib/util/get-product-price"

type VariantOptions = Record<string, string | undefined>

type ProductState = {
    product: StoreProduct | null
    countryCode: string
    options: VariantOptions
    quantity: number
    isPending: boolean
    lastError: string | null

    // derived — recomputed by computeState() whenever product/options change
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
    computeState: () => void
    handleAddToCart: () => Promise<boolean>
    reset: () => void
}

const optionsAsKeymap = (variantOptions: StoreProductVariant["options"]): VariantOptions =>
    (variantOptions ?? []).reduce((acc: VariantOptions, v: any) => {
        acc[v.option_id] = v.value
        return acc
    }, {})

const areOptionsEqual = (a: VariantOptions, b: VariantOptions) => {
    const aKeys = Object.keys(a)
    const bKeys = Object.keys(b)
    if (aKeys.length === 0 || aKeys.length !== bKeys.length) return false
    return aKeys.every((k) => a[k] !== undefined && a[k] === b[k])
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
                // Pre-fill any option that only has one possible value — there's
                // nothing to choose, so the shopper should never have to interact
                // with it for the variant to become selectable.
                const autoOptions: VariantOptions = {}
                product.options?.forEach((option) => {
                    if (option.values?.length === 1) {
                        autoOptions[option.id] = option.values[0].value
                    }
                })

                set({ ...DEFAULT_SLICE, product, countryCode, options: autoOptions })
                get().computeState()
            },

            setOption: (optionId, value) => {
                set((state) => ({ options: { ...state.options, [optionId]: value }, lastError: null }))
                get().computeState()
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

            computeState: () => {
                const { product, options } = get()
                if (!product) return

                const selectedVariant = product.variants?.find((v) =>
                    areOptionsEqual(optionsAsKeymap(v.options), options)
                )

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

                set((state) => ({
                    selectedVariant,
                    isValidVariant: Boolean(selectedVariant),
                    cheapestPrice,
                    variantPrice,
                    inStock,
                    availableQuantity,
                    quantity: Math.min(state.quantity, Math.max(1, availableQuantity ?? 99)),
                }))
            },

            handleAddToCart: async () => {
                const { selectedVariant, countryCode, quantity, isPending } = get()
                if (!selectedVariant?.id || isPending) return false

                set({ isPending: true, lastError: null })
                try {
                    await addToCart({ variantId: selectedVariant.id, quantity, countryCode })
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