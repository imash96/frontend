"use client"

import type { StoreCart } from "@medusajs/types"
import { loadStripe } from "@stripe/stripe-js"
import { Elements } from "@stripe/react-stripe-js"
import {
  PayPalScriptProvider,
  type ReactPayPalScriptOptions,
} from "@paypal/react-paypal-js"
import { isPaypal, isStripe } from "@/lib/constant"

const stripeKey = process.env.NEXT_PUBLIC_STRIPE_KEY
const stripePromise = stripeKey ? loadStripe(stripeKey) : null

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
  if (
    paymentSession &&
    stripePromise &&
    isStripe(paymentSession.provider_id)
  ) {
    const clientSecret = paymentSession.data?.client_secret as string
    const isAuthorized = ["requires_capture", "succeeded"].includes(
      paymentSession.data?.status as string,
    )

    if (isAuthorized) {
      return <>{children}</>
    }

    return (
      <Elements
        stripe={stripePromise}
        options={{
          clientSecret,
          appearance: {
            theme: "flat",
            "labels": "floating",
            variables: {
              borderRadius: "8px",
              fontFamily: "Inter, system-ui, sans-serif",
            },
          },
        }}
      >
        {children}
      </Elements>
    )
  }

  // --- PayPal (standard + card fields) ---
  const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID as string

  if (isPaypal(paymentSession?.provider_id) && paypalClientId) {
    const paypalOptions: ReactPayPalScriptOptions = {
      clientId: paypalClientId,
      currency: cart.currency_code.toUpperCase(),
      intent: "capture",
      dataPageType: "checkout",
      components: "buttons,card-fields",
    }

    return (
      <PayPalScriptProvider options={paypalOptions}>
        {children}
      </PayPalScriptProvider>
    )
  }

  // --- Manual / Default ---
  return <>{children}</>
}
