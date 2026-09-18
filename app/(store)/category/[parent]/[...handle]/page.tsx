import type { Metadata } from "next"
import { Suspense } from "react"
import { notFound } from "next/navigation"
import Link from "next/link"
import ProductListingClient from "@/module/category/templates/product-listing-client"
import { getCategoryByHandle } from "@/lib/action/categories"
import { StoreProductCategory } from "@medusajs/types"
import { getSizesForHandle } from "@/data/category-page"
import { listProductsWithSort } from "@/lib/action/product"
import { SortOptions } from "@/types/common"
import { ChevronRight } from "lucide-react"

/* ─── Types ───────────────────────────────────────────────────────────── */
type SearchParams = {
    sort?: SortOptions
    page?: string
    size?: string | string[]
    color?: string | string[]
    minPrice?: string
    maxPrice?: string
}

type GetProductsProps = {
    sort: SortOptions
    page: number
    sizes: string[]
    colors: string[]
    minPrice?: number
    maxPrice?: number
}

/* ─── Helpers ─────────────────────────────────────────────────────────── */
function toArray(v: string | string[] | undefined): string[] {
    if (!v) return []
    return Array.isArray(v) ? v : [v]
}

async function getProducts(
    category_id: string,
    { sort, page }: GetProductsProps
) {
    return await listProductsWithSort({
        page,
        queryParams: { category_id },
        sortBy: sort,
        countryCode: "us",
    })
}

function buildCrumbs(
    parent: string,
    handle: string[],
    category: StoreProductCategory
): { label: string; href: string }[] {
    const crumbs: { label: string; href: string }[] = [
        { label: "Home", href: "/" },
        { label: "Categories", href: "/category" },
        { label: parent.charAt(0).toUpperCase() + parent.slice(1), href: `/category/${parent}` },
    ]

    // Build intermediate crumbs for nested handles
    handle.forEach((seg, idx) => {
        if (idx < handle.length - 1) {
            const path = [parent, ...handle.slice(0, idx + 1)].join("/")
            crumbs.push({
                label: seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, " "),
                href: `/category/${path}`,
            })
        }
    })

    // Last crumb is the current category name (not linked)
    crumbs.push({ label: category.name, href: "#" })

    return crumbs
}

/* ─── Skeleton ────────────────────────────────────────────────────────── */
function GridSkeleton() {
    return (
        <div className="pt-8">
            {/* Toolbar skeleton */}
            <div className="flex items-center justify-between gap-3 mb-8 pb-5 border-b border-divider">
                <div className="h-9 w-28 bg-surface-sunken rounded-lg animate-pulse" />
                <div className="h-9 w-36 bg-surface-sunken rounded-lg animate-pulse" />
            </div>
            {/* Grid skeleton */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8 sm:gap-x-5 sm:gap-y-10">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i}>
                        <div className="aspect-3/4 rounded-xl bg-surface-sunken animate-pulse mb-3" />
                        <div className="h-3 w-16 bg-surface-sunken rounded animate-pulse mb-2" />
                        <div className="h-4 w-3/4 bg-surface-sunken rounded animate-pulse mb-1.5" />
                        <div className="h-3.5 w-20 bg-surface-sunken rounded animate-pulse" />
                    </div>
                ))}
            </div>
        </div>
    )
}

/* ─── Metadata ────────────────────────────────────────────────────────── */
export async function generateMetadata({
    params,
}: PageProps<"/category/[parent]/[...handle]">): Promise<Metadata> {
    const { parent, handle } = await params
    const fullHandle = [parent, ...handle].join("/")
    const category = await getCategoryByHandle([fullHandle])
    const name = category?.name ?? handle.at(-1) ?? "Collection"

    return {
        title: `${name} | Nocturne Leather`,
        description: category?.description ?? `Shop our premium ${name.toLowerCase()} leather collection.`,
        openGraph: {
            images: category?.metadata?.thumbnail ? [category.metadata.thumbnail as string] : [],
        },
    }
}

/* ─── Page (Server Component) ─────────────────────────────────────────── */
export default async function Page({
    params,
    searchParams,
}: PageProps<"/category/[parent]/[...handle]">) {
    const { parent, handle } = await params
    const sp = (await searchParams) as SearchParams
    const fullHandle = [parent, ...handle].join("/")

    // ── Category ──
    const category = await getCategoryByHandle([fullHandle])
    if (!category) notFound()

    // ── Query params ──
    const sort: SortOptions = sp.sort ?? "created_at"
    const page = Math.max(1, parseInt(sp.page ?? "1", 10))
    const sizes = toArray(sp.size)
    const colors = toArray(sp.color)
    const minPrice = sp.minPrice ? parseInt(sp.minPrice, 10) : undefined
    const maxPrice = sp.maxPrice ? parseInt(sp.maxPrice, 10) : undefined

    // ── Products ──
    const { response: { products, count, }, queryParams } = await getProducts(category.id, {
        sort,
        page,
        sizes,
        colors,
        minPrice,
        maxPrice,
    })

    // ── Sizes config ──
    const sizes_for_category = getSizesForHandle(fullHandle)

    // ── Breadcrumbs ──
    const crumbs = buildCrumbs(parent, handle, category)

    return (
        <main className="min-h-screen bg-background">
            {/* ── Category hero ──────────────────────────────────────────── */}
            <ProductCategoryHero category={category} crumbs={crumbs} />

            {/* ── Listing ────────────────────────────────────────────────── */}
            <section className="px-4 sm:px-6 lg:px-8 xl:px-10 max-w-screen-2xl mx-auto pb-16 sm:pb-24">
                <Suspense fallback={<GridSkeleton />}>
                    <ProductListingClient
                        products={products}
                        count={count}
                        currentPage={page}
                        limit={queryParams?.limit!}
                        sort={sort}
                        category={category}
                        sizes={sizes_for_category}
                        activeFilters={{
                            sizes,
                            colors,
                            minPrice: sp.minPrice ?? "",
                            maxPrice: sp.maxPrice ?? "",
                        }}
                    />
                </Suspense>
            </section>
        </main>
    )
}

/* ─── Hero ────────────────────────────────────────────────────────────── */
function ProductCategoryHero({
    category,
    crumbs,
}: {
    category: StoreProductCategory
    crumbs: { label: string; href: string }[]
}) {
    return (
        <section
            className="relative px-4 sm:px-6 lg:px-8 xl:px-10 max-w-screen-2xl mx-auto pt-5 pb-10 sm:pb-14 overflow-hidden"
            style={{ background: "var(--color-brand-surface)" }}
        >
            {/* Ambient light - fixed opacity to valid Tailwind value */}
            <div
                className="absolute top-0 right-0 w-96 h-64 rounded-full opacity-[0.08] blur-[100px] pointer-events-none"
                style={{ background: "var(--color-accent)" }}
                aria-hidden="true"
            />

            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="mb-5 relative z-10">
                <ol className="flex items-center gap-1.5 flex-wrap text-xs">
                    {crumbs.map((c, i) => {
                        const isLast = i === crumbs.length - 1
                        return (
                            <li key={i} className="flex items-center gap-1.5">
                                {isLast ? (
                                    <span
                                        className="font-medium"
                                        style={{ color: "var(--color-brand-text-soft)" }}
                                        aria-current="page"
                                    >
                                        {c.label}
                                    </span>
                                ) : (
                                    <>
                                        <Link
                                            href={c.href}
                                            className="transition-colors hover:opacity-80"
                                            style={{ color: "var(--color-brand-text-faint)" }}
                                        >
                                            {c.label}
                                        </Link>
                                        <ChevronRight
                                            className="size-3 opacity-40"
                                            style={{ color: "var(--color-brand-text-faint)" }}
                                        />
                                    </>
                                )}
                            </li>
                        )
                    })}
                </ol>
            </nav>

            {/* Title + description */}
            <div className="relative z-10 max-w-2xl">
                <h1
                    className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-[1.1] mb-3"
                    style={{
                        fontFamily: "var(--font-heading)",
                        color: "var(--color-brand-text)",
                    }}
                >
                    {category.name}
                </h1>
                {category.description && (
                    <p
                        className="text-sm sm:text-base leading-relaxed max-w-xl"
                        style={{ color: "var(--color-brand-text-soft)" }}
                    >
                        {category.description}
                    </p>
                )}
            </div>
        </section>
    )
}