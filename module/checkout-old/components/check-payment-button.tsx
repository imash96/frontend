"use client"

import type { StoreCart } from "@medusajs/types"
import type { OnApproveActions, OnApproveData } from "@paypal/paypal-js"
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js"
import { AlertCircle, Clock, CreditCard, Loader, Lock, Shield } from "lucide-react"
import { useCallback, useState } from "react"
import { ERROR_MESSAGES } from "@/data/payment"
import { captureOrder, createOrder, placeCheckoutOrder } from "@/lib/action/checkout"
import { isManual, isPaypal, isPayU, isStripe } from "@/lib/constant"
import { useCheckoutStore } from "@/lib/store/checkout-store"
import ErrorMessage from "@/module/common/templates/error-message"
import Button, { ButtonElementProps } from "@/ui/button"

export default function CheckPaymentButton({ cart }: { cart: StoreCart }) {
  const notReady = !cart || !cart.shipping_address || !cart.billing_address || !cart.email || (cart.shipping_methods?.length ?? 0) < 1

  const session = cart.payment_collection?.payment_sessions?.find(
    (s) => s.status === "pending",
  )
  const provider = session?.provider_id

  if (!session) {
    return (
      <FinalPaymentButton
        disabled
        aria-busy={false}
        icon={<AlertCircle className="w-4 h-4 mr-2 shrink-0" />}
      >

        <span>Select a payment method</span>
      </FinalPaymentButton>
    )
  }

  // if (isStripe(provider))
  //   return <StripePayment cart={cart} notReady={notReady} />
  if (provider === "pp_paypal_card")
    return <PayPalCardPayment cart={cart} notReady={notReady} />
  if (isPaypal(provider))
    return <PayPalPayment cart={cart} notReady={notReady} />
  if (isPayU(provider))
    return <PayUPayment cart={cart} notReady={notReady} />
  if (isManual(provider)) return <ManualPayment notReady={notReady} />

  return (
    <FinalPaymentButton disabled>
      <AlertCircle className="w-4 h-4 mr-2 shrink-0" />
      <span>Unsupported payment provider</span>
    </FinalPaymentButton>
  )
}

/* ═══════════════════ Stripe Payment ═══════════════════ */
// function StripePayment({
//   cart,
//   notReady,
// }: {
//   cart: StoreCart
//   notReady: boolean
// }) {
//   const { submitting, setSubmitting, error, setError, handleError } =
//     useCommonHandlers()
//   const stripe = useStripe()
//   const elements = useElements()

//   const session = cart.payment_collection?.payment_sessions?.find(
//     (s) => s.status === "pending",
//   )
//   const clientSecret = session?.data?.client_secret as string
//   const isAuthorized = ["requires_capture", "succeeded"].includes(
//     session?.data?.status as string,
//   )
//   const disabled = (!isAuthorized && (!stripe || !elements)) || notReady

//   const handleStripe = useCallback(async () => {
//     if (submitting) return
//     if (disabled) {
//       handleError(ERROR_MESSAGES.USER_NOT_READY)
//       return
//     }
//     setSubmitting(true)
//     setError(null)

//     if (isAuthorized) {
//       try {
//         await placeCheckOrder()
//       } catch (err: any) {
//         handleError(err?.message || ERROR_MESSAGES.DEFAULT_ERROR)
//       }
//       return
//     }

//     if (!elements) {
//       handleError("Payment form is not ready yet. Please wait a moment.")
//       return
//     }

//     const paymentElement =
//       elements.getElement("payment") || elements.getElement(PaymentElement)
//     if (!paymentElement) {
//       handleError("Payment form is not ready yet. Please wait a moment.")
//       return
//     }

//     try {
//       if (typeof elements.submit === "function") {
//         const { error: submitError } = await elements.submit()
//         if (submitError) {
//           handleError(submitError.message || ERROR_MESSAGES.DEFAULT_ERROR)
//           return
//         }
//       }

//       const { error: stripeError, paymentIntent } =
//         await stripe!.confirmPayment({
//           elements: elements!,
//           clientSecret,
//           confirmParams: {
//             return_url: `${window.location.origin}/check`,
//             payment_method_data: {
//               billing_details: {
//                 name: `${cart.billing_address?.first_name ?? ""} ${cart.billing_address?.last_name ?? ""}`.trim(),
//                 email: cart.email,
//                 phone: cart.billing_address?.phone ?? undefined,
//                 address: {
//                   line1: cart.billing_address?.address_1 ?? undefined,
//                   line2: cart.billing_address?.address_2 ?? undefined,
//                   city: cart.billing_address?.city ?? undefined,
//                   state: cart.billing_address?.province ?? undefined,
//                   postal_code:
//                     cart.billing_address?.postal_code ?? undefined,
//                   country: cart.billing_address?.country_code ?? undefined,
//                 },
//               },
//             },
//             shipping: {
//               name: `${cart.shipping_address?.first_name ?? ""} ${cart.shipping_address?.last_name ?? ""}`.trim(),
//               phone: cart.shipping_address?.phone ?? undefined,
//               address: {
//                 line1: cart.shipping_address?.address_1 ?? "",
//                 line2: cart.shipping_address?.address_2 ?? undefined,
//                 city: cart.shipping_address?.city ?? undefined,
//                 state: cart.shipping_address?.province ?? undefined,
//                 postal_code:
//                   cart.shipping_address?.postal_code ?? undefined,
//                 country: cart.shipping_address?.country_code ?? undefined,
//               },
//             },
//           },
//           redirect: "if_required",
//         })

//       if (stripeError) {
//         const pi = stripeError.payment_intent
//         if (
//           pi &&
//           (pi.status === "requires_capture" || pi.status === "succeeded")
//         ) {
//           await placeCheckOrder()
//           return
//         }
//         handleError(stripeError.message ?? ERROR_MESSAGES.DEFAULT_ERROR)
//         return
//       }

//       if (
//         paymentIntent &&
//         ["requires_capture", "succeeded"].includes(paymentIntent.status)
//       ) {
//         await placeCheckOrder()
//       } else {
//         handleError(ERROR_MESSAGES.DEFAULT_ERROR)
//       }
//     } catch (err: any) {
//       handleError(err?.message || ERROR_MESSAGES.DEFAULT_ERROR)
//     }
//   }, [
//     submitting,
//     disabled,
//     stripe,
//     elements,
//     clientSecret,
//     cart,
//     isAuthorized,
//     setSubmitting,
//     setError,
//     handleError,
//   ])

//   return (
//     <div className="space-y-3">
//       <FinalPaymentButton
//         disabled={disabled || submitting}
//         isLoading={submitting}
//         onClick={handleStripe}
//         icon={<CreditCard className="w-5 h-5" />}
//       >
//         {submitting ? "Processing..." : "Pay with Card"}
//       </FinalPaymentButton>
//       <ErrorMessage error={error} />
//     </div>
//   )
// }

/* ═══════════════════ PayPal Payment ═══════════════════ */
function PayPalPayment({
  cart,
  notReady,
}: {
  cart: StoreCart
  notReady: boolean
}) {
  const { submitting, setSubmitting, error, setError, handleError } =
    useCommonHandlers()

  // Wrap usePayPalScriptReducer in a try-catch approach:
  // This hook must be within PayPalScriptProvider. We render
  // the PayPal button content only when the provider is available.
  return (
    <PayPalPaymentInner
      cart={cart}
      notReady={notReady}
      submitting={submitting}
      setSubmitting={setSubmitting}
      error={error}
      setError={setError}
      handleError={handleError}
    />
  )
}

/**
 * Inner component rendered inside PayPalScriptProvider context.
 * usePayPalScriptReducer is safe here because CheckWrapper wraps
 * PayPal providers in PayPalScriptProvider.
 */
function PayPalPaymentInner({
  cart,
  notReady,
  submitting,
  setSubmitting,
  error,
  setError,
  handleError,
}: {
  cart: StoreCart
  notReady: boolean
  submitting: boolean
  setSubmitting: (v: boolean) => void
  error: string | null
  setError: (v: string | null) => void
  handleError: (msg?: string) => void
}) {
  const [{ isPending, isResolved }] = usePayPalScriptReducer()
  const disabled = notReady || submitting

  const createPaypalOrder = useCallback(async () => {
    try {
      const res = await createOrder(cart.id)
      console.log("[PayPal] create order response:", res)
      if (!res || !res.id) {
        throw new Error(`Failed to create PayPal order: ${res}`)
      }
      return res.id
    } catch (err: any) {
      handleError(err.message || "Failed to create PayPal order")
      throw err
    }
  }, [cart.id, handleError])

  const onApprove = useCallback(
    async (_data: OnApproveData, _actions: OnApproveActions) => {
      if (submitting) return
      setSubmitting(true)
      setError(null)

      try {
        const res = await captureOrder(cart.id, _data.orderID)
        console.log({ res })
        if (!res) {
          throw new Error(res || "PayPal capture failed")
        }
        await placeCheckoutOrder()
      } catch (err: any) {
        handleError(err?.message || "PayPal failed")
      }
    },
    [submitting, setSubmitting, setError, handleError, cart.id],
  )

  if (isPending) {
    return (
      <div className="flex items-center justify-center py-6">
        <Loader className="animate-spin w-6 h-6" />
        <span className="ml-2 text-xs sm:text-sm text-muted-foreground">
          Loading PayPal…
        </span>
      </div>
    )
  }

  if (!isResolved) {
    return (
      <div className="text-xs sm:text-sm text-muted-foreground py-4 text-center">
        PayPal not available
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <PayPalButtons
        style={{
          shape: "rect",
          layout: "horizontal",
          color: "silver",
          label: "paypal",
        }}
        createOrder={createPaypalOrder}
        onApprove={onApprove}
        onError={(err) => {
          handleError(`PayPal payment failed. Please try again. ${err}`)
        }}
        disabled={disabled}
        className="mt-4 sm:mt-6"
      />
      <ErrorMessage error={error} />
    </div>
  )
}

/* ═══════════════════ PayPal Card Payment ═══════════════════ */
function PayPalCardPayment({ cart, notReady, }: { cart: StoreCart; notReady: boolean }) {
  const { submitting, setSubmitting, error, handleError } = useCommonHandlers()

  // PayPal Card Fields are rendered in the preview panel (check-paypal-card.tsx)
  // This button triggers the card fields form submission
  const handleSubmit = useCallback(async () => {
    if (submitting || notReady) return
    setSubmitting(true)

    try {
      // The PayPalCardFieldsProvider form is submitted programmatically
      // through the card fields ref in the preview component
      // For now, trigger via custom event
      const event = new CustomEvent("paypal-card-submit", {
        detail: { cart_id: cart.id },
      })
      window.dispatchEvent(event)
    } catch (err: any) {
      handleError(err?.message || ERROR_MESSAGES.DEFAULT_ERROR)
    }
  }, [submitting, notReady, cart.id, setSubmitting, handleError])

  return (
    <div className="space-y-3">
      <FinalPaymentButton
        disabled={notReady || submitting}
        isLoading={submitting}
        onClick={handleSubmit}
        icon={<CreditCard className="w-5 h-5" />}
      >
        {submitting ? "Processing..." : "Pay with Card"}
      </FinalPaymentButton>
      <ErrorMessage error={error} />
    </div>
  )
}

/* ═══════════════════ PayU Payment (Redirect-based) ═══════════════════ */
function PayUPayment({
  cart,
  notReady,
}: {
  cart: StoreCart
  notReady: boolean
}) {
  const { submitting, setSubmitting, error, setError, handleError } =
    useCommonHandlers()

  const session = cart.payment_collection?.payment_sessions?.find(
    (s) => s.status === "pending",
  )
  const formData = (session?.data as Record<string, any>)?.form_data

  const handlePayU = useCallback(async () => {
    if (submitting) return
    if (notReady) {
      handleError(ERROR_MESSAGES.USER_NOT_READY)
      return
    }
    if (!formData || !formData.key || !formData.hash) {
      handleError(
        "PayU payment session is not ready. Please try selecting PayU again.",
      )
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      // Build a hidden form and submit it to redirect to PayU checkout
      const payuUrl =
        (session?.data as Record<string, any>)?.paymentUrl ||
        "https://test.payu.in/_payment"

      const form = document.createElement("form")
      form.method = "POST"
      form.action = payuUrl
      form.style.display = "none"

      // Add all form_data fields as hidden inputs
      for (const [key, value] of Object.entries(formData)) {
        if (value != null) {
          const input = document.createElement("input")
          input.type = "hidden"
          input.name = key
          input.value = String(value)
          form.appendChild(input)
        }
      }

      document.body.appendChild(form)
      form.submit()
    } catch (err: any) {
      handleError(err?.message || ERROR_MESSAGES.DEFAULT_ERROR)
    }
  }, [
    submitting,
    notReady,
    formData,
    session?.data,
    setSubmitting,
    setError,
    handleError,
  ])

  return (
    <div className="space-y-3">
      <FinalPaymentButton
        disabled={notReady || submitting || !formData}
        isLoading={submitting}
        onClick={handlePayU}
        icon={<Shield className="w-5 h-5" />}
      >
        {submitting ? "Redirecting to PayU..." : "Pay with PayU"}
      </FinalPaymentButton>
      <ErrorMessage error={error} />
    </div>
  )
}

/* ═══════════════════ Manual Payment (Pay Later) ═══════════════════ */
function ManualPayment({ notReady }: { notReady: boolean }) {
  const setIsPending = useCheckoutStore((s) => s.setIsPending)
  const isPending = useCheckoutStore((s) => s.isPending)
  const { submitting, setSubmitting, error, setError, handleError } =
    useCommonHandlers()

  const handle = useCallback(async () => {
    if (submitting) return
    if (notReady) {
      handleError(ERROR_MESSAGES.USER_NOT_READY)
      return
    }
    setSubmitting(true)
    setError(null)
    setIsPending(true)
    try {
      await placeCheckoutOrder()
    } catch (err: any) {
      handleError(err?.message || ERROR_MESSAGES.DEFAULT_ERROR)
    } finally {
      setSubmitting(false)
      setIsPending(false)
    }
  }, [
    submitting,
    notReady,
    setSubmitting,
    setError,
    handleError,
    setIsPending,
  ])

  return (
    <div className="space-y-3">
      <FinalPaymentButton
        onClick={handle}
        icon={<Clock className="w-5 h-5" />}
        isLoading={submitting}
        disabled={notReady || submitting || isPending}
      >
        {submitting ? "Processing order..." : "Place Order"}
      </FinalPaymentButton>
      <ErrorMessage error={error} />
    </div>
  )
}

/* ═══════════════════ Shared helpers ═══════════════════ */
function useCommonHandlers() {
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleError = useCallback((msg?: string) => {
    setError(msg ?? ERROR_MESSAGES.DEFAULT_ERROR)
    setSubmitting(false)
  }, [])

  return { submitting, setSubmitting, error, setError, handleError }
}

function FinalPaymentButton({
  isLoading = false,
  disabled = false,
  onClick,
  children,
  ...props
}: ButtonElementProps) {
  return (
    <>
      <Button
        variant="primary"
        isLoading={isLoading}
        disabled={disabled}
        onClick={onClick}
        className="w-full mt-4 h-11 sm:h-12 text-sm sm:text-base font-semibold tracking-wide"
        {...props}
      >
        {children ? children : isLoading ? "Processing..." : "Pay"}
      </Button>
      <div className="flex items-center justify-center gap-1.5 mt-2">
        <Lock className="w-3 h-3 text-muted-foreground" />
        <p className="text-[10px] sm:text-xs text-center text-muted-foreground">
          Transactions are secured and encrypted
        </p>
      </div>
    </>
  )
}

type FinalPaymentButtonProps = {
  isLoading?: boolean
  disabled?: boolean
  onClick?: () => void
  Icon?: React.ReactNode
} & React.PropsWithChildren
