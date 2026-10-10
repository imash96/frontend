"use client"

import { useEffect, useRef } from "react"
import { useCheckoutStore } from "@/lib/store/checkout-store"
import type { StepType } from "@/types/common"

/**
 * Hydrates the Zustand store with server-computed initial state.
 * Runs once on mount, no-ops if already initialized.
 */
export default function CheckStoreInitializer({
  step,
  completed,
}: {
  step: StepType
  completed: StepType[]
}) {
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    const store = useCheckoutStore.getState()
    store.reset()

    // Set completed steps
    for (const s of completed) {
      store.completeStep(s)
    }

    // Set current step
    store.setStep(step)
  }, [step, completed])

  return null
}
