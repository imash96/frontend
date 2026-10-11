import { retrieveCart } from "@/lib/action/cart"
import { getCheckoutPaymentMethods, getCheckoutShippingMethods } from "@/lib/action/checkout"
import { retrieveCustomer } from "@/lib/action/customer"
import StepAddress from "@/module/checkout/templates/step-address"
import StepPayment from "@/module/checkout/templates/step-payment"
import StepShipping from "@/module/checkout/templates/step-shipping"
import Summary from "@/module/checkout/templates/summary"
import CheckoutWrapper from "@/module/checkout/templates/wrapper"
import CheckoutStoreInitializer from "@/module/checkout/components/store-initializer"
import { redirect } from "next/navigation"
import { Metadata } from "next"
import { deriveCheckoutProgress } from "@/lib/store/checkout-steps"
import { StoreCartShippingOption } from "@medusajs/types"

export const metadata: Metadata = {
    title: "Secure Checkout | Velle Hide Store",
    description: "Complete your purchase securely at Velle Hide Store. Pay with credit card, PayPal, or choose Pay Later.",
    robots: { index: false, follow: false },
}

const NO_SHIPPING_OPTIONS: StoreCartShippingOption[] = []

export default async function Page() {

    const cart = await retrieveCart()

    // No cart or an empty one: there is nothing to check out, send them back.
    if (!cart?.items?.length) redirect("/cart")

    if (!cart.region?.id) return <CheckoutError message="Your cart is missing region information. Please return to your cart and try again." />

    const { step, completed } = deriveCheckoutProgress(cart)

    // Independent requests run in parallel. Shipping options depend on the address, so a fresh cart
    // has none yet: that is expected and must not be treated as a load failure.
    const [customer, shippingMethods, paymentMethods] = await Promise.all([
        retrieveCustomer(),
        completed.includes("address") ? getCheckoutShippingMethods(cart.id) : NO_SHIPPING_OPTIONS,
        getCheckoutPaymentMethods(cart.region.id),
    ])

    if (!paymentMethods || !shippingMethods) {
        return (
            <CheckoutError message="Something went wrong loading shipping or payment options. Please refresh the page or try again shortly." />
        )
    }

    return (
        <>
            {/* Seeds the client store with server-derived progress (mount-only). */}
            <CheckoutStoreInitializer step={step} completed={completed} />

            <div className="space-y-4 lg:col-span-6 lg:space-y-6">
                <StepAddress cart={cart} customer={customer} />
                <StepShipping cart={cart} shippingMethods={shippingMethods} />
                <CheckoutWrapper currency_code={cart.currency_code}>
                    <StepPayment cart={cart} paymentMethods={paymentMethods} />
                </CheckoutWrapper>
            </div>

            <aside className="w-full lg:sticky lg:top-24 lg:col-span-4 lg:self-start">
                <Summary cart={cart} />
            </aside>
        </>
    )
}

function CheckoutError({ message }: { message: string }) {
    return (
        <div role="alert" className="space-y-2 px-4 py-12 text-center lg:col-span-10">
            <h1 className="font-heading text-lg font-semibold text-foreground">We couldn&apos;t load checkout</h1>
            <p className="mx-auto max-w-md text-sm text-foreground-tertiary">{message}</p>
        </div>
    )
}