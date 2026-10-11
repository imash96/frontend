"use client"

import { DISPATCH_ACTION, usePayPalScriptReducer } from "@paypal/react-paypal-js"
import { useEffect, useState } from "react"

type Params = {
    currency: string
    components: "buttons" | "card-fields"
    /** Card fields: the SDK is loaded with this client token (your backend requires it). */
    clientToken?: string | null
    /** Wait (e.g. for the token) before loading anything. */
    enabled?: boolean
}

/**
 * Loads the PayPal SDK with exactly the options this payment method needs.
 *
 * PayPalScriptProvider reads its `options` prop once, on mount: changing the prop later does NOT
 * reload the script. A reload has to go through the reducer's resetOptions action, which is what
 * this hook does. The provider is mounted once with deferLoading, so nothing downloads until a
 * PayPal method is actually selected and the checkout tree never remounts.
 */
export function usePayPalSdk({ currency, components, clientToken = null, enabled = true }: Params) {
    const [state, dispatch] = usePayPalScriptReducer()
    const wantedCurrency = currency.trim().toUpperCase()
    const key = `${wantedCurrency}|${components}|${clientToken ?? ""}`
    const current = state.options

    // Compared against the provider's options, with "what we last requested" as a fallback, so a
    // provider that stores its options in a slightly different shape can never leave the UI
    // spinning forever.
    const [requestedKey, setRequestedKey] = useState<string | null>(null)
    const matches =
        current.currency === wantedCurrency &&
        current.components === components &&
        (current.dataClientToken ?? null) === clientToken
    const upToDate = matches || requestedKey === key

    useEffect(() => {
        if (!enabled || upToDate) return
        // Drop a token left over from the card flow when switching back to the wallet buttons.
        const { dataClientToken: _previousToken, ...base } = current
        setRequestedKey(key)
        dispatch({
            type: DISPATCH_ACTION.RESET_OPTIONS,
            value: {
                ...base,
                currency: wantedCurrency,
                components,
                ...(clientToken ? { dataClientToken: clientToken } : {}),
            },
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps -- `current` is only read to build the next options
    }, [enabled, upToDate, key, wantedCurrency, components, clientToken, dispatch])

    return {
        isLoading: !enabled || !upToDate || state.isInitial || state.isPending,
        isRejected: upToDate && state.isRejected,
        isReady: upToDate && state.isResolved,
    }
}