"use client";

import { AlertCircle, LogIn } from "lucide-react";
import { useActionState, useState } from "react";
import { login, signup, type CustomerAuthState } from "@/lib/action/customer";
import SIGNIN from "@/module/auth/templates/sign-in";
import SIGNUP from "@/module/auth/templates/sign-up";
import Button from "@/ui/button";

type LoginView = "SIGN_IN" | "SIGN_UP";

export default function Page() {
  const [view, setView] = useState<LoginView>("SIGN_IN");
  const isSignIn = view === "SIGN_IN";

  const safeAction = async (
    _state: CustomerAuthState,
    formData: FormData,
  ): Promise<CustomerAuthState> => {
    return isSignIn ? login(_state, formData) : signup(_state, formData);
  };

  const [message, formAction, isPending] = useActionState(safeAction, null);

  return (
    <>
      {/* Headings */}
      <div className="mb-6 sm:mb-8 text-center animate-fade-in-up">
        <h1 className="text-xl sm:text-2xl font-bold text-foreground font-heading">
          {isSignIn ? "Welcome back" : "Become a Member"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
          {isSignIn
            ? "Sign in to access your account and enjoy personalized shopping."
            : "Create your account to enjoy a personalized and enhanced shopping experience."}
        </p>
      </div>

      {/* Form */}
      <form action={formAction} className="space-y-4 animate-fade-in-up" style={{ animationDelay: "50ms" }}>
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

      {/* Error Message */}
      {message?.state === "error" && (
        <div
          className="flex items-center gap-2 mt-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 animate-fade-in-up"
          role="alert"
          aria-live="polite"
        >
          <AlertCircle className="w-4 h-4 text-destructive shrink-0" />
          <p className="text-sm text-destructive">{message.error}</p>
        </div>
      )}

      {/* View Switcher */}
      <p className="mt-6 text-center text-sm text-muted-foreground">
        {isSignIn ? (
          <>
            Don&apos;t have an account?{" "}
            <button
              type="button"
              onClick={() => setView("SIGN_UP")}
              className="font-semibold text-primary hover:underline underline-offset-2 transition-colors"
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
              className="font-semibold text-primary hover:underline underline-offset-2 transition-colors"
            >
              Sign in
            </button>
          </>
        )}
      </p>
    </>
  );
}
