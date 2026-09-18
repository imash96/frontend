import type { StoreProduct, StoreProductListParams, StoreRegion } from "@medusajs/types"
import { listProducts } from "@/lib/action/product"
import ProductCard from "@/ui/product-card"
import SectionHeader from "@/module/home/components/section-header"

export default async function RelatedProducts({ product, region }: RelatedProductsProps) {
    const queryParams: StoreProductListParams = {
        region_id: region.id,
        limit: 6,
        fields: "id,handle,title,*images,*variants.calculated_price,*categories",
    }

    if (product.collection_id) {
        queryParams.collection_id = [product.collection_id]
    }
    if (product.tags) {
        queryParams.tag_id = product.tags.map((t) => t.id).filter(Boolean) as string[]
    }

    const products = await listProducts({
        queryParams,
        regionId: region.id,
    }).then(({ response }) => response.products.filter((p) => p.id !== product.id).slice(0, 6))

    if (!products.length) return null

    return (
        <SectionHeader
            sectionName="related-product"
            title="You May Also Like"
            desc="Pieces chosen to sit alongside this one."
            eyebrow="Complete the look"
            align="center"
        >
            <ul className="grid grid-cols-2 gap-3 gap-y-5 md:grid-cols-4 lg:grid-cols-6 lg:gap-y-6">
                {products.map((related) => (
                    <li key={related.id}>
                        <ProductCard product={related} />
                    </li>
                ))}
            </ul>
        </SectionHeader>
    )
}

type RelatedProductsProps = {
    product: StoreProduct
    region: StoreRegion
}
