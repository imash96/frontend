"use client"

import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { useCallback } from "react"

export default function EmptyState() {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const clearFilters = useCallback(() => {
        const params = new URLSearchParams(searchParams.toString())
        // Remove all filter params but keep sort
        params.delete("page")
        params.delete("minPrice")
        params.delete("maxPrice")
        params.delete("optionValueIds")
        params.delete("q")

        const qs = params.toString()
        router.push((qs ? `${pathname}?${qs}` : pathname) as any, { scroll: false })
    }, [router, pathname, searchParams])

    return (
        <div className="flex flex-col items-center justify-center py-24 sm:py-32 text-center px-4">
            {/* Icon */}
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 bg-muted/50 border border-border">
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1}
                    className="w-9 h-9 text-text-tertiary"
                    aria-hidden="true"
                >
                    <circle cx="11" cy="11" r="8" />
                    <path strokeLinecap="round" d="m21 21-4.35-4.35" />
                </svg>
            </div>

            <h3 className="text-lg font-semibold mb-2 text-text-primary">
                No products found
            </h3>
            <p className="text-sm mb-8 max-w-sm text-text-secondary leading-relaxed">
                We couldn&apos;t find any products matching your current filters.
                Try adjusting or clearing them to browse our full collection.
            </p>

            <button
                onClick={clearFilters}
                className="px-6 py-2.5 text-sm font-medium rounded-xl border border-border text-text-secondary transition-all duration-200 hover:border-primary hover:text-primary hover:shadow-sm active:scale-[0.97]"
            >
                Clear all filters
            </button>
        </div>
    )
}