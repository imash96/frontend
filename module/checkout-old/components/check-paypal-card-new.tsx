"use client"

import { captureOrder, createOrder, markPaymentComplete, placeCheckOrder } from "@/lib/action/checkout"
import type { StoreCart } from "@medusajs/types"
import {
  PayPalCardFieldsProvider,
  PayPalCVVField,
  PayPalExpiryField,
  PayPalNumberField,
  PayPalCardFieldsForm,
  usePayPalCardFields,
} from "@paypal/react-paypal-js"
import { useCallback, useEffect, useState } from "react"

const SPIN_STYLE = `@keyframes _pp_spin { to { transform: rotate(360deg) } }`

export default function CheckPayPalCard({ cart }: { cart: StoreCart }) {
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  return (
    <div style={{ position: "relative" }}>
      <style>{SPIN_STYLE}</style>

      {submitting && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 20,
            background: "rgba(255,255,255,0.92)",
            borderRadius: 12,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 14,
            minHeight: 180,
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              border: "3px solid #dbeafe",
              borderTopColor: "#2563eb",
              animation: "_pp_spin .75s linear infinite",
            }}
          />
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: "#111827" }}>
              Processing your payment…
            </div>
            <div style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>
              Please do not close or refresh this page
            </div>
          </div>
        </div>
      )}

      <PayPalCardFieldsProvider
        style={cardStyle}
        createOrder={async () => {
          setError(null)
          const r = await createOrder(cart.id, true)
          return r.id
        }}
        onApprove={async (data: { orderID?: string }) => {
          try {
            setError(null)
            setSubmitting(true)
            const orderId = String(data?.orderID || "")
            await captureOrder(cart.id, orderId)

            // Mark the Medusa payment session as authorized / complete,
            // then finalize the cart and redirect to the confirmation page.
            await markPaymentComplete(cart.id)
            await placeCheckOrder()
          } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : "Card payment failed"
            setError(msg)
            console.error("[PayPal Card] payment failed:", msg)
          } finally {
            setSubmitting(false)
          }
        }}
        onCancel={() => {
          setSubmitting(false)
        }}
        onError={(e: Error | { message?: string }) => {
          const msg = e instanceof Error ? e.message : e?.message || "CardFields error"
          setError(msg)
          console.error("[PayPal Card] payment failed:", msg)
          setSubmitting(false)
        }}
      >
        <CardFormInner
          submitting={submitting}
          setSubmitting={setSubmitting}
          error={error}
        />
      </PayPalCardFieldsProvider>
    </div>
  )
}

/**
 * Inner component that has access to `usePayPalCardFields` (must be rendered
 * inside `PayPalCardFieldsProvider`). Listens for the `paypal-card-submit`
 * custom event dispatched by `PayPalCardPayment` in check-payment-button.tsx
 * so that the external "Pay with Card" button can trigger the card form
 * submission.
 */
function CardFormInner({ submitting, setSubmitting, error, }: {
  submitting: boolean
  setSubmitting: (v: boolean) => void
  error: string | null
}) {
  const { cardFieldsForm } = usePayPalCardFields()

  const handleSubmit = useCallback(async () => {
    if (!cardFieldsForm || submitting) return
    setSubmitting(true)
    try {
      await cardFieldsForm.submit()
    } catch (err) {
      console.error("[PayPal Card] submit error:", err)
      setSubmitting(false)
    }
  }, [cardFieldsForm, submitting, setSubmitting])

  // Listen for the custom event from the PayPal Card payment button
  useEffect(() => {
    const handler = () => {
      void handleSubmit()
    }
    window.addEventListener("paypal-card-submit", handler)
    return () => {
      window.removeEventListener("paypal-card-submit", handler)
    }
  }, [handleSubmit])

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 16,
        width: "100%",
      }}
    >
      <div>
        <label style={labelStyle}>Card number</label>
        <PayPalNumberField />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
        }}
      >
        <div>
          <label style={labelStyle}>Expiration date</label>
          <PayPalExpiryField />
        </div>
        <div>
          <label style={labelStyle}>Security code</label>
          <PayPalCVVField />
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          fontSize: 12,
          color: "#6b7280",
        }}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#10b981"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
        <span>Your payment is secured with 256-bit SSL encryption</span>
      </div>

      {error && (
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 10,
            padding: "10px 14px",
            background: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: 8,
            fontSize: 13,
            color: "#b91c1c",
            lineHeight: 1.5,
          }}
        >
          <span style={{ flexShrink: 0, marginTop: 1 }}>⚠️</span>
          <span>{error}</span>
        </div>
      )}
    </div>
  )
}

const cardStyle = {
  input: {
    "font-size": "15px",
    "font-family": "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    "font-weight": "400",
    color: "#111827",
    padding: "0 14px",
    height: "42px",
    "border-radius": "8px",
    border: "1px solid #d1d5db",
    background: "#ffffff",
    "box-shadow": "none",
    transition: "border-color 0.15s ease",
  },
  "::placeholder": {
    color: "#9ca3af",
  },
  ".invalid": {
    color: "#dc2626",
    border: "1px solid #fca5a5",
    background: "#fff7f7",
    "box-shadow": "none",
  },
  ".valid": {
    color: "#111827",
    border: "1px solid #d1d5db",
    "box-shadow": "none",
  },
  "input:focus": {
    outline: "none",
    border: "1px solid #2563eb",
    "box-shadow": "0 0 0 3px rgba(37,99,235,0.12)",
  },
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 13,
  fontWeight: 500,
  color: "#374151",
  marginBottom: 6,
  letterSpacing: "0.01em",
}