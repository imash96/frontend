import type { StorePaymentSession } from "@medusajs/types"
import { create } from "zustand"
import { devtools } from "zustand/middleware"
import { ERROR_MESSAGES } from "@/data/payment"
import { initCheckoutPayment, placeCheckoutOrder, setCheckoutAddresses, setCheckoutShipping, } from "@/lib/action/checkout"
import { computeStepStatus, STEP_INDEX, STEP_ORDER, type StepStatus } from "./checkout-steps"
import type { StepType } from "@/types/common"

export type PaymentSessionRef = Pick<StorePaymentSession, "id" | "provider_id" | "status">

const LAST_INDEX = STEP_ORDER.length - 1
/**
 * UI-only checkout state. Server data (cart, customer, options) stays in props.
 *
 * isPending     - a step-level request is in flight (save address / delivery / payment method)
 * isSubmitting  - the final payment is in progress (PayPal approval, placing order, PayU redirect)
 * notReady      - the cart can't be paid yet (missing email, address or delivery method)
 * activeSession - the pending payment session the customer picked
 */
type CheckoutData = {
  currentStep: StepType
  completedSteps: readonly StepType[]
  maxStepIndex: number

  isPending: boolean
  isSubmitting: boolean
  error: string | null
  notReady: boolean
  activeSession: PaymentSessionRef | undefined
}

type CheckoutActions = {
  initialize: (payload: { step: StepType; completed: readonly StepType[] }) => void
  setStep: (step: StepType) => boolean
  completeStep: (step: StepType) => void

  setIsPending: (value: boolean) => void
  setIsSubmitting: (value: boolean) => void
  setError: (message: string | null) => void
  /** Shows an error and releases every loading flag. */
  handleError: (message?: string) => void
  /** Releases loading flags without touching the error (bfcache restore, cancelled popups). */
  releaseLocks: () => void

  saveAddress: (formData: FormData) => Promise<boolean>
  selectShippingOption: (optionId: string) => Promise<boolean>

  setNotReady: (value: boolean) => void
  setActiveSession: (session: PaymentSessionRef | undefined) => void
  /** Mirrors cart-derived payment state; no-op (no re-render) when nothing relevant changed. */
  syncPayment: (payload: { notReady: boolean; activeSession: PaymentSessionRef | undefined }) => void

  selectPaymentMethod: (args: {
    cartId: string
    providerId: string
    collectionId?: string
  }) => Promise<boolean>
  /**
   * Atomic gate for the final payment. Reads the live store (not a render-time closure), so two
   * rapid clicks can't both pass: the first flips isSubmitting, the second gets `false`.
   */
  beginSubmit: () => boolean
  /** Completes the cart for providers without a client SDK (Pay Later). Redirects on success. */
  placeOrder: () => Promise<void>

  reset: () => void
}

export type CheckoutState = CheckoutData & CheckoutActions

const INITIAL_DATA: CheckoutData = {
  currentStep: "address",
  completedSteps: [],
  maxStepIndex: 0,

  isPending: false,
  isSubmitting: false,
  error: null,
  notReady: true, // safe default: nothing can be paid until the cart proves it's ready
  activeSession: undefined,
}

function advance(
  step: StepType,
): Pick<CheckoutData, "currentStep" | "completedSteps" | "maxStepIndex"> {
  const index = STEP_INDEX[step]
  const next = Math.min(index + 1, LAST_INDEX)
  return {
    completedSteps: STEP_ORDER.slice(0, index + 1),
    currentStep: STEP_ORDER[next] ?? step,
    // Saving a step re-locks everything after the next one: later steps must be re-confirmed.
    maxStepIndex: next,
  }
}

/** Customers never see raw exception text (it's technical, and masked in production anyway). */
function unexpected(e: unknown) {
  console.error("[checkout]", e)
  return ERROR_MESSAGES.DEFAULT_ERROR
}

// Monotonic ids drop responses that arrive after a newer request (or a reset).
let requestSeq = 0

export const useCheckoutStore = create<CheckoutState>()(
  devtools(
    (set, get) => ({
      ...INITIAL_DATA,

      // Seeds progress only. Payment fields are owned by syncPayment, which runs right after.
      initialize: ({ step, completed }) => {
        const done = Array.isArray(completed) ? completed : []
        set(
          {
            currentStep: step && step in STEP_INDEX ? step : INITIAL_DATA.currentStep,
            completedSteps: done,
            maxStepIndex: Math.min(done.length, LAST_INDEX),
            isPending: false,
            isSubmitting: false,
            error: null,
          },
          false,
          "checkout/initialize",
        )
      },

      setStep: (step) => {
        const { currentStep, maxStepIndex, isPending, isSubmitting } = get()
        if (step === currentStep) return true
        if (isPending || isSubmitting || STEP_INDEX[step] > maxStepIndex) return false
        set({ currentStep: step, error: null }, false, "checkout/setStep")
        return true
      },

      completeStep: (step) =>
        set({ ...advance(step), error: null }, false, "checkout/completeStep"),

      setIsPending: (isPending) => set({ isPending }, false, "checkout/setIsPending"),
      setIsSubmitting: (isSubmitting) =>
        set({ isSubmitting }, false, "checkout/setIsSubmitting"),
      setError: (error) => set({ error }, false, "checkout/setError"),
      handleError: (message) =>
        set(
          { error: message || ERROR_MESSAGES.DEFAULT_ERROR, isPending: false, isSubmitting: false },
          false,
          "checkout/handleError",
        ),
      releaseLocks: () =>
        set({ isPending: false, isSubmitting: false }, false, "checkout/releaseLocks"),

      // ── Address ──────────────────────────────────────────────────────────
      saveAddress: async (formData) => {
        if (get().isPending) return false
        const id = ++requestSeq
        set({ isPending: true, error: null }, false, "checkout/address:start")

        let error: string | null = null
        try {
          const result = await setCheckoutAddresses(formData)
          if (!result.success) error = result.error || ERROR_MESSAGES.DEFAULT_ERROR
        } catch (e) {
          error = unexpected(e)
        }

        if (id !== requestSeq) return false
        set(
          error === null
            ? { ...advance("address"), isPending: false }
            : { error, isPending: false },
          false,
          "checkout/address:done",
        )
        return error === null
      },

      // ── Shipping ─────────────────────────────────────────────────────────
      selectShippingOption: async (optionId) => {
        const { isPending, isSubmitting } = get()
        if (isPending || isSubmitting) return false

        const id = ++requestSeq
        set({ isPending: true, error: null }, false, "checkout/shipping:start")

        let error: string | null = null
        try {
          const result = await setCheckoutShipping(optionId)
          if (!result.success) error = result.error || ERROR_MESSAGES.DEFAULT_ERROR
        } catch (e) {
          error = unexpected(e)
        }

        if (id !== requestSeq) return false // a reset happened while the request was in flight
        set(
          error === null ? { ...advance("shipping"), isPending: false } : { error, isPending: false },
          false,
          "checkout/shipping:done",
        )
        return error === null
      },

      // ── Payment ──────────────────────────────────────────────────────────
      setNotReady: (notReady) => set({ notReady }, false, "checkout/setNotReady"),
      setActiveSession: (activeSession) =>
        set({ activeSession }, false, "checkout/setActiveSession"),

      syncPayment: ({ notReady, activeSession }) => {
        const prev = get()
        const same =
          prev.notReady === notReady &&
          prev.activeSession?.id === activeSession?.id &&
          prev.activeSession?.status === activeSession?.status &&
          prev.activeSession?.provider_id === activeSession?.provider_id
        if (!same) set({ notReady, activeSession }, false, "checkout/syncPayment")
      },

      selectPaymentMethod: async ({ cartId, providerId, collectionId }) => {
        const { isPending, isSubmitting } = get()
        if (isPending || isSubmitting) return false

        const id = ++requestSeq
        set({ isPending: true, error: null }, false, "checkout/payment:select:start")

        let error: string | null = null
        try {
          const result = await initCheckoutPayment(cartId, providerId, collectionId)
          if (!result.success) error = result.error || ERROR_MESSAGES.DEFAULT_ERROR
        } catch (e) {
          error = unexpected(e)
        }

        if (id !== requestSeq) return false
        set(
          error === null ? { isPending: false } : { error, isPending: false },
          false,
          "checkout/payment:select:done",
        )
        return error === null
      },

      beginSubmit: () => {
        const { isSubmitting, isPending, notReady } = get()
        if (isSubmitting || isPending) return false
        if (notReady) {
          set({ error: ERROR_MESSAGES.USER_NOT_READY }, false, "checkout/submit:blocked")
          return false
        }
        set({ isSubmitting: true, error: null }, false, "checkout/submit:start")
        return true
      },

      placeOrder: async () => {
        if (!get().beginSubmit()) return
        try {
          // Redirects to the confirmation page on success and never resolves normally.
          const result = await placeCheckoutOrder()
          if (result && !result.success) get().handleError(result.error || undefined)
        } catch (e) {
          get().handleError(unexpected(e))
        }
        // No `finally { isSubmitting = false }`: re-enabling the button during the redirect
        // allowed a second click and a duplicate order.
      },

      reset: () => {
        requestSeq++
        set(INITIAL_DATA, false, "checkout/reset")
      },
    }),
    {
      name: "CheckoutStore",
      enabled: process.env.NODE_ENV === "development",
    },
  ),
)

// ─── Selectors ──────────────────────────────────────────────────────────────
// Each returns a primitive, so subscribers only re-render when their answer changes.

export const selectIsBusy = (s: CheckoutState) => s.isPending || s.isSubmitting

export const selectCanPay = (s: CheckoutState) =>
  !s.notReady && !s.isPending && !s.isSubmitting && s.activeSession !== undefined

/** Status of one step (see computeStepStatus). */
export function useStepStatus(stepId: StepType): StepStatus {
  return useCheckoutStore((s) =>
    computeStepStatus(stepId, s.currentStep, s.completedSteps, s.maxStepIndex),
  )
}