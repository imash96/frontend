import { StoreProduct } from "@medusajs/types"
import { Heart, ShoppingBag } from "lucide-react"
import Link from "next/link"
import { memo } from "react"
import { getProductPrice } from "@/lib/util/get-product-price"
import { ProductThumbnailN as ProductThumbnail } from "@/module/products/components/product-thumbnail"
import RatingSystem from "./rating-system"

function ProductCard({ product }: { product: StoreProduct }) {
    const { cheapestPrice: price } = getProductPrice({ product })
    const isSale = price?.price_type === "sale"
    const hasPctBadge = isSale && !!price?.percentage_diff
    return (
        // FIX 3: entire card is a Link so the whole surface is clickable
        <article className="group relative w-full">
            <Link href={`/products/${product.handle}`} className="block" tabIndex={-1}>
                {/* ── Image ─────────────────────────────────────────────── */}
                {/* FIX 4: aspect-[3/4] reserves space → eliminates CLS */}
                <div className="relative aspect-3/4 overflow-hidden border border-border bg-white">
                    <ProductThumbnail
                        src={product.images}
                        alt={product.title}
                        sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                    />

                    {/* FIX 1+2: Sale badge - top-left, only when actually on sale */}
                    {isSale && (
                        <span className="absolute top-3 left-3 z-10 text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm bg-badge-sale text-badge-sale-foreground">
                            Sale
                        </span>
                    )}

                    {/* FIX 2: % badge - top-right, independent of sale badge */}
                    {hasPctBadge && (
                        <span className="absolute top-3 right-3 z-10 bg-destructive text-destructive-foreground text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm tabular-nums">
                            -{price.percentage_diff}%
                        </span>
                    )}

                    {/* Wishlist - below % badge when present */}
                    <button
                        aria-label={`Add ${product.title} to wishlist`}
                        className={`absolute z-10 size-8 flex items-center justify-center rounded-full backdrop-blur-md transition-all duration-200 active:scale-90 shadow-sm border border-white/60 bg-button-wishlist text-button-wishlist-foreground hover:bg-button-wishlist-hover opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 right-2.5 ${hasPctBadge ? "top-10" : "top-2.5"}`}
                    >
                        <Heart className="size-3.5" strokeWidth={1.75} />
                    </button>

                    {/* Quick-add overlay (desktop hover only) */}
                    <div
                        aria-hidden="true"
                        className="hidden sm:flex absolute bottom-0 inset-x-0 z-10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"
                    >
                        <span className="w-full flex items-center justify-center gap-2 bg-foreground backdrop-blur-sm text-background text-[11px] font-medium tracking-wider uppercase py-3.5 cursor-pointer hover:bg-foreground/90 transition-colors">
                            <ShoppingBag className="size-3.5" />
                            Quick Add
                        </span>
                    </div>
                </div>
            </Link>

            {/* ── Body ─────────────────────────────────────────────────── */}
            <div className="pt-3 pb-1 space-y-1.5">
                {product.categories?.[0] && (
                    <span className="text-[10px] font-medium uppercase tracking-widest text-text-secondary">
                        {product.categories[0].name}
                    </span>
                )}

                <Link href={`/products/${product.handle}`}>
                    <h3 className="line-clamp-2 text-[13px] font-medium leading-snug text-text-primary group-hover:text-primary transition-colors duration-200">
                        {product.title}
                    </h3>
                </Link>

                <RatingSystem averageRating={4.4} reviewCount={50} size="xs" />
                {/* TODO */}
                {/* {product.metadata?.average_rating && (
                    <RatingSystem
                        averageRating={Number(product.metadata.average_rating)}
                        reviewCount={Number(product.metadata.review_count ?? 0)}
                        size="xs"
                    />
                )} */}

                {/* Price row */}
                <div className="flex items-baseline gap-2 pt-0.5">
                    {isSale ? (
                        <>
                            <span className="text-sm font-semibold text-price-sale tabular-nums">
                                {price?.calculated_price}
                            </span>
                            {/* FIX 5: text-muted-foreground - better contrast for small text than original price color */}
                            <span className="text-xs font-normal text-muted-foreground line-through tabular-nums">
                                {price?.original_price}
                            </span>
                        </>
                    ) : (
                        <span className="text-sm font-semibold text-price-current tabular-nums">
                            {price?.calculated_price}
                        </span>
                    )}
                </div>
            </div>
        </article>
    )
}

export default memo(ProductCard)