import { StoreProduct } from "@medusajs/types"
import type { Route } from "next"
import SectionHeader from "./section-header"
import Button from "@/ui/button"
import ProductCard from "@/ui/product-card"
import { ArrowRight } from "lucide-react"

type ProductSectionProps = {
    products: StoreProduct[]
    title: string
    subTitle?: string
    desc: string
    sectionName: string
    buttonLink: string
    buttonText?: string
    mobileScroll?: boolean
}

export default function ProductSection({
    products,
    title,
    desc,
    sectionName,
    buttonText = "View all",
    buttonLink,
    mobileScroll = true,
}: ProductSectionProps) {
    const displayProducts = products?.slice(0, 6) ?? []

    // Loading state skeleton
    if (!displayProducts.length) {
        return (
            <SectionHeader title={title} desc={desc} sectionName={sectionName}>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="aspect-3/4 skeleton rounded-sm" />
                    ))}
                </div>
            </SectionHeader>
        )
    }

    return (
        <SectionHeader
            title={title}
            desc={desc}
            sectionName={sectionName}
            action={
                <Button
                    href={buttonLink as Route}
                    variant="outline"
                    icon={<ArrowRight className="size-3.5" aria-hidden />}
                    iconPosition="right"
                    className="hidden! md:inline-flex! self-center"
                >
                    {buttonText}
                </Button>
            }
        >
            {mobileScroll ? (
                <>
                    {/* Mobile scroll strip */}
                    <div className="md:hidden -mx-4 px-4 overflow-x-auto overscroll-x-contain scroll-smooth flex gap-3 pb-4">
                        {displayProducts.map((product) => (
                            <div
                                key={product.id}
                                // FIX: slightly wider so 2.2 cards visible on 375px
                                className="flex-[0_0_44%] min-w-0"
                            >
                                <ProductCard product={product} />
                            </div>
                        ))}
                        {/* Right-edge peek spacer */}
                        <div className="flex-[0_0_4%] shrink-0" aria-hidden />
                    </div>

                    <div className="hidden md:grid grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
                        {displayProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
                    {displayProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}

            <div className="mt-5 flex justify-center md:hidden">
                <Button
                    href={buttonLink as Route}
                    variant="outline"
                    icon={<ArrowRight className="size-3.5" aria-hidden />}
                    iconPosition="right"
                    className="text-xs"
                >
                    {buttonText}
                </Button>
            </div>
        </SectionHeader>
    )
}