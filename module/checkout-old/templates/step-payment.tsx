"use client"

import type { StoreCart, StorePaymentProvider } from "@medusajs/types"
import { CheckCircle, Circle, CreditCard, Loader2 } from "lucide-react"
import { AnimatePresence } from "motion/react"
import { div as Div } from "motion/react-client"
import { useState, useTransition } from "react"
import { initCheckPayment } from "@/lib/action/checkout"
import { isPaypal, isPayU } from "@/lib/constant"
import { useCheckoutStore } from "@/lib/store/checkout-store"
import ErrorMessage from "@/module/common/templates/error-message"
import CheckPaymentButton from "../components/check-payment-button"
import { checkPaymentInfoMap } from "../components/check-payment-info"
import CheckStepHeader from "../components/check-step-header"

export default function StepPayment({ cart, paymentMethods, }: PaymentStepProps) {
  const currentStep = useCheckoutStore((s) => s.currentStep)
  const isPending = useCheckoutStore((s) => s.isPending)
  const [isTransitioning, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const activeSession = cart.payment_collection?.payment_sessions?.find(
    (s) => s.status === "pending",
  )
  const selectedPaymentMethod = activeSession?.provider_id

  const isLoading = isTransitioning || isPending

  function setPaymentMethod(cart_id: string, provider_id: string, collection_id?: string,) {
    const isBrokenPaypal = provider_id === selectedPaymentMethod && isPaypal(provider_id) && !activeSession?.data?.id
    if (provider_id === selectedPaymentMethod && !isBrokenPaypal) return
    setError(null)
    startTransition(async () => {
      try {
        // PayU requires customer data (phone, name, email) for payment hash.
        // Pass these from the cart's shipping/billing address.
        const extraData = isPayU(provider_id) ? {
          email: cart.email,
          firstname: cart.shipping_address?.first_name || cart.billing_address?.first_name,
          phone: cart.shipping_address?.phone || cart.billing_address?.phone,
          shipping_address_phone: cart.shipping_address?.phone, country_code: cart.shipping_address?.country_code || cart.billing_address?.country_code,
          cart_id: cart.id,
        } : undefined
        await initCheckPayment(cart_id, provider_id, collection_id, extraData)
      } catch (err: any) {
        setError(err.message)
      }
    })
  }

  return (
    <div className="pb-4 sm:pb-5 border-b border-border">
      <CheckStepHeader
        Icon={CreditCard}
        title="Payment"
        subtitle="Choose your preferred payment option"
        name="payment"
        showEdit={false}
      />

      <AnimatePresence mode="wait">
        {currentStep === "payment" && (
          <Div
            key="payment-content"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="grid gap-2 sm:gap-3 mt-4 sm:mt-6">
              <ErrorMessage error={error} />
              {paymentMethods.map((paymentMethod) => {
                const isSelected = selectedPaymentMethod === paymentMethod.id
                const Info = checkPaymentInfoMap[paymentMethod.id]
                const isDisabled = isLoading
                const isMethodLoading = isTransitioning && !isSelected

                return (
                  <Div
                    key={paymentMethod.id}
                    whileTap={!isDisabled ? { scale: 0.99 } : undefined}
                    onClick={() =>
                      !isDisabled &&
                      setPaymentMethod(
                        cart.id,
                        paymentMethod.id,
                        cart.payment_collection?.id,
                      )
                    }
                    className={`relative flex flex-col border rounded-lg overflow-hidden transition-all duration-200 ${isSelected ? "border-accent ring-1 ring-accent shadow-sm" : "border-border hover:border-accent/50"} ${isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                  >
                    {/* Header row */}
                    <div className="flex items-center gap-2.5 sm:gap-3 p-3 sm:p-4">
                      <div className="text-accent shrink-0">
                        {isMethodLoading ? (
                          <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin text-muted-foreground" />
                        ) : isSelected ? (
                          <Div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{
                              type: "spring",
                              stiffness: 500,
                              damping: 15,
                            }}
                          >
                            <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                          </Div>
                        ) : (
                          <Circle className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0 space-y-0.5">
                        <h3 className="font-semibold text-sm sm:text-base truncate">
                          {Info?.title ?? paymentMethod.id}
                        </h3>
                        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1">
                          {Info?.desc}
                        </p>
                      </div>
                      <div className="shrink-0">{Info?.Icon}</div>
                    </div>

                    {/* Expanded preview */}
                    <AnimatePresence mode="wait">
                      {isSelected && Info?.Preview && (
                        <Info.Preview key="preview" cart={cart} />
                      )}
                    </AnimatePresence>
                  </Div>
                )
              })}

              <CheckPaymentButton cart={cart} />
            </div>
          </Div>
        )}
      </AnimatePresence>
    </div>
  )
}

type PaymentStepProps = {
  cart: StoreCart
  paymentMethods: StorePaymentProvider[]
}
