import { StoreProduct } from "@medusajs/types"
import Breadcrumbs from "../components/breadcrumbs"
import RatingSystem from "@/ui/rating-system"
import ProductPrice from "../components/price"
import { TrustBadges } from "../components/trust-badge"
import { ProductCalculatedPrice } from "@/lib/util/get-product-price"

export default function ProductInfo({ product, initialPrice, }: {
    product: StoreProduct
    initialPrice: ProductCalculatedPrice
}) {
    const crumbs = product.categories?.map((c) => ({
        label: c.name,
        href: `/category/${c.handle}`,
    }))

    return (
        <div className="flex flex-col gap-y-3">
            {crumbs && crumbs.length > 0 && <Breadcrumbs items={crumbs} />}
            <div className="space-y-1.5">
                {product.collection?.title && (
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">
                        {product.collection.title}
                    </p>
                )}
                <h1 className="font-heading text-xl font-semibold leading-snug tracking-tight text-text-primary md:text-[26px] text-pretty">
                    {product.title}
                </h1>
                {product.subtitle && (
                    <p className="text-sm font-light leading-relaxed text-text-secondary">
                        {product.subtitle}
                    </p>
                )}
            </div>
            <div className="flex flex-wrap items-center gap-3">
                <a href="#reviews" className="transition-opacity hover:opacity-80">
                    <RatingSystem averageRating={4.8} reviewCount={247} size="md" />
                </a>
                <span className="h-4 w-px bg-divider" aria-hidden />
                <span className="font-mono text-[11px] tracking-wider text-text-tertiary">
                    {product.mid_code}
                </span>
            </div>
            <ProductPrice fallback={initialPrice} />
            <div className="h-px bg-divider" />
            <TrustBadges />
            <div className="h-px bg-divider" />
        </div>
    )
}
