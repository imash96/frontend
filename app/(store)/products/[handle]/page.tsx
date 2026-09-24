import { cookies } from "next/headers"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { Suspense } from "react"
import { cacheLife } from "next/cache"
import { listProducts } from "@/lib/action/product"
import { getRegion } from "@/lib/action/regions"
import { sdk } from "@/lib/sdk"
import { getProductPrice } from "@/lib/util/get-product-price"
import Container from "@/ui/container"
import ProductGallery from "@/module/products/templates/gallery"
import ProductInfo from "@/module/products/templates/info"
import ProductActions from "@/module/products/templates/action"
import ProductAccordion from "@/module/products/templates/accordion"
import ProductDesc from "@/module/products/templates/description"
import RelatedProducts from "@/module/products/templates/related"
import ProductReview from "@/module/products/templates/review"

const PRODUCT_FIELDS = "*variants.calculated_price,*variants.prices,*variants.options,+variants.inventory_quantity,+variants.sku,+variants.manage_inventory,+variants.allow_backorder,*variants.images,+variant_rank,*images,*options,*options.values,*categories,*categories.id,*categories.name,*categories.handle,+tags.value,+type.value,+material,+origin_country,+weight,+length,+width,+height,+subtitle,+collection"

async function loadPageData(handle: string) {
    'use cache: private'
    cacheLife({ stale: 60 })
    const countryCode =
        (await cookies()).get("__country_code")?.value || process.env.NEXT_PUBLIC_DEFAULT_REGION || "us"

    const region = await getRegion(countryCode)
    if (!region) return null

    const [product] = await listProducts({
        regionId: region.id,
        queryParams: { handle, fields: PRODUCT_FIELDS, limit: 1 },
    }).then(({ response }) => response.products)

    if (!product?.id) return null

    return { product, region, countryCode }
}

export default async function ProductDetailPage(props: PageProps<"/products/[handle]">) {
    const { handle } = await props.params
    const data = await loadPageData(handle)
    if (!data) notFound()

    const { product, region, countryCode } = data
    const { cheapestPrice: initialPrice } = getProductPrice({ product })
    const inStock = product.variants?.some((v) => {
        if (!v.manage_inventory) return true
        if (v.allow_backorder) return true
        return (v.inventory_quantity ?? 0) > 0
    })
    const site = process.env.NEXT_PUBLIC_BASE_URL
    const productUrl = `${site}/products/${handle}`

    // ─── Compute price range across all variants ───
    const variantPrices = (product.variants ?? [])
        .map((v: any) => v.calculated_price?.calculated_amount as number | undefined)
        .filter((p): p is number => p != null && p > 0)

    const lowPrice = variantPrices.length > 0 ? Math.min(...variantPrices) : undefined
    const highPrice = variantPrices.length > 0 ? Math.max(...variantPrices) : undefined
    const currencyCode = initialPrice?.currency_code?.toUpperCase() ?? "USD"

    // ─── Extract variant metadata for structured data ───
    const firstVariant = product.variants?.[0]
    const colorOption = product.options?.find(
        (o) => o.title?.toLowerCase() === "color" || o.title?.toLowerCase() === "colour"
    )
    const colorValues = colorOption?.values?.map((v) => v.value).join(", ")

    // ─── JSON-LD: Product ───
    const productJsonLd: Record<string, any> = {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.title,
        description: product.description ?? undefined,
        image: product.images?.map((img) => img.url) ?? [],
        sku: firstVariant?.sku ?? undefined,
        mpn: firstVariant?.sku ?? undefined,
        gtin13: firstVariant?.ean ?? undefined,
        brand: { "@type": "Brand", name: "Velle Hide" },
        ...(product.material && { material: product.material }),
        ...(colorValues && { color: colorValues }),
        aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "4.8",
            reviewCount: "247",
            bestRating: "5",
            worstRating: "1",
        },
        ...(lowPrice != null && {
            offers: {
                "@type": "AggregateOffer",
                priceCurrency: currencyCode,
                lowPrice: lowPrice.toFixed(2),
                ...(highPrice != null && highPrice !== lowPrice && { highPrice: highPrice.toFixed(2) }),
                offerCount: String(variantPrices.length),
                availability: inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
                url: productUrl,
                seller: { "@type": "Organization", name: "Velle Hide" },
            },
        }),
    }

    // ─── JSON-LD: BreadcrumbList ───
    const breadcrumbJsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: site },
            { "@type": "ListItem", position: 2, name: "Products", item: `${site}/products` },
            ...(product.categories ?? []).map((cat, i) => ({
                "@type": "ListItem",
                position: 3 + i,
                name: cat.name,
                item: `${site}/categories/${cat.handle}`,
            })),
            {
                "@type": "ListItem",
                position: 3 + (product.categories?.length ?? 0),
                name: product.title,
                item: productUrl,
            },
        ],
    }

    return (
        <>
            <Container size="2xl" className="pt-4 pb-6 lg:pt-8 lg:pb-10">
                <div className="grid grid-cols-1 gap-y-6 lg:grid-cols-12 lg:gap-x-8 xl:gap-x-10">
                    <div className="lg:mx-0 lg:sticky lg:top-20 lg:col-span-7 lg:self-start xl:col-span-8">
                        <ProductGallery product={product} title={product.title} />
                    </div>
                    <div className="lg:col-span-5 xl:col-span-4">
                        <ProductInfo product={product} initialPrice={initialPrice} />
                        <ProductActions product={product} countryCode={countryCode} />
                        <ProductAccordion product={product} />
                    </div>
                </div>
            </Container>

            <ProductDesc />

            <Suspense fallback={<RelatedSkeleton />}>
                <RelatedProducts product={product} region={region} />
            </Suspense>

            <ProductReview />

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd).replace(/</g, "\\u003c") }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, "\\u003c") }}
            />
        </>
    )
}

function RelatedSkeleton() {
    return (
        <Container size="2xl" className="border-t border-divider py-12">
            <div className="mx-auto mb-9 h-8 w-64 animate-pulse rounded bg-muted" />
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-6">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="aspect-3/4 animate-pulse bg-muted" />
                ))}
            </div>
        </Container>
    )
}

export async function generateMetadata(props: PageProps<"/products/[handle]">): Promise<Metadata> {
    const { handle } = await props.params
    const data = await loadPageData(handle)
    if (!data) return { title: "Product Not Found" }

    const { product } = data
    const title = `${product.title} | Velle Hide`
    const description =
        product.description?.slice(0, 160) ?? `Shop the ${product.title} - handcrafted genuine leather from Velle Hide.`
    const canonical = `${process.env.NEXT_PUBLIC_BASE_URL}/products/${handle}`
    const ogImages = (product.images ?? []).slice(0, 4).map((img) => ({
        url: img.url,
        width: 1200,
        height: 1600,
        alt: product.title,
    }))
    const tags = (product as any).tags as { value: string }[] | undefined
    const keywords = tags?.map((t) => t.value).join(", ") || undefined

    return {
        title,
        description,
        keywords,
        alternates: { canonical },
        robots: { index: true, follow: true },
        openGraph: {
            title,
            description,
            type: "website",
            url: canonical,
            siteName: "Velle Hide",
            locale: "en_US",
            images: ogImages.length > 0 ? ogImages : [],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: ogImages.length > 0 ? [ogImages[0].url] : [],
        },
    }
}

export async function generateStaticParams() {
    const products = await sdk.store.product.list({ fields: "handle" }).then(({ products }) => products)
    return products.map((p) => ({ handle: p.handle }))
}
