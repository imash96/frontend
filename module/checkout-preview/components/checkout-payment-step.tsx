"use client"

import {
    AlertCircle,
    Banknote,
    Building,
    CalendarClock,
    Check,
    CheckCircle2,
    CreditCard,
    Landmark,
    Loader2,
    Lock,
    QrCode,
    ShieldCheck,
    Smartphone,
    Sparkles,
    Wallet,
} from "lucide-react"
import { useMemo, useState } from "react"
import { initCheckPayment } from "@/lib/action/checkout"
import { usePreviewFlowStore } from "@/lib/store/preview-flow-store"
import { convertToLocale } from "@/lib/util/money"
import Button from "@/ui/button"

const isPaypal = (id?: string) => id === "pp_paypal_paypal"
const isPaypalCard = (id?: string) => id === "pp_paypal_card"
const isManual = (id?: string) => Boolean(id?.startsWith("pp_system_default"))
const isPayu = (id?: string) => Boolean(id?.startsWith("pp_payu_"))

function formatCardNumber(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 16)
    return digits.replace(/(\d{4})(?=\d)/g, "$1 ")
}

function formatExpiry(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 4)
    if (digits.length >= 3) {
        return `${digits.slice(0, 2)}/${digits.slice(2)}`
    }
    return digits
}

function detectCardBrand(num: string): "VISA" | "MASTERCARD" | "AMEX" | "CARD" {
    const clean = num.replace(/\D/g, "")
    if (clean.startsWith("4")) return "VISA"
    if (/^5[1-5]/.test(clean) || /^2[2-7]/.test(clean)) return "MASTERCARD"
    if (/^3[47]/.test(clean)) return "AMEX"
    return "CARD"
}

const PROVIDER_META: Record<
    string,
    {
        title: string
        subtitle: string
        badge: string
        icon: typeof CreditCard
    }
> = {
    pp_paypal_paypal: {
        title: "PayPal Express",
        subtitle: "Fast, protected checkout with your PayPal wallet",
        badge: "Buyer Protection",
        icon: Wallet,
    },
    pp_paypal_card: {
        title: "PayPal Card",
        subtitle: "Visa, Mastercard & Amex via PayPal 3D-Secure",
        badge: "256-Bit 3DS2",
        icon: CreditCard,
    },
    pp_system_default: {
        title: "Pay Later",
        subtitle: "4× interest-free installments or Atelier Invoice",
        badge: "0% APR",
        icon: CalendarClock,
    },
    pp_payu_payu: {
        title: "PayU Gateway",
        subtitle: "Instant UPI, NetBanking, Cards & Global Wallets",
        badge: "Instant Verify",
        icon: Landmark,
    },
}

export default function CheckoutPaymentStep() {
    const cart = usePreviewFlowStore((s) => s.cart)
    const paymentProviders = usePreviewFlowStore((s) => s.paymentProviders)
    const selectedPaymentProviderId = usePreviewFlowStore(
        (s) => s.selectedPaymentProviderId,
    )
    const selectPaymentProvider = usePreviewFlowStore(
        (s) => s.selectPaymentProvider,
    )
    const activeStep = usePreviewFlowStore((s) => s.activeStep)
    const viewMode = usePreviewFlowStore((s) => s.viewMode)
    const setActiveStep = usePreviewFlowStore((s) => s.setActiveStep)
    const completePreviewOrder = usePreviewFlowStore(
        (s) => s.completePreviewOrder,
    )

    const isOpen = viewMode === "single" || activeStep === "payment"

    // Payment provider specific states
    const [paypalEmail, setPaypalEmail] = useState(
        cart.email || "alexander.vane@vellehide.com",
    )

    // PayPal Card state
    const [cardHolder, setCardHolder] = useState("ALEXANDER VANE")
    const [cardNumber, setCardNumber] = useState("4242 4242 4242 4242")
    const [cardExpiry, setCardExpiry] = useState("08/29")
    const [cardCvv, setCardCvv] = useState("842")
    const [saveCard, setSaveCard] = useState(true)

    // Pay Later sub-mode: "pay_in_4" | "atelier_invoice"
    const [payLaterPlan, setPayLaterPlan] = useState<
        "pay_in_4" | "atelier_invoice"
    >("pay_in_4")

    // PayU sub-mode: "upi" | "netbanking" | "cards" | "wallet"
    const [payuChannel, setPayuChannel] = useState<
        "upi" | "netbanking" | "cards" | "wallet"
    >("upi")
    const [upiId, setUpiId] = useState("alexander.vane@okicici")
    const [upiVerified, setUpiVerified] = useState(true)
    const [selectedBank, setSelectedBank] = useState("HDFC Bank")

    // Submission state
    const [submitting, setSubmitting] = useState(false)
    const [statusStage, setStatusStage] = useState<string | null>(null)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    const totalAmount = Number(cart.total ?? 420)
    const currencyCode = cart.currency_code || "usd"
    const installmentAmount = useMemo(
        () => Number((totalAmount / 4).toFixed(2)),
        [totalAmount],
    )
    const cardBrand = useMemo(
        () => detectCardBrand(cardNumber),
        [cardNumber],
    )

    const handleSelectProvider = async (providerId: string) => {
        setErrorMessage(null)
        selectPaymentProvider(providerId)
        if (cart.id && !cart.id.startsWith("cart_preview_")) {
            await initCheckPayment(
                cart.id,
                providerId,
                cart.payment_collection?.id,
            ).catch(() => null)
        }
    }

    const validateSelectedProvider = (): boolean => {
        if (!cart.items || cart.items.length === 0) {
            setErrorMessage(
                "Your shopping bag is empty. Please add a garment before completing payment.",
            )
            return false
        }

        if (
            !cart.shipping_address?.first_name ||
            !cart.shipping_address?.address_1 ||
            !cart.shipping_address?.city
        ) {
            setErrorMessage(
                "Please complete your delivery address in Step 1 first.",
            )
            setActiveStep("address")
            return false
        }

        if (isPaypal(selectedPaymentProviderId)) {
            if (!paypalEmail.includes("@")) {
                setErrorMessage("Please enter a valid PayPal account email.")
                return false
            }
        }

        if (isPaypalCard(selectedPaymentProviderId)) {
            const digits = cardNumber.replace(/\D/g, "")
            if (digits.length < 15) {
                setErrorMessage("Please enter a valid 15 or 16-digit card number.")
                return false
            }
            if (!cardHolder.trim()) {
                setErrorMessage("Please enter the cardholder name.")
                return false
            }
            if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) {
                setErrorMessage("Please enter a valid expiration date (MM/YY).")
                return false
            }
            if (cardCvv.replace(/\D/g, "").length < 3) {
                setErrorMessage("Please enter a valid 3 or 4-digit security code (CVV).")
                return false
            }
        }

        if (isPayu(selectedPaymentProviderId)) {
            if (payuChannel === "upi" && !upiId.includes("@")) {
                setErrorMessage(
                    "Please enter a valid UPI ID (e.g., username@okicici).",
                )
                return false
            }
        }

        return true
    }

    const handleExecutePayment = async () => {
        setErrorMessage(null)
        if (!validateSelectedProvider()) return

        setSubmitting(true)
        try {
            const providerMeta =
                PROVIDER_META[selectedPaymentProviderId] ??
                PROVIDER_META.pp_paypal_paypal

            setStatusStage(
                `Initializing ${providerMeta.title} session...`,
            )
            await new Promise((r) => setTimeout(r, 450))

            // If connected to a live Medusa backend cart, attempt real session + order placement
            if (cart.id && !cart.id.startsWith("cart_preview_")) {
                await initCheckPayment(
                    cart.id,
                    selectedPaymentProviderId,
                    cart.payment_collection?.id,
                ).catch(() => null)
            }

            if (isPaypal(selectedPaymentProviderId)) {
                setStatusStage(
                    `Authorizing PayPal Wallet (${paypalEmail})...`,
                )
            } else if (isPaypalCard(selectedPaymentProviderId)) {
                setStatusStage(
                    `Verifying 3D-Secure 2.0 with ${cardBrand} ending in ${cardNumber.slice(-4)}...`,
                )
            } else if (isManual(selectedPaymentProviderId)) {
                setStatusStage(
                    payLaterPlan === "pay_in_4"
                        ? `Approving 4× interest-free plan ($${installmentAmount.toFixed(2)} today)...`
                        : "Generating Atelier Reservation Invoice...",
                )
            } else if (isPayu(selectedPaymentProviderId)) {
                setStatusStage(
                    `Verifying PayU ${payuChannel.toUpperCase()} transaction hash...`,
                )
            }

            await new Promise((r) => setTimeout(r, 650))
            setStatusStage("Allocating full-grain hide & confirming order...")
            await new Promise((r) => setTimeout(r, 400))

            let label = providerMeta.title
            const details: Record<string, string> = {}

            if (isPaypal(selectedPaymentProviderId)) {
                label = "PayPal Express Wallet"
                details["PayPal Account"] = paypalEmail
                details["Protection"] = "PayPal Purchase Protection Eligible"
            } else if (isPaypalCard(selectedPaymentProviderId)) {
                const last4 = cardNumber.replace(/\D/g, "").slice(-4) || "4242"
                label = `PayPal Card (${cardBrand} •••• ${last4})`
                details["Cardholder"] = cardHolder
                details["Card Network"] = `${cardBrand} •••• ${last4}`
                details["3D-Secure"] = "Verified (3DS 2.2 Frictionless)"
            } else if (isManual(selectedPaymentProviderId)) {
                if (payLaterPlan === "pay_in_4") {
                    label = `Pay Later — 4× Interest-Free ($${installmentAmount.toFixed(2)}/pmt)`
                    details["Installment 1 (Today)"] = `$${installmentAmount.toFixed(2)}`
                    details["Remaining 3 Payments"] = `$${installmentAmount.toFixed(2)} every 2 weeks (0% APR)`
                } else {
                    label = "Pay Later — Atelier Invoice on Dispatch"
                    details["Billing Terms"] = "Net-14 / Settle Prior to Final Courier Hand-off"
                }
            } else if (isPayu(selectedPaymentProviderId)) {
                label = `PayU Secure Gateway (${payuChannel.toUpperCase()})`
                details["PayU Channel"] =
                    payuChannel === "upi"
                        ? `UPI (${upiId})`
                        : payuChannel === "netbanking"
                          ? `NetBanking (${selectedBank})`
                          : payuChannel.toUpperCase()
                details["Gateway Reference"] = `PAYU-HASH-${Date.now().toString().slice(-6)}`
            }

            completePreviewOrder({
                paymentLabel: label,
                paymentDetails: details,
            })
        } catch (err: any) {
            setErrorMessage(
                err?.message || "Payment authorization failed. Please try again.",
            )
        } finally {
            setSubmitting(false)
            setStatusStage(null)
        }
    }

    return (
        <section
            aria-labelledby="checkout-step-payment"
            className="overflow-hidden rounded-2xl border border-border bg-surface shadow-xs transition-all"
        >
            {/* Step Header */}
            <div className="flex items-center justify-between border-b border-divider bg-background-secondary/40 px-5 py-4 sm:px-6">
                <div className="flex items-center gap-3">
                    <span
                        className={`flex size-7 items-center justify-center rounded-full text-xs font-bold ${
                            isOpen
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-text-secondary"
                        }`}
                    >
                        3
                    </span>
                    <div>
                        <h2
                            id="checkout-step-payment"
                            className="font-heading text-base font-bold text-text-primary sm:text-lg"
                        >
                            Payment Method
                        </h2>
                        <p className="text-xs text-text-secondary">
                            Select PayPal, PayPal Card, Pay Later, or PayU Gateway
                        </p>
                    </div>
                </div>

                {!isOpen && (
                    <button
                        type="button"
                        onClick={() => setActiveStep("payment")}
                        className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-primary hover:bg-muted"
                    >
                        Select Payment
                    </button>
                )}
            </div>

            {isOpen && (
                <div className="space-y-6 p-5 sm:p-6">
                    {/* 4 Payment Method Selector Cards */}
                    <div
                        role="radiogroup"
                        aria-label="Payment method provider"
                        className="grid grid-cols-1 gap-3 sm:grid-cols-2"
                    >
                        {paymentProviders.map((provider) => {
                            const meta = PROVIDER_META[provider.id] ?? {
                                title: provider.id,
                                subtitle: "Encrypted checkout provider",
                                badge: "Secure",
                                icon: CreditCard,
                            }
                            const Icon = meta.icon
                            const selected =
                                selectedPaymentProviderId === provider.id

                            return (
                                <button
                                    key={provider.id}
                                    type="button"
                                    role="radio"
                                    aria-checked={selected}
                                    onClick={() =>
                                        handleSelectProvider(provider.id)
                                    }
                                    data-testid={`payment-provider-${provider.id}`}
                                    className={`flex flex-col justify-between rounded-xl border p-4 text-left transition-all ${
                                        selected
                                            ? "border-primary bg-primary/5 ring-1 ring-primary shadow-xs"
                                            : "border-border bg-background/50 hover:border-border-strong"
                                    }`}
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex items-center gap-2.5">
                                            <div
                                                className={`flex size-9 items-center justify-center rounded-lg ${
                                                    selected
                                                        ? "bg-primary text-primary-foreground"
                                                        : "bg-muted text-text-secondary"
                                                }`}
                                            >
                                                <Icon className="size-4.5" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-heading text-sm font-bold text-text-primary">
                                                        {meta.title}
                                                    </span>
                                                </div>
                                                <span className="inline-block rounded bg-accent/15 px-1.5 py-0.5 text-[10px] font-semibold text-accent">
                                                    {meta.badge}
                                                </span>
                                            </div>
                                        </div>

                                        <span
                                            className={`flex size-5 shrink-0 items-center justify-center rounded-full border ${
                                                selected
                                                    ? "border-primary bg-primary text-primary-foreground"
                                                    : "border-border-strong"
                                            }`}
                                        >
                                            {selected && (
                                                <Check
                                                    className="size-3"
                                                    strokeWidth={3}
                                                />
                                            )}
                                        </span>
                                    </div>

                                    <p className="mt-2.5 text-xs leading-relaxed text-text-secondary">
                                        {meta.subtitle}
                                    </p>
                                </button>
                            )
                        })}
                    </div>

                    {/* Active Provider Interactive Configuration Panel */}
                    <div className="rounded-2xl border border-border bg-background-secondary/40 p-4 sm:p-5">
                        {/* 1. PAYPAL WALLET (`pp_paypal_paypal`) */}
                        {isPaypal(selectedPaymentProviderId) && (
                            <div
                                className="space-y-4"
                                data-testid="panel-pp_paypal_paypal"
                            >
                                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-divider pb-3">
                                    <div className="flex items-center gap-2.5">
                                        <span className="inline-flex items-center rounded-lg bg-[#003087] px-2.5 py-1 font-heading text-xs font-bold tracking-wide text-white">
                                            PayPal
                                        </span>
                                        <span className="text-xs font-semibold text-text-primary">
                                            Express Wallet Authorization
                                        </span>
                                    </div>
                                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-success">
                                        <ShieldCheck className="size-3.5" />
                                        Full Buyer Protection Included
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="mb-1 block text-xs font-semibold text-text-secondary">
                                            PayPal Account Email
                                        </label>
                                        <input
                                            type="email"
                                            value={paypalEmail}
                                            onChange={(e) =>
                                                setPaypalEmail(e.target.value)
                                            }
                                            placeholder="you@example.com"
                                            className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-text-primary focus:border-primary focus:outline-none"
                                        />
                                    </div>
                                    <div className="flex flex-col justify-center rounded-xl border border-border bg-surface p-3 text-xs text-text-secondary">
                                        <p className="font-semibold text-text-primary">
                                            Instant One-Touch Checkout
                                        </p>
                                        <p className="mt-0.5 text-[11px]">
                                            Your shipping address ({cart.shipping_address?.city || "New York"}) is pre-verified with PayPal Seller Protection.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 2. PAYPAL CARD (`pp_paypal_card`) */}
                        {isPaypalCard(selectedPaymentProviderId) && (
                            <div
                                className="space-y-5"
                                data-testid="panel-pp_paypal_card"
                            >
                                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-divider pb-3">
                                    <div className="flex items-center gap-2">
                                        <CreditCard className="size-4 text-primary" />
                                        <span className="text-xs font-semibold text-text-primary">
                                            PayPal 3D-Secure Card Fields
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setCardNumber(
                                                    "4242 4242 4242 4242",
                                                )
                                                setCardExpiry("08/29")
                                                setCardCvv("842")
                                            }}
                                            className="rounded-md border border-border bg-surface px-2 py-0.5 text-[10px] font-semibold text-text-secondary hover:border-primary hover:text-primary"
                                        >
                                            Fill Visa 4242
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setCardNumber(
                                                    "5555 5555 5555 4444",
                                                )
                                                setCardExpiry("11/28")
                                                setCardCvv("918")
                                            }}
                                            className="rounded-md border border-border bg-surface px-2 py-0.5 text-[10px] font-semibold text-text-secondary hover:border-primary hover:text-primary"
                                        >
                                            Fill Mastercard 5555
                                        </button>
                                    </div>
                                </div>

                                {/* Visual Luxury Credit Card + Form Grid */}
                                <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 lg:items-center">
                                    {/* Interactive Card Preview */}
                                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#2C1810] via-[#1C120D] to-[#4A2C1D] p-5 text-[#F5EBE1] shadow-lg lg:col-span-5">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#D4A574]">
                                                Velle Hide Atelier • 3DS2
                                            </span>
                                            <span className="rounded bg-white/15 px-2 py-0.5 font-mono text-xs font-bold tracking-wider">
                                                {cardBrand}
                                            </span>
                                        </div>

                                        <div className="my-5 font-mono text-base font-semibold tracking-[0.18em] sm:text-lg">
                                            {cardNumber || "•••• •••• •••• ••••"}
                                        </div>

                                        <div className="flex items-end justify-between text-xs">
                                            <div>
                                                <p className="text-[9px] uppercase tracking-widest text-white/60">
                                                    Cardholder
                                                </p>
                                                <p className="mt-0.5 font-mono text-xs font-semibold uppercase tracking-wider">
                                                    {cardHolder || "YOUR NAME"}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[9px] uppercase tracking-widest text-white/60">
                                                    Expires
                                                </p>
                                                <p className="mt-0.5 font-mono text-xs font-semibold">
                                                    {cardExpiry || "MM/YY"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Card Input Fields */}
                                    <div className="space-y-3.5 lg:col-span-7">
                                        <div>
                                            <label className="mb-1 block text-xs font-semibold text-text-secondary">
                                                Card Number
                                            </label>
                                            <input
                                                type="text"
                                                inputMode="numeric"
                                                value={cardNumber}
                                                onChange={(e) =>
                                                    setCardNumber(
                                                        formatCardNumber(
                                                            e.target.value,
                                                        ),
                                                    )
                                                }
                                                placeholder="4242 •••• •••• 4242"
                                                data-testid="paypal-card-number-input"
                                                className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 font-mono text-sm text-text-primary focus:border-primary focus:outline-none"
                                            />
                                        </div>

                                        <div>
                                            <label className="mb-1 block text-xs font-semibold text-text-secondary">
                                                Name on Card
                                            </label>
                                            <input
                                                type="text"
                                                value={cardHolder}
                                                onChange={(e) =>
                                                    setCardHolder(
                                                        e.target.value.toUpperCase(),
                                                    )
                                                }
                                                placeholder="ALEXANDER VANE"
                                                data-testid="paypal-card-holder-input"
                                                className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm uppercase text-text-primary focus:border-primary focus:outline-none"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="mb-1 block text-xs font-semibold text-text-secondary">
                                                    Expiry Date (MM/YY)
                                                </label>
                                                <input
                                                    type="text"
                                                    inputMode="numeric"
                                                    value={cardExpiry}
                                                    onChange={(e) =>
                                                        setCardExpiry(
                                                            formatExpiry(
                                                                e.target.value,
                                                            ),
                                                        )
                                                    }
                                                    placeholder="08/29"
                                                    data-testid="paypal-card-expiry-input"
                                                    className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 font-mono text-sm text-text-primary focus:border-primary focus:outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="mb-1 block text-xs font-semibold text-text-secondary">
                                                    Security Code (CVV)
                                                </label>
                                                <input
                                                    type="password"
                                                    inputMode="numeric"
                                                    maxLength={4}
                                                    value={cardCvv}
                                                    onChange={(e) =>
                                                        setCardCvv(
                                                            e.target.value.replace(
                                                                /\D/g,
                                                                "",
                                                            ),
                                                        )
                                                    }
                                                    placeholder="•••"
                                                    data-testid="paypal-card-cvv-input"
                                                    className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 font-mono text-sm text-text-primary focus:border-primary focus:outline-none"
                                                />
                                            </div>
                                        </div>

                                        <label className="flex cursor-pointer items-center gap-2 pt-1 text-xs text-text-secondary">
                                            <input
                                                type="checkbox"
                                                checked={saveCard}
                                                onChange={(e) =>
                                                    setSaveCard(e.target.checked)
                                                }
                                                className="size-3.5 rounded border-border accent-primary"
                                            />
                                            <span>
                                                Vault card securely with PayPal Braintree for future atelier orders
                                            </span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 3. PAY LATER (`pp_system_default`) */}
                        {isManual(selectedPaymentProviderId) && (
                            <div
                                className="space-y-4"
                                data-testid="panel-pp_system_default"
                            >
                                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-divider pb-3">
                                    <div className="flex items-center gap-2">
                                        <CalendarClock className="size-4 text-accent" />
                                        <span className="text-xs font-semibold text-text-primary">
                                            Flexible Pay Later Options
                                        </span>
                                    </div>
                                    <span className="rounded-full bg-success-subtle px-2.5 py-0.5 text-[10px] font-bold text-success">
                                        0% APR • No Hidden Fees
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setPayLaterPlan("pay_in_4")
                                        }
                                        className={`rounded-xl border p-3.5 text-left transition-all ${
                                            payLaterPlan === "pay_in_4"
                                                ? "border-primary bg-surface ring-1 ring-primary"
                                                : "border-border bg-surface/60"
                                        }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold text-text-primary">
                                                4× Interest-Free Payments
                                            </span>
                                            <span className="font-mono text-xs font-bold text-primary">
                                                ${installmentAmount.toFixed(2)}/ea
                                            </span>
                                        </div>
                                        <p className="mt-1 text-[11px] text-text-secondary">
                                            Split your purchase into 4 automatic bi-weekly payments. First payment due today.
                                        </p>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setPayLaterPlan("atelier_invoice")
                                        }
                                        className={`rounded-xl border p-3.5 text-left transition-all ${
                                            payLaterPlan === "atelier_invoice"
                                                ? "border-primary bg-surface ring-1 ring-primary"
                                                : "border-border bg-surface/60"
                                        }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold text-text-primary">
                                                Atelier Reserve & Invoice
                                            </span>
                                            <span className="font-mono text-xs font-bold text-accent">
                                                $0.00 Today
                                            </span>
                                        </div>
                                        <p className="mt-1 text-[11px] text-text-secondary">
                                            Reserve your hide allocation now and settle via bank transfer or card prior to dispatch.
                                        </p>
                                    </button>
                                </div>

                                {payLaterPlan === "pay_in_4" && (
                                    <div className="grid grid-cols-2 gap-2.5 pt-1 sm:grid-cols-4">
                                        {[
                                            {
                                                step: "Payment 1",
                                                when: "Due Today",
                                                active: true,
                                            },
                                            {
                                                step: "Payment 2",
                                                when: "In 2 Weeks",
                                                active: false,
                                            },
                                            {
                                                step: "Payment 3",
                                                when: "In 4 Weeks",
                                                active: false,
                                            },
                                            {
                                                step: "Payment 4",
                                                when: "In 6 Weeks",
                                                active: false,
                                            },
                                        ].map((item) => (
                                            <div
                                                key={item.step}
                                                className={`rounded-xl border p-3 text-center ${
                                                    item.active
                                                        ? "border-primary bg-primary/5"
                                                        : "border-border bg-surface"
                                                }`}
                                            >
                                                <p className="text-[10px] font-semibold uppercase tracking-wider text-text-tertiary">
                                                    {item.step}
                                                </p>
                                                <p className="mt-1 font-mono text-sm font-bold text-text-primary">
                                                    ${installmentAmount.toFixed(2)}
                                                </p>
                                                <p className="mt-0.5 text-[11px] text-text-secondary">
                                                    {item.when}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* 4. PAYU GATEWAY (`pp_payu_payu`) */}
                        {isPayu(selectedPaymentProviderId) && (
                            <div
                                className="space-y-4"
                                data-testid="panel-pp_payu_payu"
                            >
                                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-divider pb-3">
                                    <div className="flex items-center gap-2">
                                        <span className="inline-flex items-center rounded-lg bg-[#198754] px-2.5 py-1 font-heading text-xs font-bold text-white">
                                            PayU
                                        </span>
                                        <span className="text-xs font-semibold text-text-primary">
                                            PayU Biz / Global Multi-Channel Gateway
                                        </span>
                                    </div>
                                    <span className="font-mono text-[11px] text-text-tertiary">
                                        SHA-512 Signed Session
                                    </span>
                                </div>

                                {/* Channel Selector Pills */}
                                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                                    {[
                                        {
                                            id: "upi" as const,
                                            label: "Instant UPI",
                                            icon: QrCode,
                                        },
                                        {
                                            id: "netbanking" as const,
                                            label: "NetBanking",
                                            icon: Building,
                                        },
                                        {
                                            id: "cards" as const,
                                            label: "PayU Cards/EMI",
                                            icon: CreditCard,
                                        },
                                        {
                                            id: "wallet" as const,
                                            label: "PayU Wallet",
                                            icon: Smartphone,
                                        },
                                    ].map((ch) => {
                                        const ChIcon = ch.icon
                                        const active = payuChannel === ch.id
                                        return (
                                            <button
                                                key={ch.id}
                                                type="button"
                                                onClick={() =>
                                                    setPayuChannel(ch.id)
                                                }
                                                className={`flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition-all ${
                                                    active
                                                        ? "border-primary bg-primary text-primary-foreground"
                                                        : "border-border bg-surface text-text-secondary hover:text-text-primary"
                                                }`}
                                            >
                                                <ChIcon className="size-3.5" />
                                                <span>{ch.label}</span>
                                            </button>
                                        )
                                    })}
                                </div>

                                {payuChannel === "upi" && (
                                    <div className="space-y-2">
                                        <label className="block text-xs font-semibold text-text-secondary">
                                            Enter Virtual Payment Address (UPI ID)
                                        </label>
                                        <div className="flex flex-col gap-2 sm:flex-row">
                                            <input
                                                type="text"
                                                value={upiId}
                                                onChange={(e) => {
                                                    setUpiId(e.target.value)
                                                    setUpiVerified(
                                                        e.target.value.includes(
                                                            "@",
                                                        ),
                                                    )
                                                }}
                                                placeholder="username@okicici"
                                                className="flex-1 rounded-xl border border-border bg-surface px-3.5 py-2 text-sm text-text-primary focus:border-primary focus:outline-none"
                                            />
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setUpiVerified(
                                                        upiId.includes("@"),
                                                    )
                                                }
                                                className="rounded-xl border border-border bg-surface px-4 py-2 text-xs font-semibold text-primary hover:bg-muted"
                                            >
                                                Verify VPA
                                            </button>
                                        </div>
                                        {upiVerified && upiId.includes("@") && (
                                            <p className="inline-flex items-center gap-1.5 text-xs font-medium text-success">
                                                <CheckCircle2 className="size-3.5" />
                                                Verified VPA: {upiId} (Account Holder: Alexander Vane)
                                            </p>
                                        )}
                                    </div>
                                )}

                                {payuChannel === "netbanking" && (
                                    <div className="space-y-2">
                                        <label className="block text-xs font-semibold text-text-secondary">
                                            Select Partner Bank
                                        </label>
                                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                                            {[
                                                "HDFC Bank",
                                                "ICICI Bank",
                                                "State Bank of India",
                                                "Axis Bank",
                                                "HSBC Premier",
                                                "Citibank Global",
                                            ].map((bank) => (
                                                <button
                                                    key={bank}
                                                    type="button"
                                                    onClick={() =>
                                                        setSelectedBank(bank)
                                                    }
                                                    className={`rounded-lg border px-3 py-2 text-left text-xs font-medium ${
                                                        selectedBank === bank
                                                            ? "border-primary bg-primary/10 font-semibold text-primary"
                                                            : "border-border bg-surface text-text-secondary"
                                                    }`}
                                                >
                                                    {bank}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {(payuChannel === "cards" ||
                                    payuChannel === "wallet") && (
                                    <div className="rounded-xl border border-border bg-surface p-3.5 text-xs text-text-secondary">
                                        <p className="font-semibold text-text-primary">
                                            Instant PayU {payuChannel === "cards" ? "Zero-Cost EMI & Card" : "Multi-Wallet"} Settlement
                                        </p>
                                        <p className="mt-1">
                                            Click the payment button below to authorize{" "}
                                            <strong className="text-text-primary">
                                                {convertToLocale({
                                                    amount: totalAmount,
                                                    currency_code: currencyCode,
                                                })}
                                            </strong>{" "}
                                            via encrypted PayU session token.
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Error Banner */}
                    {errorMessage && (
                        <div
                            role="alert"
                            data-testid="checkout-payment-error"
                            className="flex items-start gap-2.5 rounded-xl border border-destructive/40 bg-destructive/10 p-3.5 text-xs font-medium text-destructive"
                        >
                            <AlertCircle className="mt-0.5 size-4 shrink-0" />
                            <span>{errorMessage}</span>
                        </div>
                    )}

                    {/* Live Processing Stage Banner */}
                    {submitting && statusStage && (
                        <div
                            role="status"
                            className="flex items-center gap-3 rounded-xl border border-primary/30 bg-primary/5 p-3.5 text-xs font-semibold text-primary"
                        >
                            <Loader2 className="size-4 shrink-0 animate-spin" />
                            <span>{statusStage}</span>
                        </div>
                    )}

                    {/* Primary Complete Order CTA */}
                    <div className="space-y-3 pt-1">
                        <Button
                            type="button"
                            disabled={submitting}
                            isLoading={submitting}
                            onClick={handleExecutePayment}
                            variant="primary"
                            fullWidth
                            size="xl"
                            data-testid="complete-preview-order-button"
                            className="gap-2.5 rounded-xl py-4 text-sm font-bold uppercase tracking-wider shadow-md transition-all hover:shadow-lg"
                        >
                            <Lock className="size-4" />
                            <span>
                                {submitting
                                    ? "Authorizing Payment..."
                                    : isPaypal(selectedPaymentProviderId)
                                      ? `Authorize with PayPal • ${convertToLocale({ amount: totalAmount, currency_code: currencyCode })}`
                                      : isPaypalCard(selectedPaymentProviderId)
                                        ? `Pay Securely with Card • ${convertToLocale({ amount: totalAmount, currency_code: currencyCode })}`
                                        : isManual(selectedPaymentProviderId)
                                          ? payLaterPlan === "pay_in_4"
                                              ? `Complete Pay in 4 Order • $${installmentAmount.toFixed(2)} Today`
                                              : `Confirm Atelier Invoice Order • ${convertToLocale({ amount: totalAmount, currency_code: currencyCode })}`
                                          : `Pay with PayU (${payuChannel.toUpperCase()}) • ${convertToLocale({ amount: totalAmount, currency_code: currencyCode })}`}
                            </span>
                        </Button>

                        <p className="text-center text-[11px] text-text-tertiary">
                            By placing your order, you agree to Velle Hide&apos;s 30-Day Complimentary Return Guarantee & Privacy Policy.
                        </p>
                    </div>
                </div>
            )}
        </section>
    )
}
