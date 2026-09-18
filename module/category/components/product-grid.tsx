"use client"

import { useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { convertToLocale } from "@/lib/util/money"
import { StoreProduct } from "@medusajs/types"
import { SlidersHorizontal, Heart, ChevronRight } from "lucide-react"
import { getCategoryByHandle } from "@/lib/action/categories"

interface ProductGridProps {
    products: StoreProduct[]
    count: number
    currentPage: number
    limit: number
    sort: string
    onFilterOpen: () => void
    activeFilterCount: number
}

const SORT_OPTIONS = [
    { label: "Newest First", value: "created_at" },
    { label: "Price: Low–High", value: "price_asc" },
    { label: "Price: High–Low", value: "price_desc" },
    { label: "Name A–Z", value: "name_asc" },
] as const

export default function ProductGrid({
    products,
    count,
    currentPage,
    limit,
    sort,
    onFilterOpen,
    activeFilterCount,
}: ProductGridProps) {

    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const totalPages = Math.ceil(count / limit)

    const setParam = useCallback(
        (key: string, value: string) => {

            const params = new URLSearchParams(searchParams.toString())

            if (value) params.set(key, value)
            else params.delete(key)

            router.push(`${pathname}?${params.toString()}`, { scroll: false })

        },
        [pathname, router, searchParams]
    )

    const handleSortChange = useCallback(
        (e: React.ChangeEvent<HTMLSelectElement>) => {

            setParam("sort", e.target.value)
            setParam("page", "")

        },
        [setParam]
    )

    const handlePageChange = useCallback(
        (p: number) => setParam("page", String(p)),
        [setParam]
    )

    return (
        <div>

            {/* Toolbar */}
            <div className="flex items-center justify-between gap-3 mb-8 pb-5 border-b border-border">

                {/* Left */}
                <div className="flex items-center gap-3">

                    <button
                        onClick={onFilterOpen}
                        className={`inline-flex items-center gap-2 px-3.5 py-2 text-sm rounded-lg border transition
            ${activeFilterCount > 0
                                ? "border-accent text-accent bg-accent-subtle"
                                : "border-border text-text-secondary hover:border-border-strong"
                            }`}
                        aria-label={`Open filters${activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}`}
                    >

                        <SlidersHorizontal className="size-4" />

                        <span className="hidden sm:inline">Filters</span>

                        {activeFilterCount > 0 && (
                            <span className="flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-semibold bg-accent text-accent-foreground">
                                {activeFilterCount}
                            </span>
                        )}

                    </button>

                    <span className="hidden sm:block text-xs text-text-tertiary">
                        {count} {count === 1 ? "piece" : "pieces"}
                    </span>

                </div>

                {/* Sort */}
                <div className="relative">

                    <select
                        value={sort}
                        onChange={handleSortChange}
                        className="appearance-none pl-3.5 pr-8 py-2 text-sm rounded-lg border border-border bg-surface text-text-primary outline-none focus:border-primary cursor-pointer"
                        aria-label="Sort products"
                    >
                        {SORT_OPTIONS.map((o) => (
                            <option key={o.value} value={o.value}>
                                {o.label}
                            </option>
                        ))}
                    </select>

                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.5}
                        className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-tertiary"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>

                </div>

            </div>

            {/* Grid */}
            {products.length === 0 ? (

                <EmptyState onClearFilters={() => router.push(pathname)} />

            ) : (

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-x-4 gap-y-10">

                    {products.map((product, idx) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            priority={idx < 4}
                        />
                    ))}

                </div>

            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onChange={handlePageChange}
                />
            )}

        </div>
    )
}

/* ── Product Card - CSS-only hover, no JS state per card ─────────────── */
function ProductCard({
    product,
    priority = false,
}: {
    product: StoreProduct
    priority?: boolean
}) {
    const variant = product.variants?.[0]
    const price = variant?.calculated_price
    const firstImg = product.thumbnail ?? product.images?.[0]?.url
    const secondImg = product.images?.[1]?.url

    return (
        <Link href={`/products/${product.handle}`} className="group block">

            <div className="relative overflow-hidden rounded-xl mb-3 aspect-3/4 bg-surface">

                <Image
                    src={firstImg as string}
                    alt={product.title}
                    fill
                    sizes="(max-width:640px)50vw,(max-width:1024px)33vw,25vw"
                    className={`object-cover transition duration-700 ${secondImg ? "group-hover:opacity-0" : "group-hover:scale-105"
                        }`}
                    priority={priority}
                />

                {secondImg && (
                    <Image
                        src={secondImg}
                        alt=""
                        fill
                        className="object-cover opacity-0 group-hover:opacity-100 transition duration-700 group-hover:scale-[1.03]"
                    />
                )}

                {/* Wishlist */}
                <button
                    className="absolute top-3 right-3 p-2 rounded-full opacity-0 group-hover:opacity-100 transition bg-black/50 backdrop-blur-md text-white"
                    onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                    }}
                >
                    <Heart className="size-4" strokeWidth={1.5} />
                </button>

            </div>

            <div className="space-y-1">

                <p className="text-[10px] uppercase tracking-widest text-text-tertiary truncate">
                    {product.collection?.title ?? product.categories?.[0]?.name ?? ""}
                </p>

                <h3 className="text-sm font-medium text-text-primary line-clamp-2 group-hover:opacity-70 transition">
                    {product.title}
                </h3>

                {price && (
                    <div className="flex items-baseline gap-2 pt-0.5">

                        <span className="text-sm font-semibold text-text-primary">
                            {convertToLocale({
                                amount: price.calculated_amount ?? 0,
                                currency_code: price.currency_code ?? "usd",
                            })}
                        </span>

                        {price.original_amount &&
                            price.original_amount > (price.calculated_amount ?? 0) && (
                                <span className="text-xs line-through text-text-tertiary">
                                    {convertToLocale({
                                        amount: price.original_amount,
                                        currency_code: price.currency_code ?? "usd",
                                    })}
                                </span>
                            )}

                    </div>
                )}

            </div>

        </Link>
    )
}

/* ── Empty State ─────────────────────────────────────────────────────── */
function EmptyState({ onClearFilters }: { onClearFilters: () => void }) {
    return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
            <div
                className="w-16 h-16 rounded-full flex items-center justify-center mb-5"
                style={{ background: "var(--color-brand-elevated)" }}
            >
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1}
                    className="w-7 h-7"
                    style={{ color: "var(--color-brand-text-faint)" }}
                    aria-hidden="true"
                >
                    <circle cx="11" cy="11" r="8" />
                    <path strokeLinecap="round" d="m21 21-4.35-4.35" />
                </svg>
            </div>
            <h3
                className="text-base font-medium mb-2"
                style={{ color: "var(--color-brand-text)" }}
            >
                No products found
            </h3>
            <p
                className="text-sm mb-6 max-w-xs"
                style={{ color: "var(--color-brand-text-soft)" }}
            >
                Try adjusting your filters or clearing them to see all available products.
            </p>
            <button
                onClick={onClearFilters}
                className="px-5 py-2 text-sm font-medium rounded-lg border transition-colors"
                style={{
                    borderColor: "var(--color-brand-border-light)",
                    color: "var(--color-brand-text-soft)",
                }}
            >
                Clear all filters
            </button>
        </div>
    )
}

/* ── Pagination ──────────────────────────────────────────────────────── */
function Pagination({
    currentPage,
    totalPages,
    onChange,
}: {
    currentPage: number
    totalPages: number
    onChange: (page: number) => void
}) {
    // Build visible page range (max 7 slots)
    const getPages = (): (number | "…")[] => {
        if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)
        if (currentPage <= 4) return [1, 2, 3, 4, 5, "…", totalPages]
        if (currentPage >= totalPages - 3)
            return [1, "…", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
        return [1, "…", currentPage - 1, currentPage, currentPage + 1, "…", totalPages]
    }

    const pages = getPages()

    const btnBase =
        "flex items-center justify-center w-9 h-9 rounded-lg text-sm font-medium transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"

    return (
        <nav
            aria-label="Pagination"
            className="flex items-center justify-center gap-1.5 mt-14"
        >
            {/* Prev */}
            <button
                onClick={() => onChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={btnBase}
                style={{
                    border: "1px solid var(--color-brand-border-light)",
                    color: "var(--color-brand-text-soft)",
                    background: "transparent",
                }}
                aria-label="Previous page"
            >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
            </button>

            {pages.map((p, i) =>
                p === "…" ? (
                    <span
                        key={`ellipsis-${i}`}
                        className="flex items-center justify-center w-9 h-9 text-sm"
                        style={{ color: "var(--color-brand-text-faint)" }}
                        aria-hidden="true"
                    >
                        …
                    </span>
                ) : (
                    <button
                        key={p}
                        onClick={() => onChange(p)}
                        className={btnBase}
                        aria-label={`Page ${p}`}
                        aria-current={p === currentPage ? "page" : undefined}
                        style={
                            p === currentPage
                                ? {
                                    background: "var(--color-accent)",
                                    color: "#0e0c0a",
                                    border: "1px solid transparent",
                                }
                                : {
                                    border: "1px solid var(--color-brand-border-light)",
                                    color: "var(--color-brand-text-soft)",
                                    background: "transparent",
                                }
                        }
                    >
                        {p}
                    </button>
                )
            )}

            {/* Next */}
            <button
                onClick={() => onChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={btnBase}
                style={{
                    border: "1px solid var(--color-brand-border-light)",
                    color: "var(--color-brand-text-soft)",
                    background: "transparent",
                }}
                aria-label="Next page"
            >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
            </button>
        </nav>
    )
}

// ─── Breadcrumb ──────────────────────────────────────────────────────────────

function Breadcrumb({ items }: { items: { label: string; path?: string }[]; }) {
    return (
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-text-tertiary flex-wrap">
            {items.map((item, i) => (
                <span key={i} className="flex items-center gap-1.5">
                    <ChevronRight className="size-3 text-text-disabled" />
                    {item.path ? (
                        <button className="hover:text-text-primary transition-colors">
                            {item.label}
                        </button>
                    ) : (
                        <span className="text-text-primary font-medium">{item.label}</span>
                    )}
                </span>
            ))}
        </nav>
    );
}

// ─── Build breadcrumb items from handle ──────────────────────────────────────

async function buildBreadcrumbs(handle: string) {
    const parts = handle.split("/");
    const items: { label: string; path?: string }[] = [
        { label: "Categories", path: "category" },
    ];

    let currentPath = "";
    for (let i = 0; i < parts.length; i++) {
        currentPath = currentPath ? `${currentPath}/${parts[i]}` : parts[i];
        const cat = await getCategoryByHandle([currentPath]);
        if (i === parts.length - 1) {
            items.push({ label: cat?.name || parts[i] });
        } else {
            items.push({ label: cat?.name || parts[i], path: `category/${currentPath}` });
        }
    }
    return items;
}

