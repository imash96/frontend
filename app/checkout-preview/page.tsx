import type { Metadata } from "next"
import {
    getCheckCart,
    getCheckCustomer,
    getCheckPaymentMethods,
    getCheckShippingMethods,
} from "@/lib/action/checkout"
import CheckoutPreviewTemplate from "@/module/checkout-preview/templates/checkout-preview-template"

export const metadata: Metadata = {
    title: "Secure Atelier Checkout | Velle Hide",
    description:
        "Complete your handcrafted leather commission securely with PayPal, PayPal Card, Pay Later, or PayU.",
}

export default async function CheckoutPreviewPage() {
    let liveCart = null
    let liveCustomer = null
    let liveShippingMethods = null
    let livePaymentProviders = null

    try {
        ;[liveCart, liveCustomer] = await Promise.all([
            getCheckCart(),
            getCheckCustomer(),
        ])

        if (liveCart?.id) {
            ;[liveShippingMethods, livePaymentProviders] = await Promise.all([
                getCheckShippingMethods(liveCart.id),
                getCheckPaymentMethods(liveCart.region?.id ?? ""),
            ])
        }
    } catch {
        // Medusa backend unavailable — CheckoutPreviewTemplate serves rich interactive preview state
    }

    return (
        <CheckoutPreviewTemplate
            liveCart={liveCart}
            liveCustomer={liveCustomer}
            liveShippingMethods={liveShippingMethods}
            livePaymentProviders={livePaymentProviders}
        />
    )
}
