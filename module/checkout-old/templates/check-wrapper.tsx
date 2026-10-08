"use client"

import type { StoreCart } from "@medusajs/types"
import { PayPalScriptProvider, type ReactPayPalScriptOptions, } from "@paypal/react-paypal-js"
// import { Elements } from "@stripe/react-stripe-js"
// import { loadStripe } from "@stripe/stripe-js"
import { useEffect, useState } from "react"
import { isPaypal } from "@/lib/constant"
import { createToken } from "@/lib/action/checkout"

// const stripeKey = process.env.NEXT_PUBLIC_STRIPE_KEY
// const stripePromise = stripeKey ? loadStripe(stripeKey) : null

export default function CheckWrapper({
  cart,
  children,
}: {
  cart: StoreCart
} & React.PropsWithChildren) {
  const paymentSession = cart.payment_collection?.payment_sessions?.find(
    (s) => s.status === "pending",
  )

  // --- Stripe ---
  // if (
  //   paymentSession &&
  //   stripePromise &&
  //   isStripe(paymentSession.provider_id)
  // ) {
  //   const clientSecret = paymentSession.data?.client_secret as string
  //   const isAuthorized = ["requires_capture", "succeeded"].includes(
  //     paymentSession.data?.status as string,
  //   )

  //   if (isAuthorized) {
  //     return <>{children}</>
  //   }

  //   return (
  //     <Elements
  //       stripe={stripePromise}
  //       options={{
  //         clientSecret,
  //         appearance: {
  //           theme: "flat",
  //           "labels": "floating",
  //           variables: {
  //             borderRadius: "8px",
  //             fontFamily: "Inter, system-ui, sans-serif",
  //           },
  //         },
  //       }}
  //     >
  //       {children}
  //     </Elements>
  //   )
  // }

  // --- PayPal (standard + card fields) ---
  const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID as string
  const providerId = paymentSession?.provider_id
  const isCardFields = providerId === "pp_paypal_card"

  if (isPaypal(providerId) && paypalClientId) {
    return (
      <PayPalWrapper
        paypalClientId={paypalClientId}
        currency={cart.currency_code}
        isCardFields={isCardFields}
        buyerCountry={cart.billing_address?.country_code}
      >
        {children}
      </PayPalWrapper>
    )
  }

  // --- PayU / Manual / Default ---
  // PayU uses redirect-based checkout (form POST to PayU's hosted page),
  // so it doesn't need a client-side SDK provider wrapper.
  return <>{children}</>
}

/**
 * PayPal wrapper that handles both standard PayPal buttons and Advanced Card
 * Fields. For card fields, a `dataClientToken` is required -- it is fetched
 * from the backend's `/store/paypal/client-token` endpoint on mount.
 *
 * IMPORTANT: Always wrap children in PayPalScriptProvider so that hooks like
 * usePayPalScriptReducer and usePayPalCardFields don't crash with
 * "must be used within a PayPalScriptProvider".
 */
function PayPalWrapper({
  paypalClientId,
  currency,
  buyerCountry,
  isCardFields,
  children,
}: {
  paypalClientId: string
  currency: string
  buyerCountry?: string
  isCardFields: boolean
  children: React.ReactNode
}) {
  const [clientToken, setClientToken] = useState<string | null>(null)
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

  // Build PayPal options -- always include clientId so the provider
  // context is valid even while the client token is still loading.
  const paypalOptions: ReactPayPalScriptOptions = {
    clientId: paypalClientId,
    currency: currency.toUpperCase(),
    intent: "capture",
    enableFunding: "venmo",
    disableFunding: "",
    dataPageType: "checkout",
    components: "buttons,card-fields",
    "buyer-country": "US",
    ...(isCardFields && clientToken
      ? { dataClientToken: clientToken }
      : {}),
  }

  // Always wrap in PayPalScriptProvider so hooks work.
  // The provider's deferLoading can be used to defer script loading
  // until the client token is available for card fields.
  return (
    <PayPalScriptProvider
      options={paypalOptions}
      deferLoading={isCardFields && !clientToken && !tokenError}
    >
      {children}
    </PayPalScriptProvider>
  )
}
