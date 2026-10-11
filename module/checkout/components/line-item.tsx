import type { StoreCartLineItem } from "@medusajs/types"
import { convertToLocale } from "@/lib/util/money"
import { ProductThumbnailN as ProductThumbnail } from "@/module/products/components/product-thumbnail"

export default function CheckoutLineItem({ item, currency_code, }: CheckLineItemProps) {
    const subtotal = item.subtotal ?? 0
    const total = item.total ?? subtotal
    const discountTotal = item.discount_total ?? 0
    const hasDiscount = discountTotal > 0

    return (
        <div className="flex gap-3">
            <ProductThumbnail
                src={item.thumbnail}
                alt={item.title}
                width={300}
                height={400}
                className="w-12 sm:w-15 shrink-0 overflow-hidden rounded-md"
            />

            <div className="flex min-w-0 flex-1 items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                    <h3 className="line-clamp-2 text-sm leading-tight font-medium">
                        {item.title}
                    </h3>

                    <div className="mt-1 flex flex-col gap-x-2 text-xs text-foreground-tertiary">
                        {item.variant && (
                            <span>Variant: {item.variant.title}</span>
                        )}
                        <span>Qty: {item.quantity}</span>
                    </div>
                </div>

                <div className="shrink-0 text-right text-sm font-medium tabular-nums">
                    {hasDiscount && (
                        <div className="text-xs text-foreground-tertiary line-through">
                            {convertToLocale({
                                amount: subtotal,
                                currency_code,
                            })}
                        </div>
                    )}

                    <div className={hasDiscount ? "text-price-save" : undefined}>
                        {convertToLocale({
                            amount: total,
                            currency_code,
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}

type CheckLineItemProps = {
    item: StoreCartLineItem
    currency_code: string
}