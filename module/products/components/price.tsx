"use client"

import { useProductStore } from "@/lib/store/use-product"
import { ProductCalculatedPrice } from "@/lib/util/get-product-price";

export default function ProductPrice({ fallback }: { fallback: ProductCalculatedPrice }) {
    const { cheapestPrice, variantPrice, selectedVariant } = useProductStore();
    const price = selectedVariant ? variantPrice : cheapestPrice ?? fallback

    if (!price) return <div className="h-9 w-36 animate-pulse rounded bg-muted" aria-label="Loading price" />

    const isSale = price.price_type === "sale"

    return (
        <div className="mb-1 flex flex-col gap-1">
            <div className="flex items-baseline gap-3 pb-1">
                <span className="text-2xl sm:text-3xl font-heading font-bold text-price-current tabular-nums">
                    {price.calculated_price}
                </span>
                {isSale && (
                    <>
                        <span className="text-base text-price-original line-through tabular-nums">
                            {price.original_price}
                        </span>
                        <span className="px-2 py-0.5 text-xs font-bold bg-badge-sale text-badge-sale-foreground rounded">
                            {price.percentage_diff}% OFF
                        </span>
                    </>
                )}
            </div>
            <p className="text-xs text-text-tertiary">Tax included. Shipping calculated at checkout.</p>
        </div>
    )
}

export function ProductPriceN({ fallback }: { fallback: ProductCalculatedPrice }) {
    const { cheapestPrice, variantPrice, selectedVariant } = useProductStore();
    const price = selectedVariant ? variantPrice : cheapestPrice ?? fallback

    if (!price) return <div className="h-9 w-36 animate-pulse rounded bg-muted" aria-label="Loading price" />

    const isSale = price.price_type === "sale"


    return (
        <div className="mb-1 flex flex-col gap-1" aria-live="polite" aria-atomic="true">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 pb-1">
                <span
                    className={`font-heading text-2xl font-bold tabular-nums sm:text-3xl ${isSale ? "text-price-sale" : "text-price-current"
                        }`}
                >
                    <span className="sr-only">{isSale ? "Sale price: " : "Price: "}</span>
                    {price.calculated_price}
                </span>
                {isSale && (
                    <>
                        <s className="text-base tabular-nums text-price-original">
                            <span className="sr-only">Original price: </span>
                            {price.original_price}
                        </s>
                        {price.percentage_diff && (
                            <span className="rounded bg-badge-sale px-2 py-0.5 text-xs font-bold text-badge-sale-foreground">
                                {price.percentage_diff}% off
                            </span>
                        )}
                    </>
                )}
            </div>
            <p className="text-xs text-text-tertiary">Tax included. Shipping calculated at checkout.</p>
        </div>
    )
}