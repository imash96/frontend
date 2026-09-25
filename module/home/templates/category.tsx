import { ArrowRight } from "lucide-react"
import { AnimatePresence } from "motion/react"
import { div as Div } from "motion/react-client"
import Image from "next/image"
import Link from "next/link"
import { product_categories } from "@/data/category"
import { ProductCategory } from "@/types/common"
import SectionHeader from "../components/section-header"

export default async function Category() {
    const cats = product_categories.slice(0, 6)

    return (
        <SectionHeader
            title="Explore Our Collections"
            desc="Explore our complete range of handcrafted genuine leather goods."
            eyebrow="Shop by Category"
            sectionName="Category"
            action={<CategoryAction />}
        >
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 auto-rows-50 md:auto-rows-57.5 lg:auto-rows-67.5">
                {cats.map((cat, index) => {
                    const isHero = index === 0
                    const isWide = index === 5

                    return (
                        <CategoryCard
                            key={cat.id}
                            category={cat}
                            isHero={isHero}
                            priority={index < 2}
                            className={isHero ? "col-span-2 lg:row-span-2" : isWide ? "col-span-2 md:col-span-3 lg:col-span-1" : ""}
                        />
                    )
                })}
            </div>
        </SectionHeader>
    )
}

// ─── CategoryCard ─────────────────────────────────────────────────────────────

function CategoryCard({ category, isHero, className = "", priority = false, }: CategoryCardProps) {
    const thumb = getThumb(category)
    const tags = category.category_children?.slice(0, 3).map((c) => c.name)
    return (
        <Link
            href={`/categories/${category.handle}`}
            className={`group relative overflow-hidden border border-border-subtle bg-muted ring-1 ring-border/0 hover:ring-border/60 transition-all duration-300 ease-(--ease-spring) hover:shadow-primary active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${className}`}
        >
            <Image
                src={thumb}
                alt={category.name}
                fill
                priority={priority}
                className="object-cover object-top transition-transform duration-700 ease-(--ease-out-quart) group-hover:scale-[1.06] will-change-transform"
                sizes={isHero ? "(max-width:768px) 100vw, (max-width:1024px) 66vw, 50vw" : "(max-width:768px) 50vw, (max-width:1024px) 33vw, 25vw"}
            />

            {/* Scrim */}
            <div
                className="absolute inset-0 bg-linear-to-r from-neutral-950/60 to-transparent"
                aria-hidden="true"
            />
            <div
                className="absolute inset-0 bg-linear-to-t from-neutral-950/80 via-transparent to-transparent"
                aria-hidden="true"
            />

            {/* Text content */}
            <div className="absolute bottom-0 left-0 right-0 p-5">
                <AnimatePresence mode="wait">
                    <Div
                        key={category.name}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2 }}
                        className="text-white"
                    >
                        <p className="text-[9px] font-bold uppercase tracking-[0.32em] mb-1.5">
                            Category
                        </p>
                        <h3 className="text-xl md:text-2xl lg:text-3xl font-semibold font-heading text-white leading-tight mb-1">
                            {category.name}
                        </h3>
                        {category.description && (
                            <p className="text-xs line-clamp-2 max-w-96 leading-relaxed mb-3 text-white/80">
                                {category.description}
                            </p>
                        )}
                        <span
                            className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-accent hover:text-accent-hover transition-colors group"
                        >
                            Shop Now
                            <ArrowRight
                                className="w-3 h-3 group-hover:translate-x-0.5 transition-transform"
                                aria-hidden="true"
                            />
                        </span>
                    </Div>
                </AnimatePresence>
            </div>

            {/* Hover reveal panel - frosted glass that slides up */}
            {/* <div className="absolute inset-x-0 bottom-0 z-20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out pointer-events-none">
                <div className="bg-white/10 backdrop-blur-xl border-t border-white/10 p-4 md:p-5 pointer-events-auto">
                    <div className="flex flex-wrap gap-1.5 mb-2">
                        {tags?.map((tag) => (
                            <span key={tag} className="text-[9px] font-medium text-white/80 bg-white/15 px-2 py-0.5 rounded-sm">
                                {tag}
                            </span>
                        ))}
                    </div>
                    <p className="text-[11px] text-white/70 leading-relaxed line-clamp-2">
                        {category.description}
                    </p>
                </div>
            </div> */}
        </Link>
    )
}

const CategoryAction = () => (
    <Link
        href="/categories"
        className="hidden sm:inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary hover:text-primary-hover transition-colors group"
    >
        View All
        <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
    </Link>
)

// ─── Helpers (module scope - not recreated per render) ────────────────────────

function getThumb(cat: ProductCategory): string {
    return (cat.metadata?.thumbnail as string) ?? "/images/placeholder-category.webp"
}

type CategoryCardProps = {
    category: ProductCategory
    isHero?: boolean
    className?: string
    priority?: boolean
}