"use client"

import { createToken } from "@/lib/action/checkout"
import { PayPalScriptProvider, type ReactPayPalScriptOptions } from "@paypal/react-paypal-js"
import { useEffect, useState } from "react"

/**
 * PayPal wrapper that handles both standard PayPal buttons and Advanced Card
 * Fields. For card fields, a `dataClientToken` is required — it is fetched
 * from the backend's `/store/paypal/client-token` endpoint on mount.
 *
 * IMPORTANT: Always wrap children in PayPalScriptProvider so that hooks like
 * usePayPalScriptReducer and usePayPalCardFields don't crash with
 * "must be used within a PayPalScriptProvider".
 */
export default function PayPalWrapper({ paypalClientId, currency, isCardFields, token, children }: Props) {

    const [clientToken, setClientToken] = useState<string | null>(token)
    const [tokenError, setTokenError] = useState(false)

    // Fetch client token on mount when card fields are needed and no
    // server-side token was provided via props.
    useEffect(() => {
        if (!isCardFields || clientToken) return

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
    }, [isCardFields, clientToken])

    // Build PayPal options — always include clientId so the provider
    // context is valid even while the client token is still loading.
    const options: ReactPayPalScriptOptions = {
        clientId: paypalClientId,
        currency: currency.trim().toUpperCase(),
        intent: "capture",
        enableFunding: "venmo",
        dataPageType: "checkout",
        components: "buttons,card-fields",
        ...(isCardFields && clientToken
            ? { dataClientToken: clientToken }
            : {}),
    }

    // Always wrap in PayPalScriptProvider so hooks work.
    // deferLoading: for card fields, defer until clientToken is available
    // (or a token error occurs). For standard buttons, never defer.
    return (
        <PayPalScriptProvider
            options={options}
            deferLoading={isCardFields && !clientToken && !tokenError}
        >
            {children}
        </PayPalScriptProvider>
    )
}

type Props = {
    paypalClientId: string
    currency: string
    isCardFields: boolean
    token: string | null
    children: React.ReactNode
}