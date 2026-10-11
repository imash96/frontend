"use client"

import { useCallback, useMemo } from "react"
import { useShallow } from "zustand/react/shallow"
import { captureOrder, createOrder, markPaymentComplete, placeCheckoutOrder } from "@/lib/action/checkout"
import { useCheckoutStore } from "@/lib/store/checkout-store"

const PAID_BUT_NOT_PLACED =
    "Your payment was received, but we couldn't finish your order. Please don't pay again - contact support with your PayPal receipt."

/** PayPal errors are often plain objects. In development the reason is appended to help debugging. */
function withReason(message: string, err: unknown) {
    if (process.env.NODE_ENV === "production") return message
    const reason = err instanceof Error ? err.message : (err as { message?: unknown } | null)?.message
    return typeof reason === "string" && reason ? `${message} (${reason})` : message
}

/**
 * Shared PayPal flow for the wallet button and the card fields:
 * create order -> customer approves -> capture -> mark paid -> complete the Medusa cart.
 *
 * isSubmitting is claimed by the caller before PayPal opens (beginSubmit in the button's onClick /
 * the card form's submit), which is what blocks double clicks.
 */
export function usePayPalFlow(cartId: string) {
    const { handleError, setError, setIsSubmitting, releaseLocks } = useCheckoutStore(
        useShallow((s) => ({
            handleError: s.handleError,
            setError: s.setError,
            setIsSubmitting: s.setIsSubmitting,
            releaseLocks: s.releaseLocks,
        })),
    )

    const createPaypalOrder = useCallback(
        async (isCardPayment = false) => {
            setError(null)
            const result = await createOrder(cartId, isCardPayment)
            if (!result.success || !result.id) {
                handleError(result.error || "We couldn't start your PayPal payment. Please try again.")
                throw new Error("PayPal order was not created") // aborts the SDK flow
            }
            return result.id
        },
        [cartId, handleError, setError],
    )

    const onApprove = useCallback(
        async (data: { orderID?: string | null }) => {
            if (!data?.orderID) return handleError("PayPal did not return an order ID. Please try again.")

            setIsSubmitting(true)
            setError(null)

            let captured = false
            try {
                const capture = await captureOrder(cartId, data.orderID)
                if (!capture.success) {
                    return handleError(capture.error || "We couldn't confirm your PayPal payment. Please try again.")
                }
                captured = true

                await markPaymentComplete(cartId) // best effort; the order is completed below regardless

                // On success this redirects and never resolves normally.
                const result = await placeCheckoutOrder()
                if (result && !result.success) handleError(PAID_BUT_NOT_PLACED)
            } catch (e) {
                console.error("[PayPal] approval failed:", e)
                handleError(captured ? PAID_BUT_NOT_PLACED : "We couldn't confirm your PayPal payment. Please try again.")
            }
        },
        [cartId, handleError, setError, setIsSubmitting],
    )

    const onError = useCallback(
        (err: unknown) => {
            console.error("[PayPal] error:", err)
            // Keep a more specific message that createPaypalOrder / onApprove already set.
            handleError(useCheckoutStore.getState().error ?? withReason("PayPal payment failed. Please try again.", err))
        },
        [handleError],
    )

    const onCancel = useCallback(() => {
        releaseLocks()
        setError(null)
    }, [releaseLocks, setError])

    return useMemo(
        () => ({ createPaypalOrder, onApprove, onError, onCancel }),
        [createPaypalOrder, onApprove, onError, onCancel],
    )
}