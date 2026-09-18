"use client";

import { createContext, useCallback, useContext, useState, useTransition } from "react";
import type { StepType } from "@/types/common";

type CheckContextValue = {
  currentStep: StepType;
  setCurrentStep: (step: StepType) => void;
  completedSteps: Set<StepType>;
  markCompleted: (step: StepType) => void;
  isPending: boolean;
  manualPending: boolean;
  startPending: (callback: () => Promise<void>) => void;
  setIsPending: (value: boolean) => void;
};

const CheckContext = createContext<CheckContextValue | null>(null);

const STEP_ORDER: StepType[] = ["address", "delivery", "payment"];

export function CheckProvider({
  children,
  step,
  initialCompleted = [],
}: React.PropsWithChildren & {
  step: StepType;
  initialCompleted?: StepType[];
}) {
  const [currentStep, setCurrentStepRaw] = useState<StepType>(step);
  const [completedSteps, setCompletedSteps] = useState<Set<StepType>>(
    () => new Set(initialCompleted),
  );
  const [isPending, startTransition] = useTransition();
  const [manualPending, setManualPending] = useState(false);

  const setCurrentStep = useCallback(
    (newStep: StepType) => {
      const newIndex = STEP_ORDER.indexOf(newStep);
      const currentIndex = STEP_ORDER.indexOf(currentStep);

      // Allow going back to completed steps, staying, or advancing one step
      if (newIndex <= currentIndex || newIndex === currentIndex + 1) {
        setCurrentStepRaw(newStep);
      }
      // Also allow if all previous steps are completed
      else {
        const allPrevCompleted = STEP_ORDER.slice(0, newIndex).every((s) =>
          completedSteps.has(s),
        );
        if (allPrevCompleted) {
          setCurrentStepRaw(newStep);
        }
      }
    },
    [currentStep, completedSteps],
  );

  const markCompleted = useCallback((step: StepType) => {
    setCompletedSteps((prev) => new Set(prev).add(step));
  }, []);

  const startPending = useCallback(
    (callback: () => Promise<void>) => {
      startTransition(callback);
    },
    [],
  );

  const setIsPending = useCallback((value: boolean) => {
    setManualPending(value);
  }, []);

  return (
    <CheckContext.Provider
      value={{
        currentStep,
        setCurrentStep,
        completedSteps,
        markCompleted,
        isPending,
        manualPending,
        startPending,
        setIsPending,
      }}
    >
      {children}
    </CheckContext.Provider>
  );
}

export function useCheck() {
  const context = useContext(CheckContext);
  if (!context)
    throw new Error("useCheck must be used within a CheckProvider");
  return context;
}
