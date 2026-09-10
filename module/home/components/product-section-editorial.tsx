import { ProductSectionProps } from "@/types/homepage";
import { SectionHeaderEditorial } from "./section-header-editorial";
import Button from "@/ui/button";
import { ArrowRight } from "lucide-react";
import ProductCard from "@/ui/product-card";
import { getProductPrice } from "@/lib/util/get-product-price";

export function ProductSectionEditorial({ products, title, desc, sectionName, buttonLink = '#', buttonText = 'Shop Now', eyebrow, }: ProductSectionProps) {
    const featured = products[0];
    const rest = products.slice(1, 5);

    if (!featured) return null;
    const { cheapestPrice: price } = getProductPrice({ product: featured })
    const isSale = price?.price_type === "sale"

    return (
        <SectionHeaderEditorial
            title={title}
            desc={desc}
            sectionName={sectionName}
            eyebrow={eyebrow}
            action={
                <Button
                    href={buttonLink}
                    variant="ghost"
                    size="sm"
                    icon={<ArrowRight className="size-3.5" />}
                    iconPosition="right"
                    className="hidden! md:inline-flex!"
                >
                    {buttonText}
                </Button>
            }
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {/* Featured large product */}
                <article className="group relative overflow-hidden bg-card border border-border cursor-pointer">
                    <div className="relative aspect-3/4 md:aspect-auto md:h-full overflow-hidden">
                        <img
                            src={featured.images?.at(0)?.url}
                            alt={featured.title}
                            className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                            loading="lazy"
                        />
                        {/* linear overlay with product info */}
                        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
                        <div className="absolute bottom-0 inset-x-0 p-6 md:p-8">
                            {featured.categories && (
                                <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/70">
                                    {featured.categories[0].name}
                                </span>
                            )}
                            <h3 className="font-heading text-xl md:text-2xl font-light text-white mt-1.5 leading-tight">
                                {featured.title}
                            </h3>
                            <div className="flex items-baseline gap-3 mt-3">
                                {isSale ? (
                                    <>
                                        <span className="font-heading font-semibold text-lg text-white">${price.calculated_price}</span>
                                        <span className="text-sm text-white/60 line-through">${price.original_price}</span>
                                    </>
                                ) : (
                                    <span className="font-heading font-semibold text-lg text-white">${price?.original_price}</span>
                                )}
                            </div>
                            <Button
                                variant="primary"
                                size="sm"
                                className="mt-4"
                                icon={<ArrowRight className="size-3.5" />}
                                iconPosition="right"
                            >
                                Shop Now
                            </Button>
                        </div>
                    </div>
                </article>

                {/* Right-side grid */}
                <div className="grid grid-cols-2 gap-3 md:gap-4">
                    {rest.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>

            {/* Mobile CTA */}
            <div className="mt-6 flex justify-center md:hidden">
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
        </SectionHeaderEditorial>
    );
}