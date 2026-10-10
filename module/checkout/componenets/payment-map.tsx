import type { StoreCart } from "@medusajs/types"
import { Clock, CreditCard, Wallet } from "lucide-react"
import type { ComponentType } from "react"
import PayPalIcon from "@/icon/checkout-paypal"
import { PAYMENT_PROVIDER } from "@/lib/constant"
import PayPalCard from "../providers/paypal-card"
import PayPalDefault from "../providers/paypal-default"
import PayuDefault from "../providers/payu-default"
import SystemDefault from "../providers/system-default"
// import StripeDefault from "../providers/stripe-default"

export const checkPaymentInfoMap = {
  // [PAYMENT_PROVIDER.STRIPE]: {
  //   title: "Credit Card",
  //   desc: "Pay securely with your credit or debit card.",
  //   Icon: CreditCard,
  //   Preview: StripeDefault,
  // },
  [PAYMENT_PROVIDER.PAYPAL]: {
    title: "PayPal",
    desc: "Complete your purchase quickly and securely with PayPal.",
    Icon: PayPalIcon,
    Preview: PayPalDefault,
  },
  [PAYMENT_PROVIDER.PAYPAL_CARD]: {
    title: "Debit or Credit Card",
    desc: "Pay with your card via PayPal's secure card processing.",
    Icon: CreditCard,
    Preview: PayPalCard,
  },
  [PAYMENT_PROVIDER.PAYU]: {
    title: "PayU",
    desc: "UPI, Net Banking, Cards and Wallets - all Indian payment methods.",
    Icon: Wallet,
    Preview: PayuDefault,
  },
  [PAYMENT_PROVIDER.PAY_LATER]: {
    title: "Pay Later",
    desc: "Place your order now and pay later using your preferred method.",
    Icon: Clock,
    Preview: SystemDefault,
  },
} as Record<string, PaymentInfo>


export type PaymentInfo = {
  title: string
  desc: string
  Icon: ComponentType<{ className?: string }>
  Preview: ComponentType<{ cart: StoreCart }>
}

export const getPaymentInfo = (providerId: string): PaymentInfo | undefined => checkPaymentInfoMap[providerId]