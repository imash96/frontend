"use client"

import type { StoreCart } from "@medusajs/types"
import { ChevronDown, ChevronUp, ShoppingBag } from "lucide-react"
import { useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { convertToLocale } from "@/lib/util/money"
import CheckDiscount from "../components/check-discount"
import CheckLineItem from "../components/check-line-item"

export default function CheckSummary({ cart }: { cart: StoreCart }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const {
    currency_code,
    total,
    subtotal,
    tax_total,
    discount_total,
    gift_card_total,
    shipping_subtotal,
  } = cart

  const itemCount =
    cart.items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0

  return (
    <div className="border border-border bg-background-elevated rounded-lg overflow-hidden">
      {/* Mobile toggle header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex lg:hidden items-center justify-between w-full p-3 sm:p-4 text-left"
        aria-expanded={isExpanded}
        aria-controls="check-summary-content"
      >
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
          <span className="font-semibold text-xs sm:text-sm">
            Order Summary ({itemCount} {itemCount === 1 ? "item" : "items"})
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm">
            {convertToLocale({ amount: total ?? 0, currency_code })}
          </span>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </div>
      </button>

      {/* Content - animated on mobile */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            id="check-summary-content"
            className="lg:hidden overflow-hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <SummaryContent
              cart={cart}
              currency_code={currency_code}
              subtotal={subtotal}
              shipping_subtotal={shipping_subtotal}
              tax_total={tax_total}
              discount_total={discount_total}
              gift_card_total={gift_card_total}
              total={total}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop always-visible (hidden on mobile to avoid duplicate) */}
      <div className="hidden lg:block">
        <SummaryContent
          cart={cart}
          currency_code={currency_code}
          subtotal={subtotal}
          shipping_subtotal={shipping_subtotal}
          tax_total={tax_total}
          discount_total={discount_total}
          gift_card_total={gift_card_total}
          total={total}
        />
      </div>
    </div>
  )
}

function SummaryContent({
  cart,
  currency_code,
  subtotal,
  shipping_subtotal,
  tax_total,
  discount_total,
  gift_card_total,
  total,
}: {
  cart: StoreCart
  currency_code: string
  subtotal?: number | null
  shipping_subtotal?: number | null
  tax_total?: number | null
  discount_total?: number | null
  gift_card_total?: number | null
  total?: number | null
}) {
  return (
    <div className="p-3 sm:p-4 lg:p-5 space-y-3 sm:space-y-4 lg:space-y-5">
      {/* Line items */}
      <div className="space-y-2.5 sm:space-y-3">
        {cart.items?.map((item) => (
          <CheckLineItem
            key={item.id}
            item={item}
            currency_code={currency_code}
          />
        ))}
      </div>

      <hr className="border-border" />

      {/* Discount input */}
      <CheckDiscount cart={cart} />

      <hr className="border-border" />

      {/* Totals */}
      <div className="space-y-2 sm:space-y-2.5 text-sm">
        <div className="flex items-center justify-between">
          <p className="text-foreground-muted">Subtotal</p>
          <p>
            {convertToLocale({ amount: subtotal ?? 0, currency_code })}
          </p>
        </div>

        {!!gift_card_total && (
          <div className="flex items-center justify-between">
            <p className="text-foreground-muted">Gift Card</p>
            <p className="text-green-600">
              −{" "}
              {convertToLocale({
                amount: gift_card_total ?? 0,
                currency_code,
              })}
            </p>
          </div>
        )}

        {!!discount_total && (
          <div className="flex items-center justify-between">
            <p className="text-foreground-muted">Discount</p>
            <p className="text-green-600">
              −{" "}
              {convertToLocale({
                amount: discount_total ?? 0,
                currency_code,
              })}
            </p>
          </div>
        )}

        <div className="flex items-center justify-between">
          <p className="text-foreground-muted">Shipping</p>
          <p>
            {shipping_subtotal === 0
              ? "Free"
              : convertToLocale({
                amount: shipping_subtotal ?? 0,
                currency_code,
              })}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-foreground-muted">Taxes</p>
          <p>
            {convertToLocale({ amount: tax_total ?? 0, currency_code })}
          </p>
        </div>

        <hr className="border-border" />

        <div className="flex items-center font-semibold text-base sm:text-lg justify-between pt-1">
          <p>Total</p>
          <p>
            {convertToLocale({ amount: total ?? 0, currency_code })}
          </p>
        </div>
      </div>
    </div>
  )
}
