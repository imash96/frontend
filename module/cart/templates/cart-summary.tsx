import type { StoreCart } from "@medusajs/types";
import { ArrowRight, Lock, Shield } from "lucide-react";
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
          <span className="text-text-secondary">Subtotal</span>
          <span className="tabular-nums text-text-primary">
            {convertToLocale({ amount: subtotal ?? 0, currency_code })}
          </span>
        </div>

        {!!gift_card_total && (
          <div className="flex items-center justify-between">
            <span className="text-text-secondary">Gift Card</span>
            <span className="tabular-nums text-text-primary">
              -{convertToLocale({ amount: gift_card_total, currency_code })}
            </span>
          </div>
        )}

        {!!discount_total && (
          <div className="flex items-center justify-between">
            <span className="text-text-secondary">Discount</span>
            <span className="tabular-nums text-success">
              -{convertToLocale({ amount: discount_total, currency_code })}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-text-secondary">Shipping</span>
          <span className="tabular-nums text-text-primary">
            {shipping_subtotal ? convertToLocale({ amount: shipping_subtotal, currency_code }) : "Calculated at checkout"}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-text-secondary">Taxes</span>
          <span className="tabular-nums text-text-primary">
            {convertToLocale({ amount: tax_total ?? 0, currency_code })}
          </span>
        </div>
      </div>

      <hr className="border-divider" />

      <DiscountCode promotions={cart.promotions} />

      <hr className="border-divider" />

      <div className="flex items-baseline justify-between">
        <span className="font-heading text-base font-semibold text-text-primary">Total</span>
        <span className="font-heading text-2xl font-bold tabular-nums text-price-current">
          {convertToLocale({ amount: total ?? 0, currency_code })}
        </span>
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

      <div className="flex items-center justify-center gap-3 text-xs text-text-tertiary">
        <span className="flex items-center gap-1">
          <Lock className="size-3.5" />
          Secure checkout
        </span>
        <span className="h-3 w-px bg-divider" />
        <span className="flex items-center gap-1">
          <Shield className="size-3.5" />
          Genuine leather
        </span>
      </div>
    </div>
  );
}