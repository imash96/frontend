"use client"

import { useCheckoutSetStep, useCheckoutStep } from "@/lib/store/checkout-store"
import { StoreCart, StoreCustomer } from "@medusajs/types"
import { BookUser } from "lucide-react"
import CheckoutStepHeader from "../componenets/step-header"
import { div as Div } from "motion/react-client";
import AddressCard from "../componenets/address-card"
import { AnimatePresence } from "motion/react"
import AddressForm from "../componenets/address-form"

export default function StepAddress({ cart, customer }: StepAddressProps) {
    const currentStep = useCheckoutStep()
    const setStep = useCheckoutSetStep()
    const isOpen = currentStep === "address"
    return (
        <CheckoutStepHeader title="Shipping Address" subtitle="Where should we deliver?" Icon={BookUser} currentStep={currentStep}>
            <AnimatePresence mode="wait">
                {isOpen ? (
                    <Div
                        key="address-form"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                        <AddressForm cart={cart} />
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
                            <AddressCard
                                title="Shipping Address"
                                address={cart.shipping_address}
                                email={cart.email}
                                type="Shipping"
                            />
                            <AddressCard
                                title="Billing Address"
                                address={cart.billing_address}
                                type="Billing"
                            />
                        </div>
                    </Div>
                )}
            </AnimatePresence>
        </CheckoutStepHeader>
    )
}

type StepAddressProps = {
    cart: StoreCart
    customer: StoreCustomer | null
}
