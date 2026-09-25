import { cookies } from "next/headers"
import { notFound } from "next/navigation"
import { Suspense } from "react"
import { getCollectionByHandle } from "@/lib/action/collections"
import { listProducts } from "@/lib/action/product"
import { baseURL, PRODUCTS_PER_PAGE } from "@/lib/constant"
import CategoryHero from "@/module/categories/templates/category-hero"
import ProductGrid from "@/module/categories/templates/product-grid"
import JsonLd from "@/module/products/templates/json-ld"
import ProductGridSkeleton from "@/module/skeleton/product-grid"
import Container from "@/ui/container"
import type { SearchParams } from "../../categories/[...handle]/page"

export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }) {
    const { handle } = await params
    const collection = await getCollectionByHandle(handle)

    if (!collection) {
        return {
            title: "Collection Not Found | Velle Hide",
        }
    }

    return {
        title: `${collection.title} Collection | Velle Hide`,
        description: collection.metadata?.description as string || `Shop our premium ${collection.title.toLowerCase()} leather collection at Velle Hide.`,
        alternates: {
            canonical: `${baseURL}/collections/${handle}`,
        },
    }
}

/* Opt out of instant navigation — this route reads searchParams + cookies */
export const instant = false

export default async function Page({ params, searchParams, }: PageProps<"/collections/[handle]">) {
    const { handle } = await params

    const collection = await getCollectionByHandle(handle)
    if (!collection) notFound()
    const sp = (await searchParams) as SearchParams

    // ── Parse query params ──
    const pageParam = Math.max(1, parseInt(sp.page ?? "1", 10))
    const countryCode = (await cookies()).get("__country_code")?.value || process.env.NEXT_PUBLIC_DEFAULT_REGION || "us"

    const { response: { products, count }, queryParams, } = await listProducts({
        pageParam,
        queryParams: {
            collection_id: collection.id,
            limit: PRODUCTS_PER_PAGE,
            fields: "id,handle,title,*images,*variants.calculated_price",
        },
        countryCode,
    })

    const totalPages = Math.ceil(count / (queryParams?.limit ?? PRODUCTS_PER_PAGE))

    // ── JSON-LD structured data ──
    const collectionJsonLd = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: collection.title,
        description: collection.metadata?.description as string || `Shop our premium ${collection.title.toLowerCase()} leather collection at Velle Hide.`,
        url: `${baseURL}/collections/${handle}`,
        numberOfItems: count, ...(collection.metadata?.thumbnail ? { image: collection.metadata.thumbnail as string } : {}),
    }

    return (
        <div className="min-h-screen">
            {/* Structured Data */}
            <JsonLd data={collectionJsonLd} />
            {/* Hero */}
            <CategoryHero
                name={collection.title}
                desc={collection.metadata?.description as string || ""}
            />
            {/* Product Grid */}
            <Container size="2xl" className="py-8 sm:py-12 md:py-14 lg:py-16">
                <Suspense fallback={<ProductGridSkeleton />}>
                    <ProductGrid
                        products={products}
                        currentPage={pageParam}
                        totalPages={totalPages}
                        href={`/collections/${handle}`}
                    />
                </Suspense>
            </Container>
        </div>
    )
}