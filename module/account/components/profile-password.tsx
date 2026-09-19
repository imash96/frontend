"use client";

import { useActionState, useEffect, useState } from "react";
import { updatePassword } from "@/lib/action/customer";
import Button from "@/ui/button";
import Input from "@/ui/input";
import type { FormState } from "@/types/common";

export default function ProfilePassword() {
  const [state, formAction, isPending] = useActionState(
    updatePassword,
    initialState,
  );
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    if (state.success || state.error) {
      setShowFeedback(true);
      const timer = setTimeout(() => setShowFeedback(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [state]);

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
        helperText="Minimum 8 characters"
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
      {showFeedback && state.error && (
        <p
          className="text-destructive text-sm mt-2 animate-fade-in-up"
          role="alert"
        >
          {state.error}
        </p>
      )}
      {showFeedback && state.success && (
        <p
          className="text-success text-sm mt-2 animate-fade-in-up"
          role="status"
        >
          Password updated successfully!
        </p>
      )}
    </form>
  );
}

const initialState: FormState = {
  success: false,
  error: null,
};
