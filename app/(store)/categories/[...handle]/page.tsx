import { getCategoryByHandle } from "@/lib/action/categories"
import { listProductsWithSort } from "@/lib/action/product"
import CategoryHero from "@/module/categories/templates/category-hero"
import FilternSort from "@/module/categories/templates/filter-n-sort"
import FilterDrawer from "@/module/categories/templates/filter-drawer"
import type { ProductOption } from "@/module/categories/templates/filter-drawer"
import ProductGrid from "@/module/categories/templates/product-grid"
import ProductGridSkeleton from "@/module/skeleton/product-grid"
import { SortOptions } from "@/types/common"
import Container from "@/ui/container"
import JsonLd from "@/module/products/templates/json-ld"
import { StoreProductCategory } from "@medusajs/types"
import { Metadata } from "next"
import { cookies } from "next/headers"
import { notFound } from "next/navigation"
import { Suspense } from "react"

/* ─── Constants ──────────────────────────────────────────────────────── */
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://vellehide.com"
const PRODUCTS_PER_PAGE = 28

/* Opt out of instant navigation — this route reads searchParams + cookies */
export const instant = false

/* ─── Types ──────────────────────────────────────────────────────────── */

export type SearchParams = {
    sort?: SortOptions
    page?: string
    optionValueIds?: string | string[]
    minPrice?: string
    maxPrice?: string
    q?: string
}

/* ─── Page ────────────────────────────────────────────────────────────── */

export default async function Page({
    params,
    searchParams,
}: PageProps<"/categories/[...handle]">) {
    const { handle } = await params
    const sp = (await searchParams) as SearchParams
    const fullHandle = handle.join("/")
    const category = await getCategoryByHandle([fullHandle])
    if (!category) notFound()

    // ── Parse query params ──
    const sort: SortOptions = sp.sort ?? "created_at"
    const page = Math.max(1, parseInt(sp.page ?? "1", 10))
    const optionValueIds = toArray(sp.optionValueIds)
    const countryCode = (await cookies()).get("__country_code")?.value || process.env.NEXT_PUBLIC_DEFAULT_REGION || "us"

    // ── Fetch products ──
    const {
        response: { products, count },
        queryParams,
    } = await listProductsWithSort({
        page,
        queryParams: {
            category_id: category.id,
            limit: PRODUCTS_PER_PAGE,
        },
        sortBy: sort,
        countryCode,
        optionValueIds: optionValueIds.length ? optionValueIds : undefined,
    })

    const totalPages = Math.ceil(count / (queryParams?.limit ?? PRODUCTS_PER_PAGE))

    // ── Extract product options from fetched products ──
    const productOptions = extractProductOptions(products)

    // ── Build breadcrumbs ──
    const crumbs = buildCrumbs(handle, category)

    // ── Active filter count ──
    const activeFilterCount =
        optionValueIds.length +
        (sp.minPrice || sp.maxPrice ? 1 : 0) +
        (sp.q ? 1 : 0)

    // ── JSON-LD structured data ──
    const categoryJsonLd = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: category.name,
        description:
            category.description ||
            `Shop our premium ${category.name.toLowerCase()} leather collection at Velle Hide.`,
        url: `${baseUrl}/categories/${fullHandle}`,
        numberOfItems: count,
        ...(category.metadata?.thumbnail
            ? { image: category.metadata.thumbnail as string }
            : {}),
    }

    return (
        <div className="min-h-screen">
            {/* Structured Data */}
            <JsonLd data={categoryJsonLd} />

            {/* Hero */}
            <CategoryHero
                crumbs={crumbs}
                name={category.name ?? handle.at(-1) ?? "Collection"}
                desc={category.description || ""}
            />

            {/* Toolbar */}
            <FilternSort
                count={count}
                sort={sort}
                activeFilterCount={activeFilterCount}
            />

            {/* Filter Drawer */}
            <Suspense fallback={null}>
                <FilterDrawer
                    currentCategory={category}
                    productOptions={productOptions}
                />
            </Suspense>

            {/* Product Grid */}
            <Container size="2xl" className="py-8 sm:py-12 md:py-14 lg:py-16">
                <Suspense fallback={<ProductGridSkeleton />}>
                    <ProductGrid
                        products={products}
                        currentPage={page}
                        totalPages={totalPages}
                        href={`/categories/${fullHandle}`}
                    />
                </Suspense>
            </Container>
        </div>
    )
}

/* ─── Metadata ────────────────────────────────────────────────────────── */

export async function generateMetadata({
    params,
}: PageProps<"/categories/[...handle]">): Promise<Metadata> {
    const { handle } = await params
    const fullHandle = handle.join("/")
    const category = await getCategoryByHandle([fullHandle])
    const name = category?.name ?? handle.at(-1) ?? "Collection"
    const canonical = `${baseUrl}/categories/${fullHandle}`

    const title = `${name} | Velle Hide — Premium Leather`
    const description =
        category?.description ??
        `Shop our premium ${name.toLowerCase()} genuine leather collection at Velle Hide. Handcrafted quality, timeless style.`

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
            images: category?.metadata?.thumbnail
                ? [
                    {
                        url: category.metadata.thumbnail as string,
                        width: 1200,
                        height: 630,
                        alt: `${name} collection at Velle Hide`,
                    },
                ]
                : [
                    {
                        url: `${baseUrl}/store.jpg`,
                        width: 1200,
                        height: 630,
                        alt: "Velle Hide leather goods",
                    },
                ],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: category?.metadata?.thumbnail
                ? [category.metadata.thumbnail as string]
                : [`${baseUrl}/store.jpg`],
        },
        robots: {
            index: true,
            follow: true,
        },
    }
}

/* ─── Helpers ─────────────────────────────────────────────────────────── */

function buildCrumbs(
    handle: string[],
    category: StoreProductCategory,
): { label: string; href: string }[] {
    const crumbs: { label: string; href: string }[] = [
        { label: "Home", href: "/" },
        { label: "Categories", href: "/categories" },
    ]

    // Build intermediate crumbs for nested handles
    handle.forEach((seg, idx) => {
        if (idx < handle.length - 1) {
            const path = handle.slice(0, idx + 1).join("/")
            crumbs.push({
                label:
                    seg.charAt(0).toUpperCase() +
                    seg.slice(1).replace(/-/g, " "),
                href: `/categories/${path}`,
            })
        }
    })

    // Last crumb is the current category name (not linked)
    crumbs.push({ label: category.name, href: "#" })

    return crumbs
}

export function toArray(v: string | string[] | undefined): string[] {
    if (!v) return []
    return Array.isArray(v) ? v : [v]
}

/**
 * Extract unique product options (Size, Color, Material, etc.) from fetched products
 * to populate the filter drawer dynamically.
 */
export function extractProductOptions(
    products: { options?: { id: string; title: string; values?: { id: string; value: string }[] }[] | null }[],
): ProductOption[] {
    const optionMap = new Map<
        string,
        { id: string; title: string; values: Map<string, string> }
    >()

    for (const product of products) {
        if (!product.options) continue
        for (const option of product.options) {
            if (!optionMap.has(option.title)) {
                optionMap.set(option.title, {
                    id: option.id,
                    title: option.title,
                    values: new Map(),
                })
            }
            const entry = optionMap.get(option.title)!
            for (const val of option.values ?? []) {
                entry.values.set(val.id, val.value)
            }
        }
    }

    return Array.from(optionMap.values()).map((opt) => ({
        id: opt.id,
        title: opt.title,
        values: Array.from(opt.values.entries()).map(([id, value]) => ({
            id,
            value,
        })),
    }))
}