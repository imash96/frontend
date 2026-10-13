import { findActiveSession } from "@/lib/store/checkout-steps"
import PayPalWrapper from "../warpper/paypal"
import { StorePaymentSession } from "@medusajs/types"
import { isPaypal } from "@/lib/constant"

/**
 * Server component. Provides the (lazy) PayPal SDK context whenever PayPal is configured, instead
 * of only while a PayPal session is active: wrapping conditionally changed the tree shape, which
 * remounted the whole payment step each time the customer switched between PayPal and other
 * methods. No server-side token fetch either (it blocked page render and crashed on PayPal outages).
 */
export default function CheckoutWrapper({ currency_code, children, buyerCountry, paymentSessions }: Props) {
    const providerId = findActiveSession(paymentSessions)?.provider_id
    // --- Stripe ---
    // if (paymentSession && stripePromise && isStripe(paymentSession.provider_id)) {
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
    const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID

    if (isPaypal(providerId) && paypalClientId) {
        return (
            <PayPalWrapper
                paypalClientId={paypalClientId}
                currency={currency_code}
                buyerCountry={buyerCountry}
                isCardFields={providerId === "pp_paypal_card"}
            >
                {children}
            </PayPalWrapper>
        )
    }

    // PayU / Pay Later need no client SDK; PayPal methods are hidden when there is no client id.
    return <>{children}</>
}

type Props = {
    currency_code: string
    children: React.ReactNode
    buyerCountry?: string
    paymentSessions?: StorePaymentSession[]
}