import { StoreProduct } from "@medusajs/types";
import Breadcrumbs from "../components/breadcrumbs";
import { StarRating } from "../components/rating";
import ProductPrice from "../components/price";
import { TrustBadges } from "../components/trust-badge";
import { ProductCalculatedPrice } from "@/lib/util/get-product-price";

export default function productInfo({ product, initialPrice }: {
    product: StoreProduct;
    initialPrice: ProductCalculatedPrice
}) {
    const crumbs = product.categories?.map((c) => ({
        label: c.name,
        href: `/category/${c.handle}`,
    }))

    return (
        <div className="flex flex-col gap-y-2">
            {crumbs && <Breadcrumbs items={crumbs} />}
            <div className="space-y-1 mt-1">
                {/* <p className='text-accent font-bold uppercase text-sm tracking-wide'>
                    ✦ {product.collection?.title}
                </p> */}
                <h1 className='font-heading text-text-primary text-xl md:text-[26px] font-semibold tracking-tight leading-snug'>
                    {product.title}
                </h1>
            </div>
            <div className="flex items-center gap-4">
                <StarRating rating={48} count={247} />
                <span className="h-4 w-px bg-divider" />
                <span className="text-xs text-foreground-tertiary font-mono tracking-wider">
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

