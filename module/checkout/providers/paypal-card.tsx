"use client"

import type { StoreCart } from "@medusajs/types"
import type { EventPayload, BillingAddress as PayPalBillingAddress, OneTimePaymentFlowResponse } from "@paypal/react-paypal-js/sdk-v6"
import {
    PayPalCardFieldsProvider,
    PayPalCardNumberField,
    PayPalCardExpiryField,
    PayPalCardCvvField,
    PayPalCardNameField,
    usePayPalCardFields,
    usePayPalCardFieldsOneTimePaymentSession,
} from "@paypal/react-paypal-js/sdk-v6"
import { ShieldCheck } from "lucide-react"
import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react"
import { useShallow } from "zustand/react/shallow"
import CreditCard from "@/icon/checkout-creditcard"
import { selectCanPay, useCheckoutStore } from "@/lib/store/checkout-store"
import { CheckoutButton, NotReadyHint } from "../components/checkout-button"
import ProviderPanel, { ProviderLoading } from "../components/provider-panel"
import { useCardTheme } from "./card-theme"
import ProviderErrorBoundary from "./error-boundary"
import { describePayPalError, usePayPalFlow } from "./paypal-flow"
import { usePayPalSdk } from "./paypal-sdk"

// If the card form hasn't come alive this long after the SDK loaded, say so instead of leaving an
// empty box. The likely causes are listed in the console message.
const FORM_TIMEOUT_MS = 8_000

const UNAVAILABLE = "Card payments are temporarily unavailable. Please choose another payment method."

// ─── Field state (from PayPal v6 event handlers) ────────────────────────────────

type FieldKey = "name" | "number" | "expiry" | "cvv"
const FIELD_KEYS = ["name", "number", "expiry", "cvv"] as const

type FieldData = { isEmpty?: boolean; isValid?: boolean }
type UiState = {
    fields: Partial<Record<FieldKey, FieldData>>
    touched: Partial<Record<FieldKey, true>>
    brand: string | null
}
type UiAction = { type: "event"; payload: EventPayload } | { type: "blur"; payload: EventPayload } | { type: "touch-all" }

const INITIAL_UI: UiState = { fields: {}, touched: {}, brand: null }

/**
 * Maps the v6 `EventPayload.data` field names (number, cvv, expiry, name)
 * directly to our `FieldKey` names, extracting `isEmpty` and `isValid` for each.
 */
function extractFields(data: EventPayload["data"]): UiState["fields"] {
    const fields: UiState["fields"] = {}
    for (const key of FIELD_KEYS) {
        const state = data[key as keyof typeof data]
        if (state && typeof state === "object" && "isValid" in state) {
            fields[key] = { isEmpty: state.isEmpty, isValid: state.isValid }
        }
    }
    return fields
}

function extractBrand(data: EventPayload["data"]): string | null {
    if (data.cards && data.cards.length === 1) return data.cards[0].niceType ?? null
    return null
}

function uiReducer(state: UiState, action: UiAction): UiState {
    switch (action.type) {
        case "event": {
            const fields = extractFields(action.payload.data)
            const brand = extractBrand(action.payload.data)
            return { ...state, fields, brand }
        }
        case "blur": {
            const fields = extractFields(action.payload.data)
            const brand = extractBrand(action.payload.data)
            const blurred = action.payload.sender as FieldKey | undefined
            const touched = blurred && FIELD_KEYS.includes(blurred as FieldKey)
                ? { ...state.touched, [blurred]: true as const }
                : state.touched
            return { fields, brand, touched }
        }
        case "touch-all":
            return { ...state, touched: { name: true, number: true, expiry: true, cvv: true } }
    }
}

const EMPTY_MESSAGE: Record<FieldKey, string> = {
    name: "Enter the name on your card.",
    number: "Enter your card number.",
    expiry: "Enter the expiry date.",
    cvv: "Enter the security code.",
}
const INVALID_MESSAGE: Record<FieldKey, string> = {
    name: "Enter the name on your card.",
    number: "Enter a valid card number.",
    expiry: "Enter a valid expiry date.",
    cvv: "Enter a valid security code.",
}

/** Errors only appear once the customer has left a field (or pressed Pay), never while they type. */
function fieldError(key: FieldKey, ui: UiState) {
    const field = ui.fields[key]
    if (!ui.touched[key] || !field || field.isValid) return null
    return field.isEmpty ? EMPTY_MESSAGE[key] : INVALID_MESSAGE[key]
}

// ─── Billing address: already on the cart, so it is sent to PayPal rather than asked again ──────

function toBillingAddress(address: StoreCart["billing_address"]): PayPalBillingAddress | undefined {
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

// ─── Component ──────────────────────────────────────────────────────────────

export default function PayPalCard({ cart }: { cart: StoreCart }) {
    const [failure, setFailure] = useState<string | null>(null)
    const [formReady, setFormReady] = useState(false)
    const [ui, dispatch] = useReducer(uiReducer, INITIAL_UI)

    const theme = useCardTheme()
    // Starts the (deferred) SDK load. Nothing else in this tree does, so this is what makes the card
    // form work on its own, without PayPalButtons.
    const sdk = usePayPalSdk()
    const { createPaypalOrder, onApprove, onError } = usePayPalFlow(cart.id)

    // Stable event handlers for PayPalCardFieldsProvider (v6 event-handler props).
    // These must maintain referential stability to avoid PayPal recreating the fields.
    const handleChange = useCallback((payload: EventPayload) => {
        dispatch({ type: "event", payload })
    }, [])

    const handleBlur = useCallback((payload: EventPayload) => {
        dispatch({ type: "blur", payload })
    }, [])

    const handleCardTypeChange = useCallback((payload: EventPayload) => {
        dispatch({ type: "event", payload })
    }, [])

    const handleValidityChange = useCallback((payload: EventPayload) => {
        dispatch({ type: "event", payload })
    }, [])

    const onFormReady = useCallback(() => setFormReady(true), [])
    const billingAddress = useMemo(() => toBillingAddress(cart.billing_address), [cart.billing_address])

    // Safety net: SDK loaded but the card form never came alive.
    const sdkLoaded = !sdk.isLoading && !sdk.isRejected
    useEffect(() => {
        if (!sdkLoaded || formReady) return
        const timer = setTimeout(() => {
            console.error("[PayPal Card] Card form did not initialise in time. Check for ad blockers or extensions blocking paypal.com frames.")
            setFailure("Card form did not initialise in time. Check for ad blockers or extensions blocking paypal.com frames.")
        }, FORM_TIMEOUT_MS)
        return () => clearTimeout(timer)
    }, [sdkLoaded, formReady])

    if (failure || sdk.isRejected) return <Unavailable hint={failure ?? "The PayPal SDK failed to load."} />

    if (!sdkLoaded || !theme) {
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
                    change={handleChange}
                    blur={handleBlur}
                    cardtypechange={handleCardTypeChange}
                    validitychange={handleValidityChange}
                >
                    <ReadySignal onReady={onFormReady} />
                    <CardForm
                        ui={ui}
                        billingAddress={billingAddress}
                        createPaypalOrder={() => createPaypalOrder()}
                        onApprove={onApprove}
                        onError={onError}
                        onTouchAll={() => dispatch({ type: "touch-all" })}
                        theme={theme}
                    />
                </PayPalCardFieldsProvider>
            </ProviderErrorBoundary>
        </ProviderPanel>
    )
}

function CardForm({ ui, billingAddress, createPaypalOrder, onApprove, onError, onTouchAll, theme }: CardFormProps) {
    const isSubmitting = useCheckoutStore((s) => s.isSubmitting)

    return (
        <div className="space-y-4">
            {/* Only these four fields: PayPal's own card form (with address inputs) is never used. */}
            <div
                aria-busy={isSubmitting}
                // The inputs live in PayPal iframes; this is what stops edits while a payment is in flight.
                className={`space-y-4 ${isSubmitting ? "pointer-events-none opacity-60" : ""}`}
            >
                <FieldShell label="Name on card" error={fieldError("name", ui)}>
                    <PayPalCardNameField
                        placeholder="Name on card"
                        style={theme}
                        containerClassName="size-full"
                    />
                </FieldShell>

                <FieldShell label="Card number" error={fieldError("number", ui)} hint={ui.brand}>
                    <PayPalCardNumberField
                        placeholder="1234 5678 9012 3456"
                        style={theme}
                        containerClassName="size-full"
                    />
                </FieldShell>

                <div className="grid grid-cols-2 gap-3">
                    <FieldShell label="Expiry date" error={fieldError("expiry", ui)}>
                        <PayPalCardExpiryField
                            placeholder="MM / YY"
                            style={theme}
                            containerClassName="size-full"
                        />
                    </FieldShell>
                    <FieldShell label="Security code" error={fieldError("cvv", ui)}>
                        <PayPalCardCvvField
                            placeholder="CVV"
                            style={theme}
                            containerClassName="size-full"
                        />
                    </FieldShell>
                </div>
            </div>

            <CardSubmitButton
                billingAddress={billingAddress}
                createPaypalOrder={createPaypalOrder}
                onApprove={onApprove}
                onError={onError}
                onTouchAll={onTouchAll}
            />

            <p className="flex items-center justify-center gap-1.5 text-center text-xs text-foreground-tertiary">
                <ShieldCheck className="size-3.5 shrink-0" aria-hidden="true" />
                Card details are entered in PayPal&apos;s secure fields and never reach our servers.
            </p>
        </div>
    )
}

type CardFormProps = {
    ui: UiState
    billingAddress?: PayPalBillingAddress
    createPaypalOrder: (isCardPayment: boolean) => Promise<{ orderId: string }>
    onApprove: (data: { orderID?: string | null }) => Promise<void>
    onError: (err: unknown) => void
    onTouchAll: () => void
    theme: Record<string, Record<string, string>>
}

/** Label, themed box around PayPal's iframe, and the error line. */
function FieldShell({ label, error, hint, children }: FieldShellProps) {
    return (
        <div>
            <div className="mb-1.5 flex items-center justify-between gap-2">
                <span className="text-xs font-medium text-foreground sm:text-sm">{label}</span>
                {hint && <span className="text-xs text-foreground-tertiary">{hint}</span>}
            </div>
            {/* focus-within works for iframes: focusing the input inside makes the iframe the active element. */}
            <div
                className={`h-11 rounded-md border bg-surface transition-colors focus-within:ring-2 focus-within:ring-focus-ring ${error ? "border-destructive" : "border-border focus-within:border-accent"}`}
            >
                {children}
            </div>
            {error && (
                <p role="alert" className="mt-1.5 text-xs text-destructive">
                    {error}
                </p>
            )}
        </div>
    )
}

type FieldShellProps = {
    label: string
    error: string | null
    hint?: string | null
    children: React.ReactNode
}

/** Tells the parent the card form exists — uses the v6 `usePayPalCardFields` which returns `{ error }`. */
function ReadySignal({ onReady }: { onReady: () => void }) {
    const { error } = usePayPalCardFields()
    const calledRef = useRef(false)

    useEffect(() => {
        // The v6 hook only has `error`; if there's no error and we haven't
        // signalled yet, the form is mounted and ready.
        if (!error && !calledRef.current) {
            calledRef.current = true
            onReady()
        }
    }, [error, onReady])

    return null
}

/**
 * Must render inside PayPalCardFieldsProvider to use `usePayPalCardFieldsOneTimePaymentSession`.
 *
 * In SDK v6, card form submission uses the `usePayPalCardFieldsOneTimePaymentSession` hook
 * which provides `submit(orderId, options?)` — replacing the old `cardFieldsForm.submit()` pattern.
 */
function CardSubmitButton({ billingAddress, createPaypalOrder, onApprove, onError, onTouchAll }: CardSubmitButtonProps) {
    const { canPay, notReady, isSubmitting, beginSubmit, handleError } = useCheckoutStore(
        useShallow((s) => ({
            canPay: selectCanPay(s),
            notReady: s.notReady,
            isSubmitting: s.isSubmitting,
            beginSubmit: s.beginSubmit,
            handleError: s.handleError,
        })),
    )

    const { submit: cardSubmit, submitResponse, error: sessionError } = usePayPalCardFieldsOneTimePaymentSession()

    // Handle session-level errors from the hook
    useEffect(() => {
        if (sessionError) {
            console.error("[PayPal Card] session error:", sessionError)
            handleError(describePayPalError(sessionError, "Your card couldn't be processed. Please check the details and try again."))
        }
    }, [sessionError, handleError])

    // Handle successful submission response — bridge to our onApprove flow
    useEffect(() => {
        if (!submitResponse) return
        const { data, state } = submitResponse as OneTimePaymentFlowResponse

        if (state === "succeeded" && data?.orderId) {
            onApprove({ orderID: data.orderId })
        } else if (state === "failed") {
            handleError(data?.message ?? "Your card couldn't be processed. Please check the details and try again.")
        } else if (state === "canceled") {
            // Payment was cancelled (e.g. 3DS window closed)
            useCheckoutStore.getState().releaseLocks()
        }
    }, [submitResponse, onApprove, handleError])

    const submit = useCallback(async () => {
        try {
            if (!beginSubmit()) return

            // Create the order first
            const resp = await createPaypalOrder(true)

            // Submit the card fields with the order ID
            // v6 submit(orderId, options?) handles 3D Secure if required
            await cardSubmit(resp.orderId, billingAddress ? { billingAddress } : undefined)
        } catch (e) {
            console.error("[PayPal Card] submit failed:", e)
            handleError(describePayPalError(e, "Your card couldn't be processed. Please check the details and try again."))
        }
    }, [cardSubmit, billingAddress, beginSubmit, handleError, createPaypalOrder])

    return (
        <div className="space-y-4">
            {notReady && <NotReadyHint />}
            <CheckoutButton
                onClick={submit}
                icon={<CreditCard />}
                isLoading={isSubmitting}
                disabled={!canPay}
            >
                {isSubmitting ? "Processing payment..." : "Pay now"}
            </CheckoutButton>
        </div>
    )
}

type CardSubmitButtonProps = {
    billingAddress?: PayPalBillingAddress
    createPaypalOrder: (isCardPayment: boolean) => Promise<{ orderId: string }>
    onApprove: (data: { orderID?: string | null }) => Promise<void>
    onError: (err: unknown) => void
    onTouchAll: () => void
}

function Unavailable({ bare = false, hint }: { bare?: boolean; hint?: string }) {
    const message = (
        <div role="alert" className="space-y-2 text-center text-xs text-foreground-tertiary sm:text-sm">
            <p>{UNAVAILABLE}</p>
            {/* Never shown to customers: development builds only. */}
            {process.env.NODE_ENV !== "production" && hint && (
                <p className="rounded-md bg-muted p-2 text-left text-xs mx-auto">Dev: {hint}</p>
            )}
        </div>
    )
    return bare ? message : <ProviderPanel>{message}</ProviderPanel>
}