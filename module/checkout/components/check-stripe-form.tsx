"use client"

import { PaymentElement } from "@stripe/react-stripe-js"
import type { StripePaymentElementOptions } from "@stripe/stripe-js"
import type { StoreCart } from "@medusajs/types"
import { useState } from "react"
import { CheckCircle2 } from "lucide-react"
import CheckPaymentContainer from "./check-payment-container"

export default function CheckStripeForm({ cart }: { cart: StoreCart }) {
  const [cardComplete, setCardComplete] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)

  const session = cart.payment_collection?.payment_sessions?.find(
    (s) => s.status === "pending",
  )
  const isAuthorized = ["requires_capture", "succeeded"].includes(
    session?.data?.status as string,
  )

  if (isAuthorized) {
    return (
      <CheckPaymentContainer>
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mb-3">
            <CheckCircle2 className="w-6 h-6 text-green-500" />
          </div>
          <h3 className="text-base font-semibold text-foreground">Payment Authorized</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-62">
            Your payment has been securely authorized. Please complete your order below.
          </p>
        </div>
      </CheckPaymentContainer>
    )
  }

  return (
    <CheckPaymentContainer>
      <PaymentElement
        options={options}
        onChange={(event) => {
          setCardComplete(event.complete)
        }}
        onReady={() => setLoadError(null)}
        // @ts-ignore - onLoadError might not be in the exact TS version installed
        onLoadError={(e: any) => {
          setLoadError(
            e?.error?.message ||
              "Failed to load payment form. Please refresh and try again.",
          )
        }}
        className="w-full"
      />
      {loadError && (
        <p className="text-xs sm:text-sm text-destructive mt-2 text-left">
          {loadError}
        </p>
      )}
      {!cardComplete && !loadError && (
        <p className="text-xs sm:text-sm text-foreground-muted">
          Please complete your payment details
        </p>
      )}
    </CheckPaymentContainer>
  )
}

const options: StripePaymentElementOptions = {
  layout: { type: "accordion" },
  business: { name: "Velle Hide" },
}
