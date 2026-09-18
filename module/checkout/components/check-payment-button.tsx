"use client"

import type { StoreCart } from "@medusajs/types"
import type { OnApproveActions, OnApproveData } from "@paypal/paypal-js"
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js"
import {
  useElements,
  useStripe,
  PaymentElement,
} from "@stripe/react-stripe-js"
import { AlertCircle, Clock, CreditCard, Loader, Lock } from "lucide-react"
import { useCallback, useState } from "react"
import { ERROR_MESSAGES } from "@/data/payment"
import { placeCheckOrder } from "@/lib/action/check"
import { isManual, isPaypal, isStripe } from "@/lib/constant"
import { useCheckStore } from "@/lib/store/check-store"
import Button from "@/ui/button"
import ErrorMessage from "@/module/common/templates/error-message"

const MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL
const PUBLISHABLE_API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

export default function CheckPaymentButton({ cart }: { cart: StoreCart }) {
  const notReady =
    !cart ||
    !cart.shipping_address ||
    !cart.billing_address ||
    !cart.email ||
    (cart.shipping_methods?.length ?? 0) < 1

  const session = cart.payment_collection?.payment_sessions?.find(
    (s) => s.status === "pending",
  )
  const provider = session?.provider_id

  if (!session) {
    return (
      <FinalPaymentButton disabled aria-busy={false}>
        <AlertCircle className="w-4 h-4 mr-2 shrink-0" />
        <span>Select a payment method</span>
      </FinalPaymentButton>
    )
  }

  if (isStripe(provider))
    return <StripePayment cart={cart} notReady={notReady} />
  if (provider === "pp_paypal_card_paypal_card")
    return <PayPalCardPayment cart={cart} notReady={notReady} />
  if (isPaypal(provider))
    return <PayPalPayment cart={cart} notReady={notReady} />
  if (isManual(provider)) return <ManualPayment notReady={notReady} />

  return (
    <FinalPaymentButton disabled>
      <AlertCircle className="w-4 h-4 mr-2 shrink-0" />
      <span>Unsupported payment provider</span>
    </FinalPaymentButton>
  )
}

/* ═══════════════════ Stripe Payment ═══════════════════ */
function StripePayment({
  cart,
  notReady,
}: {
  cart: StoreCart
  notReady: boolean
}) {
  const { submitting, setSubmitting, error, setError, handleError } =
    useCommonHandlers()
  const stripe = useStripe()
  const elements = useElements()

  const session = cart.payment_collection?.payment_sessions?.find(
    (s) => s.status === "pending",
  )
  const clientSecret = session?.data?.client_secret as string
  const isAuthorized = ["requires_capture", "succeeded"].includes(
    session?.data?.status as string,
  )
  const disabled = (!isAuthorized && (!stripe || !elements)) || notReady

  const handleStripe = useCallback(async () => {
    if (submitting) return
    if (disabled) {
      handleError(ERROR_MESSAGES.USER_NOT_READY)
      return
    }
    setSubmitting(true)
    setError(null)

    if (isAuthorized) {
      try {
        await placeCheckOrder()
      } catch (err: any) {
        handleError(err?.message || ERROR_MESSAGES.DEFAULT_ERROR)
      }
      return
    }

    if (!elements) {
      handleError("Payment form is not ready yet. Please wait a moment.")
      return
    }

    const paymentElement =
      elements.getElement("payment") || elements.getElement(PaymentElement)
    if (!paymentElement) {
      handleError("Payment form is not ready yet. Please wait a moment.")
      return
    }

    try {
      if (typeof elements.submit === "function") {
        const { error: submitError } = await elements.submit()
        if (submitError) {
          handleError(submitError.message || ERROR_MESSAGES.DEFAULT_ERROR)
          return
        }
      }

      const { error: stripeError, paymentIntent } =
        await stripe!.confirmPayment({
          elements: elements!,
          clientSecret,
          confirmParams: {
            return_url: `${window.location.origin}/check`,
            payment_method_data: {
              billing_details: {
                name: `${cart.billing_address?.first_name ?? ""} ${cart.billing_address?.last_name ?? ""}`.trim(),
                email: cart.email,
                phone: cart.billing_address?.phone ?? undefined,
                address: {
                  line1: cart.billing_address?.address_1 ?? undefined,
                  line2: cart.billing_address?.address_2 ?? undefined,
                  city: cart.billing_address?.city ?? undefined,
                  state: cart.billing_address?.province ?? undefined,
                  postal_code:
                    cart.billing_address?.postal_code ?? undefined,
                  country: cart.billing_address?.country_code ?? undefined,
                },
              },
            },
            shipping: {
              name: `${cart.shipping_address?.first_name ?? ""} ${cart.shipping_address?.last_name ?? ""}`.trim(),
              phone: cart.shipping_address?.phone ?? undefined,
              address: {
                line1: cart.shipping_address?.address_1 ?? "",
                line2: cart.shipping_address?.address_2 ?? undefined,
                city: cart.shipping_address?.city ?? undefined,
                state: cart.shipping_address?.province ?? undefined,
                postal_code:
                  cart.shipping_address?.postal_code ?? undefined,
                country: cart.shipping_address?.country_code ?? undefined,
              },
            },
          },
          redirect: "if_required",
        })

      if (stripeError) {
        const pi = stripeError.payment_intent
        if (
          pi &&
          (pi.status === "requires_capture" || pi.status === "succeeded")
        ) {
          await placeCheckOrder()
          return
        }
        handleError(stripeError.message ?? ERROR_MESSAGES.DEFAULT_ERROR)
        return
      }

      if (
        paymentIntent &&
        ["requires_capture", "succeeded"].includes(paymentIntent.status)
      ) {
        await placeCheckOrder()
      } else {
        handleError(ERROR_MESSAGES.DEFAULT_ERROR)
      }
    } catch (err: any) {
      handleError(err?.message || ERROR_MESSAGES.DEFAULT_ERROR)
    }
  }, [
    submitting,
    disabled,
    stripe,
    elements,
    clientSecret,
    cart,
    isAuthorized,
    setSubmitting,
    setError,
    handleError,
  ])

  return (
    <div className="space-y-3">
      <FinalPaymentButton
        disabled={disabled || submitting}
        isLoading={submitting}
        onClick={handleStripe}
        Icon={<CreditCard className="w-5 h-5" />}
      >
        {submitting ? "Processing..." : "Pay with Card"}
      </FinalPaymentButton>
      <ErrorMessage error={error} />
    </div>
  )
}

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
  const [{ isPending, isResolved }] = usePayPalScriptReducer()
  const disabled = notReady || submitting

  const createOrder = useCallback(async () => {
    try {
      const res = await fetch(
        `${MEDUSA_BACKEND_URL}/store/paypal/create-order`,
        {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "x-publishable-api-key": PUBLISHABLE_API_KEY ?? "",
          },
          body: JSON.stringify({ cart_id: cart.id }),
        },
      )
      const data = await res.json()
      if (!res.ok || !data.id) {
        throw new Error(data.message || "Failed to create PayPal order")
      }
      return data.id
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
        const captureRes = await fetch(
          `${MEDUSA_BACKEND_URL}/store/paypal/capture-order`,
          {
            method: "POST",
            headers: { 
              "Content-Type": "application/json",
              "x-publishable-api-key": PUBLISHABLE_API_KEY ?? "",
            },
            body: JSON.stringify({
              order_id: _data.orderID,
              cart_id: cart.id,
            }),
          },
        )
        if (!captureRes.ok) {
          const errData = await captureRes.json()
          throw new Error(errData.message || "PayPal capture failed")
        }
        await placeCheckOrder()
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
          layout: "horizontal",
          shape: "rect",
          color: "blue",
          height: 44,
        }}
        createOrder={createOrder}
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
function PayPalCardPayment({
  cart,
  notReady,
}: {
  cart: StoreCart
  notReady: boolean
}) {
  const { submitting, setSubmitting, error, handleError } =
    useCommonHandlers()

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
        Icon={<CreditCard className="w-5 h-5" />}
      >
        {submitting ? "Processing..." : "Pay with Card"}
      </FinalPaymentButton>
      <ErrorMessage error={error} />
    </div>
  )
}

/* ═══════════════════ Manual Payment (Pay Later) ═══════════════════ */
function ManualPayment({ notReady }: { notReady: boolean }) {
  const setIsPending = useCheckStore((s) => s.setIsPending)
  const isPending = useCheckStore((s) => s.isPending)
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
      await placeCheckOrder()
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
        Icon={<Clock className="w-5 h-5" />}
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
  Icon,
  children,
}: FinalPaymentButtonProps) {
  return (
    <>
      <Button
        variant="primary"
        color="primary"
        isLoading={isLoading}
        disabled={disabled}
        icon={Icon}
        onClick={onClick}
        className="w-full mt-4 h-11 sm:h-12 text-sm sm:text-base font-semibold tracking-wide"
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
