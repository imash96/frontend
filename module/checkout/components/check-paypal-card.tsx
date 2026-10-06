"use client"

import type { StoreCart } from "@medusajs/types"
import { PayPalCardFieldsForm, PayPalCardFieldsProvider, usePayPalCardFields, } from "@paypal/react-paypal-js"
import { Loader2 } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { captureOrder, createOrder, placeCheckOrder } from "@/lib/action/checkout"
import ErrorMessage from "@/module/common/templates/error-message"
import CheckPaymentContainer from "./check-payment-container"

export default function CheckPayPalCard({ cart, }: { cart: StoreCart }) {
  const [error, setError] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const createPaypalOrder = useCallback(async () => {
    setError(null)
    let response: any = null

    try {
      const response = await createOrder(cart.id)
      console.log("[PayPal Card] create order response:", response)
    } catch {
      // ignore JSON parse error
    }
    console.log("[PayPal Card] create order response:", response)
    if (!response || !response.id) {
      throw new Error(
        response?.message ||
        `Unable to create PayPal order`
      )
    }

    return response.id
  }, [cart.id])

  const onApprove = useCallback(
    async (data: any) => {
      setIsProcessing(true)
      setError(null)

      try {
        if (!data?.orderID) {
          throw new Error("PayPal did not return an order ID")
        }

        let result: any = null

        try {
          result = await captureOrder(cart.id, data.orderID)
        } catch (e: any) {
          throw new Error(
            result?.message ||
            `PayPal capture failed (${e})`
          )
        }
        /*
         * At this point PayPal has successfully completed the payment.
         *
         * Your existing checkout action should now complete the
         * Medusa cart using the already-selected PayPal payment session.
         */
        await placeCheckOrder()
      } catch (err) {
        console.error("[PayPal Card] payment failed:", err)

        setError(err instanceof Error ? err.message : "Unable to complete PayPal card payment.")
      } finally {
        setIsProcessing(false)
      }
    },
    [cart.id]
  )

  return (
    <CheckPaymentContainer>
      <div className="relative w-full space-y-4 text-left">
        <PayPalCardFieldsProvider
          createOrder={createPaypalOrder}
          onApprove={onApprove}
          onError={(err) => {
            console.error("[PayPal Card] SDK error:", err)

            setError(
              "There was an error processing your card. Please check your card details and try again."
            )

            setIsProcessing(false)
          }}
        >
          <CardFormInner
            isProcessing={isProcessing}
            setIsProcessing={setIsProcessing}
            error={error}
          />
        </PayPalCardFieldsProvider>
      </div>
    </CheckPaymentContainer>
  )
}

function CardFormInner({
  isProcessing,
  setIsProcessing,
  error,
}: {
  isProcessing: boolean
  setIsProcessing: (value: boolean) => void
  error: string | null
}) {
  const { cardFieldsForm } = usePayPalCardFields()

  const handleSubmit = useCallback(async () => {
    if (!cardFieldsForm) {
      setIsProcessing(false)

      return
    }

    setIsProcessing(true)

    try {
      await cardFieldsForm.submit()
    } catch (err) {
      console.error("[PayPal Card] submit error:", err)

      setIsProcessing(false)
    }
  }, [cardFieldsForm, setIsProcessing])

  useEffect(() => {
    const handler = () => {
      void handleSubmit()
    }

    window.addEventListener("paypal-card-submit", handler)

    return () => {
      window.removeEventListener("paypal-card-submit", handler)
    }
  }, [handleSubmit])

  return (
    <div className="w-full space-y-4">
      <PayPalCardFieldsForm />

      <ErrorMessage error={error} />

      <p className="pt-2 text-center text-[10px] text-muted-foreground sm:text-xs">
        Your card details are processed securely by PayPal.
      </p>

      {isProcessing && (
        <div className="flex items-center justify-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm">
            Processing payment...
          </span>
        </div>
      )}
    </div>
  )
}
