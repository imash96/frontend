import { StepType } from "@/types/common";
import { StoreCart } from "@medusajs/types";

export const STEP_ORDER = ["address", "shipping", "payment"] as const satisfies readonly StepType[]

/**
 * Derives where a returning customer should land, based on what the cart already has.
 * `completed` is always a prefix of STEP_ORDER (you can't finish shipping without an address).
 */
export function deriveCheckoutProgress(cart: CartProgressInput): { step: StepType; completed: StepType[] } {
    const hasAddress = Boolean(cart.email && cart.shipping_address?.address_1)
    const hasShipping = hasAddress && Boolean(cart.shipping_methods?.length)

    const completed: StepType[] = []
    if (hasAddress) completed.push("address")
    if (hasShipping) completed.push("shipping")

    return { step: STEP_ORDER[completed.length] ?? "payment", completed }
}

type CartProgressInput = Pick<StoreCart, "email" | "shipping_address" | "shipping_methods">

export type StepStatus = "complete" | "current" | "reachable" | "upcoming"

export const STEP_INDEX: Readonly<Record<StepType, number>> = {
    address: 0,
    shipping: 1,
    payment: 2,
}

export function computeStepStatus(id: StepType, current: StepType, completed: readonly StepType[], maxIndex: number,): StepStatus {
    if (id === current) return "current"
    const index = STEP_INDEX[id]
    if (index < STEP_INDEX[current] && completed.includes(id)) return "complete"
    return index <= maxIndex ? "reachable" : "upcoming"
}

export type CartLike = Pick<StoreCart, "email" | "shipping_address" | "billing_address" | "shipping_methods" | "payment_collection">

/**
 * The payment session the customer is currently paying with. Switching provider can leave an
 * older pending session behind, so prefer the most recently added one instead of the first.
 */
export function findActiveSession(cart: CartLike) {
    const pending = cart.payment_collection?.payment_sessions?.filter((s) => s.status === "pending")
    return pending?.[pending.length - 1]
}

/** True until the cart has everything an order needs: email, both addresses and a delivery method. */
export const isCartNotReady = (cart: CartLike): boolean => (!cart.email || !cart.shipping_address?.address_1 || !cart.billing_address?.address_1 || !cart.shipping_methods?.length)
