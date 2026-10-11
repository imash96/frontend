"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import type { Route } from "next"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import usePagination from "@/lib/hook/use-pagination"

/* ─── Types ──────────────────────────────────────────────────────────── */

type PaginationProps = {
    totalPages: number
    currentPage: number
    href: string
}

/* ─── Component ──────────────────────────────────────────────────────── */

export default function Pagination({ totalPages, currentPage, href }: PaginationProps) {
    const searchParams = useSearchParams()

    const { pages, canPrev, canNext, buildPageUrl } = usePagination({
        currentPage,
        totalPages,
        siblingCount: 1,
    })

    if (totalPages <= 1) return null

    const prevUrl = buildPageUrl(href, currentPage - 1, searchParams)
    const nextUrl = buildPageUrl(href, currentPage + 1, searchParams)

    return (
        <nav
            className="flex items-center justify-center gap-1.5 sm:gap-2 mt-12 sm:mt-16 pt-8 border-t border-divider"
            aria-label="Pagination"
        >
            {/* Previous */}
            <PaginationLink
                href={prevUrl}
                disabled={!canPrev}
                aria-label="Previous page"
                className="gap-1.5 px-3 sm:px-4"
            >
                <ChevronLeft className="size-4" />
                <span className="hidden sm:inline text-sm">Prev</span>
            </PaginationLink>

            {/* Page Numbers */}
            <div className="flex items-center gap-1 sm:gap-1.5">
                {pages.map((page, idx) =>
                    page === "..." ? (
                        <span
                            key={`ellipsis-${idx}`}
                            className="inline-flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 text-sm text-text-tertiary select-none"
                            aria-hidden
                        >
                            …
                        </span>
                    ) : (
                        <PaginationLink
                            key={page}
                            href={buildPageUrl(href, page, searchParams)}
                            active={currentPage === page}
                            aria-label={`Page ${page}`}
                            aria-current={currentPage === page ? "page" : undefined}
                        >
                            {page}
                        </PaginationLink>
                    ),
                )}
            </div>

            {/* Next */}
            <PaginationLink
                href={nextUrl}
                disabled={!canNext}
                aria-label="Next page"
                className="gap-1.5 px-3 sm:px-4"
            >
                <span className="hidden sm:inline text-sm">Next</span>
                <ChevronRight className="size-4" />
            </PaginationLink>
        </nav>
    )
}

/* ─── Pagination Link ────────────────────────────────────────────────── */

function PaginationLink({
    href,
    active = false,
    disabled = false,
    className = "",
    children,
    ...rest
}: {
    href: string
    active?: boolean
    disabled?: boolean
    className?: string
    children: React.ReactNode
} & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
    const base =
        "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary min-w-[36px] h-9 sm:min-w-[40px] sm:h-10"

    if (disabled) {
        return (
            <span
                className={`${base} text-text-disabled cursor-not-allowed opacity-40 ${className}`}
                aria-disabled="true"
                {...rest}
            >
                {children}
            </span>
        )
    }

    if (active) {
        return (
            <span
                className={`${base} bg-primary text-primary-foreground shadow-sm pointer-events-none ${className}`}
                {...rest}
            >
                {children}
            </span>
        )
    }

    return (
        <Link
            href={href as Route}
            className={`${base} text-text-secondary hover:bg-muted hover:text-text-primary active:scale-95 ${className}`}
            scroll={true}
            {...rest}
        >
            {children}
        </Link>
    )
}
