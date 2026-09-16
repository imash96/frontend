"use client";

import { LogIn } from "lucide-react";
import { useActionState, useState } from "react";
import { login, signup, type CustomerAuthState } from "@/lib/action/customer";
import SIGNIN from "@/module/auth/templates/sign-in";
import SIGNUP from "@/module/auth/templates/sign-up";
import Button from "@/ui/button";

export type LOGIN_VIEW = "SIGN_IN" | "SIGN_UP";

export default function Page() {
  const [view, setView] = useState<LOGIN_VIEW>("SIGN_IN");
  const isSignIn = view === "SIGN_IN";
  const safeAction = async (_state: CustomerAuthState, formData: FormData): Promise<CustomerAuthState> => { return isSignIn ? login(_state, formData) : signup(_state, formData); };
  const [message, formAction, isPending] = useActionState(safeAction, null);
  return (
    <>
      {/* Headings */}
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-foreground">
          {isSignIn ? "Welcome back" : "Become a Member"}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {isSignIn ? "Sign in to access your account and enjoy personalized shopping." : "Create your account to enjoy a personalized and enhanced shopping experience."}
        </p>
      </div>

      {/* Form */}
      <form action={formAction} className="space-y-4">
        {isSignIn ? <SIGNIN /> : <SIGNUP />}

        {/* Action Button */}
        <Button
          icon={<LogIn className="w-4" />}
          variant="secondary"
          type="submit"
          className="w-full h-11"
          isLoading={isPending}
        >
          {isSignIn ? "Sign in" : "Sign up"}
        </Button>
      </form>

      {/* View Switcher */}
      <p className="mt-6 text-center text-sm text-muted-foreground">
        {isSignIn ? (
          <>
            Don’t have an account?{" "}
            <button
              type="button"
              onClick={() => setView("SIGN_UP")}
              className="font-medium text-primary hover:underline"
            >
              Sign up
            </button>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => setView("SIGN_IN")}
              className="font-medium text-primary hover:underline"
            >
              Sign in
            </button>
          </>
        )}
      </p>
      {message?.state === 'error' && (
        <p className="text-sm text-center text-destructive mt-2">{message.error}</p>
      )}
    </>
  );
}
