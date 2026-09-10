"use client";

import { useActionState } from "react";
import Button from "@/ui/button";
import Input from "@/ui/input";
import type { FormState } from "@/types/common";

export default function ProfilePassword() {
  const [state, formAction, isPending] = useActionState(
    updatePassword,
    initialState,
  );
  return (
    <form className="md:col-span-2 space-y-4" action={formAction}>
      <Input
        label="Current Password"
        id="current-password"
        name="current_password"
        type="password"
        autoComplete="current-password"
        required
      />

      <Input
        label="New Password"
        id="new-password"
        name="new_password"
        type="password"
        autoComplete="new-password"
        required
      />

      <Input
        label="Confirm Password"
        id="confirm-password"
        name="confirm_password"
        type="password"
        autoComplete="new-password"
        required
      />

      <Button isLoading={isPending} className="mt-4">
        Update Password
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

const updatePassword = async () => {
  alert("Password update is not implemented");

  try {
    // await updateCustomer(customerUpdate)
    return { success: false, error: null };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Password update is not implemented",
    };
  }
};

const initialState: FormState = {
  success: false,
  error: null,
};
