import { StorePaymentCollection } from "@medusajs/types"
import PayPalWrapper from "../warpper/paypal"
import { isPaypal } from "@/lib/constant"
import { createToken } from "@/lib/action/checkout"
// import StripeWrapper from "../warpper/stripe"

export default async function CheckoutWrapper({ payment_collection, currency_code, children }: Props) {
    const paymentSession = payment_collection?.payment_sessions?.find(
        (s) => s.status === "pending",
    )
    const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID as string
    const providerId = paymentSession?.provider_id
    const isCardFields = providerId === "pp_paypal_card"

    let clientToken: string | null = null
    if (isCardFields) {
        const data = await createToken()
        clientToken = data.client_token
    }

    // if (paymentSession && isStripe(paymentSession.provider_id)) {

    //     const isAuthorized = ["requires_capture", "succeeded"].includes(
    //         paymentSession.data?.status as string,
    //     )

    //     if (isAuthorized) {
    //         return <>{children}</>
    //     }

    //     return (
    //         <StripeWrapper clientSecret={paymentSession.data?.client_secret as string}>
    //             {children}
    //         </StripeWrapper>
    //     )
    // }

    // --- PayPal (standard + card fields) ---
    if (isPaypal(providerId) && paypalClientId) {
        return (
            <PayPalWrapper
                paypalClientId={paypalClientId}
                currency={currency_code}
                isCardFields={isCardFields}
                token={clientToken}
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

type Props = {
    payment_collection?: StorePaymentCollection
    currency_code: string
    children: React.ReactNode
    country_code?: string
}