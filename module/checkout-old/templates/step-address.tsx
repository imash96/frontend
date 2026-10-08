"use client"

import type { StoreCart, StoreCustomer } from "@medusajs/types"
import { BookUser } from "lucide-react"
import { AnimatePresence } from "motion/react"
import { div as Div } from "motion/react-client";
import { useCheckoutStore } from "@/lib/store/checkout-store"
import CheckAddressCard from "../components/check-address-card"
import CheckAddressForm from "../components/check-address-form"
import CheckStepHeader from "../components/check-step-header"

export default function StepAddress({ cart, customer }: StepAddressProps) {
  const currentStep = useCheckoutStore((s) => s.currentStep)
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
          <Div
            key="address-form"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <CheckAddressForm cart={cart} />
          </Div>
        ) : (
          <Div
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
          </Div>
        )}
      </AnimatePresence>
    </div>
  )
}

type StepAddressProps = {
  cart: StoreCart
  customer: StoreCustomer | null
}
