import { notFound, redirect } from "next/navigation";
import { retrieveCart } from "@/lib/action/cart";
import { retrieveCustomer } from "@/lib/action/customer";
import { listCartShippingMethods } from "@/lib/action/fulfillment";
import { listCartPaymentMethods } from "@/lib/action/payment";
import { CheckoutProvider } from "@/lib/store/checkout-context";
// import CheckoutExpress from "@/module/checkout/templates/checkout-express";
import CheckoutProgress from "@/module/checkout/templates/checkout-progress";
import CheckoutSummary from "@/module/checkout/templates/checkout-summary";
import PaymentWrapper from "@/module/checkout/templates/payment-wrapper";
import AddressStep from "@/module/checkout/templates/step-address";
import PaymentStep from "@/module/checkout/templates/step-payment";
import ShippingStep from "@/module/checkout/templates/step-shipping";
import type { StepType } from "@/types/common";

export default async function Page() {
    const cart = await retrieveCart();

    // No cart at all -> nothing to check out.
    if (!cart) return notFound();

    // An empty cart can't be checked out. Previously this fell through to the
    // step calculation below and rendered a full address/shipping/payment
    // flow (and a $0 summary) for zero items.
    if (!cart.items?.length) {
        redirect("/cart");
    }

    if (!cart.region?.id) {
        // Without a region we can't fetch payment providers or shipping
        // options — this is a data problem (cart has no region attached), not
        // a missing page, so it shouldn't 404.
        return (
            <div className="lg:col-span-10 py-12 text-center space-y-2">
                <h1 className="text-lg font-semibold text-foreground">
                    We couldn&apos;t load checkout
                </h1>
                <p className="text-sm text-foreground-muted">
                    Your cart is missing region information. Please return to your cart and try again.
                </p>
            </div>
        );
    }

    const [customer, shippingMethods, paymentMethods] = await Promise.all([
        retrieveCustomer(),
        listCartShippingMethods(cart.id),
        listCartPaymentMethods(cart.region.id),
    ]);

    if (!shippingMethods || !paymentMethods) {
        // These come back `null` only when the backend calls actually failed.
        // Previously this returned `null` here, which renders as a silent
        // blank page with no indication anything went wrong.
        return (
            <div className="lg:col-span-10 py-12 text-center space-y-2">
                <h1 className="text-lg font-semibold text-foreground">
                    We couldn&apos;t load checkout
                </h1>
                <p className="text-sm text-foreground-muted">
                    Something went wrong loading shipping or payment options. Please refresh the page or try again shortly.
                </p>
            </div>
        );
    }

    const step: StepType = !cart?.shipping_address?.address_1 ? "address" : !cart?.shipping_methods?.length ? "delivery" : "payment";

    return (
        <CheckoutProvider step={step}>
            <div className="lg:col-span-6 space-y-6">
                {/* <CheckoutExpress /> */}
                <CheckoutProgress />
                <PaymentWrapper cart={cart}>
                    <AddressStep cart={cart} customer={customer} />
                    <ShippingStep cart={cart} availableMethods={shippingMethods} />
                    <PaymentStep cart={cart} paymentMethods={paymentMethods} />
                </PaymentWrapper>
            </div>
            <div className="lg:col-span-4 sticky top-24 self-start w-full">
                <CheckoutSummary cart={cart} />
            </div>
        </CheckoutProvider>
    );
}