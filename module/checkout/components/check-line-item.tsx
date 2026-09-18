import type { StoreCartLineItem } from "@medusajs/types"
import { convertToLocale } from "@/lib/util/money"
import ProductThumbnail from "@/module/products/components/product-thumbnail"

export default function CheckLineItem({
  item,
  currency_code,
}: CheckLineItemProps) {
  const adjustmentsSum = (item.adjustments || []).reduce(
    (acc, adjustment) => adjustment.amount + acc,
    0,
  )
  const currentPrice = item.total! - adjustmentsSum
  const hasDiscount = adjustmentsSum > 0

  return (
    <div className="flex gap-x-2 sm:gap-x-3">
      {/* Product Image */}
      <ProductThumbnail
        src={item.thumbnail}
        alt={item.title}
        width={300}
        height={400}
        className="shrink-0 w-12 sm:w-15 rounded-md overflow-hidden"
      />

      {/* Product Details */}
      <div className="flex flex-1 min-w-0 gap-y-0.5 sm:gap-y-1">
        <div className="flex-1 min-w-0">
          <h3 className="text-xs sm:text-sm leading-tight line-clamp-2 font-medium">
            {item.title}
          </h3>
          <div className="text-[10px] sm:text-xs text-foreground-muted mt-0.5">
            {item.variant && <span>Variant: {item.variant?.title}</span>}
            <span className="ml-2">Qty: {item.quantity}</span>
          </div>
        </div>
        <div className="text-xs sm:text-sm font-medium shrink-0 ml-2 text-right">
          {hasDiscount && (
            <span className="line-through text-foreground-muted text-[10px] sm:text-xs block">
              {convertToLocale({
                amount: item.total!,
                currency_code,
              })}
            </span>
          )}
          <span className={hasDiscount ? "text-green-600" : ""}>
            {convertToLocale({
              amount: currentPrice,
              currency_code,
            })}
          </span>
        </div>
      </div>
    </div>
  )
}

type CheckLineItemProps = {
  item: StoreCartLineItem
  currency_code: string
}
