// This only checks if it is native stripe for card payments, it ignores the other stripe-based providers
export const isStripe = (providerId?: string) => providerId?.startsWith("pp_stripe_");

export const isPaypal = (providerId?: string) => providerId?.startsWith("pp_paypal_");

export const isManual = (providerId?: string) => providerId?.startsWith("pp_system_");

export const isPayU = (providerId?: string) => providerId?.startsWith("pp_payu_");

export const provider = (providerId?: string) => {
  switch (providerId) {
    case "pp_paypal_paypal":
      return "PayPal";
    case "pp_paypal_card":
      return "Debit or Credit Card (via PayPal)";
    case "pp_payu_payu":
      return "PayU Secure Checkout";
    case "pp_system_manual":
      return "Pay Later";
    case "pp_stripe_stripe":
      return "Debit or Credit Card (via Stripe)";
    default:
      return "Card / Online Payment";
  }
}

// Add currencies that don't need to be divided by 100
export const noDivisionCurrencies = [
  "krw",
  "jpy",
  "vnd",
  "clp",
  "pyg",
  "xaf",
  "xof",
  "bif",
  "djf",
  "gnf",
  "kmf",
  "mga",
  "rwf",
  "xpf",
  "htg",
  "vuv",
  "xag",
  "xdr",
  "xau",
];

export const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export const PRODUCTS_PER_PAGE = 28