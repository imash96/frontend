import { ArrowRight } from "lucide-react"
import { SectionHeaderClassic, SectionHeaderCentered } from "./section-header-final"
import { StoreProduct } from "@medusajs/types"
import Button from "@/ui/button"
import ProductCard from "@/ui/product-card"

type ProductSectionProps = {
    products: StoreProduct[]
    title: string
    desc: string
    sectionName: string
    buttonLink?: string
    buttonText?: string
    eyebrow?: string
}

// ─── Skeleton grid ────────────────────────────────────────────────────────────

function SkeletonGrid({ cols = 6 }: { cols?: number }) {
    return (
        <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-${cols} gap-3 md:gap-4`}>
            {Array.from({ length: cols }).map((_, i) => (
                <div key={i} className="aspect-3/4 skeleton rounded-sm" />
            ))}
        </div>
    )
}

// ─── Variant 1: Classic left-aligned ─────────────────────────────────────────

export function ProductSectionClassic({
    products,
    title,
    desc,
    sectionName,
    buttonLink = "#",
    buttonText = "View all",
    eyebrow,
}: ProductSectionProps) {
    const displayProducts = products.slice(0, 6)

    // FIX 4: skeleton when empty
    if (!displayProducts.length) {
        return (
            <SectionHeaderClassic title={title} desc={desc} sectionName={sectionName} eyebrow={eyebrow}>
                <SkeletonGrid />
            </SectionHeaderClassic>
        )
    }

    return (
        <SectionHeaderClassic
            title={title}
            desc={desc}
            sectionName={sectionName}
            eyebrow={eyebrow}
            action={
                // FIX 1: no !important needed
                <Button
                    href={buttonLink}
                    variant="outline"
                    size="sm"
                    icon={<ArrowRight className="size-3.5" />}
                    iconPosition="right"
                    className="hidden! md:inline-flex!"
                >
                    {buttonText}
                </Button>
            }
        >
            {/* FIX 2+3: pb-3 bottom padding + right-edge spacer */}
            <div className="md:hidden -mx-4 px-4 overflow-x-auto overscroll-x-contain scroll-smooth flex gap-3 pb-3 no-scrollbar">
                {displayProducts.map((product) => (
                    <div key={product.id} className="flex-[0_0_44%] min-w-0">
                        <ProductCard product={product} />
                    </div>
                ))}
                {/* FIX 3: right-edge breathing room */}
                <div className="flex-[0_0_4%] shrink-0" aria-hidden="true" />
            </div>

            {/* Tablet + Desktop: grid */}
            <div className="hidden md:grid grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
                {displayProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>

            {/* Mobile CTA */}
            <div className="mt-5 flex justify-center md:hidden">
                <Button
                    href={buttonLink}
                    variant="outline"
                    size="sm"
                    icon={<ArrowRight className="size-3.5" />}
                    iconPosition="right"
                >
                    {buttonText}
                </Button>
            </div>
        </SectionHeaderClassic>
    )
}

// ─── Variant 2: Centered elegant ─────────────────────────────────────────────

export function ProductSectionElegant({
    products,
    title,
    desc,
    sectionName,
    buttonLink = "#",
    buttonText = "Explore Collection",
    eyebrow,
}: ProductSectionProps) {
    const displayProducts = products.slice(0, 4)

    if (!displayProducts.length) {
        return (
            <SectionHeaderCentered title={title} desc={desc} sectionName={sectionName} eyebrow={eyebrow}>
                <SkeletonGrid cols={4} />
            </SectionHeaderCentered>
        )
    }

    return (
        <SectionHeaderCentered
            title={title}
            desc={desc}
            sectionName={sectionName}
            eyebrow={eyebrow}
        >
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {displayProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>

            <div className="mt-10 md:mt-12 flex justify-center">
                {/* FIX 5: outline matches brand CTA style */}
                <Button
                    href={buttonLink}
                    variant="outline"
                    size="lg"
                    icon={<ArrowRight className="size-4" />}
                    iconPosition="right"
                >
                    {buttonText}
                </Button>
            </div>
        </SectionHeaderCentered>
    )
}