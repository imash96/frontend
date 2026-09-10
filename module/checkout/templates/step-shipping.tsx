"use client";

import type { StoreCart, StoreCartShippingOption } from "@medusajs/types";
import { Truck } from "lucide-react";
import { useLayoutEffect } from "react";
import { useCheckout } from "@/lib/store/checkout-context";
import ListShippingMethods from "../components/shipping-method-list";
import ShippingCardShow from "../components/shipping-method-show";
import StepHeader from "../components/step-header";

export default function ShippingStep({
  cart,
  availableMethods,
}: ShippingProps) {
  const { currentStep, setCurrentStep } = useCheckout();
  const isOpen = currentStep === "delivery";

  useLayoutEffect(() => {
    if (cart.shipping_methods?.length && currentStep === "delivery")
      setCurrentStep("payment");
  }, [cart.shipping_methods, currentStep]);

  return (
    <div className="pb-4 border-b">
      <StepHeader
        Icon={Truck}
        title="Shipping Method"
        subtitle="Choose your preferred delivery option"
        showEdit={!isOpen && currentStep !== "address"}
        name="delivery"
      />
      {isOpen ? (
        <ListShippingMethods
          availableMethods={availableMethods}
          cartId={cart.id}
          currencyCode={cart.currency_code}
          selectedMethodId={cart.shipping_methods?.at(0)?.shipping_option_id}
        />
      ) : (
        <ShippingCardShow
          methods={cart.shipping_methods}
          currencyCode={cart.currency_code}
        />
      )}
    </div>
  );
}

type ShippingProps = {
  cart: StoreCart;
  availableMethods: StoreCartShippingOption[];
};
