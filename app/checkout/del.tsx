"use client"

import { markPaymentComplete } from "@/lib/action/checkout";
import Button from "@/ui/button";
import { StoreCart } from "@medusajs/types";

export default function CheckPageButton({ cart }: { cart: StoreCart }) {
    return (
        <Button
            onClick={() => markPaymentComplete(cart.id)}
            variant="secondary"
            className="w-full mt-4"
        >
            Mark Payment Complete
        </Button>
    )
}