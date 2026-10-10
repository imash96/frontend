"use client"

import type {
    StoreCart,
    StoreCartShippingOption,
    StoreCustomer,
    StorePaymentProvider,
} from "@medusajs/types"
import {
    Check,
    ChevronDown,
    CreditCard,
    Layers,
    ListChecks,
    MapPin,
    RefreshCw,
    ShoppingBag,
    Truck,
} from "lucide-react"
import { useEffect, useState } from "react"
import { type CheckoutStepId, usePreviewFlowStore, } from "@/lib/store/preview-flow-store"
import { convertToLocale } from "@/lib/util/money"
import Container from "@/ui/container"
import CheckoutAddressStep from "../components/checkout-address-step"
import CheckoutOrderSummary from "../components/checkout-order-summary"
import CheckoutPaymentStep from "../components/checkout-payment-step"
import CheckoutShippingStep from "../components/checkout-shipping-step"

type CheckoutPreviewTemplateProps = {
    liveCart?: StoreCart | null
    liveCustomer?: StoreCustomer | null
    liveShippingMethods?: StoreCartShippingOption[] | null
    livePaymentProviders?: StorePaymentProvider[] | null
}

export default function CheckoutPreviewTemplate({
    liveCart,
    liveCustomer,
    liveShippingMethods,
    livePaymentProviders,
}: CheckoutPreviewTemplateProps) {
    const cart = usePreviewFlowStore((s) => s.cart)
    const activeStep = usePreviewFlowStore((s) => s.activeStep)
    const viewMode = usePreviewFlowStore((s) => s.viewMode)
    const setActiveStep = usePreviewFlowStore((s) => s.setActiveStep)
    const setViewMode = usePreviewFlowStore((s) => s.setViewMode)
    const resetFlow = usePreviewFlowStore((s) => s.resetFlow)
    const hydrateFromServer = usePreviewFlowStore((s) => s.hydrateFromServer)

    const [mobileSummaryOpen, setMobileSummaryOpen] = useState(false)

    useEffect(() => {
        if (liveCart && (liveCart.items?.length ?? 0) > 0) {
            hydrateFromServer({
                cart: liveCart,
                customer: liveCustomer,
                shippingMethods: liveShippingMethods ?? undefined,
                paymentProviders: livePaymentProviders ?? undefined,
            })
        }
    }, [
        liveCart,
        liveCustomer,
        liveShippingMethods,
        livePaymentProviders,
        hydrateFromServer,
    ])

    const steps: {
        id: CheckoutStepId
        label: string
        icon: typeof MapPin
    }[] = [
            { id: "address", label: "1. Address", icon: MapPin },
            { id: "shipping", label: "2. Delivery", icon: Truck },
            { id: "payment", label: "3. Payment", icon: CreditCard },
        ]

    const itemCount = (cart.items ?? []).reduce(
        (sum, i) => sum + Number(i.quantity ?? 1),
        0,
    )

    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Top Step Progress & Layout Mode Switcher Bar */}
            <div className="border-b border-divider bg-surface/90 backdrop-blur-md">
                <Container
                    size="2xl"
                    className="flex flex-wrap items-center justify-between gap-3 py-3"
                >
                    {/* Center: Interactive Step Pills */}
                    <nav
                        aria-label="Checkout steps"
                        className="flex items-center gap-1.5"
                    >
                        {steps.map((st, idx) => {
                            const Icon = st.icon
                            const isCurrent = activeStep === st.id
                            const stepIndex = steps.findIndex(
                                (s) => s.id === activeStep,
                            )
                            const isPast = idx < stepIndex

                            return (
                                <button
                                    key={st.id}
                                    type="button"
                                    onClick={() => setActiveStep(st.id)}
                                    data-testid={`step-pill-${st.id}`}
                                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-all ${isCurrent
                                        ? "bg-primary text-primary-foreground shadow-xs"
                                        : isPast
                                            ? "bg-success-subtle text-success"
                                            : "bg-background-secondary text-text-secondary hover:text-text-primary"
                                        }`}
                                >
                                    {isPast ? (
                                        <Check
                                            className="size-3"
                                            strokeWidth={2.5}
                                        />
                                    ) : (
                                        <Icon className="size-3" />
                                    )}
                                    <span>{st.label}</span>
                                </button>
                            )
                        })}
                    </nav>

                    {/* Right: View Mode Toggle (Guided 3-Step vs Single-Page Express) + Reset */}
                    <div className="flex items-center gap-2">
                        <div
                            role="group"
                            aria-label="Checkout layout mode"
                            className="inline-flex rounded-xl border border-border bg-background-secondary p-0.5 text-[11px]"
                        >
                            <button
                                type="button"
                                onClick={() => setViewMode("single")}
                                className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 font-semibold transition-all ${viewMode === "single"
                                    ? "bg-surface text-text-primary shadow-2xs"
                                    : "text-text-secondary hover:text-text-primary"
                                    }`}
                            >
                                <Layers className="size-3" />
                                <span>Express All-in-One</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setViewMode("stepped")}
                                className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 font-semibold transition-all ${viewMode === "stepped"
                                    ? "bg-surface text-text-primary shadow-2xs"
                                    : "text-text-secondary hover:text-text-primary"
                                    }`}
                            >
                                <ListChecks className="size-3" />
                                <span>3-Step Guided</span>
                            </button>
                        </div>

                        <button
                            type="button"
                            onClick={resetFlow}
                            title="Reset checkout demo state"
                            className="inline-flex items-center gap-1 rounded-xl border border-border bg-surface px-2.5 py-1.5 text-[11px] font-semibold text-text-secondary hover:bg-muted hover:text-text-primary"
                        >
                            <RefreshCw className="size-3" />
                            <span className="hidden xl:inline">Reset</span>
                        </button>
                    </div>
                </Container>
            </div>

            {/* Mobile Collapsible Order Summary Drawer (< lg) */}
            <div className="border-b border-divider bg-surface lg:hidden">
                <Container size="2xl">
                    <button
                        type="button"
                        onClick={() =>
                            setMobileSummaryOpen((prev) => !prev)
                        }
                        aria-expanded={mobileSummaryOpen}
                        className="flex w-full items-center justify-between py-3.5 text-left"
                    >
                        <span className="inline-flex items-center gap-2 text-xs font-semibold text-primary">
                            <ShoppingBag className="size-4 text-accent" />
                            <span>
                                {mobileSummaryOpen
                                    ? "Hide Order Summary"
                                    : `Show Order Summary (${itemCount} ${itemCount === 1 ? "item" : "items"})`}
                            </span>
                            <ChevronDown
                                className={`size-4 transition-transform ${mobileSummaryOpen ? "rotate-180" : ""
                                    }`}
                            />
                        </span>
                        <span className="font-heading text-base font-bold text-price-current tabular-nums">
                            {convertToLocale({
                                amount: Number(cart.total ?? 420),
                                currency_code: cart.currency_code || "usd",
                            })}
                        </span>
                    </button>

                    {mobileSummaryOpen && (
                        <div className="pb-5">
                            <CheckoutOrderSummary />
                        </div>
                    )}
                </Container>
            </div>

            {/* Main 12-Column Responsive Checkout Grid */}
            <Container size="2xl" className="py-6 lg:py-10">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start lg:gap-8 xl:gap-10">
                    {/* Left Column: Address, Shipping, Payment Steps */}
                    <div className="space-y-6 lg:col-span-7 xl:col-span-7">
                        <CheckoutAddressStep />
                        <CheckoutShippingStep />
                        <CheckoutPaymentStep />
                    </div>

                    {/* Right Column: Sticky Desktop Order Summary */}
                    <div className="hidden lg:sticky lg:top-20 lg:col-span-5 lg:block xl:col-span-5">
                        <CheckoutOrderSummary />
                    </div>
                </div>
            </Container>
        </div>
    )
}
