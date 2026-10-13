
import type { ReactNode } from "react";
import type { StoreCart } from "@medusajs/types";
import { ArrowRight, BadgePercentIcon, LockIcon, ShieldCheckIcon, } from "lucide-react";
import { div as MotionDiv } from "motion/react-client";
import { convertToLocale } from "@/lib/util/money";
import Button from "@/ui/button";
import DiscountCode from "@/module/checkout/components/discount";

type CartSummaryProps = {
  cart: StoreCart;
};

const ROW_TRANSITION = {
  type: "spring",
  stiffness: 380,
  damping: 32,
} as const;

export default function CartSummary({ cart }: CartSummaryProps) {
  const { currency_code, total, subtotal, tax_total, discount_total, gift_card_total, shipping_subtotal, shipping_methods, items, promotions, } = cart;

  const discount = discount_total ?? 0;
  const giftCard = gift_card_total ?? 0;
  const hasShipping = (shipping_methods?.length ?? 0) > 0;

  const formatMoney = (amount: number | null | undefined) =>
    convertToLocale({
      amount: amount ?? 0,
      currency_code,
    });

  return (
    <section className="space-y-4 rounded-2xl border border-border/60 bg-linear-to-br from-card to-background-secondary p-4 shadow-sm sm:space-y-5 sm:p-5 lg:p-6">
      <h2 className="font-heading text-base font-semibold tracking-wide text-foreground uppercase sm:text-lg">
        Order summary
      </h2>

      {/* Discount code */}
      <div className="border-y border-border/60 py-3 sm:py-4">
        <DiscountCode promotions={promotions ?? []} />
      </div>

      {/* Price breakdown */}
      <dl className="space-y-2.5 text-sm">
        <Row label="Subtotal">
          {formatMoney(subtotal)}
        </Row>

        {discount > 0 && (
          <Row
            label="Discount"
            animateIn
            className="text-price-save"
          >
            −{formatMoney(discount)}
          </Row>
        )}

        {giftCard > 0 && (
          <Row
            label="Gift card"
            animateIn
            className="text-price-save"
          >
            −{formatMoney(giftCard)}
          </Row>
        )}

        <Row label="Shipping">
          {!hasShipping ? (
            <span className="text-right text-text-tertiary">
              Calculated at checkout
            </span>
          ) : shipping_subtotal == null ? (
            <span className="text-right text-text-tertiary">
              Calculating…
            </span>
          ) : shipping_subtotal === 0 ? (
            <span className="font-medium text-price-save">
              Free
            </span>
          ) : (
            formatMoney(shipping_subtotal)
          )}
        </Row>

        <Row label="Taxes">
          {formatMoney(tax_total)}
        </Row>
      </dl>

      {/* Grand total */}
      <MotionDiv
        layout="position"
        transition={ROW_TRANSITION}
        className="flex items-baseline justify-between gap-3 border-t border-border/60 pt-4"
      >
        <div className="min-w-0">
          <span className="text-base font-semibold text-text-primary">
            Total
          </span>
          <span className="ml-1.5 text-[10px] uppercase tracking-wider text-text-tertiary sm:text-xs">
            ({currency_code.toUpperCase()})
          </span>
        </div>

        <MotionDiv
          layout="position"
          transition={ROW_TRANSITION}
          className="shrink-0 text-right font-heading text-xl font-bold tabular-nums text-price-current sm:text-2xl"
        >
          {formatMoney(total)}
        </MotionDiv>
      </MotionDiv>

      {/* Savings message */}
      {discount > 0 && (
        <MotionDiv
          layout="position"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="flex items-start gap-2 rounded-lg bg-success-subtle px-3 py-2.5 text-xs leading-5 font-medium text-success sm:text-sm"
        >
          <BadgePercentIcon
            aria-hidden="true"
            className="mt-0.5 size-4 shrink-0"
          />
          <p>
            You&apos;re saving{" "}
            <span className="font-semibold tabular-nums">
              {formatMoney(discount)}
            </span>{" "}
            on this order.
          </p>
        </MotionDiv>
      )}

      {/* Proceed to checkout */}
      <Button
        href="/checkout"
        size="lg"
        fullWidth
        icon={<ArrowRight className="size-4" />}
        iconPosition="right"
        className="uppercase tracking-wide"
      >
        Proceed to Checkout
      </Button>

      {/* Security reassurance */}
      <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-xs text-text-tertiary">
        <span className="flex items-center gap-1.5">
          <LockIcon
            aria-hidden="true"
            className="size-3.5 shrink-0"
          />
          Secure checkout
        </span>

        <span
          aria-hidden="true"
          className="hidden h-3 w-px bg-divider sm:block"
        />

        <span className="flex items-center gap-1.5">
          <ShieldCheckIcon
            aria-hidden="true"
            className="size-3.5 shrink-0"
          />
          Genuine leather
        </span>
      </div>
    </section>
  );
}

type RowProps = {
  label: string;
  children: ReactNode;
  className?: string;
  animateIn?: boolean;
};

function Row({ label, children, className = "text-text-secondary", animateIn = false, }: RowProps) {
  return (
    <MotionDiv
      layout="position"
      initial={animateIn ? { opacity: 0, y: 4 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={ROW_TRANSITION}
      className={`flex items-baseline justify-between gap-3 ${className}`}
    >
      <dt className="min-w-0">{label}</dt>
      <dd className="shrink-0 text-right tabular-nums">
        {children}
      </dd>
    </MotionDiv>
  );
}