"use client"

import { INSTANCE_LOADING_STATE, usePayPal } from "@paypal/react-paypal-js/sdk-v6"

/**
 * Wraps the SDK v6 `usePayPal()` hook into a simple loading/ready/rejected
 * status object that the rest of the checkout can branch on.
 *
 * In SDK v6 the `PayPalProvider` handles script loading and currency
 * automatically — there is no need to dispatch RESET_OPTIONS or manually
 * trigger loading like the old `usePayPalScriptReducer` required.
 */
export function usePayPalSdk() {
    const { loadingStatus, error, isHydrated } = usePayPal()

    return {
        isLoading: !isHydrated || loadingStatus === INSTANCE_LOADING_STATE.PENDING,
        isRejected: loadingStatus === INSTANCE_LOADING_STATE.REJECTED,
        isReady: isHydrated && loadingStatus === INSTANCE_LOADING_STATE.RESOLVED,
        error,
    }
}