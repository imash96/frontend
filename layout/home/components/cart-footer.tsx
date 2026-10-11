"use client"

import type { StoreCart } from "@medusajs/types"
import { ArrowRight } from "lucide-react";
import { div as Div } from "motion/react-client"
import { useDrawerStore } from "@/lib/store/drawer-store"
import { convertToLocale } from "@/lib/util/money"
import Button from "@/ui/button";

export default function CartFooter({ cart }: { cart: StoreCart }) {
    const close = useDrawerStore((s) => s.close);
    return (
        <Div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="w-full p-4 sm:p-6 border-t border-divider bg-surface"
        >
            <div className="flex w-full justify-between items-baseline mb-3">
                <h2 className="text-sm sm:text-base font-semibold uppercase tracking-wide text-foreground-secondary">
                    Subtotal
                </h2>
                <span className="text-xl sm:text-2xl font-semibold text-foreground font-heading">
                    {convertToLocale({
                        amount: cart.subtotal,
                        currency_code: cart.currency_code,
                    })}
                </span>
            </div>

            {/* Helper Text */}
            <p className="text-xs sm:text-sm text-foreground-tertiary leading-relaxed mb-4">
                Shipping, taxes, and discounts calculated at checkout.
            </p>

            {/* Checkout Button */}
            <Button
                variant="primary"
                onClick={close}
                href="/cart"
                size="lg"
                fullWidth
                className="mt-2 uppercase tracking-wide font-semibold flex items-center justify-center gap-2 group"
                icon={<ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" strokeWidth={2} aria-hidden="true" />}
                iconPosition="right"
            >
                <span>Go to Cart</span>
            </Button>

            {/* Security Badge (optional) */}
            <div className="mt-4 pt-4 border-t border-divider flex items-center justify-center gap-2 text-xs text-foreground-tertiary">
                <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    aria-hidden="true"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                </svg>
                <span>Secure checkout</span>
            </div>
        </Div>
    )
}