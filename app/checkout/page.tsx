import { retrieveCart } from "@/lib/action/cart"
import { getCheckPaymentMethods, getCheckShippingMethods } from "@/lib/action/checkout"
import { retrieveCustomer } from "@/lib/action/customer"
import CheckoutProgress from "@/module/checkout/templates/progress"
import StepAddress from "@/module/checkout/templates/step-address"
import StepPayment from "@/module/checkout/templates/step-payment"
import StepShipping from "@/module/checkout/templates/step-shipping"
import Summary from "@/module/checkout/templates/summary"
import CheckoutWrapper from "@/module/checkout/templates/wrapper"
import { notFound, redirect } from "next/navigation"
import { LockIcon, ShieldCheckIcon, TruckIcon } from "lucide-react";
import { TrustBadge } from "@/module/checkout/templates/trust-badge"

export default async function Page() {

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

    // Parallel data fetching
    const [customer, shippingMethods, paymentMethods] = await Promise.all([
        retrieveCustomer(),
        getCheckShippingMethods(cart.id),
        getCheckPaymentMethods(cart.region.id),
    ])

    if (!shippingMethods || !paymentMethods) {
        return (
            <div className="lg:col-span-10 py-8 sm:py-12 text-center space-y-2 px-4">
                <h1 className="text-base sm:text-lg font-semibold text-foreground">
                    We couldn&apos;t load checkout
                </h1>
                <p className="text-xs sm:text-sm text-foreground-muted max-w-md mx-auto">
                    Something went wrong loading shipping or payment options. Please
                    refresh the page or try again shortly.
                </p>
            </div>
        )
    }

    return (
        <>
            {/* Main checkout form */}
            <div className="lg:col-span-6 space-y-4 sm:space-y-5 lg:space-y-6">
                <CheckoutProgress />
                <StepAddress cart={cart} customer={customer} />
                <StepShipping cart={cart} shippingMethods={shippingMethods} />
                <CheckoutWrapper payment_collection={cart.payment_collection} currency_code={cart.currency_code}>
                    <StepPayment cart={cart} paymentMethods={paymentMethods} />
                </CheckoutWrapper>
            </div>
            {/* Order summary sidebar */}
            <div className="w-full lg:sticky lg:top-24 lg:col-span-4 lg:self-start space-y-6">
                <Summary cart={cart} />
                <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs text-text-tertiary">
                    <TrustBadge icon={<LockIcon />}>Encrypted</TrustBadge>
                    <TrustBadge icon={<ShieldCheckIcon />}>Insured</TrustBadge>
                    <TrustBadge icon={<TruckIcon />}>Tracked</TrustBadge>
                </div>
            </div>
        </>
    )
}