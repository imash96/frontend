"use client"

import { useCallback } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import Container from "@/ui/container"
import { SlidersHorizontal, ArrowUpDown } from "lucide-react"
import { useDrawerStore } from "@/lib/store/drawer-store"
import { useActiveFilterCount } from "@/lib/store/filter-store"

type Props = {
    count: number
    sort: string
    activeFilterCount: number
}

export default function FilternSort({ count, sort, activeFilterCount }: Props) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const openDrawer = useDrawerStore((s) => s.open)
    const storeFilterCount = useActiveFilterCount()

    // Use the larger of prop-based or store-based count
    const filterCount = Math.max(activeFilterCount, storeFilterCount)

    const handleSortChange = useCallback(
        (e: React.ChangeEvent<HTMLSelectElement>) => {
            const params = new URLSearchParams(searchParams.toString())
            const value = e.target.value

            if (value && value !== "created_at") {
                params.set("sort", value)
            } else {
                params.delete("sort")
            }
            params.delete("page") // Reset page on sort change

            const qs = params.toString()
            router.push((qs ? `${pathname}?${qs}` : pathname) as any, { scroll: false })
        },
        [pathname, router, searchParams],
    )

    return (
        <div className="sticky top-0 z-30 border-b border-divider bg-surface/95 backdrop-blur-md">
            <Container size="2xl">
                <div className="flex items-center justify-between gap-4 py-3 sm:py-4">
                    {/* Left: Filter button + count */}
                    <div className="flex items-center gap-3 sm:gap-4">
                        <button
                            onClick={() => openDrawer("filter")}
                            className={`inline-flex items-center gap-2 px-3.5 py-2 text-sm rounded-xl border transition-all duration-200 active:scale-[0.97] ${
                                filterCount > 0
                                    ? "border-primary text-primary bg-primary/5 shadow-sm"
                                    : "border-border text-text-secondary hover:border-text-tertiary hover:text-text-primary"
                            }`}
                            aria-label={`Open filters${filterCount > 0 ? ` (${filterCount} active)` : ""}`}
                        >
                            <SlidersHorizontal className="size-4" />
                            <span className="hidden sm:inline font-medium">Filters</span>

                            {filterCount > 0 && (
                                <span className="flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold bg-primary text-primary-foreground">
                                    {filterCount}
                                </span>
                            )}
                        </button>

                        <span className="text-xs text-text-tertiary tabular-nums">
                            <span className="font-semibold text-text-secondary">{count}</span>
                            {" "}
                            {count === 1 ? "product" : "products"}
                        </span>
                    </div>

                    {/* Right: Sort dropdown */}
                    <div className="relative">
                        <ArrowUpDown className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-text-tertiary" />
                        <select
                            value={sort}
                            onChange={handleSortChange}
                            className="appearance-none pl-8 pr-8 py-2 text-sm rounded-xl border border-border bg-surface text-text-primary outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 cursor-pointer transition-all"
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
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M19 9l-7 7-7-7"
                            />
                        </svg>
                    </div>
                </div>
            </Container>
        </div>
    )
}

const SORT_OPTIONS = [
    { label: "Newest First", value: "created_at" },
    { label: "Price: Low → High", value: "price_asc" },
    { label: "Price: High → Low", value: "price_desc" },
    { label: "Name: A → Z", value: "name_asc" },
] as const