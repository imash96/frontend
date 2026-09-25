import { StoreProduct } from "@medusajs/types"
import Link from "next/link"
import { ProductCalculatedPrice } from "@/lib/util/get-product-price"
import RatingSystem from "@/ui/rating-system"
import Breadcrumbs from "../components/breadcrumbs"
import ProductPrice from "../components/price"
import { TrustBadges } from "../components/trust-badge"

export default function ProductInfo({ product, initialPrice, }: {
    product: StoreProduct
    initialPrice: ProductCalculatedPrice
}) {
    const crumbs = product.categories?.map((c) => ({
        label: c.name,
        href: `/categories/${c.handle}`,
    }))

    const typeName = (product as any).type?.value as string | undefined
    const hasMidCode = Boolean(product.mid_code?.trim())
    const tags = (product as any).tags as { id: string; value: string }[] | undefined

    return (
        <div className="flex flex-col gap-y-3">
            {crumbs && crumbs.length > 0 && <Breadcrumbs items={crumbs} />}
            <div className="space-y-1.5">
                {(product.collection?.title || typeName) && (
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">
                        {product.collection?.title}
                        {product.collection?.title && typeName && (
                            <span className="mx-1.5 text-border-strong" aria-hidden>·</span>
                        )}
                        {typeName}
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
                <Link href="#reviews" className="transition-opacity hover:opacity-80">
                    <RatingSystem averageRating={4.8} reviewCount={247} size="md" />
                </Link>
                {hasMidCode && (
                    <>
                        <span className="h-4 w-px bg-divider" aria-hidden />
                        <span className="font-mono text-[11px] tracking-wider text-text-tertiary">
                            {product.mid_code}
                        </span>
                    </>
                )}
            </div>
            {/* {tags && tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                    {tags.map((tag) => (
                        <span
                            key={tag.id}
                            className="inline-block rounded-full bg-muted px-2.5 py-0.5 text-[10px] font-medium tracking-wide text-text-tertiary"
                        >
                            {tag.value}
                        </span>
                    ))}
                </div>
            )} */}
            <ProductPrice fallback={initialPrice} />
            <div className="h-px bg-divider" />
            <TrustBadges />
            <div className="h-px bg-divider" />
        </div>
    )
}
