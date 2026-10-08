import Button, { type ButtonElementProps } from "@/ui/button"
import { StoreCart } from "@medusajs/types"
import { AlertCircle, Lock } from "lucide-react"
import { PayPalPaymentButton } from "../providers/paypal-default"
import { PayLaterButton } from "../providers/system-default"


export default function PaymentButton({ cart }: { cart: StoreCart }) {
    const notReady = !cart || !cart.shipping_address || !cart.billing_address || !cart.email || (cart.shipping_methods?.length ?? 0) < 1

    const session = cart.payment_collection?.payment_sessions?.find(
        (s) => s.status === "pending",
    )
    const provider = session?.provider_id

    if (!session) {
        return (
            <CheckoutButton
                disabled
                aria-busy={false}
                icon={<AlertCircle className="w-4 h-4 mr-2 shrink-0" />}
            >

                <span>Select a payment method</span>
            </CheckoutButton>
        )
    }
    console.log(provider)
    switch (provider) {
        case "pp_paypal_paypal":
            return <PayPalPaymentButton cart={cart} notReady={notReady} />
        case "pp_system_default":
            return <PayLaterButton notReady={notReady} />
        default:
            break;
    }

    return (
        <>Payment</>
    )
}



export const CheckoutButton = ({ isLoading = false, disabled = false, onClick, children, ...props }: ButtonElementProps) => {
    return (
        <>
            <Button
                variant="accent"
                isLoading={isLoading}
                disabled={disabled}
                onClick={onClick}
                className="w-full mt-4 h-11 sm:h-12 text-sm sm:text-base font-semibold tracking-wide"
                {...props}
            >
                {children ? children : isLoading ? "Processing..." : "Pay"}
            </Button>
            <div className="flex items-center justify-center gap-1.5 mt-2">
                <Lock className="w-3 h-3 text-muted-foreground" />
                <p className="text-[10px] sm:text-xs text-center text-muted-foreground">
                    Transactions are secured and encrypted
                </p>
            </div>
        </>
    )
}