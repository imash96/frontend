// This only checks if it is native stripe for card payments, it ignores the other stripe-based providers
export const isStripe = (providerId?: string) =>
  providerId?.startsWith("pp_stripe_");

export const isPaypal = (providerId?: string) =>
  providerId?.startsWith("pp_paypal_");

export const isManual = (providerId?: string) =>
  providerId?.startsWith("pp_system_default");

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
