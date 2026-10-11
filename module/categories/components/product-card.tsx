"use client"

import { StoreProduct } from "@medusajs/types"
import { Heart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { convertToLocale } from "@/lib/util/money"

export default function ProductCard({
    product,
    priority = false,
}: {
    product: StoreProduct
    priority?: boolean
}) {
    const variant = product.variants?.[0]
    const price = variant?.calculated_price
    const firstImg = product.thumbnail ?? product.images?.[0]?.url
    const secondImg = product.images?.[1]?.url

    // Calculate discount percentage
    const hasDiscount =
        price?.original_amount &&
        price.original_amount > (price.calculated_amount ?? 0)
    const discountPct = hasDiscount
        ? Math.round(
            ((price.original_amount! - (price.calculated_amount ?? 0)) /
                price.original_amount!) *
            100,
        )
        : 0

    return (
        <Link
            href={`/products/${product.handle}`}
            className="group block relative"
        >
            {/* Image Container */}
            <div className="relative overflow-hidden mb-3 sm:mb-4 aspect-3/4 bg-white">
                {firstImg && (
                    <Image
                        src={firstImg}
                        alt={product.title}
                        fill
                        sizes="(max-width:480px) 100vw, (max-width:768px) 50vw, (max-width:1024px) 33vw, 25vw"
                        className={`object-contain transition-all duration-700 ease-out ${secondImg ? "group-hover:opacity-0 group-hover:scale-105" : "group-hover:scale-[1.06]"}`}
                        priority={priority}
                    />
                )}

                {secondImg && (
                    <Image
                        src={secondImg}
                        alt=""
                        fill
                        sizes="(max-width:480px) 100vw, (max-width:768px) 50vw, (max-width:1024px) 33vw, 25vw"
                        className="object-contain opacity-0 group-hover:opacity-100 transition-all duration-700 ease-out scale-105 group-hover:scale-100"
                        loading="lazy"
                    />
                )}

                {/* Discount Badge */}
                {hasDiscount && discountPct > 0 && (
                    <span className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 px-2 py-0.5 text-[10px] sm:text-xs font-semibold bg-red-600 text-white rounded-md tracking-wide">
                        -{discountPct}%
                    </span>
                )}

                {/* Wishlist */}
                <button
                    className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white/80 dark:bg-black/50 backdrop-blur-md text-text-primary hover:bg-white dark:hover:bg-black/70 hover:scale-110 active:scale-95 shadow-sm"
                    aria-label={`Add ${product.title} to wishlist`}
                    onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                    }}
                >
                    <Heart className="size-3.5 sm:size-4" strokeWidth={1.5} />
                </button>

                {/* Quick view overlay */}
                <div className="absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </div>

            {/* Product Info */}
            <div className="space-y-1 sm:space-y-1.5 px-0.5">
                {/* Collection / Category tag */}
                <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.08em] text-text-tertiary truncate font-medium">
                    {product.collection?.title ??
                        product.categories?.[0]?.name ??
                        ""}
                </p>

                {/* Title */}
                <h3 className="text-xs sm:text-sm font-medium text-text-primary leading-snug line-clamp-2 group-hover:text-primary transition-colors duration-200">
                    {product.title}
                </h3>

                {/* Price */}
                {price && (
                    <div className="flex items-baseline gap-2 pt-0.5">
                        <span
                            className={`text-sm sm:text-base font-semibold ${hasDiscount
                                ? "text-destructive"
                                : "text-text-primary"
                                }`}
                        >
                            {convertToLocale({
                                amount: price.calculated_amount ?? 0,
                                currency_code: price.currency_code ?? "usd",
                            })}
                        </span>

                        {hasDiscount && (
                            <span className="text-xs line-through text-text-tertiary">
                                {convertToLocale({
                                    amount: price.original_amount!,
                                    currency_code:
                                        price.currency_code ?? "usd",
                                })}
                            </span>
                        )}
                    </div>
                )}
            </div>
        </Link>
    )
}