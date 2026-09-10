"use client";

import type { StoreCart } from "@medusajs/types";
import { AnimatePresence } from "motion/react";
import { div as Div } from "motion/react-client";
import { useActionState, useEffect, useMemo } from "react";
import { setAddresses } from "@/lib/action/cart";
import { useCheckout } from "@/lib/store/checkout-context";
import { useToggleState } from "@/lib/hook/use-toggle-state";
import compareAddresses from "@/lib/util/compare-addresses";
import Button from "@/ui/button";
import CustomInput from "@/ui/input";
import CustomSelect from "@/ui/native-select";
import type { FormState } from "@/types/common";

export default function AddressForm({ cart }: AddressFormProps) {
  const { setCurrentStep } = useCheckout();
  const [addressState, addressAction, isPending] = useActionState(
    setAddresses,
    {
      success: false,
      error: null,
    } as FormState,
  );

  const { state: sameAsBilling, toggle: toggleSameAsBilling } = useToggleState(
    cart?.shipping_address && cart?.billing_address
      ? compareAddresses(cart?.shipping_address, cart?.billing_address)
      : true,
  );

  useEffect(() => {
    const handleNext = () => setCurrentStep("delivery");
    if (addressState.success) {
      handleNext();
      addressState.success = false;
      addressState.error = null;
    }
  }, [addressState, setCurrentStep]);

  const countryOptions = useMemo(() => {
    return (
      cart.region?.countries
        ?.map((country) => ({
          value: country.iso_2,
          label: country.display_name,
        }))
        .filter(
          (opt): opt is { value: string; label: string } => opt !== null,
        ) ?? []
    );
  }, [cart.region]);

  return (
    <form action={addressAction} className="flex flex-col flex-1 space-y-4">
      <AddressFields
        prefix="shipping_address"
        data={cart.shipping_address}
        email={cart.email}
        countryOptions={countryOptions}
      />

      <h2 className="text-xl font-medium">Billing details</h2>
      <div className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="same_as_billing"
          checked={sameAsBilling}
          onChange={toggleSameAsBilling}
        />
        <label>Same as shipping address</label>
      </div>
      <AnimatePresence mode="wait">
        {!sameAsBilling && (
          <Div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <AddressFields
              prefix="billing_address"
              data={cart.billing_address}
              countryOptions={countryOptions}
            />
          </Div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <div>
        <Button
          isLoading={isPending}
          className="w-25 h-10"
          type="submit"
          disabled={isPending}
        >
          Save
        </Button>
        {addressState.error && (
          <div
            className="text-destructive-foreground text-sm pt-2"
            role="alert"
            aria-live="polite"
          >
            {addressState.error}
          </div>
        )}
      </div>
    </form>
  );
}

function AddressFields({
  prefix,
  data,
  email,
  countryOptions,
}: AddressFieldsProps) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <CustomInput
          label="First name"
          name={`${prefix}.first_name`}
          defaultValue={data?.first_name || ""}
          required
          autoFocus
        />
        <CustomInput
          label="Last name"
          name={`${prefix}.last_name`}
          defaultValue={data?.last_name || ""}
          required
        />
      </div>
      <CustomInput
        label="Company"
        name={`${prefix}.company`}
        defaultValue={data?.company || ""}
      />
      <CustomInput
        label="Address"
        name={`${prefix}.address_1`}
        defaultValue={data?.address_1 || ""}
        required
      />
      <CustomInput
        label="Apartment, suite, etc."
        name={`${prefix}.address_2`}
        defaultValue={data?.address_2 || ""}
      />

      <div className="grid grid-cols-[144px_1fr] lg:grid-cols-[220px_1fr] gap-4">
        <CustomInput
          label="Postal code"
          name={`${prefix}.postal_code`}
          defaultValue={data?.postal_code || ""}
          required
        />
        <CustomInput
          label="City"
          name={`${prefix}.city`}
          defaultValue={data?.city || ""}
          required
        />
      </div>

      <div className="grid grid-cols-[1fr_144px] lg:grid-cols-[1fr_220px] gap-4">
        <CustomSelect
          options={countryOptions}
          defaultValue={data?.country_code || undefined}
          label="Country"
          name={`${prefix}.country_code`}
          required
          disabled={countryOptions.length === 0}
        />
        <CustomInput
          label="Province / State"
          name={`${prefix}.province`}
          defaultValue={data?.province || ""}
        />
      </div>

      {email !== undefined && (
        <CustomInput
          label="Email"
          name="email"
          defaultValue={email || ""}
          required
        />
      )}
      <CustomInput
        label="Phone"
        name={`${prefix}.phone`}
        defaultValue={data?.phone || ""}
        required
      />
    </div>
  );
}

type AddressFieldsProps = {
  prefix: string;
  data?: StoreCart["shipping_address"] | StoreCart["billing_address"];
  email?: string | null;
  countryOptions: { value: string; label: string }[];
};

type AddressFormProps = {
  cart: StoreCart;
};
