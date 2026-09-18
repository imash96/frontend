import { create } from "zustand"
import { devtools } from "zustand/middleware"
import type { StepType } from "@/types/common"

// Step order for the /check flow (uses "shipping" not "delivery")
const STEP_ORDER: StepType[] = ["address", "shipping", "payment"]

interface CheckState {
  currentStep: StepType
  completedSteps: Set<StepType>
  isPending: boolean

  // Actions
  setStep: (step: StepType) => void
  markCompleted: (step: StepType) => void
  canGoTo: (step: StepType) => boolean
  setIsPending: (value: boolean) => void
  reset: () => void
}

const initialState = {
  currentStep: "address" as StepType,
  completedSteps: new Set<StepType>(),
  isPending: false,
}

export const useCheckStore = create<CheckState>()(
  devtools(
    (set, get) => ({
      ...initialState,

      setStep: (step) =>
        set((state) => {
          const newIndex = STEP_ORDER.indexOf(step)
          const currentIndex = STEP_ORDER.indexOf(state.currentStep)

          // Allow going back to completed steps
          if (state.completedSteps.has(step)) {
            return { currentStep: step }
          }

          // Allow staying on current or advancing one step
          if (newIndex <= currentIndex || newIndex === currentIndex + 1) {
            return { currentStep: step }
          }

          // Allow jumping if all previous steps are completed
          const allPrevCompleted = STEP_ORDER.slice(0, newIndex).every((s) =>
            state.completedSteps.has(s),
          )
          if (allPrevCompleted) {
            return { currentStep: step }
          }

          return state // No change
        }, false, "check/setStep"),

      markCompleted: (step) =>
        set((state) => {
          if (state.completedSteps.has(step)) return state
          const next = new Set(state.completedSteps)
          next.add(step)
          return { completedSteps: next }
        }, false, "check/markCompleted"),

      canGoTo: (step) => {
        const state = get()
        if (state.completedSteps.has(step)) return true
        const targetIndex = STEP_ORDER.indexOf(step)
        return STEP_ORDER.slice(0, targetIndex).every((s) =>
          state.completedSteps.has(s),
        )
      },

      setIsPending: (value) =>
        set({ isPending: value }, false, "check/setIsPending"),

      reset: () => set(initialState, false, "check/reset"),
    }),
    {
      name: "CheckStore",
      enabled: process.env.NODE_ENV === "development",
    },
  ),
)

// ── Granular Selectors ────────────────────────────────────────────
export const useCheckStep = () => useCheckStore((s) => s.currentStep)
export const useCheckCompleted = () => useCheckStore((s) => s.completedSteps)
export const useCheckPending = () => useCheckStore((s) => s.isPending)
