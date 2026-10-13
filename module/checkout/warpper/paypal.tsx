"use client"

import { createToken } from "@/lib/action/checkout"
import { PayPalProvider, type Components } from "@paypal/react-paypal-js/sdk-v6"
import { useEffect, useMemo, useState } from "react"

/**
 * Mounted once around the payment step, always in the same place in the tree, so switching
 * payment methods never remounts the checkout.
 *
 * SDK v6's `PayPalProvider` manages script loading automatically — there is no `deferLoading`
 * prop. Loading is deferred until `clientId` or `clientToken` resolves (string | Promise | undefined).
 * When `clientToken` is `undefined`, the SDK waits.
 *
 * The `environment` prop is required and explicitly controls sandbox vs production —
 * a live `clientId` still loads sandbox if `environment="sandbox"`.
 */
export default function PayPalWrapper({ paypalClientId, currency, buyerCountry, isCardFields, children }: Props) {
    const [clientToken, setClientToken] = useState<string | undefined>(undefined)
    const [tokenError, setTokenError] = useState(false)

    useEffect(() => {
        if (!isCardFields) return

        let cancelled = false

        async function fetchToken() {
            try {
                const data = await createToken()
                if (!cancelled && data?.client_token) {
                    setClientToken(data.client_token)
                } else if (!cancelled) {
                    console.error("[PayPal] No client_token in response", data)
                    setTokenError(true)
                }
            } catch (err) {
                if (!cancelled) {
                    console.error("[PayPal] Failed to fetch client token:", err)
                    setTokenError(true)
                }
            }
        }

        fetchToken()
        return () => {
            cancelled = true
        }
    }, [isCardFields])

    // SDK v6 uses `clientId` OR `clientToken` (mutually exclusive).
    // Card fields require a `clientToken`; standard buttons use `clientId`.
    // Components list tells the SDK which component scripts to load.
    const components = useMemo<Components[]>(() => {
        const list: Components[] = ["paypal-payments", "googlepay-payments", "applepay-payments", "paypal-messages"]
        if (isCardFields) list.push("card-fields")
        return list
    }, [isCardFields])

    if (tokenError) {
        return <>{children}</>
    }

    // For card fields, use clientToken; for standard buttons, use clientId.
    // PayPalProvider defers loading until the credential resolves.
    if (isCardFields) {
        return (
            <PayPalProvider
                clientId={paypalClientId}
                environment="sandbox"
                components={components}
                pageType="checkout"
                clientMetadataId={crypto.randomUUID()}
                {...(buyerCountry ? { testBuyerCountry: buyerCountry.toUpperCase() } : {})}
            >
                {children}
            </PayPalProvider>
        )
    }

    return (
        <PayPalProvider
            clientId={paypalClientId}
            environment="sandbox"
            components={components}
            pageType="checkout"
            {...(buyerCountry ? { testBuyerCountry: buyerCountry.toUpperCase() } : {})}
        >
            {children}
        </PayPalProvider>
    )
}

type Props = {
    paypalClientId: string
    currency: string
    children: React.ReactNode
    buyerCountry?: string
    isCardFields: boolean
}