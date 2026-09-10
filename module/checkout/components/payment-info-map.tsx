// import StripeContainer from "@/module/checkout/components/container-stripe";
import { Clock } from "lucide-react";
import ManualContainer from "@/module/checkout/components/container-manual";
import PayPalContainer from "@/module/checkout/components/container-paypal";
import PayPal from "@/icon/checkout-paypal";

export const paymentInfoMap = {
  // pp_stripe_stripe: {
  //     title: "Credit Card",
  //     desc: "Pay securely with your credit or debit card.",
  //     Icon: <CreditCard className="w-7 h-7 text-foreground" />,
  //     Preview: <StripeContainer className="w-7 h-7 text-foreground" />,
  // },
  pp_paypal_paypal: {
    title: "PayPal",
    desc: "Complete your purchase quickly and securely with PayPal.",
    Icon: <PayPal className="w-7 h-7 text-foreground" />,
    Preview: <PayPalContainer />,
  },
  pp_system_default: {
    title: "Pay Later",
    desc: "Place your order now and pay later using your preferred method.",
    Icon: <Clock className="w-7 h-7 text-foreground" />,
    Preview: <ManualContainer />,
  },
} as Record<string, PIM>;

type PIM = {
  title: string;
  desc: string;
  Icon: React.JSX.Element;
  Preview: React.JSX.Element;
};
