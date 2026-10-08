"use client"

import { useCheckoutPending, useCheckoutSetStep, useCheckoutStep } from "@/lib/store/checkout-store"
import { StoreCart, StorePaymentProvider } from "@medusajs/types"
import { CheckCircle, Circle, CreditCard, Loader2 } from "lucide-react"
import CheckoutStepHeader from "../componenets/step-header"
import { div as Div } from "motion/react-client"
import { useState, useTransition } from "react"
import { checkPaymentInfoMap } from "../componenets/payment-map"
import { AnimatePresence } from "motion/react"
import { initiatePaymentSession } from "@/lib/action/cart"
import { isPayU } from "@/lib/constant"
import PaymentButton from "../componenets/payment-button"

export default function StepPayment({ cart, paymentMethods }: StepAddressProps) {
    const currentStep = useCheckoutStep()
    const setStep = useCheckoutSetStep()
    const isPending = useCheckoutPending()
    const [isTransitioning, startTransition] = useTransition()
    const [error, setError] = useState<string | null>(null)

    const isOpen = currentStep === "payment"
    const isLoading = isTransitioning || isPending

    const activeSession = cart.payment_collection?.payment_sessions?.find(
        (s) => s.status === "pending",
    )

    const setPaymentMethod = async (method: string) => {
        const extraData = isPayU(method) ? { phone: cart.shipping_address?.phone || cart.billing_address?.phone, } : {}
        setError(null)
        startTransition(async () => {
            try {
                await initiatePaymentSession(cart.id, {
                    provider_id: method,
                    data: {
                        payment_description: "Leather Goods",
                        ...extraData,
                    },
                })
            } catch (err: any) {
                setError(err.message)
            }
        })
    }

    const selectedPaymentMethod = activeSession?.provider_id
    return (
        <CheckoutStepHeader title="Payment Information" subtitle="Secure payment processing" Icon={CreditCard} currentStep={currentStep}>
            <Div
                key="payment-content"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
            >
                <div className="grid gap-2 sm:gap-3 mt-4 sm:mt-6">
                    {paymentMethods.map((paymentMethod) => {
                        const isSelected = selectedPaymentMethod === paymentMethod.id
                        const Info = checkPaymentInfoMap[paymentMethod.id]
                        const isMethodLoading = isTransitioning && !isSelected

                        return (
                            <Div
                                key={paymentMethod.id}
                                whileTap={!isLoading ? { scale: 0.99 } : undefined}
                                onClick={() =>
                                    !isLoading &&
                                    setPaymentMethod(paymentMethod.id)
                                }
                                className={`relative flex flex-col border rounded-lg overflow-hidden transition-all duration-200 ${isSelected ? "border-accent ring-1 ring-accent shadow-sm" : "border-border hover:border-accent/50"} ${isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
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
                    <PaymentButton cart={cart} />
                </div>
            </Div>
        </CheckoutStepHeader>
    )
}

type StepAddressProps = {
    cart: StoreCart
    paymentMethods: StorePaymentProvider[]
}
