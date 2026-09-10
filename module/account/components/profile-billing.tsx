"use client";

import type { StoreCustomer, StoreRegion } from "@medusajs/types";
import { useActionState, useMemo } from "react";
import {
  addCustomerAddress,
  updateCustomerAddress,
} from "@/lib/action/customer";
import Button from "@/ui/button";
import Input from "@/ui/input";
import Select from "@/ui/native-select";
import type { FormState } from "@/types/common";

export default function ProfileBilling({ customer, regions }: CustomerProps) {
  const billingAddress = customer.addresses?.find(
    (addr) => addr.is_default_billing,
  );
  const isEdit = Boolean(billingAddress);
  const [state, formAction, isPending] = useActionState(
    isEdit ? updateCustomerAddress : addCustomerAddress,
    initialState,
  );

  const regionOptions = useMemo(
    () =>
      regions.flatMap((region) =>
        region
          .countries!.map((country) => ({
            value: country.iso_2,
            label: country.display_name,
          }))
          .filter(
            (option): option is { value: string; label: string } => !!option,
          ),
      ),
    [regions],
  );

  return (
    <form
      action={formAction}
      className="w-full md:col-span-2 space-y-4"
      aria-label="Billing address form"
    >
      {/* Hidden for edit */}
      <input type="hidden" name="addressId" value={billingAddress?.id || ""} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="First name"
          name="first_name"
          defaultValue={billingAddress?.first_name ?? ""}
          required
        />
        <Input
          label="Last name"
          name="last_name"
          defaultValue={billingAddress?.last_name ?? ""}
          required
        />
      </div>

      <Input
        label="Company (optional)"
        name="company"
        defaultValue={billingAddress?.company ?? ""}
      />

      <Input
        label="Address"
        name="address_1"
        defaultValue={billingAddress?.address_1 ?? ""}
        required
      />

      <Input
        label="Apartment, suite, etc. (optional)"
        name="address_2"
        defaultValue={billingAddress?.address_2 ?? ""}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Postal code"
          name="postal_code"
          defaultValue={billingAddress?.postal_code ?? ""}
          required
        />
        <Input
          label="City"
          name="city"
          defaultValue={billingAddress?.city ?? ""}
          required
        />
      </div>

      <Input
        label="Province / State"
        name="province"
        defaultValue={billingAddress?.province ?? ""}
      />
      <Select
        name="country_code"
        defaultValue={billingAddress?.country_code ?? "us"}
        required
        label="Country"
        options={regionOptions}
      />

      <Input
        label="Phone (optional)"
        name="phone"
        defaultValue={billingAddress?.phone ?? ""}
      />

      <Button type="submit" isLoading={isPending}>
        {isEdit ? "Update Address" : "Add Address"}
      </Button>

      {state.error && (
        <p className="text-destructive text-sm mt-2" role="alert">
          {state.error}
        </p>
      )}
      {state.success && (
        <p className="text-success text-sm mt-2" role="status">
          Billing address updated successfully!
        </p>
      )}
    </form>
  );
}

type BillingFormState = {
  addressId?: string;
  isDefaultBilling: boolean;
} & FormState;

const initialState: BillingFormState = {
  isDefaultBilling: true,
  error: null,
  success: false,
};

type CustomerProps = {
  customer: StoreCustomer;
  regions: StoreRegion[];
};
