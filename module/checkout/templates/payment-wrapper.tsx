"use client";

import type { StoreCart } from "@medusajs/types";
// import { loadStripe } from "@stripe/stripe-js"
// import StripeProvider from "@lib/context/stripe-context"
import {
  PayPalScriptProvider,
  type ReactPayPalScriptOptions,
} from "@paypal/react-paypal-js";
import { isPaypal } from "@/lib/constant";

// const stripeKey = process.env.NEXT_PUBLIC_STRIPE_KEY
// const stripePromise = stripeKey ? loadStripe(stripeKey) : null

export default function PaymentWrapper({
  cart,
  children,
}: PaymentWrapperProps) {
  const paymentSession = cart.payment_collection?.payment_sessions?.find(
    (s) => s.status === "pending",
  );

  // --- Stripe ---
  // if (paymentSession && stripePromise && isStripe(paymentSession.provider_id)) {
  //     return (
  //         <StripeProvider
  //             paymentSession={paymentSession}
  //             stripeKey={stripeKey}
  //             stripePromise={stripePromise}
  //             currency={cart.currency_code}
  //             buyerCountry={cart.shipping_address?.country_code}
  //         >
  //             {children}
  //         </StripeProvider>
  //     )
  // }

  // --- PayPal ---
  const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID as string;

  const options: ReactPayPalScriptOptions = {
    clientId: paypalClientId,
    currency: cart.currency_code.toUpperCase(),
    intent: "capture",
    dataPageType: "checkout",
    components: "buttons",
  };

  if (isPaypal(paymentSession?.provider_id) && paypalClientId) {
    return (
      <PayPalScriptProvider options={options}>{children}</PayPalScriptProvider>
    );
  }

  return <>{children}</>;
}

type PaymentWrapperProps = {
  cart: StoreCart;
} & React.PropsWithChildren;
