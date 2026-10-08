"use client"

import {
    CheckCircle2,
    Gift,
    Lock,
    Minus,
    Plus,
    RefreshCw,
    Scissors,
    ShieldCheck,
    Sparkles,
    Tag,
    Trash2,
    Truck,
    X,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { PREVIEW_RELATED_PRODUCTS } from "@/data/preview-data"
import { usePreviewFlowStore } from "@/lib/store/preview-flow-store"
import { convertToLocale } from "@/lib/util/money"

export default function CheckoutOrderSummary() {
    const cart = usePreviewFlowStore((s) => s.cart)
    const promoCode = usePreviewFlowStore((s) => s.promoCode)
    const promoDiscountPercent = usePreviewFlowStore(
        (s) => s.promoDiscountPercent,
    )
    const giftWrap = usePreviewFlowStore((s) => s.giftWrap)
    const updateLineItemQuantity = usePreviewFlowStore(
        (s) => s.updateLineItemQuantity,
    )
    const removeLineItem = usePreviewFlowStore((s) => s.removeLineItem)
    const applyPromoCode = usePreviewFlowStore((s) => s.applyPromoCode)
    const removePromoCode = usePreviewFlowStore((s) => s.removePromoCode)
    const resetDemoFlow = usePreviewFlowStore((s) => s.resetDemoFlow)
    const addProductToPreviewCart = usePreviewFlowStore(
        (s) => s.addProductToPreviewCart,
    )

    const [codeInput, setCodeInput] = useState("")
    const [promoFeedback, setPromoFeedback] = useState<{
        ok: boolean
        msg: string
    } | null>(null)

    const items = cart.items ?? []
    const currencyCode = cart.currency_code || "usd"

    const handleApplyCode = (codeToApply?: string) => {
        const target = (codeToApply ?? codeInput).trim()
        if (!target) return
        const res = applyPromoCode(target)
        setPromoFeedback({ ok: res.success, msg: res.message })
        if (res.success) setCodeInput("")
    }

    return (
        <aside
            aria-label="Order summary"
            className="rounded-2xl border border-border bg-surface p-5 shadow-xs sm:p-6"
        >
            <div className="flex items-center justify-between border-b border-divider pb-4">
                <div>
                    <h2 className="font-heading text-lg font-bold text-text-primary">
                        Atelier Order Summary
                    </h2>
                    <p className="text-xs text-text-secondary">
                        {items.reduce((sum, i) => sum + Number(i.quantity ?? 1), 0)}{" "}
                        handcrafted{" "}
                        {items.reduce((sum, i) => sum + Number(i.quantity ?? 1), 0) === 1
                            ? "piece"
                            : "pieces"}{" "}
                        in bag
                    </p>
                </div>
                <Link
                    href="/product-preview/milano-asymmetric-moto-jacket"
                    className="text-xs font-semibold text-link hover:underline"
                >
                    + Edit / Add Piece
                </Link>
            </div>

            {/* Line Items */}
            {items.length === 0 ? (
                <div className="my-6 rounded-xl border border-dashed border-border p-6 text-center">
                    <p className="text-sm font-semibold text-text-primary">
                        Your preview bag is empty
                    </p>
                    <p className="mt-1 text-xs text-text-secondary">
                        Restore the default Milano Asymmetric Moto Jacket or browse the product preview.
                    </p>
                    <button
                        type="button"
                        onClick={resetDemoFlow}
                        className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary-hover"
                    >
                        <RefreshCw className="size-3.5" />
                        <span>Restore Sample Bag</span>
                    </button>
                </div>
            ) : (
                <ul className="divide-y divide-divider py-2">
                    {items.map((item) => {
                        const meta = (item.metadata ?? {}) as Record<
                            string,
                            string
                        >
                        const hasCustom = Boolean(
                            meta.lining ||
                                meta.hardware ||
                                meta.monogram ||
                                meta.custom_measurements,
                        )

                        return (
                            <li
                                key={item.id}
                                className="flex gap-3.5 py-4 first:pt-2 last:pb-2"
                            >
                                <div className="relative h-22 w-18 shrink-0 overflow-hidden rounded-xl border border-border bg-white">
                                    <Image
                                        src={
                                            item.thumbnail ||
                                            "/images/col_thumb/col_mens_2.webp"
                                        }
                                        alt={item.title || "Leather jacket"}
                                        fill
                                        sizes="72px"
                                        className="object-contain p-1"
                                    />
                                </div>

                                <div className="flex min-w-0 flex-1 flex-col justify-between">
                                    <div>
                                        <div className="flex items-start justify-between gap-2">
                                            <Link
                                                href={`/product-preview/${item.product_handle || "milano-asymmetric-moto-jacket"}`}
                                                className="line-clamp-1 font-heading text-xs font-bold text-text-primary hover:text-primary sm:text-sm"
                                            >
                                                {item.title}
                                            </Link>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeLineItem(item.id)
                                                }
                                                aria-label={`Remove ${item.title}`}
                                                className="text-text-tertiary transition-colors hover:text-destructive"
                                            >
                                                <Trash2 className="size-3.5" />
                                            </button>
                                        </div>

                                        <p className="mt-0.5 text-[11px] font-medium text-text-secondary">
                                            Variant: {item.variant_title || "Obsidian Black / M"}
                                        </p>

                                        {hasCustom && (
                                            <div className="mt-1.5 flex flex-wrap gap-1">
                                                {meta.lining && (
                                                    <span className="inline-flex items-center gap-1 rounded bg-accent/15 px-1.5 py-0.5 text-[10px] font-semibold text-accent">
                                                        <Scissors className="size-2.5" />
                                                        Lining: {meta.lining}
                                                    </span>
                                                )}
                                                {meta.hardware && (
                                                    <span className="rounded bg-accent/15 px-1.5 py-0.5 text-[10px] font-semibold text-accent">
                                                        Hardware: {meta.hardware}
                                                    </span>
                                                )}
                                                {meta.monogram && (
                                                    <span className="rounded bg-primary/10 px-1.5 py-0.5 font-mono text-[10px] font-bold text-primary">
                                                        Monogram: &ldquo;{meta.monogram}&rdquo;
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-2.5 flex items-center justify-between">
                                        {/* Quantity Stepper */}
                                        <div className="inline-flex items-center rounded-lg border border-border bg-background">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    updateLineItemQuantity(
                                                        item.id,
                                                        Number(
                                                            item.quantity ?? 1,
                                                        ) - 1,
                                                    )
                                                }
                                                aria-label="Decrease quantity"
                                                className="px-2 py-1 text-text-secondary hover:text-text-primary"
                                            >
                                                <Minus className="size-3" />
                                            </button>
                                            <span className="min-w-6 text-center font-mono text-xs font-semibold tabular-nums">
                                                {item.quantity}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    updateLineItemQuantity(
                                                        item.id,
                                                        Number(
                                                            item.quantity ?? 1,
                                                        ) + 1,
                                                    )
                                                }
                                                aria-label="Increase quantity"
                                                className="px-2 py-1 text-text-secondary hover:text-text-primary"
                                            >
                                                <Plus className="size-3" />
                                            </button>
                                        </div>

                                        <div className="text-right">
                                            <span className="font-mono text-xs font-bold text-text-primary sm:text-sm tabular-nums">
                                                {convertToLocale({
                                                    amount:
                                                        Number(
                                                            item.unit_price ??
                                                                420,
                                                        ) *
                                                        Number(
                                                            item.quantity ?? 1,
                                                        ),
                                                    currency_code: currencyCode,
                                                })}
                                            </span>
                                            {Number(
                                                item.compare_at_unit_price ?? 0,
                                            ) >
                                                Number(
                                                    item.unit_price ?? 0,
                                                ) && (
                                                <s className="ml-1.5 font-mono text-[11px] text-price-original tabular-nums">
                                                    {convertToLocale({
                                                        amount:
                                                            Number(
                                                                item.compare_at_unit_price,
                                                            ) *
                                                            Number(
                                                                item.quantity ??
                                                                    1,
                                                            ),
                                                        currency_code:
                                                            currencyCode,
                                                    })}
                                                </s>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </li>
                        )
                    })}
                </ul>
            )}

            {/* Quick Companion Cross-Sell */}
            {items.length > 0 && items.length < 2 && (
                <div className="my-3 rounded-xl border border-border bg-background-secondary/50 p-3">
                    <div className="flex items-center justify-between gap-2">
                        <div className="min-w-0">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-accent">
                                Frequently Paired Together
                            </p>
                            <p className="truncate text-xs font-semibold text-text-primary">
                                {PREVIEW_RELATED_PRODUCTS[2].title}
                            </p>
                            <p className="font-mono text-[11px] text-text-secondary">
                                $340.00 • Full-Grain Tuscan Calfskin
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() =>
                                addProductToPreviewCart({
                                    product: PREVIEW_RELATED_PRODUCTS[2],
                                    variant:
                                        PREVIEW_RELATED_PRODUCTS[2]
                                            .variants?.[0] as any,
                                    quantity: 1,
                                })
                            }
                            className="shrink-0 rounded-lg border border-primary bg-surface px-2.5 py-1.5 text-[11px] font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                        >
                            + Add
                        </button>
                    </div>
                </div>
            )}

            {/* Promo / Atelier Privileges Code */}
            <div className="border-t border-divider pt-4">
                <label className="mb-1.5 flex items-center justify-between text-xs font-semibold text-text-secondary">
                    <span className="inline-flex items-center gap-1.5">
                        <Tag className="size-3.5 text-accent" />
                        Promo or Atelier Privilege Code
                    </span>
                    <div className="flex items-center gap-1">
                        {["VELLE10", "VIP20", "HERITAGE50"].map((sample) => (
                            <button
                                key={sample}
                                type="button"
                                onClick={() => handleApplyCode(sample)}
                                className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] font-semibold text-text-secondary hover:bg-accent/20 hover:text-accent"
                            >
                                {sample}
                            </button>
                        ))}
                    </div>
                </label>

                {promoCode ? (
                    <div className="flex items-center justify-between rounded-xl border border-success/40 bg-success-subtle/30 px-3 py-2 text-xs">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="size-4 text-success" />
                            <span className="font-mono font-bold text-text-primary">
                                {promoCode}
                            </span>
                            <span className="text-text-secondary">
                                ({promoDiscountPercent > 0 ? `${promoDiscountPercent}% off` : "$50 off"})
                            </span>
                        </div>
                        <button
                            type="button"
                            onClick={() => {
                                removePromoCode()
                                setPromoFeedback(null)
                            }}
                            className="text-xs font-semibold text-destructive hover:underline"
                        >
                            Remove
                        </button>
                    </div>
                ) : (
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={codeInput}
                            onChange={(e) =>
                                setCodeInput(e.target.value.toUpperCase())
                            }
                            placeholder="Enter code (e.g. VELLE10)"
                            data-testid="promo-code-input"
                            className="flex-1 rounded-xl border border-border bg-background px-3 py-2 font-mono text-xs uppercase text-text-primary focus:border-primary focus:outline-none"
                        />
                        <button
                            type="button"
                            onClick={() => handleApplyCode()}
                            data-testid="apply-promo-button"
                            className="rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary-hover"
                        >
                            Apply
                        </button>
                    </div>
                )}

                {promoFeedback && !promoCode && (
                    <p
                        className={`mt-1.5 text-[11px] font-medium ${
                            promoFeedback.ok ? "text-success" : "text-destructive"
                        }`}
                    >
                        {promoFeedback.msg}
                    </p>
                )}
            </div>

            {/* Itemized Totals */}
            <div className="mt-4 space-y-2.5 border-t border-divider pt-4 text-xs">
                <div className="flex justify-between text-text-secondary">
                    <span>Subtotal</span>
                    <span className="font-mono font-semibold text-text-primary tabular-nums">
                        {convertToLocale({
                            amount: Number(cart.item_subtotal ?? 420),
                            currency_code: currencyCode,
                        })}
                    </span>
                </div>

                {Number(cart.discount_total ?? 0) > 0 && (
                    <div className="flex justify-between font-medium text-success">
                        <span>Atelier Privilege Discount ({promoCode})</span>
                        <span className="font-mono tabular-nums">
                            -
                            {convertToLocale({
                                amount: Number(cart.discount_total ?? 0),
                                currency_code: currencyCode,
                            })}
                        </span>
                    </div>
                )}

                <div className="flex justify-between text-text-secondary">
                    <span>Insured Courier Delivery</span>
                    <span className="font-mono font-semibold text-text-primary tabular-nums">
                        {Number(cart.shipping_total ?? 0) === 0
                            ? "FREE"
                            : convertToLocale({
                                  amount: Number(cart.shipping_total ?? 0),
                                  currency_code: currencyCode,
                              })}
                    </span>
                </div>

                {giftWrap && (
                    <div className="flex justify-between text-text-secondary">
                        <span>Cedar Hanger & Wax-Sealed Gift Box</span>
                        <span className="font-mono font-semibold text-text-primary tabular-nums">
                            $15.00
                        </span>
                    </div>
                )}

                <div className="flex justify-between text-text-secondary">
                    <span>Estimated Duties & Taxes (Included/8%)</span>
                    <span className="font-mono font-semibold text-text-primary tabular-nums">
                        {convertToLocale({
                            amount: Number(cart.tax_total ?? 0),
                            currency_code: currencyCode,
                        })}
                    </span>
                </div>

                <div className="flex items-baseline justify-between border-t border-divider pt-3">
                    <div>
                        <span className="font-heading text-sm font-bold text-text-primary sm:text-base">
                            Total Due
                        </span>
                        <span className="ml-1.5 text-[11px] font-medium uppercase text-text-tertiary">
                            ({currencyCode.toUpperCase()})
                        </span>
                    </div>
                    <span
                        data-testid="checkout-total-amount"
                        className="font-heading text-xl font-bold text-price-current tabular-nums sm:text-2xl"
                    >
                        {convertToLocale({
                            amount: Number(cart.total ?? 420),
                            currency_code: currencyCode,
                        })}
                    </span>
                </div>

                <p className="text-right text-[11px] text-text-tertiary">
                    Or 4 interest-free payments of{" "}
                    <strong className="font-semibold text-text-secondary">
                        ${(Number(cart.total ?? 420) / 4).toFixed(2)}
                    </strong>{" "}
                    with Pay Later
                </p>
            </div>

            {/* Trust Guarantees */}
            <div className="mt-5 grid grid-cols-3 gap-2 rounded-xl border border-border bg-background-secondary/40 p-3 text-center text-[11px] text-text-secondary">
                <div className="flex flex-col items-center gap-1">
                    <Lock className="size-4 text-accent" />
                    <span className="font-medium">256-Bit SSL</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                    <ShieldCheck className="size-4 text-accent" />
                    <span className="font-medium">30-Day Returns</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                    <Truck className="size-4 text-accent" />
                    <span className="font-medium">Insured Air</span>
                </div>
            </div>
        </aside>
    )
}
