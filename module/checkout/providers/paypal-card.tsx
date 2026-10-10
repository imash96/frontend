"use client"

import type { StoreCart } from "@medusajs/types"
import {
    PayPalCardFieldsProvider,
    PayPalCVVField,
    PayPalExpiryField,
    PayPalNameField,
    PayPalNumberField,
    usePayPalCardFields,
} from "@paypal/react-paypal-js"
import { CreditCard } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { useShallow } from "zustand/react/shallow"
import { createToken } from "@/lib/action/checkout"
import { selectCanPay, useCheckoutStore } from "@/lib/store/checkout-store"
import { CheckoutButton, NotReadyHint } from "../componenets/checkout-button"
import ProviderPanel, { ProviderLoading } from "../componenets/provider-panel"
import { usePayPalFlow } from "./paypal-flow"
import { usePayPalSdk } from "./paypal-sdk"

const FIELD_CLASS = "h-11 rounded-md border border-border bg-surface px-3"

// Inputs render inside PayPal iframes, so only plain CSS values work. 16px stops iOS from zooming in.
const CARD_STYLE = {
    input: { "font-size": "16px", "font-family": "inherit" },
    ".invalid": { color: "#dc2626" },
}

export default function PayPalCard({ cart }: { cart: StoreCart }) {
    const [token, setToken] = useState<string | null>(null)
    const [tokenFailed, setTokenFailed] = useState(false)

    // The client token is fetched here, only when the card method is open.
    useEffect(() => {
        let cancelled = false
        createToken()
            .then((res) => {
                if (cancelled) return
                if (res.client_token) setToken(res.client_token)
                else setTokenFailed(true)
            })
            .catch(() => !cancelled && setTokenFailed(true))
        return () => {
            cancelled = true
        }
    }, [])

    const sdk = usePayPalSdk({
        currency: cart.currency_code,
        components: "card-fields",
        clientToken: token,
        enabled: token !== null,
    })
    const { createPaypalOrder, onApprove, onError } = usePayPalFlow(cart.id)
    const createCardOrder = useCallback(() => createPaypalOrder(true), [createPaypalOrder])

    if (tokenFailed || sdk.isRejected) {
        return (
            <ProviderPanel>
                <p role="alert" className="text-center text-xs text-foreground-muted sm:text-sm">
                    The secure card form couldn&apos;t be loaded. Please refresh the page or choose another payment method.
                </p>
            </ProviderPanel>
        )
    }

    if (!token || sdk.isLoading) {
        return (
            <ProviderPanel>
                <ProviderLoading>Loading secure card form…</ProviderLoading>
            </ProviderPanel>
        )
    }

    return (
        <ProviderPanel>
            <PayPalCardFieldsProvider
                createOrder={createCardOrder}
                onApprove={onApprove}
                onError={onError}
                style={CARD_STYLE}
            >
                <div className="space-y-4">
                    <Field label="Name on card">
                        <PayPalNameField className={FIELD_CLASS} />
                    </Field>
                    <Field label="Card number">
                        <PayPalNumberField className={FIELD_CLASS} />
                    </Field>
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Expiry date">
                            <PayPalExpiryField className={FIELD_CLASS} />
                        </Field>
                        <Field label="Security code">
                            <PayPalCVVField className={FIELD_CLASS} />
                        </Field>
                    </div>
                    <CardSubmitButton />
                </div>
            </PayPalCardFieldsProvider>
        </ProviderPanel>
    )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div>
            <span className="mb-1.5 block text-xs font-medium text-foreground sm:text-sm">{label}</span>
            {children}
        </div>
    )
}

/** Must render inside PayPalCardFieldsProvider to reach the card form. */
function CardSubmitButton() {
    const { cardFieldsForm } = usePayPalCardFields()
    const { canPay, notReady, isSubmitting, beginSubmit, handleError } = useCheckoutStore(
        useShallow((s) => ({
            canPay: selectCanPay(s),
            notReady: s.notReady,
            isSubmitting: s.isSubmitting,
            beginSubmit: s.beginSubmit,
            handleError: s.handleError,
        })),
    )

    const submit = useCallback(async () => {
        if (!cardFieldsForm) return handleError("The card form isn't ready yet. Please wait a moment and try again.")

        try {
            const state = await cardFieldsForm.getState()
            if (!state.isFormValid) return handleError("Please check your card details and try again.")

            if (!beginSubmit()) return
            // This call was missing: the old "Pay" button only toggled a flag and never charged.
            // submit() runs createOrder -> 3D Secure if required -> onApprove (see use-paypal-flow).
            await cardFieldsForm.submit()
        } catch (e) {
            console.error("[PayPal Card] submit failed:", e)
            handleError("Your card couldn't be processed. Please check the details and try again.")
        }
    }, [cardFieldsForm, beginSubmit, handleError])

    return (
        <>
            {notReady && <NotReadyHint />}
            <CheckoutButton
                onClick={submit}
                icon={<CreditCard />}
                isLoading={isSubmitting}
                disabled={!canPay || !cardFieldsForm}
            >
                {isSubmitting ? "Processing payment..." : "Pay now"}
            </CheckoutButton>
        </>
    )
}