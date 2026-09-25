"use client"

import { StoreProductCategory } from "@medusajs/types"
import { ChevronRight, RotateCcw, X } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useRef, useTransition } from "react"
import { useDrawerStore, useIsUIOpen } from "@/lib/store/drawer-store"
import { buildFilterParams, useActiveFilterCount, useFilterStore } from "@/lib/store/filter-store"

/* ─── Types ──────────────────────────────────────────────────────────── */

export interface ProductOption {
    id: string
    title: string
    values: { id: string; value: string }[]
}

interface FilterDrawerProps {
    currentCategory: StoreProductCategory | null
    /** Dynamic product options fetched from the API */
    productOptions?: ProductOption[]
}

/* ─── Price Presets ───────────────────────────────────────────────────── */

const PRICE_RANGES = [
    { label: "Under $50", min: "", max: "50" },
    { label: "$50 - $100", min: "50", max: "100" },
    { label: "$100 - $200", min: "100", max: "200" },
    { label: "$200 - $500", min: "200", max: "500" },
    { label: "$500+", min: "500", max: "" },
] as const

/* ─── Component ──────────────────────────────────────────────────────── */

export default function FilterDrawer({
    currentCategory,
    productOptions = [],
}: FilterDrawerProps) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const isOpen = useIsUIOpen("filter")
    const closeDrawer = useDrawerStore((s) => s.close)

    const {
        sort,
        minPrice,
        maxPrice,
        optionValueIds,
        setMinPrice,
        setMaxPrice,
        toggleOptionValue,
        clearAll,
    } = useFilterStore()

    const [, startTransition] = useTransition()
    const closeBtnRef = useRef<HTMLButtonElement>(null)

    // Hydrate store from URL on open
    useEffect(() => {
        if (isOpen) {
            useFilterStore.getState().hydrate(searchParams)
        }
    }, [isOpen, searchParams])

    // Focus management & escape key
    useEffect(() => {
        if (!isOpen) return

        const timer = setTimeout(() => closeBtnRef.current?.focus(), 60)

        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") closeDrawer()
        }

        document.addEventListener("keydown", handler)
        return () => {
            clearTimeout(timer)
            document.removeEventListener("keydown", handler)
        }
    }, [isOpen, closeDrawer])

    /* ── Apply & Navigate ─────────────────────────────────────────── */

    const applyFilters = useCallback(() => {
        const state = useFilterStore.getState()
        const params = buildFilterParams(state)

        // Preserve sort from current URL if store hasn't changed it
        if (sort === "created_at") params.delete("sort")

        startTransition(() => {
            const qs = params.toString()
            router.push((qs ? `${pathname}?${qs}` : pathname) as any, { scroll: false })
            closeDrawer()
        })
    }, [pathname, router, sort, closeDrawer])

    const handleClearAll = useCallback(() => {
        clearAll()
        startTransition(() => {
            // Keep only sort if it's not default
            const params = new URLSearchParams()
            if (sort !== "created_at") params.set("sort", sort)
            const qs = params.toString()
            router.push((qs ? `${pathname}?${qs}` : pathname) as any, { scroll: false })
            closeDrawer()
        })
    }, [clearAll, sort, pathname, router, closeDrawer])

    const navigateToCategory = useCallback(
        (handle: string) => {
            router.push(`/categories/${handle}` as any)
            closeDrawer()
        },
        [router, closeDrawer],
    )

    /* ── Derived ──────────────────────────────────────────────────── */

    const children = currentCategory?.category_children ?? []
    const parent = currentCategory?.parent_category
    const totalActive = useActiveFilterCount()

    /* ── Price range match ─────────────────────────────────────────── */

    const isPriceRangeActive = (range: (typeof PRICE_RANGES)[number]) =>
        minPrice === range.min && maxPrice === range.max

    return (
        <>
            {/* Overlay */}
            <div
                aria-hidden="true"
                className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] transition-opacity duration-300 ${isOpen
                    ? "opacity-100 pointer-events-auto"
                    : "opacity-0 pointer-events-none"
                    }`}
                onClick={closeDrawer}
            />

            {/* Drawer */}
            <aside
                role="dialog"
                aria-modal="true"
                aria-labelledby="filter-drawer-title"
                className={`fixed left-0 top-0 z-50 h-full w-[88vw] max-w-sm flex flex-col bg-surface shadow-2xl transition-transform duration-300 ease-out ${isOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                {/* ── Header ──────────────────────────────────────────── */}
                <header className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-border shrink-0">
                    <div>
                        <h2
                            id="filter-drawer-title"
                            className="text-base font-semibold text-text-primary tracking-tight"
                        >
                            Filters
                        </h2>
                        {totalActive > 0 && (
                            <p className="text-xs text-accent mt-0.5 font-medium">
                                {totalActive} active
                            </p>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        {totalActive > 0 && (
                            <button
                                onClick={handleClearAll}
                                className="inline-flex items-center gap-1 text-xs font-medium text-text-tertiary hover:text-text-primary transition-colors px-2 py-1 rounded-md hover:bg-muted"
                            >
                                <RotateCcw className="size-3" />
                                Clear
                            </button>
                        )}

                        <button
                            ref={closeBtnRef}
                            onClick={closeDrawer}
                            aria-label="Close filters"
                            className="p-2 rounded-lg hover:bg-muted transition-colors"
                        >
                            <X className="size-4 text-text-secondary" />
                        </button>
                    </div>
                </header>

                {/* ── Body ────────────────────────────────────────────── */}
                <div className="flex-1 overflow-y-auto overscroll-contain px-5 sm:px-6 py-6 space-y-8">
                    {/* Back to parent */}
                    {parent && (
                        <button
                            onClick={() => navigateToCategory(parent.handle)}
                            className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-primary transition-colors group"
                        >
                            <ChevronRight className="size-3.5 rotate-180 group-hover:-translate-x-0.5 transition-transform" />
                            Back to {parent.name}
                        </button>
                    )}

                    {/* ── Browse Sub-categories ─────────────────────── */}
                    {children.length > 0 && (
                        <FilterSection title="Browse">
                            <div className="space-y-0.5">
                                {children.map((child) => (
                                    <button
                                        key={child.id}
                                        onClick={() =>
                                            navigateToCategory(child.handle)
                                        }
                                        className="flex w-full items-center justify-between px-3 py-2.5 rounded-xl text-sm text-text-secondary hover:bg-muted hover:text-text-primary transition-all group"
                                    >
                                        <span>{child.name}</span>
                                        <ChevronRight className="size-3.5 text-text-disabled group-hover:text-text-tertiary group-hover:translate-x-0.5 transition-all" />
                                    </button>
                                ))}
                            </div>
                        </FilterSection>
                    )}

                    {/* ── Product Options (Dynamic from API) ────────── */}
                    {productOptions.map((option) => (
                        <FilterSection key={option.id} title={option.title}>
                            <div className="flex flex-wrap gap-2">
                                {option.values.map((val) => {
                                    const active =
                                        optionValueIds.includes(val.id)
                                    return (
                                        <button
                                            key={val.id}
                                            onClick={() =>
                                                toggleOptionValue(val.id)
                                            }
                                            aria-pressed={active}
                                            className={`px-3.5 py-2 text-xs font-medium rounded-xl border transition-all duration-200 ${active
                                                ? "bg-primary/10 text-primary border-primary shadow-sm"
                                                : "border-border text-text-secondary hover:border-text-tertiary hover:text-text-primary"
                                                }`}
                                        >
                                            {val.value}
                                        </button>
                                    )
                                })}
                            </div>
                        </FilterSection>
                    ))}

                    {/* ── Price Range ────────────────────────────────── */}
                    <FilterSection title="Price Range">
                        {/* Quick presets */}
                        <div className="flex flex-wrap gap-2 mb-4">
                            {PRICE_RANGES.map((range) => {
                                const active = isPriceRangeActive(range)
                                return (
                                    <button
                                        key={range.label}
                                        onClick={() => {
                                            if (active) {
                                                setMinPrice("")
                                                setMaxPrice("")
                                            } else {
                                                setMinPrice(range.min)
                                                setMaxPrice(range.max)
                                            }
                                        }}
                                        aria-pressed={active}
                                        className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all duration-200 ${active
                                            ? "bg-primary/10 text-primary border-primary"
                                            : "border-border text-text-secondary hover:border-text-tertiary"
                                            }`}
                                    >
                                        {range.label}
                                    </button>
                                )
                            })}
                        </div>

                        {/* Custom inputs */}
                        <div className="flex gap-3 items-center">
                            <PriceInput
                                placeholder="Min"
                                value={minPrice}
                                onChange={setMinPrice}
                            />
                            <span className="text-text-disabled text-xs font-medium">
                                —
                            </span>
                            <PriceInput
                                placeholder="Max"
                                value={maxPrice}
                                onChange={setMaxPrice}
                            />
                        </div>
                    </FilterSection>
                </div>

                {/* ── Footer ──────────────────────────────────────────── */}
                <footer className="px-5 sm:px-6 py-4 border-t border-border shrink-0 bg-surface">
                    <button
                        onClick={applyFilters}
                        className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm tracking-wide hover:opacity-90 active:scale-[0.98] transition-all duration-200 shadow-sm"
                    >
                        Apply Filters
                        {totalActive > 0 && (
                            <span className="ml-1.5 inline-flex items-center justify-center w-5 h-5 rounded-full bg-white/20 text-[10px] font-bold">
                                {totalActive}
                            </span>
                        )}
                    </button>
                </footer>
            </aside>
        </>
    )
}

/* ─── Filter Section ─────────────────────────────────────────────────── */

function FilterSection({
    title,
    children,
}: {
    title: string
    children: React.ReactNode
}) {
    return (
        <section>
            <h3 className="text-[11px] uppercase tracking-[0.12em] font-semibold text-text-tertiary mb-3">
                {title}
            </h3>
            {children}
        </section>
    )
}

/* ─── Price Input ────────────────────────────────────────────────────── */

function PriceInput({
    placeholder,
    value,
    onChange,
}: {
    placeholder: string
    value: string
    onChange: (v: string) => void
}) {
    return (
        <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary text-xs pointer-events-none">
                $
            </span>
            <input
                type="number"
                inputMode="numeric"
                min={0}
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                aria-label={
                    placeholder === "Min" ? "Minimum price" : "Maximum price"
                }
                className="w-full pl-7 pr-3 py-2.5 text-sm rounded-xl border border-border bg-surface text-text-primary placeholder:text-text-disabled focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all"
            />
        </div>
    )
}