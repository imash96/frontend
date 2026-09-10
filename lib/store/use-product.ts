"use client"

import { create } from "zustand"
import { StoreProduct, StoreProductVariant } from "@medusajs/types"
import { addToCart } from "@/lib/action/cart"
import { getProductPrice } from "@/lib/util/get-product-price"

type VariantOptions = Record<string, string | undefined>

type ProductCalculatedPrice = {
    calculated_price_number: any
    calculated_price: string
    original_price_number: any
    original_price: string
    currency_code: any
    price_type: any
    percentage_diff: string
} | null

type ProductState = {
    product: StoreProduct | null
    countryCode: string

    options: VariantOptions
    isPending: boolean

    // derived
    selectedVariant?: StoreProductVariant
    isValidVariant: boolean
    inStock: boolean
    cheapestPrice: ProductCalculatedPrice
    variantPrice: ProductCalculatedPrice

    // actions
    setProduct: (product: StoreProduct, countryCode: string) => void
    setOption: (id: string, value: string) => void
    computeState: () => void
    handleAddToCart: (toggleCartDrawer?: () => void) => Promise<void>
}

/* ───────────────── helpers ───────────────── */

const optionsAsKeymap = (variantOptions: StoreProductVariant["options"]) =>
    variantOptions?.reduce((acc: Record<string, string>, v: any) => {
        acc[v.option_id] = v.value
        return acc
    }, {})

const areOptionsEqual = (a?: VariantOptions, b?: VariantOptions) => {
    if (!a || !b) return false
    const keys = Object.keys(a)
    if (keys.length !== Object.keys(b).length) return false
    return keys.every((k) => a[k] === b[k])
}

/* ───────────────── store ───────────────── */

export const useProductStore = create<ProductState>((set, get) => ({
    product: null,
    countryCode: "",

    options: {},
    isPending: false,

    selectedVariant: undefined,
    isValidVariant: false,
    inStock: false,
    cheapestPrice: null,
    variantPrice: null,

    /* ───── init ───── */
    setProduct: (product, countryCode) => {
        set({
            product,
            countryCode,
            options: {},
        })

        get().computeState()
    },

    /* ───── option change ───── */
    setOption: (id, value) => {
        set((state) => ({
            options: {
                ...state.options,
                [id]: value,
            },
        }))

        get().computeState()
    },

    /* ───── derived computation ───── */
    computeState: () => {
        const { product, options } = get()
        if (!product) return

        const selectedVariant = product.variants?.find((v) =>
            areOptionsEqual(optionsAsKeymap(v.options), options)
        )

        const isValidVariant =
            product.variants?.some((v) =>
                areOptionsEqual(optionsAsKeymap(v.options), options)
            ) ?? false

        const { cheapestPrice, variantPrice } = getProductPrice({
            product,
            variantId: selectedVariant?.id,
        })

        let inStock = false
        if (selectedVariant) {
            if (!selectedVariant.manage_inventory) inStock = true
            else if (selectedVariant.allow_backorder) inStock = true
            else inStock = (selectedVariant.inventory_quantity || 0) > 0
        }

        set({
            selectedVariant,
            isValidVariant,
            cheapestPrice,
            variantPrice,
            inStock,
        })
    },

    /* ───── add to cart ───── */
    handleAddToCart: async (toggleCartDrawer) => {
        const { selectedVariant, countryCode } = get()

        if (!selectedVariant?.id) return

        set({ isPending: true })

        try {
            await addToCart({
                variantId: selectedVariant.id,
                quantity: 1,
                countryCode,
            })

            toggleCartDrawer?.()
        } finally {
            set({ isPending: false })
        }
    },
}))