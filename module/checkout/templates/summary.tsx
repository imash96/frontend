import { StoreCart } from "@medusajs/types";
import { convertToLocale } from "@/lib/util/money";
import Discount from "@/module/checkout/components/discount";
import CheckLineItem from "../components/line-item";
import { LockIcon, ShieldCheckIcon, TruckIcon, type LucideIcon } from "lucide-react"

export default function Summary({ cart }: { cart: StoreCart }) {
    const { currency_code, total, item_subtotal, tax_total, discount_total, gift_card_total, shipping_subtotal, } = cart
    return (
        <div className="space-y-5 rounded-2xl border border-border/60 bg-linear-to-br from-card to-background-secondary p-5 shadow-xl">
            <h2 className="font-heading text-lg font-bold text-text-primary">
                Order Summary
            </h2>
            {/* Cart items */}
            <div className="space-y-3">
                {cart.items?.map((item) => (
                    <CheckLineItem
                        key={item.id}
                        item={item}
                        currency_code={currency_code}
                    />
                ))}
            </div>

            {/* Price breakdown */}
            <div className="space-y-4 text-sm">
                <div className="flex justify-between text-text-secondary">
                    <span>Subtotal</span>
                    <span className="font-mono">
                        {convertToLocale({
                            amount: item_subtotal ?? 0,
                            currency_code,
                        })}
                    </span>
                </div>

                <div className="flex justify-between text-text-secondary">
                    <span>Courier Delivery</span>
                    <span className="font-mono">
                        {shipping_subtotal === 0
                            ? "FREE"
                            : convertToLocale({
                                amount: shipping_subtotal ?? 0,
                                currency_code,
                            })}
                    </span>
                </div>

                {discount_total > 0 && (
                    <div className="flex justify-between text-price-save">
                        <span>Promo</span>
                        <span>
                            -{convertToLocale({
                                amount: discount_total,
                                currency_code,
                            })}
                        </span>
                    </div>
                )}

                {gift_card_total > 0 && (
                    <div className="flex justify-between text-price-save">
                        <span>Gift card</span>
                        <span className="font-mono">
                            -{convertToLocale({
                                amount: gift_card_total,
                                currency_code,
                            })}
                        </span>
                    </div>
                )}

                <div className="flex justify-between text-text-secondary">
                    <span>Duties & Taxes</span>
                    <span className="font-mono">
                        {convertToLocale({
                            amount: tax_total ?? 0,
                            currency_code,
                        })}
                    </span>
                </div>

                <div className="h-px bg-divider" />
                <Discount promotions={cart.promotions} />
                <hr className="border-border" />

                <div className="flex justify-between text-xl font-bold text-text-primary">
                    <div className=""><span className="font-heading text-sm font-bold text-text-primary sm:text-base">Total</span><span className="ml-1.5 text-xs font-medium uppercase text-text-tertiary">({currency_code.toUpperCase()})</span></div>
                    <span className="font-mono">
                        {convertToLocale({
                            amount: total ?? 0,
                            currency_code,
                        })}
                    </span>
                </div>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-2 rounded-xl border border-border bg-background-secondary/40 p-3 text-center text-[11px] text-text-secondary">
                {BADGES.map(({ Icon, label }) => (
                    <TrustBadge key={label} icon={Icon}>
                        {label}
                    </TrustBadge>
                ))}
            </div>
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