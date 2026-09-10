"use client";

import type { StoreCart, StoreCustomer } from "@medusajs/types";
import { BookUser } from "lucide-react";
import { useCheckout } from "@/lib/store/checkout-context";
import AddressCard from "../components/address-card";
import AddressForm from "../components/address-form";
import StepHeader from "../components/step-header";

export default function AddressStep({ cart, customer }: AddressStepProps) {
  const { currentStep } = useCheckout();
  const isOpen = currentStep === "address";
  return (
    <div className="pb-4 border-b">
      <StepHeader
        Icon={BookUser}
        title="Addresses"
        subtitle="Shipping and billing addresses"
        showEdit={!isOpen}
        name="address"
      />

      {!isOpen ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <AddressCard
            title="Shipping Address"
            address={cart.shipping_address}
            email={cart.email}
            type="Shipping"
          />
          <AddressCard
            title="Billing Address"
            address={cart.billing_address}
            type="Billing"
          />
        </div>
      ) : (
        <AddressForm cart={cart} />
      )}
    </div>
  );
}

type AddressStepProps = {
  cart: StoreCart;
  customer: StoreCustomer | null;
};
