import { Clock, CreditCard } from "lucide-react"
import CheckStripeForm from "./check-stripe-form"
import CheckPayPalPreview from "./check-paypal-preview"
import CheckPayPalCard from "./check-paypal-card"
import CheckManualPreview from "./check-manual-preview"
import PayPal from "@/icon/checkout-paypal"
import type { ComponentType } from "react"
import type { StoreCart } from "@medusajs/types"

export const checkPaymentInfoMap = {
  pp_stripe_stripe: {
    title: "Credit Card",
    desc: "Pay securely with your credit or debit card.",
    Icon: <CreditCard className="w-6 h-6 sm:w-7 sm:h-7 text-foreground" />,
    Preview: CheckStripeForm,
  },
  pp_paypal_paypal: {
    title: "PayPal",
    desc: "Complete your purchase quickly and securely with PayPal.",
    Icon: <PayPal className="w-6 h-6 sm:w-7 sm:h-7 text-foreground" />,
    Preview: CheckPayPalPreview,
  },
  pp_paypal_card_paypal_card: {
    title: "Debit or Credit Card",
    desc: "Pay with your card via PayPal's secure card processing.",
    Icon: <CreditCard className="w-6 h-6 sm:w-7 sm:h-7 text-foreground" />,
    Preview: CheckPayPalCard,
  },
  pp_system_default: {
    title: "Pay Later",
    desc: "Place your order now and pay later using your preferred method.",
    Icon: <Clock className="w-6 h-6 sm:w-7 sm:h-7 text-foreground" />,
    Preview: CheckManualPreview,
  },
} as Record<string, PaymentInfo>

type PaymentInfo = {
  title: string
  desc: string
  Icon: React.JSX.Element
  Preview: ComponentType<{ cart: StoreCart }>
}
