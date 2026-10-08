"use client"

import {
    ArrowLeft,
    CheckCircle2,
    CreditCard,
    MapPin,
    PackageCheck,
    Printer,
    RefreshCw,
    Scissors,
    ShieldCheck,
    Sparkles,
    Truck,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import {
    type ConfirmedPreviewOrder,
    usePreviewFlowStore,
} from "@/lib/store/preview-flow-store"
import { convertToLocale } from "@/lib/util/money"
import Button from "@/ui/button"

export default function CheckoutConfirmedView({
    order,
}: {
    order: ConfirmedPreviewOrder
}) {
    const clearConfirmedOrder = usePreviewFlowStore(
        (s) => s.clearConfirmedOrder,
    )
    const setActiveStep = usePreviewFlowStore((s) => s.setActiveStep)

    const handleTestAnotherPayment = () => {
        clearConfirmedOrder()
        setActiveStep("payment")
    }

    const stages = [
        {
            label: "Order & Payment Verified",
            desc: new Date(order.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            }),
            done: true,
        },
        {
            label: "Full-Grain Hide Selection",
            desc: "Assigned to Master Cutter",
            done: true,
        },
        {
            label: "47-Step Bench Tailoring",
            desc: "Florence Workshop",
            done: false,
        },
        {
            label: "Insured Courier Dispatch",
            desc: order.estimatedDelivery,
            done: false,
        },
    ]

    return (
        <div
            data-testid="checkout-order-confirmed-view"
            className="mx-auto max-w-4xl space-y-6 py-4"
        >
            {/* Hero Confirmation Card */}
            <div className="overflow-hidden rounded-3xl border border-border bg-surface p-6 shadow-md sm:p-10">
                <div className="flex flex-col items-start justify-between gap-4 border-b border-divider pb-6 sm:flex-row sm:items-center">
                    <div className="flex items-start gap-4">
                        <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-success/15 text-success">
                            <CheckCircle2 className="size-8" strokeWidth={2} />
                        </div>
                        <div>
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/15 px-3 py-0.5 text-[11px] font-bold uppercase tracking-widest text-accent">
                                <Sparkles className="size-3" />
                                Atelier Commission Confirmed
                            </span>
                            <h1 className="mt-1.5 font-heading text-2xl font-bold text-text-primary sm:text-3xl">
                                Thank You, {order.shippingAddress?.first_name || "Collector"}!
                            </h1>
                            <p className="mt-1 text-xs text-text-secondary sm:text-sm">
                                Confirmation sent to{" "}
                                <strong className="text-text-primary">
                                    {order.email}
                                </strong>
                            </p>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-border bg-background-secondary/60 px-4 py-3 text-left sm:text-right">
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-text-tertiary">
                            Atelier Order Reference
                        </p>
                        <p className="font-mono text-base font-bold text-primary">
                            #VH-{order.displayId}
                        </p>
                        <p className="font-mono text-[11px] text-text-tertiary">
                            {order.transactionId}
                        </p>
                    </div>
                </div>

                {/* 4-Stage Craft & Delivery Tracker */}
                <div className="my-6 grid grid-cols-1 gap-3 sm:grid-cols-4">
                    {stages.map((st, idx) => (
                        <div
                            key={st.label}
                            className={`rounded-2xl border p-3.5 ${
                                st.done
                                    ? "border-success/40 bg-success-subtle/20"
                                    : "border-border bg-background/50"
                            }`}
                        >
                            <div className="flex items-center gap-2">
                                <span
                                    className={`flex size-5 items-center justify-center rounded-full text-[10px] font-bold ${
                                        st.done
                                            ? "bg-success text-success-foreground"
                                            : "bg-muted text-text-secondary"
                                    }`}
                                >
                                    {idx + 1}
                                </span>
                                <span className="text-xs font-semibold text-text-primary">
                                    {st.label}
                                </span>
                            </div>
                            <p className="mt-1 pl-7 text-[11px] text-text-secondary">
                                {st.desc}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Details Grid: Payment Provider, Delivery Address, Shipping Method */}
                <div className="grid grid-cols-1 gap-4 border-y border-divider py-6 md:grid-cols-3">
                    <div className="rounded-2xl border border-border bg-background/40 p-4">
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-text-tertiary">
                            <CreditCard className="size-3.5 text-accent" />
                            <span>Payment Provider</span>
                        </div>
                        <p
                            data-testid="confirmed-payment-label"
                            className="mt-2 font-heading text-sm font-bold text-text-primary"
                        >
                            {order.paymentLabel}
                        </p>
                        <p className="mt-0.5 font-mono text-[11px] text-text-tertiary">
                            Provider ID: {order.paymentProviderId}
                        </p>
                        {order.paymentDetails && (
                            <dl className="mt-2.5 space-y-1 border-t border-divider pt-2 text-[11px]">
                                {Object.entries(order.paymentDetails).map(
                                    ([k, v]) => (
                                        <div
                                            key={k}
                                            className="flex justify-between gap-2"
                                        >
                                            <dt className="text-text-tertiary">
                                                {k}:
                                            </dt>
                                            <dd className="font-medium text-text-primary text-right">
                                                {v}
                                            </dd>
                                        </div>
                                    ),
                                )}
                            </dl>
                        )}
                    </div>

                    <div className="rounded-2xl border border-border bg-background/40 p-4">
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-text-tertiary">
                            <MapPin className="size-3.5 text-accent" />
                            <span>Shipping Destination</span>
                        </div>
                        <p className="mt-2 text-sm font-bold text-text-primary">
                            {order.shippingAddress?.first_name}{" "}
                            {order.shippingAddress?.last_name}
                        </p>
                        <p className="mt-0.5 text-xs text-text-secondary">
                            {order.shippingAddress?.address_1}
                            {order.shippingAddress?.address_2
                                ? `, ${order.shippingAddress.address_2}`
                                : ""}
                        </p>
                        <p className="text-xs text-text-secondary">
                            {order.shippingAddress?.city},{" "}
                            {order.shippingAddress?.province}{" "}
                            {order.shippingAddress?.postal_code} (
                            {order.shippingAddress?.country_code?.toUpperCase()})
                        </p>
                        <p className="mt-1 text-[11px] text-text-tertiary">
                            Tel: {order.shippingAddress?.phone}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-border bg-background/40 p-4">
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-text-tertiary">
                            <Truck className="size-3.5 text-accent" />
                            <span>Courier & Packaging</span>
                        </div>
                        <p className="mt-2 text-sm font-bold text-text-primary">
                            {order.shippingMethodName}
                        </p>
                        <p className="mt-0.5 text-xs text-text-secondary">
                            Estimated Arrival: {order.estimatedDelivery}
                        </p>
                        {order.giftWrap && (
                            <p className="mt-2 rounded-lg bg-accent/15 px-2.5 py-1 text-[11px] font-semibold text-accent">
                                + Cedar Hanger & Wax-Sealed Gift Box Included
                            </p>
                        )}
                    </div>
                </div>

                {/* Commissioned Items List */}
                <div className="mt-6 space-y-4">
                    <h2 className="font-heading text-base font-bold text-text-primary">
                        Commissioned Garments
                    </h2>
                    <ul className="divide-y divide-divider rounded-2xl border border-border bg-background/30 px-4">
                        {order.items.map((item) => {
                            const meta = (item.metadata ?? {}) as Record<
                                string,
                                string
                            >
                            return (
                                <li
                                    key={item.id}
                                    className="flex items-center justify-between gap-4 py-3.5"
                                >
                                    <div className="flex items-center gap-3.5">
                                        <div className="relative h-16 w-13 shrink-0 overflow-hidden rounded-lg border border-border bg-white">
                                            <Image
                                                src={
                                                    item.thumbnail ||
                                                    "/images/col_thumb/col_mens_2.webp"
                                                }
                                                alt={item.title}
                                                fill
                                                sizes="52px"
                                                className="object-contain p-1"
                                            />
                                        </div>
                                        <div>
                                            <p className="font-heading text-sm font-bold text-text-primary">
                                                {item.title}
                                            </p>
                                            <p className="text-xs text-text-secondary">
                                                Variant: {item.variant_title} • Qty:{" "}
                                                {item.quantity}
                                            </p>
                                            {(meta.lining ||
                                                meta.hardware ||
                                                meta.monogram) && (
                                                <p className="mt-0.5 text-[11px] text-accent">
                                                    Bespoke:{" "}
                                                    {[
                                                        meta.lining &&
                                                            `Lining (${meta.lining})`,
                                                        meta.hardware &&
                                                            `Hardware (${meta.hardware})`,
                                                        meta.monogram &&
                                                            `Monogram "${meta.monogram}"`,
                                                    ]
                                                        .filter(Boolean)
                                                        .join(" • ")}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <span className="font-mono text-sm font-bold text-text-primary tabular-nums">
                                        {convertToLocale({
                                            amount:
                                                Number(item.unit_price ?? 420) *
                                                Number(item.quantity ?? 1),
                                            currency_code: order.currencyCode,
                                        })}
                                    </span>
                                </li>
                            )
                        })}
                    </ul>
                </div>

                {/* Totals Receipt Footer */}
                <div className="mt-6 flex flex-col justify-between gap-6 border-t border-divider pt-6 sm:flex-row sm:items-end">
                    <div className="flex flex-wrap gap-2.5">
                        <Button
                            type="button"
                            onClick={handleTestAnotherPayment}
                            variant="primary"
                            size="md"
                            data-testid="test-another-payment-button"
                            className="gap-2 rounded-xl text-xs font-semibold"
                        >
                            <RefreshCw className="size-3.5" />
                            <span>Test Another Payment Method</span>
                        </Button>

                        <Link
                            href="/product-preview/milano-asymmetric-moto-jacket"
                            className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2.5 text-xs font-semibold text-text-primary transition-colors hover:bg-muted"
                        >
                            <ArrowLeft className="size-3.5" />
                            <span>Back to Product Preview</span>
                        </Link>

                        <button
                            type="button"
                            onClick={() => window.print()}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface px-3.5 py-2.5 text-xs font-semibold text-text-secondary hover:text-text-primary"
                        >
                            <Printer className="size-3.5" />
                            <span>Print Receipt</span>
                        </button>
                    </div>

                    <div className="w-full space-y-1.5 text-xs sm:w-64">
                        <div className="flex justify-between text-text-secondary">
                            <span>Subtotal</span>
                            <span className="font-mono">
                                {convertToLocale({
                                    amount: order.subtotal,
                                    currency_code: order.currencyCode,
                                })}
                            </span>
                        </div>
                        {order.discountTotal > 0 && (
                            <div className="flex justify-between text-success">
                                <span>Discount</span>
                                <span className="font-mono">
                                    -
                                    {convertToLocale({
                                        amount: order.discountTotal,
                                        currency_code: order.currencyCode,
                                    })}
                                </span>
                            </div>
                        )}
                        <div className="flex justify-between text-text-secondary">
                            <span>Shipping & Packaging</span>
                            <span className="font-mono">
                                {order.shippingTotal === 0
                                    ? "FREE"
                                    : convertToLocale({
                                          amount: order.shippingTotal,
                                          currency_code: order.currencyCode,
                                      })}
                            </span>
                        </div>
                        <div className="flex justify-between text-text-secondary">
                            <span>Tax</span>
                            <span className="font-mono">
                                {convertToLocale({
                                    amount: order.taxTotal,
                                    currency_code: order.currencyCode,
                                })}
                            </span>
                        </div>
                        <div className="flex justify-between border-t border-divider pt-2 font-heading text-base font-bold text-text-primary">
                            <span>Total Paid</span>
                            <span className="font-mono text-price-current">
                                {convertToLocale({
                                    amount: order.total,
                                    currency_code: order.currencyCode,
                                })}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
