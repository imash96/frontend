import { cookies } from "next/headers"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { listProducts } from "@/lib/action/product"
import { getRegion } from "@/lib/action/regions"
import { sdk } from "@/lib/sdk"
import { getProductPrice } from "@/lib/util/get-product-price"
import Container from "@/ui/container"
import ProductGallery from "@/module/products/templates/gallery"
import ProductInfo from "@/module/products/templates/info"
import ProductActions from "@/module/products/templates/action-n"
import ProductAccordion from "@/module/products/templates/accordion"
import { Heart, Share2 } from "lucide-react"
import ProductDesc from "@/module/products/templates/description"
import RelatedProducts from "@/module/products/templates/related"
import ProductReview from "@/module/products/templates/review"

const PRODUCT_FIELDS = "*variants.calculated_price,*variants.prices,*variants.options,+variants.inventory_quantity,+variants.sku,+variants.manage_inventory,+variants.allow_backorder,*images,*options,*options.values,*categories,*categories.id,*categories.name,*categories.handle,+tags.value,+type.value,+material,+origin_country,+weight,+length,+width,+height,+subtitle,+collection"

async function getProductByHandle(handle: string, regionId: string) {
    const [product] = await listProducts({
        regionId,
        queryParams: { handle, fields: PRODUCT_FIELDS, limit: 1 },
    }).then(({ response }) => response.products);
    return product ?? null
}

async function loadPageData(handle: string) {
    const countryCode = (await cookies()).get("__country_code")?.value || process.env.NEXT_PUBLIC_DEFAULT_REGION || "us"

    const region = await getRegion(countryCode)
    if (!region) return null

    const product = await getProductByHandle(handle, region.id)
    if (!product?.id) return null

    return { product, region, countryCode }
}

export default async function ProductDetailPage(props: PageProps<"/products/[handle]">) {
    const { handle } = await props.params
    const data = await loadPageData(handle)
    if (!data) notFound()

    const { product, region, countryCode } = data
    const { cheapestPrice: initialPrice } = getProductPrice({ product })

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
                availability: "https://schema.org/InStock",
                url: `${process.env.NEXT_PUBLIC_BASE_URL}/prod/${handle}`,
            },
        }),
    }

    return (
        <Container size="2xl" className="mx-auto px-0 sm:px-4 lg:px-6 xl:px-8 pt-0 lg:pt-6">
            <div className="grid grid-cols-1 gap-y-2 lg:grid-cols-12 md:gap-x-4">
                <div className="lg:sticky lg:top-24 lg:col-span-7 lg:self-start xl:col-span-8">
                    <ProductGallery images={product.images ?? null} title={product.title} />
                </div>
                <div className="lg:col-span-5 xl:col-span-4">
                    <ProductInfo product={product} initialPrice={initialPrice} />
                    {/* <ProductActions product={product} countryCode={countryCode} /> */}
                    <ProductActions product={product} countryCode={countryCode} />
                    {/* Wishlist + Share row */}
                    <div className="flex items-center gap-3 mb-4">
                        <button
                            className='flex items-center gap-1.5 text-xs text-text-secondary hover:text-text-primary transition-colors cursor-pointer text-[10px] uppercase tracking-wider'

                        >
                            <Heart className="size-3.5" strokeWidth={1.5} />
                            Add to Wishlist
                        </button>
                        <span className="text-border">|</span>
                        <button
                            className='flex items-center gap-1.5 text-xs text-text-secondary hover:text-text-primary transition-colors cursor-pointer text-[10px] uppercase tracking-wider'
                        >
                            <Share2 className="size-3.5" strokeWidth={1.5} />
                            Share
                        </button>
                    </div>
                    <ProductAccordion product={product} />
                </div>
            </div>

            <ProductDesc />
            <div className="h-px bg-divider" />
            <RelatedProducts product={product} region={region} />
            <div className="h-px bg-divider" />
            <ProductReview />

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd).replace(/</g, "\\u003c") }}
            />
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
        product.description?.slice(0, 160) ??
        `Shop the ${product.title} — handcrafted genuine leather from Velle Hide.`
    const image = product.thumbnail ?? product.images?.[0]?.url
    const canonical = `${process.env.NEXT_PUBLIC_BASE_URL}/prod/${handle}`

    return {
        title,
        description,
        alternates: { canonical },
        openGraph: {
            title,
            description,
            type: "website",
            url: canonical,
            images: image ? [{ url: image, width: 1200, height: 1200, alt: product.title }] : [],
        },
        twitter: { card: "summary_large_image", title, description, images: image ? [image] : [] },
    }
}

export async function generateStaticParams() {
    const products = await sdk.store.product.list({ fields: "handle" }).then(({ products }) => products)
    return products.map((p) => ({ handle: p.handle }))
}