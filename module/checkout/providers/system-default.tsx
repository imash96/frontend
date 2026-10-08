import { Clock } from "lucide-react";
import ProviderContainer from "../componenets/provider-container";
import { CheckoutButton } from "../componenets/payment-button";
import ErrorMessage from "@/module/common/templates/error-message";
import { useCallback } from "react";
import { ERROR_MESSAGES } from "@/data/payment";
import { useCheckoutStore } from "@/lib/store/checkout-store";
import { placeCheckOrder } from "@/lib/action/checkout";

export default function SystemDefault() {
    return (
        <ProviderContainer>
            <div className="flex flex-col items-center text-center space-y-3 sm:space-y-4">
                <Clock className="w-10 h-10 sm:w-12 sm:h-12 text-accent" />
                <h3 className="text-base sm:text-lg font-semibold">Pay Later</h3>
                <p className="text-xs sm:text-sm text-muted-foreground max-w-sm">
                    Place your order now and complete your payment later using your
                    preferred method. We&apos;ll send you payment instructions after your
                    order is confirmed.
                </p>
            </div>
        </ProviderContainer>
    )
}

export const PayLaterButton = ({ notReady }: { notReady: boolean }) => {
    const { isPending, error, handleError, setError, setIsPending, } = useCheckoutStore();
    const handle = useCallback(async () => {
        if (isPending) return
        if (notReady) {
            handleError(ERROR_MESSAGES.USER_NOT_READY)
            return
        }
        setIsPending(true)
        setError(null)
        setIsPending(true)
        try {
            await placeCheckOrder()
        } catch (err: any) {
            handleError(err?.message || ERROR_MESSAGES.DEFAULT_ERROR)
        } finally {
            setIsPending(false)
        }
    }, [isPending, notReady, setError, handleError, setIsPending,])

    return (
        <div className="space-y-3">
            <CheckoutButton
                onClick={handle}
                icon={<Clock className="w-5 h-5" />}
                isLoading={isPending}
                disabled={notReady || isPending}
            >
                {isPending ? "Processing order..." : "Place Order"}
            </CheckoutButton>
            <ErrorMessage error={error} />
        </div>
    )
}