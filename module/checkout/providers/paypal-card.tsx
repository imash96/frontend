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
import { CheckoutButton, NotReadyHint } from "../components/checkout-button"
import ProviderPanel, { ProviderLoading } from "../components/provider-panel"
import { usePayPalFlow } from "./paypal-flow"
import { usePayPalSdk } from "./paypal-sdk"
import ProviderErrorBoundary from "./error-boundary"

const FIELD_CLASS = "h-11 rounded-md border border-border bg-surface px-3"

// Card inputs render inside PayPal iframes: only plain CSS values work. 16px stops iOS zooming in.
const CARD_STYLE = {
    input: { "font-size": "16px" },
    ".invalid": { color: "#dc2626" },
}

// If the card form hasn't come alive this long after the SDK loaded, tell the customer instead of
// leaving an empty box (typical causes are listed in the console message below).
const FORM_TIMEOUT_MS = 10_000

const UNAVAILABLE =
    "Card payments are temporarily unavailable. Please choose another payment method."

type Eligibility = "eligible" | "ineligible" | "unavailable"

type CardFieldsApi = (options: Record<string, unknown>) => { isEligible?: () => boolean }

/**
 * Asks PayPal's SDK directly whether card fields can be used. This is the same check the React
 * provider runs internally; when it fails the provider silently renders nothing, which looks like
 * "the card form doesn't load". Asking up front turns that into a definite, logged answer.
 */
function probeCardFields(): Eligibility {
    const paypal = (window as unknown as { paypal?: { CardFields?: CardFieldsApi } }).paypal
    if (typeof paypal?.CardFields !== "function") return "unavailable"
    try {
        const probe = paypal.CardFields({
            createOrder: async () => "",
            onApprove: async () => undefined,
            onError: () => undefined,
        })
        return probe.isEligible?.() === false ? "ineligible" : "eligible"
    } catch {
        return "unavailable"
    }
}

const REASON = {
    ineligible:
        "PayPal reports this account cannot use card fields (isEligible() is false). Card fields need a PayPal " +
        "business account approved for Advanced Credit and Debit Card Payments, in a supported country, " +
        "using a supported currency. For sandbox: create the sandbox business account in a supported " +
        "country (for example US), enable Advanced Credit and Debit Card Payments on its REST app, and use " +
        "that app's client id and secret in both the storefront and Medusa.",
    unavailable:
        "The PayPal SDK loaded without the card-fields component. Check the components= and currency= " +
        "values in the SDK URL (see sdkUrl below).",
    timeout:
        "PayPal says card fields are eligible, but the form did not initialise in time. Check for ad " +
        "blockers or privacy extensions blocking paypal.com frames, and that the client token and client " +
        "id belong to the same environment.",
} as const

/** Development-only: the loaded SDK URL shows exactly which currency/components PayPal received. */
function sdkUrl() {
    return document.querySelector('script[src*="paypal.com/sdk/js"]')?.getAttribute("src") ?? "(not found)"
}

/** The billing address is already on the cart: send it to PayPal instead of asking again. */
function toBillingAddress(address: StoreCart["billing_address"]) {
    if (!address?.address_1 || !address.country_code) return undefined
    return {
        addressLine1: address.address_1,
        ...(address.address_2 ? { addressLine2: address.address_2 } : {}),
        ...(address.city ? { adminArea2: address.city } : {}),
        ...(address.province ? { adminArea1: address.province } : {}),
        ...(address.postal_code ? { postalCode: address.postal_code } : {}),
        countryCode: address.country_code.toUpperCase(),
    }
}

export default function PayPalCard({ cart }: { cart: StoreCart }) {
    const [token, setToken] = useState<string | null>(null)
    const [failure, setFailure] = useState<string | null>(null)
    const [formReady, setFormReady] = useState(false)

    // The client token is fetched here, only when the card method is open.
    useEffect(() => {
        let cancelled = false
        createToken()
            .then((res) => {
                if (cancelled) return
                if (res.client_token) setToken(res.client_token)
                else {
                    console.error("[PayPal Card] no client token:", res.error)
                    setFailure("Your backend's /store/paypal/client-token did not return a token.")
                }
            })
            .catch((e) => {
                console.error("[PayPal Card] client token request failed:", e)
                if (!cancelled) setFailure("The client token request failed.")
            })
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
    const onFormReady = useCallback(() => setFormReady(true), [])

    // Once the SDK is loaded, ask PayPal whether card fields are usable here, then watch for the
    // form coming alive (a safety net for the "eligible but still nothing" case).
    const sdkLoaded = token !== null && !sdk.isLoading && !sdk.isRejected
    useEffect(() => {
        if (!sdkLoaded || formReady) return

        const eligibility = probeCardFields()
        if (eligibility !== "eligible") {
            console.error(`[PayPal Card] ${REASON[eligibility]}`, {
                currency: cart.currency_code,
                sdkUrl: sdkUrl(),
            })
            setFailure(REASON[eligibility])
            return
        }

        const timer = setTimeout(() => {
            console.error(`[PayPal Card] ${REASON.timeout}`, { sdkUrl: sdkUrl() })
            setFailure(REASON.timeout)
        }, FORM_TIMEOUT_MS)
        return () => clearTimeout(timer)
    }, [sdkLoaded, formReady, cart.currency_code])

    if (failure || sdk.isRejected) return <Unavailable hint={failure ?? "The PayPal SDK failed to load."} />

    if (!sdkLoaded) {
        return (
            <ProviderPanel>
                <ProviderLoading>Loading secure card form…</ProviderLoading>
            </ProviderPanel>
        )
    }

    return (
        <ProviderPanel>
            <ProviderErrorBoundary fallback={<Unavailable bare hint="The PayPal card component crashed (see console)." />}>
                <PayPalCardFieldsProvider
                    createOrder={createCardOrder}
                    onApprove={onApprove}
                    onError={onError}
                    style={CARD_STYLE}
                >
                    <ReadySignal onReady={onFormReady} />
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
                        <CardSubmitButton billingAddress={toBillingAddress(cart.billing_address)} />
                    </div>
                </PayPalCardFieldsProvider>
            </ProviderErrorBoundary>
        </ProviderPanel>
    )
}

function Unavailable({ bare = false, hint }: { bare?: boolean; hint?: string }) {
    const message = (
        <div role="alert" className="space-y-2 text-center text-xs text-foreground-tertiary sm:text-sm">
            <p>{UNAVAILABLE}</p>
            {/* Never shown to customers: development builds only. */}
            {process.env.NODE_ENV !== "production" && hint && (
                <p className="rounded-md bg-muted p-2 text-left text-xs">Dev: {hint}</p>
            )}
        </div>
    )
    return bare ? message : <ProviderPanel>{message}</ProviderPanel>
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div>
            <span className="mb-1.5 block text-xs font-medium text-foreground sm:text-sm">{label}</span>
            {children}
        </div>
    )
}

/** Tells the parent the card form exists (it is null until PayPal says the merchant is eligible). */
function ReadySignal({ onReady }: { onReady: () => void }) {
    const { cardFieldsForm } = usePayPalCardFields()
    useEffect(() => {
        if (cardFieldsForm) onReady()
    }, [cardFieldsForm, onReady])
    return null
}

type BillingAddress = NonNullable<ReturnType<typeof toBillingAddress>>

/** Must render inside PayPalCardFieldsProvider to reach the card form. */
function CardSubmitButton({ billingAddress }: { billingAddress?: BillingAddress }) {
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
            const { isFormValid } = await cardFieldsForm.getState()
            if (!isFormValid) return handleError("Please check your card details and try again.")

            if (!beginSubmit()) return
            // submit() runs createOrder -> 3D Secure if required -> onApprove (see paypal-flow).
            await cardFieldsForm.submit(billingAddress ? { billingAddress } : undefined)
        } catch (e) {
            console.error("[PayPal Card] submit failed:", e)
            handleError("Your card couldn't be processed. Please check the details and try again.")
        }
    }, [cardFieldsForm, billingAddress, beginSubmit, handleError])

    return (
        <div className="space-y-4">
            {notReady && <NotReadyHint />}
            <CheckoutButton
                onClick={submit}
                icon={<CreditCard />}
                isLoading={isSubmitting}
                disabled={!canPay || !cardFieldsForm}
            >
                {isSubmitting ? "Processing payment..." : "Pay now"}
            </CheckoutButton>
        </div>
    )
}