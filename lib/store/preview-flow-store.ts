import type {
    StoreCart,
    StoreCartAddress,
    StoreCartLineItem,
    StoreCartShippingOption,
    StoreCustomer,
    StorePaymentProvider,
    StoreProduct,
} from "@medusajs/types"
import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"
import {
    PREVIEW_CUSTOMER,
    PREVIEW_DEFAULT_CART,
    PREVIEW_PAYMENT_PROVIDERS,
    PREVIEW_SHIPPING_METHODS,
} from "@/data/preview-data"

export type CheckoutStepId = "address" | "shipping" | "payment"
export type CheckoutViewMode = "stepped" | "single"

export type ConfirmedPreviewOrder = {
    id: string
    displayId: string
    transactionId: string
    createdAt: string
    email: string
    paymentProviderId: string
    paymentLabel: string
    paymentDetails?: Record<string, string>
    shippingAddress: StoreCartAddress | null
    billingAddress: StoreCartAddress | null
    shippingMethodName: string
    estimatedDelivery: string
    giftWrap: boolean
    giftNote: string
    items: StoreCartLineItem[]
    subtotal: number
    discountTotal: number
    shippingTotal: number
    taxTotal: number
    total: number
    currencyCode: string
}

export type AddPreviewItemPayload = {
    id: string
    productId: string
    productTitle: string
    productHandle: string
    thumbnail: string
    variantId: string
    variantTitle: string
    variantSku: string
    unitPrice: number
    originalUnitPrice?: number
    quantity: number
    currencyCode?: string
    metadata?: Record<string, unknown>
}

export interface PreviewFlowState {
    cart: StoreCart
    customer: StoreCustomer | null
    shippingMethods: StoreCartShippingOption[]
    paymentProviders: StorePaymentProvider[]
    activeStep: CheckoutStepId
    viewMode: CheckoutViewMode
    sameAsBilling: boolean
    selectedShippingOptionId: string
    selectedPaymentProviderId: string
    promoCode: string | null
    promoDiscountPercent: number
    giftWrap: boolean
    giftNote: string
    confirmedOrder: ConfirmedPreviewOrder | null

    // Actions
    setActiveStep: (step: CheckoutStepId) => void
    setViewMode: (mode: CheckoutViewMode) => void
    setSameAsBilling: (same: boolean) => void
    saveAddresses: (payload: {
        email: string
        shippingAddress: StoreCartAddress
        billingAddress: StoreCartAddress
        sameAsBilling: boolean
    }) => void
    selectShippingOption: (optionId: string) => void
    selectPaymentProvider: (providerId: string) => void
    setGiftWrap: (enabled: boolean, note?: string) => void
    addPreviewItem: (payload: AddPreviewItemPayload) => void
    addProductToPreviewCart: (payload: {
        product: StoreProduct
        variant: any
        quantity: number
    }) => void
    updateLineItemQuantity: (itemId: string, quantity: number) => void
    removeLineItem: (itemId: string) => void
    applyPromoCode: (rawCode: string) => { success: boolean; message: string }
    removePromoCode: () => void
    completePreviewOrder: (payload: {
        paymentLabel: string
        paymentDetails?: Record<string, string>
    }) => ConfirmedPreviewOrder
    clearConfirmedOrder: () => void
    resetDemoFlow: () => void
    hydrateFromServer: (payload: {
        cart?: StoreCart | null
        customer?: StoreCustomer | null
        shippingMethods?: StoreCartShippingOption[]
        paymentProviders?: StorePaymentProvider[]
    }) => void
}

function recalculateCart(
    cart: StoreCart,
    opts: {
        shippingMethods: StoreCartShippingOption[]
        selectedShippingOptionId: string
        promoCode: string | null
        promoDiscountPercent: number
        giftWrap: boolean
    },
): StoreCart {
    const items = (cart.items ?? []).map((item) => {
        const unit = Number(item.unit_price ?? 420)
        const qty = Number(item.quantity ?? 1)
        return {
            ...item,
            subtotal: unit * qty,
            total: unit * qty,
        }
    }) as StoreCartLineItem[]

    const itemSubtotal = items.reduce(
        (sum, item) => sum + Number(item.unit_price ?? 0) * Number(item.quantity ?? 1),
        0,
    )

    let discountTotal = 0
    if (opts.promoCode === "HERITAGE50") {
        discountTotal = Math.min(50, itemSubtotal)
    } else if (opts.promoDiscountPercent > 0) {
        discountTotal =
            Math.round(itemSubtotal * (opts.promoDiscountPercent / 100) * 100) / 100
    }

    const selectedShip =
        opts.shippingMethods.find((m) => m.id === opts.selectedShippingOptionId) ??
        opts.shippingMethods[0]
    const shippingAmount = Number(selectedShip?.amount ?? 0)
    const giftWrapFee = opts.giftWrap ? 15 : 0
    const totalShippingAndPackaging = shippingAmount + giftWrapFee

    const taxable = Math.max(0, itemSubtotal - discountTotal)
    const taxTotal = Math.round(taxable * 0.08 * 100) / 100
    const total = Math.max(
        0,
        Math.round((taxable + totalShippingAndPackaging + taxTotal) * 100) / 100,
    )

    return {
        ...cart,
        items,
        item_subtotal: itemSubtotal,
        subtotal: itemSubtotal,
        discount_total: discountTotal,
        shipping_subtotal: shippingAmount,
        shipping_total: shippingAmount,
        tax_total: taxTotal,
        total,
    }
}

export const usePreviewFlowStore = create<PreviewFlowState>()(
    devtools(
        persist(
            (set, get) => ({
                cart: recalculateCart(PREVIEW_DEFAULT_CART, {
                    shippingMethods: PREVIEW_SHIPPING_METHODS,
                    selectedShippingOptionId: PREVIEW_SHIPPING_METHODS[0].id,
                    promoCode: null,
                    promoDiscountPercent: 0,
                    giftWrap: false,
                }),
                customer: PREVIEW_CUSTOMER,
                shippingMethods: PREVIEW_SHIPPING_METHODS,
                paymentProviders: PREVIEW_PAYMENT_PROVIDERS,
                activeStep: "address",
                viewMode: "single",
                sameAsBilling: true,
                selectedShippingOptionId: PREVIEW_SHIPPING_METHODS[0].id,
                selectedPaymentProviderId: "pp_paypal_paypal",
                promoCode: null,
                promoDiscountPercent: 0,
                giftWrap: false,
                giftNote: "",
                confirmedOrder: null,

                setActiveStep: (step) => set({ activeStep: step }),
                setViewMode: (viewMode) => set({ viewMode }),
                setSameAsBilling: (sameAsBilling) => set({ sameAsBilling }),

                saveAddresses: ({
                    email,
                    shippingAddress,
                    billingAddress,
                    sameAsBilling,
                }) =>
                    set((state) => ({
                        sameAsBilling,
                        activeStep: "shipping",
                        cart: {
                            ...state.cart,
                            email,
                            shipping_address: shippingAddress,
                            billing_address: billingAddress,
                        },
                    })),

                selectShippingOption: (optionId) =>
                    set((state) => {
                        const updatedCart = recalculateCart(state.cart, {
                            shippingMethods: state.shippingMethods,
                            selectedShippingOptionId: optionId,
                            promoCode: state.promoCode,
                            promoDiscountPercent: state.promoDiscountPercent,
                            giftWrap: state.giftWrap,
                        })
                        return {
                            selectedShippingOptionId: optionId,
                            cart: updatedCart,
                        }
                    }),

                selectPaymentProvider: (providerId) =>
                    set({ selectedPaymentProviderId: providerId }),

                setGiftWrap: (enabled, note) =>
                    set((state) => {
                        const updatedCart = recalculateCart(state.cart, {
                            shippingMethods: state.shippingMethods,
                            selectedShippingOptionId: state.selectedShippingOptionId,
                            promoCode: state.promoCode,
                            promoDiscountPercent: state.promoDiscountPercent,
                            giftWrap: enabled,
                        })
                        return {
                            giftWrap: enabled,
                            giftNote: note !== undefined ? note : state.giftNote,
                            cart: updatedCart,
                        }
                    }),

                addPreviewItem: (payload) =>
                    set((state) => {
                        const currentItems = [...(state.cart.items ?? [])]
                        const metadataKey = JSON.stringify(payload.metadata ?? {})
                        const existingIdx = currentItems.findIndex(
                            (i) =>
                                i.variant_id === payload.variantId &&
                                JSON.stringify(i.metadata ?? {}) === metadataKey,
                        )

                        if (existingIdx >= 0) {
                            const existing = currentItems[existingIdx]
                            currentItems[existingIdx] = {
                                ...existing,
                                quantity: Math.min(
                                    99,
                                    Number(existing.quantity ?? 1) + payload.quantity,
                                ),
                            }
                        } else {
                            currentItems.unshift({
                                id: payload.id || `item_${Date.now()}`,
                                title: payload.productTitle,
                                subtitle: payload.variantTitle,
                                thumbnail: payload.thumbnail,
                                product_id: payload.productId,
                                product_title: payload.productTitle,
                                product_handle: payload.productHandle,
                                variant_id: payload.variantId,
                                variant_sku: payload.variantSku,
                                variant_title: payload.variantTitle,
                                quantity: payload.quantity,
                                unit_price: payload.unitPrice,
                                compare_at_unit_price:
                                    payload.originalUnitPrice ?? payload.unitPrice,
                                subtotal: payload.unitPrice * payload.quantity,
                                total: payload.unitPrice * payload.quantity,
                                original_total:
                                    (payload.originalUnitPrice ?? payload.unitPrice) *
                                    payload.quantity,
                                adjustments: [],
                                variant: {
                                    id: payload.variantId,
                                    title: payload.variantTitle,
                                    sku: payload.variantSku,
                                },
                                product: {
                                    id: payload.productId,
                                    title: payload.productTitle,
                                    handle: payload.productHandle,
                                },
                                metadata: payload.metadata ?? {},
                            } as unknown as StoreCartLineItem)
                        }

                        const updatedCart = recalculateCart(
                            { ...state.cart, items: currentItems },
                            {
                                shippingMethods: state.shippingMethods,
                                selectedShippingOptionId: state.selectedShippingOptionId,
                                promoCode: state.promoCode,
                                promoDiscountPercent: state.promoDiscountPercent,
                                giftWrap: state.giftWrap,
                            },
                        )

                        return {
                            cart: updatedCart,
                            confirmedOrder: null,
                        }
                    }),

                addProductToPreviewCart: ({ product, variant, quantity }) => {
                    const price =
                        variant?.calculated_price?.calculated_amount ?? 340
                    const orig =
                        variant?.calculated_price?.original_amount ?? price
                    get().addPreviewItem({
                        id: `item_${variant?.id || product.id}_${Date.now()}`,
                        productId: product.id,
                        productTitle: product.title,
                        productHandle: product.handle,
                        thumbnail:
                            product.thumbnail ||
                            product.images?.[0]?.url ||
                            "/images/col_thumb/col_mens_2.webp",
                        variantId: variant?.id || `var_${product.id}`,
                        variantTitle: variant?.title || "One Size",
                        variantSku: variant?.sku || "VH-COMP-01",
                        unitPrice: Number(price),
                        originalUnitPrice: Number(orig),
                        quantity,
                    })
                },

                updateLineItemQuantity: (itemId, quantity) =>
                    set((state) => {
                        const nextItems =
                            quantity <= 0
                                ? (state.cart.items ?? []).filter(
                                      (i) => i.id !== itemId,
                                  )
                                : (state.cart.items ?? []).map((i) =>
                                      i.id === itemId
                                          ? {
                                                ...i,
                                                quantity: Math.min(99, quantity),
                                            }
                                          : i,
                                  )

                        const updatedCart = recalculateCart(
                            { ...state.cart, items: nextItems },
                            {
                                shippingMethods: state.shippingMethods,
                                selectedShippingOptionId: state.selectedShippingOptionId,
                                promoCode: state.promoCode,
                                promoDiscountPercent: state.promoDiscountPercent,
                                giftWrap: state.giftWrap,
                            },
                        )
                        return { cart: updatedCart }
                    }),

                removeLineItem: (itemId) =>
                    set((state) => {
                        const nextItems = (state.cart.items ?? []).filter(
                            (i) => i.id !== itemId,
                        )
                        const updatedCart = recalculateCart(
                            { ...state.cart, items: nextItems },
                            {
                                shippingMethods: state.shippingMethods,
                                selectedShippingOptionId: state.selectedShippingOptionId,
                                promoCode: state.promoCode,
                                promoDiscountPercent: state.promoDiscountPercent,
                                giftWrap: state.giftWrap,
                            },
                        )
                        return { cart: updatedCart }
                    }),

                applyPromoCode: (rawCode) => {
                    const code = rawCode.trim().toUpperCase()
                    const validMap: Record<
                        string,
                        { pct: number; label: string }
                    > = {
                        VELLE10: { pct: 10, label: "10% Atelier Privilege applied" },
                        WELCOME10: { pct: 10, label: "10% Welcome Privilege applied" },
                        VIP20: { pct: 20, label: "20% Collector VIP Privilege applied" },
                        VELLE20: { pct: 20, label: "20% Privilege applied" },
                        HERITAGE50: { pct: 0, label: "$50 Heritage Credit applied" },
                    }

                    const match = validMap[code]
                    if (!match) {
                        return {
                            success: false,
                            message:
                                "Unrecognized code. Try VELLE10 (10%), VIP20 (20%), or HERITAGE50 ($50 off).",
                        }
                    }

                    set((state) => {
                        const updatedCart = recalculateCart(state.cart, {
                            shippingMethods: state.shippingMethods,
                            selectedShippingOptionId: state.selectedShippingOptionId,
                            promoCode: code,
                            promoDiscountPercent: match.pct,
                            giftWrap: state.giftWrap,
                        })
                        return {
                            promoCode: code,
                            promoDiscountPercent: match.pct,
                            cart: updatedCart,
                        }
                    })

                    return { success: true, message: match.label }
                },

                removePromoCode: () =>
                    set((state) => {
                        const updatedCart = recalculateCart(state.cart, {
                            shippingMethods: state.shippingMethods,
                            selectedShippingOptionId: state.selectedShippingOptionId,
                            promoCode: null,
                            promoDiscountPercent: 0,
                            giftWrap: state.giftWrap,
                        })
                        return {
                            promoCode: null,
                            promoDiscountPercent: 0,
                            cart: updatedCart,
                        }
                    }),

                completePreviewOrder: ({ paymentLabel, paymentDetails }) => {
                    const state = get()
                    const shipMethod =
                        state.shippingMethods.find(
                            (m) => m.id === state.selectedShippingOptionId,
                        ) ?? state.shippingMethods[0]

                    const now = new Date()
                    const estStart = new Date(now)
                    estStart.setDate(now.getDate() + 3)
                    const estEnd = new Date(now)
                    estEnd.setDate(now.getDate() + 5)
                    const fmt = (d: Date) =>
                        d.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                        })

                    const order: ConfirmedPreviewOrder = {
                        id: `order_vh_${Date.now()}`,
                        displayId: String(
                            Math.floor(10480 + Math.random() * 8900),
                        ),
                        transactionId: `TXN-${state.selectedPaymentProviderId.toUpperCase()}-${Date.now().toString().slice(-6)}`,
                        createdAt: now.toISOString(),
                        email:
                            state.cart.email ||
                            "julian.sterling@vellehide.com",
                        paymentProviderId: state.selectedPaymentProviderId,
                        paymentLabel,
                        paymentDetails,
                        shippingAddress: state.cart.shipping_address ?? null,
                        billingAddress: state.cart.billing_address ?? null,
                        shippingMethodName:
                            shipMethod?.name ||
                            "Standard Atelier Insured Courier",
                        estimatedDelivery: `${fmt(estStart)} – ${fmt(estEnd)}`,
                        giftWrap: state.giftWrap,
                        giftNote: state.giftNote,
                        items: state.cart.items ?? [],
                        subtotal: Number(state.cart.subtotal ?? 760),
                        discountTotal: Number(state.cart.discount_total ?? 0),
                        shippingTotal:
                            Number(state.cart.shipping_total ?? 0) +
                            (state.giftWrap ? 15 : 0),
                        taxTotal: Number(state.cart.tax_total ?? 0),
                        total: Number(state.cart.total ?? 820.8),
                        currencyCode: state.cart.currency_code || "usd",
                    }

                    set({ confirmedOrder: order })
                    return order
                },

                clearConfirmedOrder: () => set({ confirmedOrder: null }),

                resetDemoFlow: () =>
                    set({
                        cart: recalculateCart(PREVIEW_DEFAULT_CART, {
                            shippingMethods: PREVIEW_SHIPPING_METHODS,
                            selectedShippingOptionId:
                                PREVIEW_SHIPPING_METHODS[0].id,
                            promoCode: null,
                            promoDiscountPercent: 0,
                            giftWrap: false,
                        }),
                        customer: PREVIEW_CUSTOMER,
                        shippingMethods: PREVIEW_SHIPPING_METHODS,
                        paymentProviders: PREVIEW_PAYMENT_PROVIDERS,
                        activeStep: "address",
                        selectedShippingOptionId:
                            PREVIEW_SHIPPING_METHODS[0].id,
                        selectedPaymentProviderId: "pp_paypal_paypal",
                        promoCode: null,
                        promoDiscountPercent: 0,
                        giftWrap: false,
                        giftNote: "",
                        confirmedOrder: null,
                    }),

                hydrateFromServer: ({
                    cart,
                    customer,
                    shippingMethods,
                    paymentProviders,
                }) =>
                    set((state) => ({
                        cart:
                            cart && (cart.items?.length ?? 0) > 0
                                ? cart
                                : state.cart,
                        customer: customer ?? state.customer,
                        shippingMethods:
                            shippingMethods && shippingMethods.length > 0
                                ? shippingMethods
                                : state.shippingMethods,
                        paymentProviders:
                            paymentProviders && paymentProviders.length > 0
                                ? paymentProviders
                                : state.paymentProviders,
                    })),
            }),
            {
                name: "vellehide-preview-flow-v2",
                partialize: (state) => ({
                    cart: state.cart,
                    activeStep: state.activeStep,
                    viewMode: state.viewMode,
                    sameAsBilling: state.sameAsBilling,
                    selectedShippingOptionId: state.selectedShippingOptionId,
                    selectedPaymentProviderId: state.selectedPaymentProviderId,
                    promoCode: state.promoCode,
                    promoDiscountPercent: state.promoDiscountPercent,
                    giftWrap: state.giftWrap,
                    giftNote: state.giftNote,
                }),
            },
        ),
        {
            name: "PreviewFlowStore",
            enabled: process.env.NODE_ENV === "development",
        },
    ),
)
