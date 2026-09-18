import { cache } from "react"
import { cookies } from "next/headers"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { Suspense } from "react"
import { listProducts } from "@/lib/action/product"
import { getRegion } from "@/lib/action/regions"
import { sdk } from "@/lib/sdk"
import { getProductPrice } from "@/lib/util/get-product-price"
import Container from "@/ui/container"
import ProductGallery from "@/module/products/templates/gallery"
import ProductInfo from "@/module/products/templates/info"
import ProductActions from "@/module/products/templates/action-n"
import ProductAccordion from "@/module/products/templates/accordion"
import ProductDesc from "@/module/products/templates/description"
import RelatedProducts from "@/module/products/templates/related"
import ProductReview from "@/module/products/templates/review"

const PRODUCT_FIELDS =
    "*variants.calculated_price,*variants.prices,*variants.options,+variants.inventory_quantity,+variants.sku,+variants.manage_inventory,+variants.allow_backorder,*images,*options,*options.values,*categories,*categories.id,*categories.name,*categories.handle,+tags.value,+type.value,+material,+origin_country,+weight,+length,+width,+height,+subtitle,+collection"

const loadPageData = cache(async (handle: string) => {
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
})

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

    const productJsonLd = {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.title,
        description: product.description ?? undefined,
        image: product.images?.map((img) => img.url) ?? [],
        sku: product.variants?.[0]?.sku ?? undefined,
        brand: { "@type": "Brand", name: "Velle Hide" },
        ...(initialPrice && {
            offers: {
                "@type": "Offer",
                priceCurrency: initialPrice.currency_code?.toUpperCase(),
                price: initialPrice.calculated_price_number?.toFixed(2),
                availability: inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
                url: productUrl,
            },
        }),
    }

    return (
        <>
            <Container size="2xl" className="pt-4 pb-6 lg:pt-8 lg:pb-10">
                <div className="grid grid-cols-1 gap-y-6 lg:grid-cols-12 lg:gap-x-8 xl:gap-x-10">
                    <div className="lg:mx-0 lg:sticky lg:top-20 lg:col-span-7 lg:self-start xl:col-span-8">
                        <ProductGallery images={product.images ?? null} title={product.title} />
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
        product.description?.slice(0, 160) ?? `Shop the ${product.title} — handcrafted genuine leather from Velle Hide.`
    const image = product.thumbnail ?? product.images?.[0]?.url
    const canonical = `${process.env.NEXT_PUBLIC_BASE_URL}/products/${handle}`

    return {
        title,
        description,
        alternates: { canonical },
        openGraph: {
            title,
            description,
            type: "website",
            url: canonical,
            images: image ? [{ url: image, width: 1200, height: 1600, alt: product.title }] : [],
        },
        twitter: { card: "summary_large_image", title, description, images: image ? [image] : [] },
    }
}

export async function generateStaticParams() {
    const products = await sdk.store.product.list({ fields: "handle" }).then(({ products }) => products)
    return products.map((p) => ({ handle: p.handle }))
}
