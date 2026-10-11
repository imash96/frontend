"use client"

import type { StoreCart } from "@medusajs/types"
import { AlertCircle, Clock } from "lucide-react"
import { isPaypalCard, PAYMENT_PROVIDER } from "@/lib/constant"
import { useCheckoutStore } from "@/lib/store/checkout-store"
import { PayPalPaymentButton } from "../providers/paypal-default"
import { PayUPaymentButton } from "../providers/payu-default"
import { CheckoutButton, NotReadyHint } from "./checkout-button"
import PlaceOrderButton from "./place-order-button"

export default function PaymentButton({ cart }: { cart: StoreCart }) {
    const providerId = useCheckoutStore((s) => s.activeSession?.provider_id)
    const notReady = useCheckoutStore((s) => s.notReady)

    if (!providerId) {
        return (
            <CheckoutButton disabled icon={<AlertCircle />}>
                Select a payment method
            </CheckoutButton>
        )
    }

    if (isPaypalCard(providerId)) return null

    let button: React.ReactNode
    switch (providerId) {
        case PAYMENT_PROVIDER.PAYPAL:
            button = <PayPalPaymentButton cart={cart} />
            break
        case PAYMENT_PROVIDER.PAYPAL_CARD:
            return null // card fields render their own Pay button inside PayPalCardFieldsProvider
        case PAYMENT_PROVIDER.PAYU:
            button = <PayUPaymentButton cart={cart} />
            break
        case PAYMENT_PROVIDER.PAY_LATER:
            button = <PlaceOrderButton label="Place Order" icon={<Clock />} />
            break
        default:
            return <CheckoutButton disabled>Unsupported payment method</CheckoutButton>
    }

    return (
        <>
            {notReady && <NotReadyHint />}
            {button}
        </>
    )
}