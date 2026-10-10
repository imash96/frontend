import PayPalWrapper from "../warpper/paypal"

/**
 * Server component. Provides the (lazy) PayPal SDK context whenever PayPal is configured, instead
 * of only while a PayPal session is active: wrapping conditionally changed the tree shape, which
 * remounted the whole payment step each time the customer switched between PayPal and other
 * methods. No server-side token fetch either (it blocked page render and crashed on PayPal outages).
 */
export default function CheckoutWrapper({ currency_code, children }: Props) {
    const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID

    // PayU / Pay Later need no client SDK; PayPal methods are hidden when there is no client id.
    if (!paypalClientId) return <>{children}</>

    return (
        <PayPalWrapper paypalClientId={paypalClientId} currency={currency_code}>
            {children}
        </PayPalWrapper>
    )
}

type Props = {
    currency_code: string
    children: React.ReactNode
}