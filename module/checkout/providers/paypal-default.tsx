"use client"

import type { StoreCart } from "@medusajs/types"
import { OnApproveDataOneTimePayments, PayPalOneTimePaymentButton } from "@paypal/react-paypal-js/sdk-v6"
import BrowserWireframe from "@/icon/browser-wireframe"
import { useCheckoutStore } from "@/lib/store/checkout-store"
import ProviderPanel, { ProviderInfo, ProviderLoading } from "../components/provider-panel"
import { usePayPalFlow } from "./paypal-flow"
import { usePayPalSdk } from "./paypal-sdk"
import ProviderErrorBoundary from "./error-boundary"

export default function PayPalDefault(_props: { cart: StoreCart }) {
    return (
        <ProviderPanel>
            <ProviderInfo icon={<BrowserWireframe className="w-40 sm:w-48" />}>
                Use the PayPal button below. You&apos;ll confirm your payment in a secure PayPal window.
            </ProviderInfo>
        </ProviderPanel>
    )
}

const UNAVAILABLE = (
    <p role="alert" className="text-center text-xs text-foreground-tertiary sm:text-sm">
        PayPal couldn&apos;t be loaded. Please refresh the page or choose another payment method.
    </p>
)

export function PayPalPaymentButton({ cart }: { cart: StoreCart }) {
    // Not isSubmitting: the buttons must stay enabled while PayPal's own window is open.
    const blocked = useCheckoutStore((s) => s.notReady || s.isPending)
    const beginSubmit = useCheckoutStore((s) => s.beginSubmit)
    const sdk = usePayPalSdk()
    const { createPaypalOrder, onApprove, onError, onCancel } = usePayPalFlow(cart.id)

    if (sdk.isLoading) return <ProviderLoading>Loading PayPal…</ProviderLoading>
    if (sdk.isRejected) return UNAVAILABLE

    return (
        <ProviderErrorBoundary fallback={UNAVAILABLE}>
            <PayPalOneTimePaymentButton
                createOrder={() => createPaypalOrder(false)}
                onApprove={async (data: OnApproveDataOneTimePayments) => {
                    onApprove({ orderID: data.orderId });
                }}
                presentationMode="auto"
                disabled={blocked}
                // Claim the payment before the PayPal window opens; a second click is rejected right here.
                onCancel={onCancel}
                onError={onError}
            />
        </ProviderErrorBoundary>
    )
}