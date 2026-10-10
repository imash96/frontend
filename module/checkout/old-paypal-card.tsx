"use client"

import type { StoreCart } from "@medusajs/types"
import { PayPalButtons, PayPalCardFieldsProvider, PayPalCVVField, PayPalExpiryField, PayPalNameField, PayPalNumberField, usePayPalCardFields, } from "@paypal/react-paypal-js"
import { useCallback, useState } from "react"
import { captureOrder, createOrder, markPaymentComplete, placeCheckoutOrder } from "@/lib/action/checkout"
import CheckPaymentContainer from "./components/provider-panel"

export default function PayPalCard({ cart, }: { cart: StoreCart }) {
  const [error, setError] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isPaying, setIsPaying] = useState(false);
  const createPaypalOrder = useCallback(async () => {
    setError(null)
    let response: any = null

    try {
      response = await createOrder(cart.id)

      console.log("creating order response received")
      console.log(response)
    } catch (e) {
      console.error("[PayPal Card] create order request failed:", e)
      throw e
    }

    console.log("[PayPal Card] create order response:", response)

    if (!response?.id) {
      throw new Error(
        response?.message || "Unable to create PayPal order"
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

        try {
          const result = await captureOrder(cart.id, data.orderID)
          await markPaymentComplete(cart.id)
          console.log("[PayPal Card] capture response:", result)
        } catch (e: any) {
          console.error("[PayPal Card] capture failed:", e)

          throw new Error(
            e?.message || "PayPal capture failed"
          )
        }
        /*
         * At this point PayPal has successfully completed the payment.
         *
         * Your existing checkout action should now complete the
         * Medusa cart using the already-selected PayPal payment session.
         */
        await placeCheckoutOrder()
      } catch (err) {
        console.error("[PayPal Card] payment failed:", err)

        setError(err instanceof Error ? err.message : "Unable to complete PayPal card payment.")
      } finally {
        setIsProcessing(false)
      }
    },
    [cart.id]
  )

  const onError = useCallback(async (err: any) => {
    console.error("[PayPal Card] payment failed:", err)

    setError(err instanceof Error ? err.message : "Unable to complete PayPal card payment.")
  }, [])

  return (
    <CheckPaymentContainer>
      <div className="relative w-full space-y-4 text-left">

        <PayPalButtons
          createOrder={createPaypalOrder}
          onApprove={onApprove}
          onError={onError}
          style={{
            shape: "rect",
            layout: "vertical",
            color: "gold",
            label: "paypal",
          }}
        />

        <PayPalCardFieldsProvider
          createOrder={createPaypalOrder}
          onApprove={onApprove}
          onError={onError}
          style={{
            input: {
              "font-size": "16px",
              "font-family": "courier, monospace",
              "font-weight": "lighter",
              color: "#ccc",
            },
            ".invalid": { color: "purple" },
          }}
        >
          <PayPalNameField
            style={{
              input: { color: "blue" },
              ".invalid": { color: "purple" },
            }}
          />
          <PayPalNumberField />
          <PayPalExpiryField />
          <PayPalCVVField />

          {/* Custom client component to handle card fields submission */}
          <SubmitPayment
            isPaying={isPaying}
            setIsPaying={setIsPaying}
          />
        </PayPalCardFieldsProvider>
      </div>
    </CheckPaymentContainer>
  )
}

const SubmitPayment = ({ isPaying, setIsPaying }: any) => {
  const { cardFieldsForm, fields } = usePayPalCardFields();

  const handleClick = async () => {
    if (!cardFieldsForm) {
      const childErrorMessage =
        "Unable to find any child components in the <PayPalCardFieldsProvider />";

      throw new Error(childErrorMessage);
    }
    const formState = await cardFieldsForm.getState();

    if (!formState.isFormValid) {
      return alert("The payment form is invalid");
    }
    setIsPaying(true);
  };

  return (
    <button
      className={isPaying ? "btn" : "btn btn-primary"}
      style={{ float: "right" }}
      onClick={handleClick}
    >
      {isPaying ? <div className="spinner tiny" /> : "Pay"}
    </button>
  );
};
