import { fetchProductsByCollection } from "@/lib/action/product"
import { product_collections } from "@/data/collection"
import { ProductSectionClassic } from "../components/product-section-final"

// ─── New Arrival ──────────────────────────────────────────────────────────────

export async function NewArrival({ region_id }: { region_id: string }) {
    // FIX 1: try/catch — graceful degradation
    let products
    try {
        const collection = product_collections[12]
        products = await fetchProductsByCollection({
            regionId: region_id,
            collectionId: collection.id,
        })
        // FIX 3: hide section when no products
        if (!products?.length) return null

        return (
            <ProductSectionClassic
                title={collection.title}
                desc={(collection.metadata as any)?.description ?? ""}
                buttonLink={`/collection/${collection.handle}`}
                sectionName={collection.handle}
                products={products}
                eyebrow="Just Dropped"
            />
        )
    } catch {
        return null
    }
}

// ─── On Sale ──────────────────────────────────────────────────────────────────

export async function TrendingNow({ region_id }: { region_id: string }) {
    try {
        const collection = product_collections[9]
        const products = await fetchProductsByCollection({
            collectionId: collection.id,
            regionId: region_id,
        })
        if (!products?.length) return null

        return (
            <ProductSectionClassic
                title={collection.title}
                desc={(collection.metadata as any)?.description ?? ""}
                buttonLink={`/collection/${collection.handle}`}
                sectionName={collection.handle}
                products={products}
                eyebrow="Popular"
            />
        )
    } catch {
        return null
    }
}

// ─── Trending Now ─────────────────────────────────────────────────────────────

export async function OnSale({ region_id }: { region_id: string }) {
    try {
        const collection = product_collections[10]
        const products = await fetchProductsByCollection({
            regionId: region_id,
            collectionId: collection.id,
        })
        if (!products?.length) return null

        return (
            <ProductSectionClassic
                title={collection.title}
                desc={(collection.metadata as any)?.description ?? ""}
                buttonLink={`/collection/${collection.handle}`}
                sectionName={collection.handle}
                products={products}
                eyebrow="Most Loved"
            />
        )
    } catch {
        return null
    }
}