import BrowserWireframe from "@/icon/browser-wireframe";
import ProviderContainer from "../componenets/provider-container";
import { useCheckoutStore } from "@/lib/store/checkout-store";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { StoreCart } from "@medusajs/types";
import { Loader } from "lucide-react";
import { createOrder, onApprove } from "./common";
import ErrorMessage from "@/module/common/templates/error-message";


export default function PayPalDefault({ cart }: { cart: StoreCart }) {
    return (
        <ProviderContainer>
            <BrowserWireframe className="w-40 sm:w-48 lg:w-64" />
            <p className="text-xs sm:text-sm text-muted-foreground max-w-sm">
                After clicking &quot;Pay with PayPal&quot;, you will be redirected to
                PayPal to complete your purchase securely.
            </p>
        </ProviderContainer>
    )
}

export const PayPalPaymentButton = ({ cart, notReady, }: { cart: StoreCart; notReady: boolean }) => {
    const { isPending, error, handleError } = useCheckoutStore();
    const [{ isPending: payPalPending, isResolved }] = usePayPalScriptReducer()
    const disabled = notReady || isPending

    if (payPalPending) {
        return (
            <div className="flex items-center justify-center py-6">
                <Loader className="animate-spin w-6 h-6" />
                <span className="ml-2 text-xs sm:text-sm text-muted-foreground">
                    Loading PayPal…
                </span>
            </div>
        )
    }

    if (!isResolved) {
        return (
            <div className="text-xs sm:text-sm text-muted-foreground py-4 text-center">
                PayPal not available
            </div>
        )
    }

    return (
        <div className="space-y-3">
            <PayPalButtons
                style={{
                    shape: "rect",
                    layout: "horizontal",
                    color: "silver",
                    label: "paypal",
                }}
                createOrder={() => createOrder(cart.id)}
                onApprove={(data) => onApprove(cart.id, data)}
                onError={(err) => {
                    handleError(`PayPal payment failed. Please try again. ${err}`)
                }}
                disabled={disabled}
                className="mt-4 sm:mt-6"
            />
            <ErrorMessage error={error} />
        </div>
    )
}