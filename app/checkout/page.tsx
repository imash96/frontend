import { notFound } from "next/navigation";
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
  if (!cart) return notFound();

  const [customer, shippingMethods, paymentMethods] = await Promise.all([
    retrieveCustomer(),
    listCartShippingMethods(cart.id),
    listCartPaymentMethods(cart.region?.id ?? ""),
  ]);

  if (!shippingMethods || !paymentMethods) return null;

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
