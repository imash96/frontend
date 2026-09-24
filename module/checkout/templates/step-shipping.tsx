"use client"

import type { StoreCart, StoreCartShippingOption } from "@medusajs/types"
import { Truck } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import { useCheckStore } from "@/lib/store/checkout-store"
import CheckShippingList from "../components/check-shipping-list"
import CheckShippingShow from "../components/check-shipping-show"
import CheckStepHeader from "../components/check-step-header"

export default function StepShipping({ cart, availableMethods }: ShippingProps) {
  const currentStep = useCheckStore((s) => s.currentStep)
  const isOpen = currentStep === "shipping"

  return (
    <div className="pb-4 sm:pb-5 border-b border-border">
      <CheckStepHeader
        Icon={Truck}
        title="Shipping Method"
        subtitle="Choose your preferred delivery option"
        showEdit={!isOpen && currentStep !== "address"}
        name="shipping"
      />

      <AnimatePresence mode="wait">
        {isOpen ? (
          <motion.div
            key="shipping-list"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <CheckShippingList
              availableMethods={availableMethods}
              cartId={cart.id}
              currencyCode={cart.currency_code}
              selectedMethodId={cart.shipping_methods?.at(0)?.shipping_option_id}
            />
          </motion.div>
        ) : (
          currentStep !== "address" && (
            <motion.div
              key="shipping-show"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <CheckShippingShow
                methods={cart.shipping_methods}
                currencyCode={cart.currency_code}
              />
            </motion.div>
          )
        )}
      </AnimatePresence>
    </div>
  )
}

type ShippingProps = {
  cart: StoreCart
  availableMethods: StoreCartShippingOption[]
}
