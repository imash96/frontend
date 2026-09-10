"use client";

import type { StoreCart } from "@medusajs/types";
import type { OnApproveActions, OnApproveData } from "@paypal/paypal-js";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
// import { useElements, useStripe } from "@stripe/react-stripe-js"
import { AlertCircle, Clock, Loader } from "lucide-react";
import { useCallback, useState } from "react";
import { ERROR_MESSAGES } from "@/data/payment";
import { placeOrder } from "@/lib/action/cart";
import { isManual, isPaypal } from "@/lib/constant";
import Button from "@/ui/button";
import ErrorMessage from "@/module/common/templates/error-message";
import { useCheckout } from "@/lib/store/checkout-context";

export default function PaymentButton({ cart }: { cart: StoreCart }) {
  const notReady =
    !cart ||
    !cart.shipping_address ||
    !cart.billing_address ||
    !cart.email ||
    (cart.shipping_methods?.length ?? 0) < 1;
  const session = cart.payment_collection?.payment_sessions?.find(
    (s) => s.status === "pending",
  );
  const provider = session?.provider_id;

  if (!session) {
    return (
      <FinalPaymentButton disabled aria-busy={false}>
        <AlertCircle className="w-4 h-4 mr-2" />
        Select a payment method
      </FinalPaymentButton>
    );
  }

  // if (isStripe(provider)) return <StripePayment cart={cart} notReady={notReady} />
  if (isPaypal(provider))
    return <PayPalPayment cart={cart} notReady={notReady} />;
  if (isManual(provider)) return <ManualPayment notReady={notReady} />;

  return (
    <FinalPaymentButton disabled>
      <AlertCircle className="w-4 h-4 mr-2" />
      Unsupported payment provider
    </FinalPaymentButton>
  );
}

/* ---------------- Stripe Payment Component ---------------- */
// function StripePayment({ cart, notReady, }: PaymentComponentProps) {
//     const { submitting, setSubmitting, error, setError, handleError, handleSuccess } = useCommonHandlers()
//     const stripe = useStripe()
//     const elements = useElements()

//     const session = cart.payment_collection?.payment_sessions?.find((s) => s.status === "pending")
//     const clientSecret = session?.data?.client_secret as string

//     const disabled = !stripe || !elements || notReady
//     const finalize = useCallback(async (resultOk: boolean, message?: string) => {
//         if (!resultOk) {
//             handleError(message ?? ERROR_MESSAGES.DEFAULT_ERROR)
//             return
//         }
//         await handleSuccess()
//     }, [handleError, handleSuccess])

//     const handleStripe = useCallback(async () => {
//         if (submitting) return
//         if (disabled) {
//             handleError(ERROR_MESSAGES.USER_NOT_READY)
//             return
//         }
//         setSubmitting(true)
//         setError(null)

//         try {
//             const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
//                 elements,
//                 clientSecret,
//                 confirmParams: {
//                     payment_method_data: {
//                         billing_details: {
//                             name: `${cart.billing_address?.first_name ?? ""} ${cart.billing_address?.last_name ?? ""}`.trim(),
//                             email: cart.email,
//                             phone: cart.billing_address?.phone ?? undefined,
//                             address: {
//                                 line1: cart.billing_address?.address_1 ?? undefined,
//                                 line2: cart.billing_address?.address_2 ?? undefined,
//                                 city: cart.billing_address?.city ?? undefined,
//                                 state: cart.billing_address?.province ?? undefined,
//                                 postal_code: cart.billing_address?.postal_code ?? undefined,
//                                 country: cart.billing_address?.country_code ?? undefined,
//                             },
//                         },
//                     },
//                     shipping: {
//                         name: `${cart.shipping_address?.first_name ?? ""} ${cart.shipping_address?.last_name ?? ""}`.trim(),
//                         phone: cart.billing_address?.phone ?? undefined,
//                         address: {
//                             line1: cart.shipping_address?.address_1 ?? "",
//                             line2: cart.shipping_address?.address_2 ?? undefined,
//                             city: cart.shipping_address?.city ?? undefined,
//                             state: cart.shipping_address?.province ?? undefined,
//                             postal_code: cart.shipping_address?.postal_code ?? undefined,
//                             country: cart.shipping_address?.country_code ?? undefined,
//                         },
//                     },

//                 },
//                 redirect: "if_required",
//             })

//             if (stripeError) {
//                 const pi = stripeError.payment_intent
//                 if ((pi && pi.status === "requires_capture") || (pi && pi.status === "succeeded")) {
//                     finalize(true, stripeError.message)
//                 }
//                 finalize(false, stripeError.message)
//                 return
//             }

//             // If no error, check result status
//             const success = !!(paymentIntent && ["requires_capture", "succeeded"].includes(paymentIntent.status))
//             await finalize(success, success ? undefined : ERROR_MESSAGES.DEFAULT_ERROR)
//             return
//         } catch (err: any) {
//             handleError(err?.message || ERROR_MESSAGES.DEFAULT_ERROR)
//         }
//     }, [submitting, disabled, stripe, elements, clientSecret, cart, finalize, setSubmitting, setError, handleError,])

//     return (
//         <div className="space-y-3">
//             <FinalPaymentButton
//                 disabled={disabled || submitting}
//                 isLoading={submitting}
//                 onClick={handleStripe}
//             >
//                 {submitting ? "Processing Payment..." : "Pay with Card"}
//             </FinalPaymentButton>
//             <ErrorMessage error={error} />
//         </div>
//     )
// }

/* ---------------- PayPal ---------------- */
function PayPalPayment({
  cart,
  notReady,
}: {
  cart: StoreCart;
  notReady: boolean;
}) {
  const {
    submitting,
    setSubmitting,
    error,
    setError,
    handleError,
    handleSuccess,
  } = useCommonHandlers();
  const session = cart.payment_collection?.payment_sessions?.find(
    (s) => s.status === "pending",
  );
  const [{ isPending, isResolved }] = usePayPalScriptReducer();

  const disabled = notReady || submitting;

  const onApprove = useCallback(
    async (_data: OnApproveData, actions: OnApproveActions) => {
      if (submitting) return;
      setSubmitting(true);
      setError(null);

      try {
        // After buyer approval, capture the order on client
        // (use capture for intent=capture). actions.order.capture() returns capture details.
        const capture = await actions.order!.capture();
        if (
          !capture ||
          !capture.status ||
          (capture.status !== "COMPLETED" && capture.status !== "APPROVED")
        ) {
          handleError("PayPal capture failed");
          return;
        }
        await handleSuccess();
      } catch (err: any) {
        handleError(err?.message || "PayPal failed");
      }
    },
    [submitting, setSubmitting, setError, handleError, handleSuccess],
  );

  if (isPending) {
    return (
      <div className="flex items-center justify-center py-6">
        <Loader className="animate-spin w-6 h-6" />
        <span className="ml-2 text-sm text-muted-foreground">
          Loading PayPal…
        </span>
      </div>
    );
  }

  if (!isResolved) {
    return (
      <div className="text-sm text-muted-foreground py-4 text-center">
        PayPal not available
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <PayPalButtons
        style={{
          layout: "horizontal",
          shape: "rect",
          color: "blue",
          height: 44,
        }}
        createOrder={async () => session?.data.id as string}
        onApprove={onApprove}
        onError={(err) => {
          handleError(`"PayPal payment failed. Please try again." ${err}`);
        }}
        disabled={disabled}
        className="mt-6"
      />

      <ErrorMessage error={error} />
    </div>
  );
}

/* ---------------- Manual Payment (testing) ---------------- */
function ManualPayment({ notReady }: { notReady: boolean }) {
  const { setIsPending, isPending } = useCheckout();
  const {
    submitting,
    setSubmitting,
    error,
    setError,
    handleError,
    handleSuccess,
  } = useCommonHandlers();

  const handle = useCallback(async () => {
    if (submitting) return;
    if (notReady) {
      handleError(ERROR_MESSAGES.USER_NOT_READY);
      return;
    }
    setSubmitting(true);
    setError(null);
    setIsPending(true); // 🚀 disable PaymentStep too
    try {
      await placeOrder();
      await handleSuccess();
    } catch (err: any) {
      handleError(err?.message || ERROR_MESSAGES.DEFAULT_ERROR);
    } finally {
      setSubmitting(false);
      setIsPending(false); // ✅ re-enable after finish
    }
  }, [submitting, notReady, setSubmitting, setError, handleError, handleSuccess, setIsPending]);

  return (
    <div className="space-y-3">
      <FinalPaymentButton
        onClick={handle}
        Icon={<Clock className="w-5 h-5" />}
        isLoading={submitting}
        disabled={notReady || submitting || isPending}
      >
        {submitting ? "Processing order..." : "Place order"}
      </FinalPaymentButton>

      <ErrorMessage error={error} />
    </div>
  );
}

/* ---------------- Shared small helpers ---------------- */
function useCommonHandlers() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleError = useCallback((msg?: string) => {
    setError(msg ?? ERROR_MESSAGES.DEFAULT_ERROR);
    setSubmitting(false);
  }, []);

  const handleSuccess = useCallback(async () => {
    try {
      await placeOrder();
      setError(null);
    } catch (err: any) {
      setError(err?.message ?? ERROR_MESSAGES.DEFAULT_ERROR);
    } finally {
      setSubmitting(false);
    }
  }, []);

  return {
    submitting,
    setSubmitting,
    error,
    setError,
    handleError,
    handleSuccess,
  };
}

function FinalPaymentButton({
  isLoading = false,
  disabled = false,
  onClick,
  Icon,
  children,
}: FinalPaymentButtonProps) {
  return (
    <>
      <Button
        variant="primary"
        color="primary"
        isLoading={isLoading}
        disabled={disabled}
        icon={Icon}
        onClick={onClick}
        className="w-full mt-4 h-11 text-base font-semibold tracking-wide"
      >
        {children ? children : isLoading ? "Processing..." : `Pay`}
      </Button>
      <p className="text-xs text-center text-muted-foreground mt-2">
        Transactions are secured and encrypted
      </p>
    </>
  );
}

type FinalPaymentButtonProps = {
  isLoading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  Icon?: React.ReactNode;
} & React.PropsWithChildren;

type PaymentComponentProps = {
  cart: StoreCart;
  notReady: boolean;
  onSuccess?: () => void;
  onError?: (error: string) => void;
};
