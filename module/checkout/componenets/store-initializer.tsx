"use client"

import { useEffect } from "react"
import { useCheckoutStore } from "@/lib/store/checkout-store"
import type { StepType } from "@/types/common"


type Props = {
  step: StepType
  completed: readonly StepType[]
}

export default function CheckoutStoreInitializer({ step, completed }: Props) {
  useEffect(() => {
    useCheckoutStore.getState().initialize({ step, completed })

    // Coming back from a redirect gateway (PayU) with the Back button restores this page from
    // the bfcache with isSubmitting still true; unlock the pay button again.
    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) useCheckoutStore.getState().releaseLocks()
    }
    window.addEventListener("pageshow", onPageShow)

    return () => {
      window.removeEventListener("pageshow", onPageShow)
      useCheckoutStore.getState().reset()
    }
  }, [])

  return null
}