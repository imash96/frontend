import type { StoreCart } from "@medusajs/types"
import { BadgePercentIcon, LockIcon, ShieldCheckIcon, TruckIcon, type LucideIcon, } from "lucide-react"
import { convertToLocale } from "@/lib/util/money"
import CheckoutLineItem from "../components/line-item"
import DiscountCode from "../components/discount"
import SummaryAccordion from "../components/summary-button"

/** Plays when a row mounts, so it fires the moment a discount appears. */
const ENTER = "animate-[fade-in-up_0.35s_var(--ease-out-quart)_both]"

export default function CheckoutSummary({ cart }: { cart: StoreCart }) {
    const { currency_code, total, subtotal, tax_total, shipping_subtotal, discount_total, gift_card_total, shipping_methods, items, promotions } = cart
    const hasShipping = (shipping_methods?.length ?? 0) > 0

    return (
        <SummaryAccordion title="Order summary">
            <div className="space-y-5 p-5 lg:p-6">
                <ul role="list" className="max-h-64 space-y-4 overflow-y-auto py-2 pr-1">
                    {cart.items?.map((item) => (
                        <CheckoutLineItem key={item.id} item={item} currency_code={currency_code} />
                    ))}
                </ul>

                <div className="border-y border-border/60 py-4">
                    <DiscountCode promotions={cart.promotions} />
                </div>

                <dl className="space-y-2.5 text-sm">
                    <Row label="Subtotal">{convertToLocale({ amount: subtotal ?? 0, currency_code })}</Row>

                    {discount_total > 0 && (
                        <Row label="Discount" className={`${ENTER} text-price-save`}>
                            −{convertToLocale({ amount: discount_total ?? 0, currency_code })}
                        </Row>
                    )}

                    {gift_card_total > 0 && (
                        <Row label="Gift card" className={`${ENTER} text-price-save`}>
                            −{convertToLocale({ amount: gift_card_total ?? 0, currency_code })}
                        </Row>
                    )}

                    <Row label="Shipping">
                        {!hasShipping ? (
                            <span className="text-text-tertiary">Calculated at next step</span>
                        ) : shipping_subtotal ? (
                            convertToLocale({ amount: shipping_subtotal ?? 0, currency_code })
                        ) : (
                            <span className="font-medium text-price-save">Free</span>
                        )}
                    </Row>

                    <Row label="Taxes">{convertToLocale({ amount: tax_total ?? 0, currency_code })}</Row>
                </dl>

                <div className="flex items-baseline justify-between border-t border-border/60 pt-4">
                    <span className="text-right">
                        <span className="text-base font-semibold text-text-primary">Total</span>
                        <span className="ml-1.5 text-xs uppercase tracking-wider text-text-tertiary">
                            ({currency_code.toUpperCase()})
                        </span>
                    </span>
                    <span className="font-heading text-2xl font-bold tabular-nums text-text-primary">
                        {convertToLocale({ amount: total ?? 0, currency_code })}
                    </span>
                </div>

                {discount_total > 0 && (
                    <p
                        className={`${ENTER} flex items-center gap-2 rounded-lg bg-success-subtle px-3 py-2 text-xs font-medium text-success`}
                    >
                        <BadgePercentIcon className="size-4 shrink-0" aria-hidden />
                        You&apos;re saving {convertToLocale({ amount: discount_total ?? 0, currency_code })} on this order
                    </p>
                )}
                <div className="mt-5 grid grid-cols-3 gap-2 rounded-xl border border-border bg-background-secondary/40 p-3 text-center text-[11px] text-text-secondary">
                    {BADGES.map(({ Icon, label }) => (
                        <TrustBadge key={label} icon={Icon}>
                            {label}
                        </TrustBadge>
                    ))}
                </div>
            </div>
        </SummaryAccordion>
    )
}

function Row({ label, className = "text-text-secondary", children, }: { label: string; className?: string } & React.PropsWithChildren) {
    return (
        <div className={`flex items-baseline justify-between gap-4 ${className}`}>
            <dt>{label}</dt>
            <dd className="tabular-nums">{children}</dd>
        </div>
    )
}

export function TrustBadge({ icon: Icon, children }: { icon: LucideIcon; children: React.ReactNode }) {
    return (
        <div className="flex flex-col items-center gap-1">
            <Icon aria-hidden="true" className="size-4 shrink-0 text-accent" />
            <span>{children}</span>
        </div>
    )
}

const BADGES = [
    { Icon: LockIcon, label: "Encrypted checkout" },
    { Icon: ShieldCheckIcon, label: "Insured delivery" },
    { Icon: TruckIcon, label: "Tracked shipping" },
] as const satisfies readonly Badge[]

type Badge = { Icon: LucideIcon; label: string }