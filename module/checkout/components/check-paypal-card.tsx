"use client"

import { useEffect, useState, useCallback } from "react"
import {
  PayPalCardFieldsProvider,
  PayPalCardFieldsForm,
  usePayPalCardFields,
} from "@paypal/react-paypal-js"
import type { StoreCart } from "@medusajs/types"
import CheckPaymentContainer from "./check-payment-container"
import ErrorMessage from "@/module/common/templates/error-message"
import { Loader2 } from "lucide-react"
import { placeCheckOrder } from "@/lib/action/check"

const MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL
const PUBLISHABLE_API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

export default function CheckPayPalCard({ cart }: { cart: StoreCart }) {
  const [error, setError] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isAvailable, setIsAvailable] = useState(true)

  useEffect(() => {
    try {
      // @ts-ignore
      if (typeof window !== "undefined" && !window.paypal?.CardFields) {
        setIsAvailable(false)
      }
    } catch {
      setIsAvailable(false)
    }
  }, [])

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
      setError(err.message || "Failed to create PayPal order")
      throw err
    }
  }, [cart.id])

  const onApprove = useCallback(async (data: any) => {
    setIsProcessing(true)
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
            order_id: data.orderID,
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
      setError(err?.message || "PayPal failed")
      setIsProcessing(false)
    }
  }, [cart.id])

  if (!isAvailable) {
    return (
      <CheckPaymentContainer>
        <div className="text-center space-y-2 py-2">
          <p className="text-xs sm:text-sm text-muted-foreground">
            Card payment via PayPal is not currently available.
          </p>
          <p className="text-[10px] sm:text-xs text-muted-foreground">
            Please select another payment method.
          </p>
        </div>
      </CheckPaymentContainer>
    )
  }

  return (
    <CheckPaymentContainer>
      <div className="w-full space-y-3 sm:space-y-4 text-left relative min-h-[150px]">
        {/* We use PayPalCardFieldsProvider which needs createOrder and onApprove */}
        <PayPalCardFieldsProvider
          createOrder={createOrder}
          onApprove={onApprove}
          onError={(err: any) => {
            setError("There was an error processing your card. Please try again.")
            setIsProcessing(false)
          }}
        >
          <CardFormInner setIsProcessing={setIsProcessing} error={error} />
        </PayPalCardFieldsProvider>

        {isProcessing && (
          <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-10 flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-accent" />
            <span className="text-sm font-medium text-foreground">
              Processing payment...
            </span>
          </div>
        )}
      </div>
    </CheckPaymentContainer>
  )
}

function CardFormInner({
  setIsProcessing,
  error,
}: {
  setIsProcessing: (val: boolean) => void
  error: string | null
}) {
  const { cardFieldsForm } = usePayPalCardFields()

  useEffect(() => {
    const handleEvent = () => {
      if (cardFieldsForm) {
        setIsProcessing(true)
        cardFieldsForm
          .submit()
          .catch((err: any) => {
            setIsProcessing(false)
          })
      }
    }
    window.addEventListener("paypal-card-submit", handleEvent)
    return () => window.removeEventListener("paypal-card-submit", handleEvent)
  }, [cardFieldsForm, setIsProcessing])

  return (
    <div className="w-full space-y-4">
      <PayPalCardFieldsForm />
      <ErrorMessage error={error} />
      <p className="text-[10px] sm:text-xs text-muted-foreground text-center pt-2">
        Your card details are processed securely by PayPal.
      </p>
    </div>
  )
}
