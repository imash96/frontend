import {
    createOrder as serverCreateOrder,
    captureOrder as serverCaptureOrder,
    markPaymentComplete,
} from "@/lib/action/checkout"

/**
 * Creates a PayPal order via the Medusa backend.
 *
 * The PayPal SDK `createOrder` callback does NOT receive the cart — the
 * `cartId` must be bound before passing to the `<PayPalButtons>` or
 * `<PayPalCardFieldsProvider>`.
 *
 * @example
 *   <PayPalButtons createOrder={() => createOrder(cart.id)} … />
 */
async function createOrder(cartId: string, isCardPayment = false): Promise<string> {
    const data = await serverCreateOrder(cartId, isCardPayment)

    if (!data?.id) {
        throw new Error(
            "[PayPal] createOrder did not return an order ID"
        )
    }

    return data.id
}

/**
 * Captures a PayPal order and marks the Medusa payment as complete.
 *
 * @example
 *   <PayPalButtons onApprove={(data) => onApprove(cart.id, data)} … />
 */
async function onApprove(cartId: string, data: Record<string, unknown>): Promise<void> {
    const orderId = data.orderID as string | undefined

    if (!orderId) {
        throw new Error("[PayPal] onApprove: missing orderID")
    }

    const result = await serverCaptureOrder(cartId, orderId)
    console.log("[PayPal] Capture result:", result)

    // Tell Medusa to finalize the payment collection so the order can
    // be completed.
    await markPaymentComplete(cartId)
}

function onError(error: unknown) {
    console.error(`[PayPal] Error:`, error)
}

export { createOrder, onApprove, onError }