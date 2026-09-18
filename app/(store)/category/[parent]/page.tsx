import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { getCategoryByHandle } from "@/lib/action/categories"
import { getCategoryImage, getLeafCategories } from "@/data/category-page"
import Container from "@/ui/container"
import { StoreProductCategory } from "@medusajs/types"
import { ArrowRight, ChevronRight, Layers } from "lucide-react"

// ── Metadata ──────────────────────────────────────────────────────────────
export async function generateMetadata({
    params,
}: PageProps<"/category/[parent]">): Promise<Metadata> {
    const { parent } = await params
    const category = await getCategoryByHandle([parent])
    if (!category) return { title: "Not Found" }

    return {
        title: `${category.name} | Nocturne Leather`,
        description:
            category.description ??
            `Explore our premium ${category.name.toLowerCase()} collection.`,
        openGraph: {
            images: category.metadata?.thumbnail ? [category.metadata.thumbnail as string] : [],
        },
    }
}

// ── Main Page ─────────────────────────────────────────────────────────────
export default async function Page({ params }: PageProps<"/category/[parent]">) {
    const { parent } = await params
    const category = await getCategoryByHandle([parent])

    if (!category) notFound()

    const children: StoreProductCategory[] = category.category_children ?? []

    return (
        <div className="min-h-screen bg-background">
            {/* Breadcrumb */}
            <div className="border-b border-divider bg-surface-sunken">
                <Container size="2xl" className="py-3">
                    <nav aria-label="Breadcrumb">
                        <ol className="flex items-center gap-1.5 text-xs text-text-tertiary flex-wrap">
                            <li>
                                <Link href="/category" className="hover:text-text-primary transition-colors">
                                    Categories
                                </Link>
                            </li>
                            <li aria-hidden="true">
                                <ChevronRight className="size-3" />
                            </li>
                            <li className="text-text-primary font-medium" aria-current="page">
                                {category.name}
                            </li>
                        </ol>
                    </nav>
                </Container>
            </div>

            {/* Page hero */}
            <div className="relative border-b border-divider bg-surface-sunken">
                {/* Subtle texture overlay */}
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage:
                            "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
                    }}
                    aria-hidden="true"
                />
                <Container size="2xl" className="py-10 md:py-14">
                    <div className="max-w-2xl">
                        <p className="inline-flex items-center gap-2 text-[10px] font-semibold tracking-[0.28em] uppercase text-accent mb-3">
                            <span className="block h-px w-6 bg-accent" aria-hidden="true" />
                            Collection
                        </p>
                        <h1 className="font-heading font-bold text-3xl sm:text-4xl md:text-5xl text-text-primary tracking-tight leading-[1.1] mb-3">
                            {category.name}
                        </h1>
                        {category.description && (
                            <p className="text-sm md:text-base text-text-secondary leading-relaxed">
                                {category.description}
                            </p>
                        )}
                    </div>
                </Container>
            </div>

            {/* Children grid */}
            <Container size="2xl" className="py-10 md:py-14">
                {children.length > 0 ? (
                    <>
                        <div className="mb-8">
                            <h2 className="font-heading text-lg md:text-xl font-semibold text-text-primary tracking-tight">
                                Explore {category.name}’s Collections
                            </h2>
                        </div>

                        {/* Responsive grid: first item large on md+ */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                            {children.map((child, idx) => (
                                <ChildCategoryCard
                                    key={child.id}
                                    category={child}
                                    parentHandle={parent}
                                    index={idx}
                                />
                            ))}
                        </div>
                    </>
                ) : (
                    /* Leaf category - no children, link to products */
                    <div className="text-center py-12">
                        <p className="text-text-secondary mb-6">
                            Explore our {category.name.toLowerCase()} collection
                        </p>
                        <Link
                            href={`/category/${parent}/${category.handle}`}
                            className="inline-flex items-center gap-2 bg-button-primary text-button-primary-foreground px-6 py-3 text-sm font-medium hover:bg-button-primary-hover transition-colors"
                        >
                            Browse Products
                            <ArrowRight className="size-4" />
                        </Link>
                    </div>
                )}
            </Container>

            {/* Popular subcategories strip */}
            {children.length > 0 && (
                <div className="border-t border-divider bg-background-secondary">
                    <Container size="2xl">
                        <PopularSubcategories parent={category} parentHandle={parent} />
                    </Container>
                </div>
            )}
        </div>
    )
}

type ChildCategoryCardProp = {
    category: StoreProductCategory
    parentHandle: string
    index: number
}
// ── Child category card ───────────────────────────────────────────────────
function ChildCategoryCard({ category, parentHandle, index, }: ChildCategoryCardProp) {
    const categoryCount = category.category_children?.length ?? 0
    const subCategories = category.category_children ?? []
    const isLarge = index === 0

    // Build correct href from handle
    const segments = category.handle.split("/")
    const rest = segments.slice(1)
    const href = rest.length === 0 ? `/category/${parentHandle}` : `/category/${parentHandle}/${rest.join("/")}`

    return (
        <Link
            href={href}
            className={`group relative overflow-hidden border border-border bg-card hover:border-primary/40 transition-all duration-500 cursor-pointer ${isLarge ? "md:col-span-2 md:row-span-2" : ""}`}
        >
            {/* Image */}
            <div className={`relative overflow-hidden ${isLarge ? "aspect-4/3 md:aspect-3/2" : "aspect-4/3"}`}>
                <Image
                    src={getCategoryImage(category.handle)}
                    alt={category.name}
                    fill
                    sizes={isLarge ? "(max-width: 768px) 100vw, 66vw" : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"}
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    loading={index < 2 ? "eager" : "lazy"}
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />

                {/* Content overlay */}
                <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-6">
                    {/* Count badge */}
                    {categoryCount > 0 && (
                        <div className="mb-2.5">
                            <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-white/80 bg-white/15 backdrop-blur-sm px-2.5 py-1 rounded-full">
                                <Layers className="size-3" />
                                {categoryCount} {categoryCount === 1 ? "category" : "categories"}
                            </span>
                        </div>
                    )}

                    <h3
                        className={`font-heading font-semibold text-white mb-1.5 tracking-tight ${isLarge ? "text-2xl md:text-3xl" : "text-lg md:text-xl"
                            }`}
                    >
                        {category.name}
                    </h3>

                    {category.description && (
                        <p className={`text-white/75 leading-relaxed mb-3 line-clamp-2 ${isLarge ? "text-sm md:text-base max-w-md" : "text-xs md:text-sm"}`}>
                            {category.description}
                        </p>
                    )}

                    {/* Subcategory pills */}
                    {subCategories.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-3">
                            {subCategories.slice(0, isLarge ? 6 : 3).map((sub) => (
                                <span key={sub.id} className="text-[10px] font-medium text-white/70 bg-white/10 backdrop-blur-sm px-2 py-0.5 rounded-full">
                                    {sub.name}
                                </span>
                            ))}
                            {subCategories.length > (isLarge ? 6 : 3) && (
                                <span className="text-[10px] font-medium text-white/50 px-1">
                                    +{subCategories.length - (isLarge ? 6 : 3)} more
                                </span>
                            )}
                        </div>
                    )}

                    {/* CTA */}
                    <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white group-hover:text-accent transition-colors duration-200">
                        Explore Collection
                        <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                </div>
            </div>
        </Link>
    )
}

type PopularSubcategories = {
    parent: StoreProductCategory,
    parentHandle: string
}
// ── Popular Subcategories ─────────────────────────────────────────────────
function PopularSubcategories({ parent, parentHandle, }: PopularSubcategories) {
    const leaves = getLeafCategories(parent.category_children).slice(0, 8)
    if (leaves.length === 0) return null

    return (
        <section className="py-10 md:py-14">
            <div className="mb-7">
                <p className="inline-flex items-center gap-2.5 text-[10px] font-semibold tracking-[0.30em] uppercase text-accent mb-2.5">
                    <span className="block h-px w-7 bg-accent" aria-hidden="true" />
                    Popular in {parent.name}
                </p>
                <h2 className="font-heading text-xl md:text-2xl font-semibold text-text-primary tracking-tight">
                    Browse Specific Styles
                </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
                {leaves.map((leaf) => {
                    const segments = leaf.handle.split("/")
                    const rest = segments.slice(1)
                    const href = rest.length === 0 ? `/category/${parentHandle}` : `/category/${parentHandle}/${rest.join("/")}`

                    return (
                        <Link
                            key={leaf.id}
                            href={href}
                            className="group relative overflow-hidden bg-card border border-border hover:border-primary/40 transition-all duration-300"
                        >
                            <div className="aspect-3/2 overflow-hidden">
                                <Image
                                    src={getCategoryImage(leaf.handle)}
                                    alt={leaf.name}
                                    width={400}
                                    height={270}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    loading="lazy"
                                />
                            </div>
                            <div className="p-3 md:p-4 flex items-center justify-between gap-2">
                                <h4 className="text-sm font-medium text-text-primary group-hover:text-primary transition-colors truncate">
                                    {leaf.name}
                                </h4>
                                <ArrowRight className="size-3.5 text-text-tertiary group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-200 shrink-0" />
                            </div>
                        </Link>
                    )
                })}
            </div>
        </section>
    )
}