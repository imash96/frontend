"use client";

import type { StoreCart, StorePaymentProvider } from "@medusajs/types";
import { CheckCircle, Circle, CreditCard, Loader2 } from "lucide-react";
import { AnimatePresence } from "motion/react";
import { useLayoutEffect } from "react";
import { initiatePaymentSession } from "@/lib/action/cart";
import { useCheckout } from "@/lib/store/checkout-context";
import PaymentButton from "../components/payment-button";
import { paymentInfoMap } from "../components/payment-info-map";
import StepHeader from "../components/step-header";

export default function PaymentStep({
  cart,
  paymentMethods,
}: PaymentStepProps) {
  const {
    currentStep,
    setCurrentStep,
    isPending,
    startPending,
    manualPending,
  } = useCheckout();
  const isOpen = currentStep === "payment";
  const activeSession = cart.payment_collection?.payment_sessions?.find(
    (paymentSession) => paymentSession.status === "pending",
  );
  const selectedPaymentMethod = activeSession?.provider_id;

  useLayoutEffect(() => {
    if (isOpen && !cart.shipping_methods?.length) {
      setCurrentStep("delivery");
    }
  }, [isOpen, cart.shipping_methods?.length, setCurrentStep]);

  function setPaymentMethod(
    cart_id: string,
    provider_id: string,
    collection_id?: string,
  ) {
    if (provider_id == selectedPaymentMethod) return;
    startPending(async () => {
      await initiatePaymentSession(
        cart_id,
        { provider_id, data: { payment_description: "Leather Goods" } },
        collection_id,
      );
    });
  }

  return (
    <div className="pb-4 border-b">
      <StepHeader
        Icon={CreditCard}
        title="Payment"
        subtitle="Choose your preferred payment option"
        name="payment"
        showEdit={false}
      />
      {isOpen && (
        <div className="grid mt-6">
          {paymentMethods.map((paymentMethod) => {
            const isSelected = selectedPaymentMethod === paymentMethod.id;
            const Info = paymentInfoMap[paymentMethod.id];
            const isDisabled = isPending || manualPending;
            return (
              <div
                key={paymentMethod.id}
                onClick={() =>
                  !isDisabled &&
                  setPaymentMethod(
                    cart.id,
                    paymentMethod.id,
                    cart.payment_collection?.id,
                  )
                }
                className={`relative flex flex-col border transition ${isSelected ? "border-accent ring-1 ring-accent" : "border-border"} ${isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
              >
                {/* Header row */}
                <div className="flex items-center gap-3 p-4">
                  <div className="text-accent">
                    {isPending && !isSelected ? (
                      <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                    ) : isSelected ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      <Circle className="w-6 h-6 text-muted-foreground" />
                    )}
                  </div>

                  <div className="flex-1 space-y-1">
                    <h3 className="font-semibold">
                      {Info?.title ?? paymentMethod.id}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {Info?.desc}
                    </p>
                  </div>
                  {Info?.Icon}
                </div>

                {/* Extra info / Preview */}
                <AnimatePresence mode="wait">
                  {isSelected && Info?.Preview}
                </AnimatePresence>
              </div>
            );
          })}
          <PaymentButton cart={cart} />
        </div>
      )}
    </div>
  );
}

type PaymentStepProps = {
  cart: StoreCart;
  paymentMethods: StorePaymentProvider[];
};