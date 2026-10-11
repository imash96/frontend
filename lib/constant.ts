/**
 * Medusa payment provider ids: "pp_" + provider module id + "_" + provider id.
 * These match the PayPal (paypal / paypal_card) and PayU plugins registered in medusa-config.
 */
export const PAYMENT_PROVIDER = {
  STRIPE: "pp_stripe_stripe",
  PAYPAL: "pp_paypal_paypal",
  PAYPAL_CARD: "pp_paypal_card",
  PAYU: "pp_payu_payu",
  PAY_LATER: "pp_system_default", // Medusa's built-in manual provider
} as const

export const isStripe = (providerId?: string) => providerId?.startsWith("pp_stripe_") ?? false
export const isPaypal = (providerId?: string) => providerId?.startsWith("pp_paypal_") ?? false
// The card provider id depends on how the plugin registers it ("pp_paypal_card" or
// "pp_paypal_card_paypal_card"), so match the prefix instead of one exact string.
export const isPaypalCard = (providerId?: string) => providerId?.startsWith("pp_paypal_card") ?? false
export const isPaypalWallet = (providerId?: string) => isPaypal(providerId) && !isPaypalCard(providerId)
export const isManual = (providerId?: string) => providerId?.startsWith("pp_system_") ?? false
export const isPayU = (providerId?: string) => providerId?.startsWith("pp_payu_") ?? false

const PROVIDER_LABEL: Record<string, string> = {
  [PAYMENT_PROVIDER.PAYPAL]: "PayPal",
  [PAYMENT_PROVIDER.PAYPAL_CARD]: "Debit or Credit Card (via PayPal)",
  [PAYMENT_PROVIDER.PAYU]: "PayU Secure Checkout",
  [PAYMENT_PROVIDER.PAY_LATER]: "Pay Later", // was keyed "pp_system_manual", which never matched
  pp_stripe_stripe: "Debit or Credit Card (via Stripe)",
}

export const provider = (providerId?: string) =>
  (providerId && PROVIDER_LABEL[providerId]) || "Card / Online Payment"

// Currencies whose amounts are not stored in minor units (no division by 100).
export const noDivisionCurrencies = [
  "krw", "jpy", "vnd", "clp", "pyg", "xaf", "xof", "bif", "djf", "gnf", "kmf", "mga", "rwf", "xpf", "htg", "vuv", "xag", "xdr", "xau",
]

export const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"

export const PRODUCTS_PER_PAGE = 28

export const CART_FIELDS =
  "*items, *region, *items.product, *items.variant, *items.thumbnail, *items.metadata, +items.total, *promotions, +shipping_methods.name"