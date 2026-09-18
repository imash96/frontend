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