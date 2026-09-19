import type { Metadata } from "next"
import { cookies } from "next/headers"
import { Suspense } from "react"
import { notFound } from "next/navigation"
import Link from "next/link"
import type { StoreProduct, StoreProductCategory } from "@medusajs/types"
import ProductListingClient from "@/module/categories/templates/product-listing-client"
import { getCategoryByHandle } from "@/lib/action/categories"
import { getSizesForHandle } from "@/data/category-page"
import { listProducts } from "@/lib/action/product"
import { sortProducts } from "@/lib/util/sort-products"
import { toTitleCase } from "@/lib/util/get-title-case"
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

/* ─── Helpers ─────────────────────────────────────────────────────────── */
function toArray(v: string | string[] | undefined): string[] {
    if (!v) return []
    return Array.isArray(v) ? v : [v]
}

/**
 * Does at least one variant satisfy every requested filter? Values
 * within one facet are OR'd (size M or L); the size and color facets
 * are AND'd together (that size AND that color, on the same variant).
 */
function variantMatchesFilters(product: StoreProduct, sizes: string[], colors: string[]) {
    if (!sizes.length && !colors.length) return true
    const lowerSizes = sizes.map((s) => s.toLowerCase())
    const lowerColors = colors.map((c) => c.toLowerCase())

    return (product.variants ?? []).some((variant) => {
        const options = variant.options ?? []
        const sizeOk =
            !lowerSizes.length ||
            options.some((o: any) => {
                const title = o.option?.title?.toLowerCase?.() ?? ""
                return title === "size" && lowerSizes.includes(o.value?.toLowerCase?.() ?? "")
            })
        const colorOk =
            !lowerColors.length ||
            options.some((o: any) => {
                const title = o.option?.title?.toLowerCase?.() ?? ""
                return (title === "color" || title === "colour") && lowerColors.includes(o.value?.toLowerCase?.() ?? "")
            })
        return sizeOk && colorOk
    })
}

function productMinPrice(product: StoreProduct): number | null {
    const amounts = (product.variants ?? [])
        .map((v) => v.calculated_price?.calculated_amount)
        .filter((a): a is number => typeof a === "number")
    return amounts.length ? Math.min(...amounts) : null
}

type GetProductsFilters = {
    sort: SortOptions
    page: number
    sizes: string[]
    colors: string[]
    minPrice?: number
    maxPrice?: number
}

async function getProducts(
    category_id: string,
    countryCode: string,
    { sort, page, sizes, colors, minPrice, maxPrice }: GetProductsFilters
) {
    const limit = 12

    // The store product-list endpoint has no size/color/price filter of
    // its own, so - same as the existing sort helper already does for
    // price sorting - pull the (bounded) full category and filter, sort
    // and paginate here instead of relying on the query string alone.
    const { response: { products: allProducts } } = await listProducts({
        countryCode,
        queryParams: {
            category_id,
            limit: 100,
            fields:
                "*variants.calculated_price,+variants.inventory_quantity,*variants.images,*variants.options,*variants.options.option,+metadata,+tags,*images,*categories",
        },
    })

    const filtered = allProducts.filter((product) => {
        if (!variantMatchesFilters(product, sizes, colors)) return false
        const price = productMinPrice(product)
        if (minPrice != null && (price == null || price < minPrice)) return false
        if (maxPrice != null && (price == null || price > maxPrice)) return false
        return true
    })

    const sorted = sortProducts(filtered, sort)
    const start = (page - 1) * limit

    return {
        products: sorted.slice(start, start + limit),
        count: filtered.length,
        limit,
    }
}

function buildCrumbs(
    parent: string,
    handle: string[],
    category: StoreProductCategory
): { label: string; href: string }[] {
    const crumbs: { label: string; href: string }[] = [
        { label: "Home", href: "/" },
        { label: "Categories", href: "/category" },
        { label: toTitleCase(parent), href: `/category/${parent}` },
    ]

    // Build intermediate crumbs for nested handles
    handle.forEach((seg, idx) => {
        if (idx < handle.length - 1) {
            const path = [parent, ...handle.slice(0, idx + 1)].join("/")
            crumbs.push({
                label: toTitleCase(seg),
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
    const canonical = `${process.env.NEXT_PUBLIC_BASE_URL}/category/${fullHandle}`
    const title = `${name} | Velle Hide`
    const description =
        category?.description ?? `Shop our premium ${name.toLowerCase()} leather collection.`
    const image = category?.metadata?.thumbnail as string | undefined

    return {
        title,
        description,
        alternates: { canonical },
        openGraph: {
            type: "website",
            title,
            description,
            url: canonical,
            siteName: "Velle Hide",
            images: image ? [image] : [],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: image ? [image] : [],
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

    // ── Region (was hardcoded to "us" regardless of the visitor) ──
    const countryCode =
        (await cookies()).get("__country_code")?.value ||
        process.env.NEXT_PUBLIC_DEFAULT_REGION ||
        "us"

    // ── Query params ──
    const sort: SortOptions = sp.sort ?? "created_at"
    const page = Math.max(1, parseInt(sp.page ?? "1", 10))
    const sizes = toArray(sp.size)
    const colors = toArray(sp.color)
    const minPrice = sp.minPrice ? parseInt(sp.minPrice, 10) : undefined
    const maxPrice = sp.maxPrice ? parseInt(sp.maxPrice, 10) : undefined

    // ── Products ── (sizes/colors/min/maxPrice now actually filter the
    // results - previously computed here and then silently dropped
    // before the fetch, so the filter drawer never affected what showed)
    const { products, count, limit } = await getProducts(category.id, countryCode, {
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
            {/* ── Category hero ── */}
            <ProductCategoryHero category={category} crumbs={crumbs} />

            {/* ── Listing ── */}
            <section className="px-4 sm:px-6 lg:px-8 xl:px-10 max-w-screen-2xl mx-auto pb-16 sm:pb-24">
                <Suspense fallback={<GridSkeleton />}>
                    <ProductListingClient
                        products={products}
                        count={count}
                        currentPage={page}
                        limit={limit}
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
        <section className="relative px-4 sm:px-6 lg:px-8 xl:px-10 max-w-screen-2xl mx-auto pt-5 pb-10 sm:pb-14 overflow-hidden bg-surface-sunken">
            {/* Ambient light */}
            <div
                className="absolute top-0 right-0 w-96 h-64 rounded-full opacity-[0.08] blur-[100px] pointer-events-none bg-accent"
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
                                    <span className="font-medium text-text-secondary" aria-current="page">
                                        {c.label}
                                    </span>
                                ) : (
                                    <>
                                        <Link
                                            href={c.href}
                                            className="transition-colors hover:opacity-80 text-text-tertiary"
                                        >
                                            {c.label}
                                        </Link>
                                        <ChevronRight className="size-3 opacity-40 text-text-tertiary" />
                                    </>
                                )}
                            </li>
                        )
                    })}
                </ol>
            </nav>

            {/* Title + description */}
            <div className="relative z-10 max-w-2xl">
                <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-[1.1] mb-3 text-text-primary">
                    {category.name}
                </h1>
                {category.description && (
                    <p className="text-sm sm:text-base leading-relaxed max-w-xl text-text-secondary">
                        {category.description}
                    </p>
                )}
            </div>
        </section>
    )
}