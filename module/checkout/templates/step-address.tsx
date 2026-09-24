"use client"

import type { StoreCart, StoreCustomer } from "@medusajs/types"
import { BookUser } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import { useCheckStore } from "@/lib/store/checkout-store"
import CheckAddressCard from "../components/check-address-card"
import CheckAddressForm from "../components/check-address-form"
import CheckStepHeader from "../components/check-step-header"

export default function StepAddress({ cart, customer }: StepAddressProps) {
  const currentStep = useCheckStore((s) => s.currentStep)
  const isOpen = currentStep === "address"

  return (
    <div className="pb-4 sm:pb-5 border-b border-border">
      <CheckStepHeader
        Icon={BookUser}
        title="Addresses"
        subtitle="Shipping and billing addresses"
        showEdit={!isOpen}
        name="address"
      />

      <AnimatePresence mode="wait">
        {isOpen ? (
          <motion.div
            key="address-form"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <CheckAddressForm cart={cart} />
          </motion.div>
        ) : (
          <motion.div
            key="address-cards"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <CheckAddressCard
                title="Shipping Address"
                address={cart.shipping_address}
                email={cart.email}
                type="Shipping"
              />
              <CheckAddressCard
                title="Billing Address"
                address={cart.billing_address}
                type="Billing"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

type StepAddressProps = {
  cart: StoreCart
  customer: StoreCustomer | null
}
