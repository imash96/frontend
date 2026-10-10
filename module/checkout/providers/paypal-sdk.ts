"use client"

import { DISPATCH_ACTION, usePayPalScriptReducer } from "@paypal/react-paypal-js"
import { useEffect } from "react"

type Params = {
    currency: string
    components: "buttons" | "card-fields"
    /** Card fields only: the SDK must be loaded with this token or it can't render the card form. */
    clientToken?: string | null
    /** Wait (e.g. for the token) before loading anything. */
    enabled?: boolean
}

/**
 * Loads the PayPal SDK with exactly the options this payment method needs.
 *
 * PayPalScriptProvider reads its `options` prop once, on mount - changing the prop later does
 * NOT reload the script (the old wrapper relied on that, so card fields could load without
 * their client token). Reloading has to go through the reducer's resetOptions action.
 * The provider itself is mounted once with deferLoading, so nothing downloads until a PayPal
 * method is actually selected, and the checkout tree never remounts.
 */
export function usePayPalSdk({ currency, components, clientToken = null, enabled = true }: Params) {
    const [state, dispatch] = usePayPalScriptReducer()
    const wantedCurrency = currency.trim().toUpperCase()
    const current = state.options

    const matches =
        current.currency === wantedCurrency &&
        current.components === components &&
        (current.dataClientToken ?? null) === clientToken

    useEffect(() => {
        if (!enabled || matches) return
        // Drop a token left over from the card flow when switching back to the wallet buttons.
        const { dataClientToken: _previousToken, ...base } = current
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
    }, [enabled, matches, wantedCurrency, components, clientToken, dispatch])

    return {
        // "No match yet" counts as loading: a reload is about to start (or waiting on the token).
        isLoading: state.isInitial || state.isPending || !matches,
        isRejected: matches && state.isRejected,
        isReady: matches && state.isResolved,
    }
}