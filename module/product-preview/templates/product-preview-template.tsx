"use client"

import { ArrowRight, CheckCircle2, Layers, ShoppingBag, Sparkles } from "lucide-react"
import Link from "next/link"
import { PREVIEW_PRODUCT, PREVIEW_RELATED_PRODUCTS } from "@/data/preview-data"
import { usePreviewFlowStore } from "@/lib/store/preview-flow-store"
import { getProductPrice } from "@/lib/util/get-product-price"
import type { StoreProductWithReviews } from "@/types/product"
import Container from "@/ui/container"
import PreviewGallery from "../components/preview-gallery"
import PreviewInfoAndActions from "../components/preview-info-actions"
import {
    PreviewAccordionSpecs,
    PreviewCraftsmanshipStory,
    PreviewRelatedGrid,
    PreviewReviewsSection,
} from "../components/preview-specs-reviews"

type ProductPreviewTemplateProps = {
    product: StoreProductWithReviews
    countryCode: string
    relatedProducts: StoreProductWithReviews[]
    isLiveBackend?: boolean
}

export default function ProductPreviewTemplate({
    product,
    countryCode,
    relatedProducts,
    isLiveBackend = false,
}: ProductPreviewTemplateProps) {
    const cart = usePreviewFlowStore((s) => s.cart)
    const bagCount = (cart.items ?? []).reduce(
        (sum, item) => sum + Number(item.quantity ?? 1),
        0,
    )
    const { cheapestPrice: initialPrice } = getProductPrice({ product })

    const sampleHandles = [
        { handle: PREVIEW_PRODUCT.handle, label: "Milano Moto" },
        ...PREVIEW_RELATED_PRODUCTS.slice(0, 3).map((p) => ({
            handle: p.handle,
            label: p.title.replace("The ", "").split(" ").slice(0, 2).join(" "),
        })),
    ]

    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Interactive Preview Flow Bar */}
            <div className="border-b border-divider bg-surface/90 backdrop-blur-md">
                <Container
                    size="2xl"
                    className="flex flex-wrap items-center justify-between gap-2 py-2.5 text-xs"
                >
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary">
                            <Sparkles className="size-3 text-accent" />
                            <span>Atelier Product Experience</span>
                        </span>
                        <span className="hidden text-text-tertiary sm:inline">|</span>
                        <div className="hidden items-center gap-1.5 md:flex">
                            <span className="text-[11px] text-text-tertiary">Switch piece:</span>
                            {sampleHandles.map((item) => {
                                const isActive = product.handle === item.handle
                                return (
                                    <Link
                                        key={item.handle}
                                        href={`/product-preview/${item.handle}`}
                                        className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium transition-colors ${
                                            isActive
                                                ? "bg-primary text-primary-foreground"
                                                : "bg-background-secondary text-text-secondary hover:text-text-primary"
                                        }`}
                                    >
                                        {item.label}
                                    </Link>
                                )
                            })}
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            href="/checkout-preview"
                            className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3.5 py-1 text-xs font-semibold text-accent-foreground shadow-xs transition-all hover:bg-accent-hover"
                        >
                            <ShoppingBag className="size-3.5" />
                            <span>Checkout Preview ({bagCount})</span>
                            <ArrowRight className="size-3.5" />
                        </Link>
                    </div>
                </Container>
            </div>

            {/* Main Product Grid */}
            <Container size="2xl" className="pt-4 pb-10 lg:pt-8 lg:pb-16">
                <div className="grid grid-cols-1 gap-y-8 lg:grid-cols-12 lg:gap-x-8 xl:gap-x-12">
                    {/* Left Column: Sticky Gallery */}
                    <div className="lg:sticky lg:top-20 lg:col-span-7 lg:self-start xl:col-span-7">
                        <PreviewGallery product={product} title={product.title} />
                    </div>

                    {/* Right Column: Info, Variants, Bespoke Studio, CTAs, Specs */}
                    <div className="lg:col-span-5 xl:col-span-5">
                        <PreviewInfoAndActions
                            product={product}
                            countryCode={countryCode}
                            initialPrice={initialPrice}
                            reviewStats={product.review_stats}
                            isFallbackData={!isLiveBackend}
                        />
                        <PreviewAccordionSpecs product={product} />
                    </div>
                </div>
            </Container>

            {/* 47-Step Craftsmanship & Price Transparency */}
            <PreviewCraftsmanshipStory />

            {/* Related Products Grid */}
            <PreviewRelatedGrid products={relatedProducts} />

            {/* Customer Reviews & Rating Breakdown + Write a Review Modal */}
            <PreviewReviewsSection
                productId={product.id}
                productTitle={product.title}
                initialReviews={product.product_review}
                initialStats={product.review_stats}
            />
        </div>
    )
}
