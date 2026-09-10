import type { StoreCart } from "@medusajs/types";
import { convertToLocale } from "@/lib/util/money";
import CheckoutLineItem from "../components/line-item";

export default function CheckoutSummary({ cart }: { cart: StoreCart }) {
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
    <div className="border border-border bg-background-elevated rounded-lg space-y-5 p-5">
      <div className="space-y-2">
        {cart.items?.map((item, index) => (
          <CheckoutLineItem
            key={index}
            item={item}
            currency_code={currency_code}
          />
        ))}
      </div>
      <hr />
      <div className="space-y-4 text-sm">
        <div className="flex items-center justify-between">
          <p className="">Subtotal</p>
          <p className="text-foreground-muted">
            {convertToLocale({ amount: subtotal ?? 0, currency_code })}
          </p>
        </div>
        {!!gift_card_total && (
          <div className="flex items-center justify-between">
            <p className="">Gift Card</p>
            <p className="text-foreground-muted">
              {convertToLocale({ amount: gift_card_total ?? 0, currency_code })}
            </p>
          </div>
        )}
        {!!discount_total && (
          <div className="flex items-center justify-between">
            <p className="">Discount</p>
            <p className="text-foreground-muted">
              {convertToLocale({ amount: discount_total ?? 0, currency_code })}
            </p>
          </div>
        )}
        <div className="flex items-center justify-between">
          <p className="">Shipping</p>
          <p className="text-foreground-muted">
            {convertToLocale({ amount: shipping_subtotal ?? 0, currency_code })}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <p className="">Taxes</p>
          <p className="text-foreground-muted">
            {convertToLocale({ amount: tax_total ?? 0, currency_code })}
          </p>
        </div>
        <hr />
        <div className="flex items-center font-medium text-lg justify-between">
          <p>Total</p>
          <p>{convertToLocale({ amount: total ?? 0, currency_code })}</p>
        </div>
      </div>
    </div>
  );
};
