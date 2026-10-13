
"use client"

import type { StoreCart, StorePaymentProvider } from "@medusajs/types"
import { CheckCircle, Circle, Loader2 } from "lucide-react"
import { AnimatePresence } from "motion/react"
import { div as Div } from "motion/react-client"
import { memo, useCallback, useEffect, useMemo, useOptimistic, useTransition } from "react"
import { useShallow } from "zustand/react/shallow"
import { selectIsBusy, useCheckoutStore, } from "@/lib/store/checkout-store"
import ErrorMessage from "@/module/common/templates/error-message"
import PaymentButton from "../components/payment-button"
import { getPaymentInfo, type PaymentInfo } from "../components/payment-map"
import CheckoutStepHeader from "../components/step-header"
import { findActiveSession, isCartNotReady } from "@/lib/store/checkout-steps"

export default function StepPayment({ cart, paymentMethods }: StepPaymentProps) {
    const { error, isBusy, selectPaymentMethod, syncPayment } = useCheckoutStore(
        useShallow((s) => ({
            error: s.error,
            isBusy: selectIsBusy(s),
            selectPaymentMethod: s.selectPaymentMethod,
            syncPayment: s.syncPayment,
        })),
    )
    const [isTransitioning, startTransition] = useTransition()

    const session = findActiveSession(cart.payment_collection?.payment_sessions)
    const selectedId = session?.provider_id
    const notReady = isCartNotReady(cart)

    // Mirror cart-derived payment state into the store before paint, so the pay button (a sibling
    // subtree) never flashes "Select a payment method". Only primitives are depended on, and the
    // store skips the update when nothing relevant changed.
    const sessionId = session?.id
    const sessionStatus = session?.status
    const activeSession = useMemo(() => sessionId && selectedId && sessionStatus ? { id: sessionId, provider_id: selectedId, status: sessionStatus } : undefined, [sessionId, selectedId, sessionStatus])
    useEffect(() => {
        syncPayment({ notReady, activeSession })
    }, [notReady, activeSession, syncPayment])

    const methods = useMemo(() => paymentMethods.flatMap((m) => {
        const info = getPaymentInfo(m.id);
        return info ? [{ id: m.id, info }] : []
    }), [paymentMethods])

    // The radio flips instantly; React reverts it if the request fails and keeps it until the
    // refreshed cart arrives if it succeeds (no flash back to the old method).
    const [optimisticId, setOptimisticId] = useOptimistic(selectedId)
    const isLocked = isTransitioning || isBusy

    const cartId = cart.id
    const collectionId = cart.payment_collection?.id
    const onSelect = useCallback(
        (providerId: string) => {
            startTransition(async () => {
                setOptimisticId(providerId)
                await selectPaymentMethod({ cartId, providerId, collectionId })
            })
        },
        [cartId, collectionId, selectPaymentMethod, setOptimisticId],
    )

    return (
        <CheckoutStepHeader title="Payment Information" subtitle="Secure payment processing" number={3} stepId="payment">
            <div className="space-y-4">
                {methods.length === 0 ? (
                    <p role="alert" className="text-sm text-foreground-tertiary">
                        No payment methods are available for your region right now. Please contact support.
                    </p>
                ) : (
                    <div role="radiogroup" aria-label="Payment method" aria-busy={isLocked} className="space-y-3">
                        {methods.map(({ id, info }) => (
                            <PaymentOption
                                key={id}
                                id={id}
                                info={info}
                                cart={cart}
                                isSelected={optimisticId === id}
                                isActive={selectedId === id}
                                isSwitching={isTransitioning && optimisticId === id && selectedId !== id}
                                disabled={isLocked}
                                onSelect={onSelect}
                            />
                        ))}
                    </div>
                )}

                {/* The one place errors are shown: the individual buttons don't render their own copy. */}
                <div aria-live="polite">
                    <ErrorMessage error={error} />
                </div>

                <PaymentButton cart={cart} />
            </div>
        </CheckoutStepHeader>
    )
}

type OptionProps = {
    id: string
    info: PaymentInfo
    cart: StoreCart
    /** Checked state (optimistic: flips immediately on click). */
    isSelected: boolean
    /** The method the cart really has a session for: only then is its preview mounted. */
    isActive: boolean
    isSwitching: boolean
    disabled: boolean
    onSelect: (id: string) => void
}

const PaymentOption = memo(function PaymentOption({ id, info, cart, isSelected, isActive, isSwitching, disabled, onSelect, }: OptionProps) {
    const { Icon, Preview } = info

    return (
        <div className={`overflow-hidden rounded-xl border transition-colors has-focus-visible:ring-2 has-focus-visible:ring-focus-ring ${isSelected ? "border-accent bg-accent/5" : "border-border hover:border-accent/50"} ${disabled && !isSelected ? "opacity-60" : ""}`}>
            {/* Only this header selects the method. The whole card used to be clickable, so every click
                inside the PayPal / card-field preview re-created the payment session. */}
            <label className={`flex items-center gap-3 p-3 sm:p-4 ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}>
                {/* aria-disabled instead of disabled: a disabled radio drops keyboard focus mid-request. */}
                <input
                    type="radio"
                    name="payment-method"
                    value={id}
                    checked={isSelected}
                    aria-disabled={disabled}
                    onChange={() => {
                        if (!disabled) onSelect(id)
                    }}
                    className="sr-only"
                />
                <span aria-hidden="true" className="shrink-0 text-accent">
                    {isSwitching ? (
                        <Loader2 className="size-5 animate-spin text-foreground-tertiary sm:size-6" />
                    ) : isSelected ? (
                        <CheckCircle className="size-5 sm:size-6" />
                    ) : (
                        <Circle className="size-5 text-foreground-tertiary sm:size-6" />
                    )}
                </span>

                <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-foreground sm:text-base">{info.title}</span>
                    <span className="line-clamp-2 block text-xs text-foreground-tertiary sm:text-sm">{info.desc}</span>
                </span>

                <span aria-hidden="true" className="shrink-0 text-foreground">
                    <Icon className="size-6 sm:size-7" />
                </span>
            </label>

            <AnimatePresence initial={false}>
                {isActive && (
                    <Div key="preview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                        <Preview cart={cart} />
                    </Div>
                )}
            </AnimatePresence>
        </div>
    )
})

type StepPaymentProps = {
    cart: StoreCart
    paymentMethods: StorePaymentProvider[]
}
