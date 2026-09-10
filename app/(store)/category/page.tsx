import Link from "next/link"
import Image from "next/image"
import { getCategoryImage, getLeafCategories } from "@/data/category-page"
import { listParentCategories } from "@/lib/action/categories"
import Button from "@/ui/button"
import Container from "@/ui/container"
import { StoreProductCategory } from "@medusajs/types"
import { ArrowRight } from "lucide-react"

export default async function Page() {
    const categories = await listParentCategories()

    return (
        <>
            <CategoryHero />

            <Container size="2xl">
                {categories.map((parent) => (
                    <ParentCategorySection key={parent.id} parent={parent} />
                ))}
            </Container>

            {/* Bottom CTA */}
            <div className="bg-surface-sunken border-t border-border mt-4">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16 text-center space-y-4">
                    <h2 className="font-heading font-semibold text-xl md:text-2xl text-text-primary tracking-tight">
                        Can&apos;t find what you&apos;re looking for?
                    </h2>
                    <p className="text-sm text-text-secondary max-w-md mx-auto">
                        Browse our full collection or reach out to our styling team for personalized recommendations.
                    </p>
                    <div className="flex items-center justify-center gap-3 pt-2">
                        <Button href="/contact-us">Contact Us</Button>
                    </div>
                </div>
            </div>
        </>
    )
}

// ── Page Hero ──────────────────────────────────────────────────────────────
function CategoryHero() {
    return (
        <div className="relative overflow-hidden bg-surface-sunken border-b border-divider">
            {/* Subtle texture overlay */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage:
                        "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
                }}
                aria-hidden="true"
            />
            <Container size="2xl" className="py-12 md:py-16 lg:py-20 space-y-3">
                <p className="inline-flex items-center gap-2.5 text-[10px] font-bold tracking-[0.30em] uppercase text-accent">
                    <span className="h-px w-8 bg-accent" aria-hidden />
                    Browse by Category
                    <span className="h-px w-8 bg-accent" aria-hidden />
                </p>
                <h1 className="font-heading font-bold text-3xl sm:text-4xl md:text-5xl text-text-primary tracking-tight leading-[1.1]">
                    All Categories
                </h1>
                <p className="text-sm md:text-base text-text-secondary leading-relaxed max-w-xl">
                    Explore our complete collection of premium genuine leather goods — handcrafted apparel,
                    footwear, bags, accessories, and home décor.
                </p>
            </Container>
        </div>
    )
}

// ── Parent category section ───────────────────────────────────────────────
function ParentCategorySection({ parent }: { parent: StoreProductCategory }) {
    const leaves = getLeafCategories(parent.category_children)
    // Build the correct href for the parent category
    const parentHref = `/category/${parent.handle.split("/")[0]}`

    return (
        <section className="py-8 md:py-10 border-b border-divider last:border-b-0">
            {/* Header */}
            <div className="flex items-start sm:items-end justify-between gap-4 mb-6 md:mb-8">
                <div className="flex-1 min-w-0">
                    <Link
                        href={parentHref}
                        className="group inline-flex items-center gap-2 mb-2"
                    >
                        <h2 className="font-heading text-xl sm:text-2xl md:text-[1.75rem] font-semibold text-text-primary group-hover:text-primary transition-colors tracking-tight">
                            {parent.name}
                        </h2>
                        <ArrowRight className="size-5 text-text-tertiary group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-200 shrink-0" />
                    </Link>
                    {parent.description && (
                        <p className="text-sm text-text-secondary leading-relaxed max-w-2xl line-clamp-2">
                            {parent.description}
                        </p>
                    )}
                </div>

                {/* "View All" link — properly linked */}
                <Link
                    href={parentHref}
                    className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary-hover transition-colors shrink-0 group"
                >
                    View All
                    <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                </Link>
            </div>

            {/* Leaf categories */}
            <LeafScrollRow leaves={leaves} maxRows={3} />
        </section>
    )
}

// ── Horizontal scroll row of leaves ──────────────────────────────────────
function LeafScrollRow({ leaves, maxRows }: { leaves: StoreProductCategory[]; maxRows: number }) {
    const itemsPerRow = 6
    const threshold = maxRows * itemsPerRow
    const shouldScroll = leaves.length > threshold

    if (shouldScroll) {
        return (
            <div className="relative">
                <div className="flex gap-4 sm:gap-5 overflow-x-auto pb-4 scrollbar-hide scroll-smooth -mx-4 px-4 md:mx-0 md:px-0">
                    {leaves.map((leaf) => (
                        <LeafCategoryCircle key={leaf.id} cat={leaf} />
                    ))}
                    {/* Trailing spacer so last item doesn't hide under fade */}
                    <div className="shrink-0 w-4 md:w-12" aria-hidden />
                </div>
                {/* Right fade — desktop only */}
                <div
                    className="hidden md:block absolute right-0 top-0 bottom-4 w-20 pointer-events-none"
                    style={{ background: "linear-gradient(to left, var(--background), transparent)" }}
                    aria-hidden="true"
                />
            </div>
        )
    }

    // Grid mode for fewer items
    return (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 sm:gap-5">
            {leaves.map((leaf) => (
                <div key={leaf.id} className="flex justify-center">
                    <LeafCategoryCircle cat={leaf} />
                </div>
            ))}
        </div>
    )
}

// ── Leaf category circle ──────────────────────────────────────────────────
function LeafCategoryCircle({ cat }: { cat: StoreProductCategory }) {
    const img = getCategoryImage(cat.handle)

    // Build correct path: handle is "men/jackets" → /category/men/jackets
    const segments = cat.handle.split("/")
    const [parentSeg, ...rest] = segments
    const href =
        rest.length === 0
            ? `/category/${parentSeg}`
            : `/category/${parentSeg}/${rest.join("/")}`

    return (
        <Link
            href={href}
            className="group flex flex-col items-center gap-2.5 shrink-0 w-22 sm:w-25"
        >
            <div className="relative w-18 h-18 sm:w-21 sm:h-21 rounded-full overflow-hidden border-2 border-border bg-surface-sunken group-hover:border-primary group-hover:shadow-md transition-all duration-300">
                <Image
                    src={img}
                    alt={cat.name}
                    fill
                    sizes="84px"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
            </div>
            <span className="text-[11px] sm:text-xs font-medium text-text-secondary group-hover:text-text-primary text-center leading-tight transition-colors line-clamp-2">
                {cat.name}
            </span>
        </Link>
    )
}