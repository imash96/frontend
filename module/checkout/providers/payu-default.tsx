"use client"

import type { StoreCart } from "@medusajs/types"
import { ExternalLink, Shield } from "lucide-react"
import { useMemo, useRef } from "react"
import { useShallow } from "zustand/react/shallow"
import { selectCanPay, useCheckoutStore } from "@/lib/store/checkout-store"
import { CheckoutButton } from "../components/checkout-button"
import ProviderPanel, { ProviderInfo } from "../components/provider-panel"
import { findActiveSession } from "@/lib/store/checkout-steps"

export default function PayuDefault() {
    return (
        <ProviderPanel>
            <ProviderInfo
                title="PayU Secure Checkout"
                icon={
                    <span className="flex size-12 items-center justify-center rounded-full bg-success/10 text-success">
                        <Shield className="size-6" aria-hidden="true" />
                    </span>
                }
            >
                <p>
                    You&apos;ll be redirected to PayU&apos;s secure page to pay with UPI, Net Banking, Cards or Wallets, then
                    brought back to confirm your order.
                </p>
            </ProviderInfo>
        </ProviderPanel>
    )
}

type PayUForm = { url: string; fields: [string, string][] }

/**
 * medusa-payu-payment-plugin returns the signed form in the payment session:
 * `data.paymentUrl` + `data.form_data`. The storefront must POST it to PayU; the order is then
 * completed by the plugin's webhook, so cart.complete must NOT be called here (the payment
 * isn't authorized until PayU confirms it).
 */
function readPayUForm(data: unknown): PayUForm | null {
    if (!data || typeof data !== "object") return null
    const { paymentUrl, form_data } = data as { paymentUrl?: unknown; form_data?: unknown }
    if (typeof paymentUrl !== "string" || !form_data || typeof form_data !== "object") return null

    try {
        if (new URL(paymentUrl).protocol !== "https:") return null
    } catch {
        return null
    }

    return {
        url: paymentUrl,
        fields: Object.entries(form_data as Record<string, unknown>).map(([k, v]) => [k, String(v ?? "")]),
    }
}

export function PayUPaymentButton({ cart }: { cart: StoreCart }) {
    const formRef = useRef<HTMLFormElement>(null)
    const { canPay, isSubmitting, beginSubmit, handleError } = useCheckoutStore(
        useShallow((s) => ({
            canPay: selectCanPay(s),
            isSubmitting: s.isSubmitting,
            beginSubmit: s.beginSubmit,
            handleError: s.handleError,
        })),
    )

    const session = findActiveSession(cart)
    const form = useMemo(() => readPayUForm(session?.data), [session?.data])

    const redirect = () => {
        if (!beginSubmit()) return
        if (!form || !formRef.current) {
            return handleError("Your PayU session has expired. Please select PayU again.")
        }
        formRef.current.submit() // leaves the page; the pageshow handler unlocks the button on Back
    }

    return (
        <>
            {form && (
                <form ref={formRef} method="POST" action={form.url} hidden>
                    {form.fields.map(([name, value]) => (
                        <input key={name} type="hidden" name={name} value={value} />
                    ))}
                </form>
            )}
            {!form && (
                <p role="status" className="text-center text-xs text-foreground-tertiary sm:text-sm">
                    Select PayU again to refresh your payment session.
                </p>
            )}
            <CheckoutButton
                onClick={redirect}
                icon={<ExternalLink />}
                isLoading={isSubmitting}
                disabled={!canPay || !form}
            >
                {isSubmitting ? "Redirecting to PayU..." : "Pay with PayU"}
            </CheckoutButton>
        </>
    )
}