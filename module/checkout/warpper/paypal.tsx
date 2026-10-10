"use client"

import { PayPalScriptProvider } from "@paypal/react-paypal-js"
import { useMemo } from "react"

/**
 * Mounted once around the payment step, always in the same place in the tree, so switching
 * payment methods never remounts the checkout. deferLoading keeps the SDK from downloading until
 * a PayPal method is selected: usePayPalSdk loads it with the options that method needs.
 *
 * The provider only reads `options` on mount, so these are just the stable base options.
 */
export default function PayPalWrapper({ paypalClientId, currency, children }: Props) {
    const options = useMemo(
        () => ({
            clientId: paypalClientId,
            currency: currency.trim().toUpperCase(),
            intent: "capture" as const,
            dataPageType: "checkout" as const,
        }),
        [paypalClientId, currency],
    )

    return (
        <PayPalScriptProvider options={options} deferLoading>
            {children}
        </PayPalScriptProvider>
    )
}

type Props = {
    paypalClientId: string
    currency: string
    children: React.ReactNode
}