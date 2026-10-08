import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { StepType } from "@/types/common";

const STEP_ORDER = ["address", "shipping", "payment"] as const satisfies readonly StepType[];

const STEP_INDEX: Record<string, number> = Object.fromEntries(
  STEP_ORDER.map((step, index) => [step, index])
);

export function canReachStep(currentStep: StepType, completedSteps: readonly StepType[], targetStep: StepType,): boolean {
  const currentIndex = STEP_INDEX[currentStep]
  const targetIndex = STEP_INDEX[targetStep]

  if (currentIndex === undefined || targetIndex === undefined) {
    return false
  }

  // Already here.
  if (currentIndex === targetIndex) {
    return true
  }

  // Going backwards is always allowed.
  if (targetIndex < currentIndex) {
    return true
  }

  // Moving forward requires every prerequisite step to be complete.
  return STEP_ORDER.slice(0, targetIndex).every((step) => completedSteps.includes(step))

}

type CheckoutState = {
  currentStep: StepType
  completedSteps: StepType[]
  isPending: boolean
  error: string | null

  setStep: (step: StepType) => void
  markCompleted: (step: StepType) => void
  canGoTo: (step: StepType) => boolean
  setIsPending: (value: boolean) => void
  setError: (msg: string | null) => void
  handleError: (msg?: string) => void
  reset: () => void
}

const INITIAL_STATE = {
  currentStep: "address" as StepType,
  completedSteps: [] as StepType[],
  isPending: false,
  error: null
}

export const useCheckoutStore = create<CheckoutState>()(
  devtools(
    (set, get) => ({
      ...INITIAL_STATE,

      setStep: (step) =>
        set(
          (state) => {
            if (state.currentStep === step) return state;
            if (!canReachStep(state.currentStep, state.completedSteps, step)) {
              return state; // unreachable — no change, no re-render
            }
            return { currentStep: step };
          },
          false,
          "checkout/setStep",
        ),

      markCompleted: (step) =>
        set(
          (state) => {
            if (state.completedSteps.includes(step)) return state
            const stepIndex = STEP_INDEX[step]

            if (stepIndex === undefined) {
              return state
            }

            const completedSteps = [
              ...state.completedSteps,
            ]

            /*
             * Insert in checkout order without sorting
             * the entire array on every update.
             */
            const insertAt = completedSteps.findIndex((completedStep) => (STEP_INDEX[completedStep] ?? Infinity) > stepIndex)

            if (insertAt === -1) {
              completedSteps.push(step)
            } else {
              completedSteps.splice(insertAt, 0, step)
            }

            return {
              completedSteps,
            }
          },
          false,
          "checkout/markCompleted",
        ),

      canGoTo: (step) => {
        const { currentStep, completedSteps } = get();
        return canReachStep(currentStep, completedSteps, step);
      },

      setIsPending: (value) => set((state) => state.isPending === value ? state : { isPending: value },
        false,
        "checkout/setIsPending"
      ),

      handleError: (msg) => set((state) => msg ? { error: msg, isPending: false } : state,
        false,
        "checkout/handleError"
      ),

      setError: (msg) => set({ error: msg },
        false,
        "checkout/setError"
      ),

      reset: () => set({
        currentStep: INITIAL_STATE.currentStep,
        completedSteps: [],
        isPending: false,
      }, false, "checkout/reset"),
    }),
    {
      name: "CheckStore",
      enabled: process.env.NODE_ENV === "development",
    },
  ),
);

// ── Granular Selectors ────────────────────────────────────────────
export const useCheckoutStep = () => useCheckoutStore((s) => s.currentStep);
export const useCheckoutCompleted = () => useCheckoutStore((s) => s.completedSteps);
export const useCheckoutPending = () => useCheckoutStore((s) => s.isPending);
export const useCheckoutSetStep = () => useCheckoutStore((s) => s.setStep)