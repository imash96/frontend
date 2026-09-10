import { useProductStore } from '@/lib/store/use-product'

export default function ProductPrice() {
    const { cheapestPrice, variantPrice, selectedVariant } = useProductStore()

    const selectedPrice = selectedVariant ? variantPrice : cheapestPrice

    if (!selectedPrice)
        return (
            <div
                className="block w-32 h-9 bg-foreground-disabled animate-pulse rounded"
                aria-label="Loading price..."
            />
        );

    const isSale = selectedPrice.price_type === "sale";

    return (
        <div className="flex flex-col font-display mt-4">
            <div className="flex items-center gap-3">
                <span className={`text-3xl font-bold tracking-tight ${isSale ? "text-price-discount" : "text-price"}`}
                >
                    {selectedPrice.calculated_price}
                </span>

                {isSale && (
                    <span className="bg-badge-sale text-price text-xs font-semibold px-2 py-1 rounded-full"
                        aria-label={`Discount of ${selectedPrice.percentage_diff}%`}
                    >
                        SAVE {selectedPrice.percentage_diff}%
                    </span>
                )}
            </div>

            {isSale && (
                <div className="mt-1 text-sm flex items-center text-price-original gap-2">
                    <span>Original:</span>
                    <span className="line-through">
                        {selectedPrice.original_price}
                    </span>
                </div>
            )}
        </div>
    );
}