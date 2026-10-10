import type { Metadata } from "next"
import {
    getCheckoutCustomer,
    getCheckoutPaymentMethods,
    getCheckoutShippingMethods,
} from "@/lib/action/checkout"
import CheckoutPreviewTemplate from "@/module/checkout-preview/templates/checkout-preview-template"
import { retrieveCustomer } from "@/lib/action/customer"
import { retrieveCart } from "@/lib/action/cart"
import { notFound, redirect } from "next/navigation"

export const metadata: Metadata = {
    title: "Secure Atelier Checkout | Velle Hide",
    description:
        "Complete your handcrafted leather commission securely with PayPal, PayPal Card, Pay Later, or PayU.",
}

export default async function CheckoutPreviewPage() {

    const cart = await retrieveCart()

    if (!cart) {
        return notFound()
    }

    // Empty cart → redirect to cart page
    if (!cart.items?.length) redirect("/cart")

    // Missing region → helpful error
    if (!cart.region?.id) {
        return (
            <div className="lg:col-span-10 py-8 sm:py-12 text-center space-y-2 px-4">
                <h1 className="text-base sm:text-lg font-semibold text-foreground">
                    We couldn&apos;t load checkout
                </h1>
                <p className="text-xs sm:text-sm text-foreground-muted max-w-md mx-auto">
                    Your cart is missing region information. Please return to your cart and
                    try again.
                </p>
            </div>
        )
    }

    const [customer, shippingMethods, paymentMethods] = await Promise.all([
        retrieveCustomer(),
        getCheckoutShippingMethods(cart.id),
        getCheckoutPaymentMethods(cart.region.id),
    ])


    return (
        <CheckoutPreviewTemplate
            liveCart={cart}
            liveCustomer={customer}
            liveShippingMethods={shippingMethods}
            livePaymentProviders={paymentMethods}
        />
    )
}
