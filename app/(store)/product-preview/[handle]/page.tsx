import type { Metadata } from "next"
import { cookies } from "next/headers"
import {
    getPreviewProduct,
    PREVIEW_RELATED_PRODUCTS,
    PREVIEW_REVIEW_STATS,
    PREVIEW_REVIEWS,
} from "@/data/preview-data"
import { listProducts } from "@/lib/action/product"
import { getRegion } from "@/lib/action/regions"
import { baseURL } from "@/lib/constant"
import { getProductPrice } from "@/lib/util/get-product-price"
import ProductPreviewTemplate from "@/module/product-preview/templates/product-preview-template"
import type { StoreProductWithReviews } from "@/types/product"

const PRODUCT_FIELDS = [
    "id",
    "title",
    "handle",
    "subtitle",
    "description",
    "thumbnail",
    "collection_id",
    "material",
    "origin_country",
    "weight",
    "length",
    "width",
    "height",
    "images.id",
    "images.url",
    "options.id",
    "options.title",
    "options.values.value",
    "options.values.rank",
    "categories.id",
    "categories.name",
    "categories.handle",
    "tags.id",
    "tags.value",
    "type.value",
    "collection.id",
    "collection.title",
    "variants.allow_backorder",
    "*variants.calculated_price",
    "variants.ean",
    "variants.hs_code",
    "variants.mid_code",
    "variants.sku",
    "variants.upc",
    "variants.thumbnail",
    "variants.images.id",
    "variants.images.url",
    "variants.id",
    "variants.manage_inventory",
    "variants.title",
    "variants.inventory_quantity",
    "variants.variant_rank",
    "variants.options.id",
    "variants.options.value",
    "variants.options.title",
    "variants.options.option",
    "*review_stats",
    "*product_review",
    "metadata",
].join(",")

async function loadPreviewPageData(handle: string) {
    let countryCode = process.env.NEXT_PUBLIC_DEFAULT_REGION || "us"
    try {
        const cookieStore = await cookies()
        countryCode = cookieStore.get("__country_code")?.value || countryCode
    } catch {
        // Fallback during static generation
    }

    try {
        const region = await getRegion(countryCode)
        if (region) {
            const { response } = await listProducts({
                regionId: region.id,
                queryParams: { handle, fields: PRODUCT_FIELDS, limit: 1 },
            })
            const liveProduct = response.products?.[0] as
                | StoreProductWithReviews
                | undefined

            if (liveProduct?.id) {
                const relatedRes = await listProducts({
                    regionId: region.id,
                    queryParams: { limit: 5, is_giftcard: false },
                }).catch(() => ({ response: { products: [] } }))

                const related = (relatedRes.response.products as StoreProductWithReviews[])
                    .filter((p) => p.id !== liveProduct.id)
                    .slice(0, 4)

                return {
                    product: {
                        ...liveProduct,
                        review_stats: liveProduct.review_stats ?? PREVIEW_REVIEW_STATS,
                        product_review:
                            liveProduct.product_review &&
                            liveProduct.product_review.length > 0
                                ? liveProduct.product_review
                                : PREVIEW_REVIEWS,
                    },
                    countryCode,
                    relatedProducts:
                        related.length > 0 ? related : PREVIEW_RELATED_PRODUCTS,
                    isLiveBackend: true,
                }
            }
        }
    } catch {
        // Medusa backend unavailable — seamlessly serve preview catalog
    }

    const fallbackProduct = getPreviewProduct(handle)
    const relatedProducts = PREVIEW_RELATED_PRODUCTS.filter(
        (p) => p.handle !== fallbackProduct.handle,
    ).slice(0, 4)

    return {
        product: fallbackProduct,
        countryCode,
        relatedProducts,
        isLiveBackend: false,
    }
}

export default async function ProductPreviewPage(
    props: PageProps<"/product-preview/[handle]">,
) {
    const { handle } = await props.params
    const { product, countryCode, relatedProducts, isLiveBackend } =
        await loadPreviewPageData(handle)

    const { cheapestPrice: initialPrice } = getProductPrice({ product })
    const inStock = product.variants?.some((v) => {
        if (!v.manage_inventory) return true
        if (v.allow_backorder) return true
        return (v.inventory_quantity ?? 0) > 0
    })
    const productUrl = `${baseURL}/product-preview/${handle}`

    const variantPrices = (product.variants ?? [])
        .map((v: any) => v.calculated_price?.calculated_amount as number | undefined)
        .filter((p): p is number => p != null && p > 0)

    const lowPrice =
        variantPrices.length > 0 ? Math.min(...variantPrices) : undefined
    const highPrice =
        variantPrices.length > 0 ? Math.max(...variantPrices) : undefined
    const currencyCode = initialPrice?.currency_code?.toUpperCase() ?? "USD"
    const firstVariant = product.variants?.[0]

    const productJsonLd: Record<string, unknown> = {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.title,
        description: product.description ?? undefined,
        image: product.images?.map((img) => img.url) ?? [],
        sku: firstVariant?.sku ?? undefined,
        mpn: firstVariant?.sku ?? undefined,
        brand: { "@type": "Brand", name: "Velle Hide" },
        ...(product.material && { material: product.material }),
        ...(product.review_stats && product.review_stats.review_count > 0
            ? {
                  aggregateRating: {
                      "@type": "AggregateRating",
                      ratingValue: String(
                          product.review_stats.average_rating.toFixed(1),
                      ),
                      reviewCount: String(product.review_stats.review_count),
                      bestRating: "5",
                      worstRating: "1",
                  },
              }
            : {}),
        ...(lowPrice != null && {
            offers: {
                "@type": "AggregateOffer",
                priceCurrency: currencyCode,
                lowPrice: lowPrice.toFixed(2),
                ...(highPrice != null &&
                    highPrice !== lowPrice && { highPrice: highPrice.toFixed(2) }),
                offerCount: String(variantPrices.length),
                availability: inStock
                    ? "https://schema.org/InStock"
                    : "https://schema.org/OutOfStock",
                url: productUrl,
                seller: { "@type": "Organization", name: "Velle Hide" },
            },
        }),
    }

    const breadcrumbJsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: baseURL },
            {
                "@type": "ListItem",
                position: 2,
                name: "Products",
                item: `${baseURL}/products`,
            },
            {
                "@type": "ListItem",
                position: 3,
                name: product.title,
                item: productUrl,
            },
        ],
    }

    return (
        <>
            <ProductPreviewTemplate
                product={product}
                countryCode={countryCode}
                relatedProducts={relatedProducts}
                isLiveBackend={isLiveBackend}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(productJsonLd).replace(/</g, "\\u003c"),
                }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, "\\u003c"),
                }}
            />
        </>
    )
}

export async function generateMetadata(
    props: PageProps<"/product-preview/[handle]">,
): Promise<Metadata> {
    const { handle } = await props.params
    const { product } = await loadPreviewPageData(handle)

    const title = `${product.title} | Velle Hide Atelier`
    const description =
        product.description?.slice(0, 160) ??
        `Shop the ${product.title} — handcrafted full-grain Italian leather from Velle Hide.`
    const canonical = `${baseURL}/product-preview/${handle}`

    return {
        title,
        description,
        alternates: { canonical },
        openGraph: {
            title,
            description,
            type: "website",
            url: canonical,
            siteName: "Velle Hide",
        },
    }
}
