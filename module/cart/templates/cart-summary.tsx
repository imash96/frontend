import type { StoreCart } from "@medusajs/types";
import { ArrowRight, Lock } from "lucide-react";
import { convertToLocale } from "@/lib/util/money";
import Button from "@/ui/button";
import DiscountCode from "../components/discount-code";

export default function CartSummary({ cart }: { cart: StoreCart }) {
  const {
    currency_code,
    total,
    subtotal,
    tax_total,
    discount_total,
    gift_card_total,
    shipping_subtotal,
  } = cart;

  return (
    <div className="space-y-5 py-6 px-5 lg:px-6 rounded-lg border border-border bg-surface shadow-sm">
      <h2 className="text-xl font-semibold text-foreground">Order Summary</h2>

      <div className="space-y-3 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-foreground-secondary">Subtotal</span>
          <span>
            {convertToLocale({ amount: subtotal ?? 0, currency_code })}
          </span>
        </div>

        {!!gift_card_total && (
          <div className="flex items-center justify-between">
            <span className="text-foreground-secondary">Gift Card</span>
            <span>
              -{convertToLocale({ amount: gift_card_total, currency_code })}
            </span>
          </div>
        )}

        {!!discount_total && (
          <div className="flex items-center justify-between text-price-save">
            <span>Discount</span>
            <span>
              -{convertToLocale({ amount: discount_total, currency_code })}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-foreground-secondary">Shipping</span>
          <span>
            {shipping_subtotal
              ? convertToLocale({ amount: shipping_subtotal, currency_code })
              : "Calculated at checkout"}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-foreground-secondary">Taxes</span>
          <span>{convertToLocale({ amount: tax_total ?? 0, currency_code })}</span>
        </div>
      </div>

      <hr className="border-divider" />

      <DiscountCode promotions={cart.promotions} />

      <hr className="border-divider" />

      <div className="flex items-center justify-between text-base font-semibold text-foreground">
        <span>Total</span>
        <span>{convertToLocale({ amount: total ?? 0, currency_code })}</span>
      </div>

      <Button
        href="/checkout"
        size="lg"
        fullWidth
        icon={<ArrowRight className="w-4 h-4" />}
        iconPosition="right"
        className="uppercase tracking-wide"
      >
        Proceed to Checkout
      </Button>

      <p className="flex items-center justify-center gap-1.5 text-xs text-foreground-tertiary">
        <Lock className="w-3 h-3" />
        Secure checkout
      </p>
    </div>
  );
}