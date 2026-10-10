"use client"

import { useShallow } from "zustand/react/shallow"
import { selectCanPay, useCheckoutStore } from "@/lib/store/checkout-store"
import { CheckoutButton } from "./checkout-button"

type Props = {
    label: string
    processingLabel?: string
    icon?: React.ReactNode
}

/** Completes the cart for providers that need no client SDK (Pay Later). */
export default function PlaceOrderButton({ label, processingLabel = "Processing order...", icon }: Props) {
    const { canPay, isSubmitting, placeOrder } = useCheckoutStore(
        useShallow((s) => ({
            canPay: selectCanPay(s),
            isSubmitting: s.isSubmitting,
            placeOrder: s.placeOrder,
        })),
    )

    return (
        <CheckoutButton onClick={placeOrder} icon={icon} isLoading={isSubmitting} disabled={!canPay}>
            {isSubmitting ? processingLabel : label}
        </CheckoutButton>
    )
}