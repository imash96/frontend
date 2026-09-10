"use client";

import { createContext, useContext, useState, useTransition } from "react";
import type { StepType } from "@/types/common";

type CheckoutContextValue = {
  currentStep: StepType;
  setCurrentStep: (step: StepType) => void;
  isPending: boolean;
  manualPending: boolean;
  startPending: (callback: () => Promise<void>) => void;
  setIsPending: (value: boolean) => void; // for PaymentButton
};

const CheckoutContext = createContext<CheckoutContextValue | null>(null);

export function CheckoutProvider({
  children,
  step,
}: React.PropsWithChildren & { step: StepType }) {
  const [currentStep, setCurrentStep] = useState<StepType>(step);
  const [isPending, startTransition] = useTransition();
  const [manualPending, setManualPending] = useState(false);

  const startPending = (callback: () => Promise<void>) => {
    startTransition(callback);
  };

  // state setter for PaymentButton (manual control)
  const setIsPending = (value: boolean) => {
    setManualPending(value);
  };

  return (
    <CheckoutContext.Provider value={{
      currentStep,
      setCurrentStep,
      isPending: isPending,
      manualPending,
      startPending,
      setIsPending,
    }}>
      {children}
    </CheckoutContext.Provider>
  );
}

export function useCheckout() {
  const context = useContext(CheckoutContext);
  if (!context)
    throw new Error("useCheckout must be used within a CheckoutProvider");
  return context;
}
