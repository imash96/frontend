import { StoreCart } from "@medusajs/types";
import { convertToLocale } from "@/lib/util/money";
import Discount from "@/module/checkout/componenets/discount";
import CheckLineItem from "../componenets/line-item";

export default function Summary({ cart }: { cart: StoreCart }) {
    const { currency_code, total, item_subtotal, tax_total, discount_total, gift_card_total, shipping_subtotal, } = cart
    return (
        <div className="space-y-5 rounded-2xl border border-border/60 bg-linear-to-br from-card to-background-secondary p-5 shadow-xl">
            <h3 className="mb-4 text-lg font-semibold text-text-primary">Order summary</h3>
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
                    <span>
                        {convertToLocale({
                            amount: item_subtotal ?? 0,
                            currency_code,
                        })}
                    </span>
                </div>

                <div className="flex justify-between text-text-secondary">
                    <span>Shipping</span>
                    <span>
                        {shipping_subtotal === 0
                            ? "Free"
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
                        <span>
                            -{convertToLocale({
                                amount: gift_card_total,
                                currency_code,
                            })}
                        </span>
                    </div>
                )}

                <div className="flex justify-between text-text-secondary">
                    <span>Taxes</span>
                    <span>
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
                    <span>Total</span>
                    <span>
                        {convertToLocale({
                            amount: total ?? 0,
                            currency_code,
                        })}
                    </span>
                </div>
            </div>

            {/* Trust badges */}

        </div>
    )
}