import { StoreProduct } from "@medusajs/types"
import type { Route } from "next"
import SectionHeader from "./section-header"
import Button from "@/ui/button"
import ProductCard from "@/ui/product-card"
import { ArrowRight } from "lucide-react"

type ProductSectionProps = {
    products: StoreProduct[]
    title: string
    subTitle?: string
    desc: string
    sectionName: string
    buttonLink: string
    buttonText?: string
    /** Show as horizontal scroll on mobile (default: true) */
    mobileScroll?: boolean
}

/**
 * ProductSection
 * ──────────────
 * Reusable product grid used by NewArrivals, TrendingNow, OnSale, etc.
 *
 * Desktop (lg+): 6-column grid.
 * Tablet (md):   3-column grid.
 * Mobile:        Horizontal scroll strip showing 2 cards + peek, OR
 *                a 2-column grid (controlled by `mobileScroll` prop).
 *
 * Renders max 6 products.
 */
export default function ProductSection({
    products,
    title,
    desc,
    sectionName,
    buttonText = "View all",
    buttonLink,
    mobileScroll = true,
}: ProductSectionProps) {
    const displayProducts = products?.slice(0, 6) ?? []

    return (
        <SectionHeader
            title={title}
            desc={desc}
            sectionName={sectionName}
            action={
                <Button
                    href={buttonLink as Route}
                    variant="outline"
                    icon={<ArrowRight className="size-3.5" aria-hidden />}
                    iconPosition="right"
                    className="hidden sm:inline-flex"
                >
                    {buttonText}
                </Button>
            }
        >
            {/* ── Product grid ──────────────────────────────────────── */}
            {mobileScroll ? (
                <>
                    {/* Mobile: horizontal scroll strip */}
                    <div className="md:hidden -mx-4 sm:-mx-6 px-4 sm:px-6">
                        <div
                            className="flex gap-3 overflow-x-auto no-scrollbar pb-1"
                            aria-label={`${title} products`}
                        >
                            {displayProducts.map((product) => (
                                <div
                                    key={product.id}
                                    className="shrink-0 w-[46vw] max-w-50"
                                >
                                    <ProductCard product={product} />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Tablet / Desktop: standard grid */}
                    <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {displayProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </>
            ) : (
                /* Static 2-col mobile grid variant */
                <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6 md:gap-4">
                    {displayProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}

            {/* CTA — mobile shows below grid, desktop shows in header via `action` */}
            <div className="flex justify-center sm:hidden mt-2">
                <Button
                    href={buttonLink as Route}
                    variant="outline"
                    icon={<ArrowRight className="size-3.5" aria-hidden />}
                    iconPosition="right"
                >
                    {buttonText}
                </Button>
            </div>
        </SectionHeader>
    )
}