"use client"

import { useCheckoutStep } from "@/lib/store/checkout-store"
import { StoreCart, StoreCartShippingOption } from "@medusajs/types"
import { Truck } from "lucide-react"
import CheckoutStepHeader from "../componenets/step-header"
import { div as Div } from "motion/react-client";
import DeliveryCard from "../componenets/delivery-card"

export default function StepShipping({ cart, shippingMethods }: StepAddressProps) {
    const currentStep = useCheckoutStep()

    if (!shippingMethods) {
        return (
            <div className="lg:col-span-10 py-8 sm:py-12 text-center space-y-2 px-4">
                <h1 className="text-base sm:text-lg font-semibold text-foreground">
                    We couldn&apos;t load checkout
                </h1>
                <p className="text-xs sm:text-sm text-foreground-muted max-w-md mx-auto">
                    Something went wrong loading shipping options. Please refresh the page or try again shortly.
                </p>
            </div>
        )
    }

    return (
        <CheckoutStepHeader title="Delivery Method" subtitle="Choose your preferred shipping speed" Icon={Truck} currentStep={currentStep}>
            <Div
                key="shipping-list"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
            >
                <DeliveryCard
                    availableMethods={shippingMethods}
                    cartId={cart.id}
                    currencyCode={cart.currency_code}
                    selectedMethodId={cart.shipping_methods?.at(0)?.shipping_option_id}
                />
            </Div>
        </CheckoutStepHeader>
    )
}

type StepAddressProps = {
    cart: StoreCart
    shippingMethods: StoreCartShippingOption[]
}
