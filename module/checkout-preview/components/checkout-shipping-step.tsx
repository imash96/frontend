"use client"

import { Check, Clock, Edit3, Gift, Plane, ShieldCheck, } from "lucide-react"
import { useState } from "react"
import { setCheckoutShipping } from "@/lib/action/checkout"
import { usePreviewFlowStore } from "@/lib/store/preview-flow-store"
import { convertToLocale } from "@/lib/util/money"
import Button from "@/ui/button"

export default function CheckoutShippingStep() {
    const cart = usePreviewFlowStore((s) => s.cart)
    const shippingMethods = usePreviewFlowStore((s) => s.shippingMethods)
    const selectedShippingOptionId = usePreviewFlowStore(
        (s) => s.selectedShippingOptionId,
    )
    const selectShippingOption = usePreviewFlowStore((s) => s.selectShippingOption)
    const giftWrap = usePreviewFlowStore((s) => s.giftWrap)
    const giftNote = usePreviewFlowStore((s) => s.giftNote)
    const setGiftWrap = usePreviewFlowStore((s) => s.setGiftWrap)
    const activeStep = usePreviewFlowStore((s) => s.activeStep)
    const viewMode = usePreviewFlowStore((s) => s.viewMode)
    const setActiveStep = usePreviewFlowStore((s) => s.setActiveStep)

    const [saving, setSaving] = useState(false)

    const isOpen = viewMode === "single" || activeStep === "shipping"
    const currentMethod =
        shippingMethods.find((m) => m.id === selectedShippingOptionId) ??
        shippingMethods[0]
    const isCompleted = Boolean(selectedShippingOptionId)

    const handleSelectMethod = async (optionId: string) => {
        selectShippingOption(optionId)
        if (cart.id && !cart.id.startsWith("cart_preview_")) {
            await setCheckoutShipping(optionId).catch(() => null)
        }
    }

    const handleContinue = () => {
        setSaving(true)
        window.setTimeout(() => {
            setSaving(false)
            setActiveStep("payment")
        }, 180)
    }

    return (
        <section
            aria-labelledby="checkout-step-shipping"
            className="overflow-hidden rounded-2xl border border-border bg-surface shadow-xs transition-all"
        >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-divider bg-background-secondary/40 px-5 py-4 sm:px-6">
                <div className="flex items-center gap-3">
                    <span
                        className={`flex size-7 items-center justify-center rounded-full text-xs font-bold ${isCompleted && !isOpen
                            ? "bg-success text-success-foreground"
                            : activeStep === "shipping" || viewMode === "single"
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-text-secondary"
                            }`}
                    >
                        {isCompleted && !isOpen ? (
                            <Check className="size-4" strokeWidth={2.5} />
                        ) : (
                            "2"
                        )}
                    </span>
                    <div>
                        <h2
                            id="checkout-step-shipping"
                            className="font-heading text-base font-bold text-text-primary sm:text-lg"
                        >
                            Insured Atelier Delivery & Packaging
                        </h2>
                        <p className="text-xs text-text-secondary">
                            Climate-controlled transit from Florence to your doorstep
                        </p>
                    </div>
                </div>

                {!isOpen && isCompleted && (
                    <button
                        type="button"
                        onClick={() => setActiveStep("shipping")}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-muted"
                    >
                        <Edit3 className="size-3.5" />
                        <span>Edit</span>
                    </button>
                )}
            </div>

            {/* Collapsed Summary */}
            {!isOpen && isCompleted && currentMethod && (
                <div className="flex flex-wrap items-center justify-between gap-4 p-5 text-xs sm:px-6">
                    <div className="flex items-center gap-3">
                        <div className="flex size-9 items-center justify-center rounded-xl bg-accent/15 text-accent">
                            <Plane className="size-4" />
                        </div>
                        <div>
                            <p className="font-semibold text-text-primary">
                                {currentMethod.name}
                            </p>
                            <p className="text-text-secondary">
                                {(currentMethod.data as any)?.estimated_days ||
                                    "3–5 business days"}{" "}
                                {giftWrap ? "• Includes Cedar & Satin Gift Presentation" : ""}
                            </p>
                        </div>
                    </div>
                    <span className="font-mono text-sm font-bold text-text-primary">
                        {currentMethod.amount === 0
                            ? "FREE"
                            : convertToLocale({
                                amount: currentMethod.amount,
                                currency_code: cart.currency_code || "usd",
                            })}
                    </span>
                </div>
            )}

            {/* Expanded Content */}
            {isOpen && (
                <div className="space-y-5 p-5 sm:p-6">
                    <div
                        role="radiogroup"
                        aria-label="Shipping method"
                        className="space-y-3"
                    >
                        {shippingMethods.map((method) => {
                            const selected = method.id === selectedShippingOptionId
                            const data = (method.data ?? {}) as Record<string, string>
                            const isFree = Number(method.amount ?? 0) === 0

                            return (
                                <button
                                    key={method.id}
                                    type="button"
                                    role="radio"
                                    aria-checked={selected}
                                    onClick={() => handleSelectMethod(method.id)}
                                    data-testid={`shipping-option-${method.id}`}
                                    className={`flex w-full items-start justify-between gap-4 rounded-xl border p-4 text-left transition-all ${selected
                                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                                        : "border-border bg-background/50 hover:border-border-strong"
                                        }`}
                                >
                                    <div className="flex items-start gap-3.5">
                                        <span
                                            className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border ${selected
                                                ? "border-primary bg-primary text-primary-foreground"
                                                : "border-border-strong"
                                                }`}
                                        >
                                            {selected && (
                                                <Check className="size-3" strokeWidth={3} />
                                            )}
                                        </span>

                                        <div className="space-y-1">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className="text-sm font-semibold text-text-primary">
                                                    {method.name}
                                                </span>
                                                {isFree && (
                                                    <span className="rounded-full bg-success-subtle px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-success">
                                                        Complimentary
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-text-secondary">
                                                {data.description ||
                                                    "Fully insured international courier with signature confirmation."}
                                            </p>
                                            <div className="flex items-center gap-3 pt-0.5 text-[11px] text-text-tertiary">
                                                <span className="inline-flex items-center gap-1">
                                                    <Clock className="size-3 text-accent" />
                                                    Est. {data.estimated_days || "3–5 business days"}
                                                </span>
                                                <span className="inline-flex items-center gap-1">
                                                    <ShieldCheck className="size-3 text-success" />
                                                    100% Transit Insurance
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <span className="shrink-0 font-mono text-sm font-bold text-text-primary tabular-nums">
                                        {isFree
                                            ? "FREE"
                                            : convertToLocale({
                                                amount: method.amount,
                                                currency_code:
                                                    cart.currency_code || "usd",
                                            })}
                                    </span>
                                </button>
                            )
                        })}
                    </div>

                    {/* Bespoke Cedar & Satin Gift Presentation Option */}
                    <div className="rounded-xl border border-accent/35 bg-accent-subtle/20 p-4">
                        <div className="flex items-start justify-between gap-3">
                            <label className="flex cursor-pointer items-start gap-3">
                                <input
                                    type="checkbox"
                                    checked={giftWrap}
                                    onChange={(e) =>
                                        setGiftWrap(e.target.checked, giftNote)
                                    }
                                    className="mt-1 size-4 rounded border-border accent-primary"
                                />
                                <div>
                                    <div className="flex items-center gap-2">
                                        <Gift className="size-4 text-accent" />
                                        <span className="text-xs font-semibold text-text-primary sm:text-sm">
                                            Add Signature Cedar Hanger & Wax-Sealed Gift Box
                                        </span>
                                    </div>
                                    <p className="mt-0.5 text-xs text-text-secondary">
                                        Includes a solid aromatic cedarwood coat hanger, breathable cotton garment cover, and hand-calligraphed note card.
                                    </p>
                                </div>
                            </label>
                            <span className="shrink-0 font-mono text-xs font-bold text-accent">
                                +$15.00
                            </span>
                        </div>

                        {giftWrap && (
                            <div className="mt-3 pl-7">
                                <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-text-secondary">
                                    Personalized Gift Message (Optional)
                                </label>
                                <textarea
                                    rows={2}
                                    maxLength={180}
                                    value={giftNote}
                                    onChange={(e) => setGiftWrap(true, e.target.value)}
                                    placeholder="Write a personal dedication for the wax-sealed card..."
                                    className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-xs text-text-primary focus:border-primary focus:outline-none"
                                />
                            </div>
                        )}
                    </div>

                    {viewMode === "stepped" && (
                        <div className="flex justify-end pt-1">
                            <Button
                                type="button"
                                isLoading={saving}
                                onClick={handleContinue}
                                variant="primary"
                                size="lg"
                                className="rounded-xl px-6 text-xs font-semibold uppercase tracking-wider"
                                data-testid="continue-to-payment-button"
                            >
                                Continue to Payment Method
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </section>
    )
}
