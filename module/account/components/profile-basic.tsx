"use client";

import type { StoreCustomer } from "@medusajs/types";
import { useActionState } from "react";
import { updateCustomer } from "@/lib/action/customer";
import Button from "@/ui/button";
import Input from "@/ui/input";
import type { FormState } from "@/types/common";

export default function ProfilePersonal({
  customer,
}: {
  customer: StoreCustomer;
}) {
  const [state, formAction, isPending] = useActionState(
    updateCustomerAction,
    initialState,
  );

  return (
    <form className="md:col-span-2 space-y-4" action={formAction}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          name="first_name"
          label="First Name"
          autoComplete="given-name"
          autoFocus
          defaultValue={customer.first_name ?? ""}
        />
        <Input
          name="last_name"
          label="Last Name"
          autoComplete="family-name"
          defaultValue={customer.last_name ?? ""}
        />
      </div>
      <Input
        name="company_name"
        label="Company Name"
        autoComplete="organization"
        defaultValue={customer.company_name ?? ""}
      />
      <Input
        name="email"
        label="Email"
        type="email"
        defaultValue={customer.email ?? ""}
        disabled
      />
      <Input
        name="phone"
        label="Phone"
        type="tel"
        autoComplete="phone"
        defaultValue={customer.phone ?? ""}
        helperText="Enter phone number with country code"
        required
      />

      <Button isLoading={isPending}>
        Update Profile
      </Button>
      {state.error && (
        <p className="text-destructive text-sm mt-2" role="alert">
          {state.error}
        </p>
      )}
      {state.success && (
        <p className="text-success text-sm mt-2" role="status">
          Profile updated successfully!
        </p>
      )}
    </form>
  );
}

const initialState: FormState = {
  success: false,
  error: null,
};

async function updateCustomerAction(_: FormState, formData: FormData) {
  const customerUpdate = {
    first_name: formData.get("first_name") as string,
    last_name: formData.get("last_name") as string,
    company_name: formData.get("company_name") as string,
    phone: formData.get("phone") as string,
  };

  try {
    await updateCustomer(customerUpdate);
    return { success: true, error: null };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}
