import { useMemo } from "react"

/**
 * Generates a smart pagination range with ellipsis.
 *
 * @param currentPage  Current active page (1-indexed)
 * @param totalPages   Total number of pages
 * @param siblingCount How many siblings on each side of current page
 *
 * @returns Object with page numbers, navigation helpers, and URL builder
 *
 * @example
 * const { pages, canPrev, canNext, buildPageUrl } = usePagination({
 *   currentPage: 5,
 *   totalPages: 20,
 *   siblingCount: 1,
 * })
 */
export default function usePagination({
    currentPage,
    totalPages,
    siblingCount = 1,
}: UsePaginationProps): UsePaginationReturn {
    const pages = useMemo(() => {
        if (totalPages <= 1) return [1]

        const range = (start: number, end: number): number[] => {
            const length = end - start + 1
            return Array.from({ length }, (_, i) => start + i)
        }

        // Total page numbers to show: siblings on each side + first + last + current + 2 ellipsis
        const totalPageNumbers = siblingCount * 2 + 5

        // Case 1: If total pages fits within our budget, show all
        if (totalPageNumbers >= totalPages) {
            return range(1, totalPages)
        }

        const leftSiblingIndex = Math.max(currentPage - siblingCount, 1)
        const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages)

        const showLeftEllipsis = leftSiblingIndex > 2
        const showRightEllipsis = rightSiblingIndex < totalPages - 1

        // Case 2: No left ellipsis, right ellipsis
        if (!showLeftEllipsis && showRightEllipsis) {
            const leftItemCount = 3 + 2 * siblingCount
            const leftRange = range(1, leftItemCount)
            return [...leftRange, "..." as const, totalPages]
        }

        // Case 3: Left ellipsis, no right ellipsis
        if (showLeftEllipsis && !showRightEllipsis) {
            const rightItemCount = 3 + 2 * siblingCount
            const rightRange = range(totalPages - rightItemCount + 1, totalPages)
            return [1, "..." as const, ...rightRange]
        }

        // Case 4: Both ellipsis
        const middleRange = range(leftSiblingIndex, rightSiblingIndex)
        return [1, "..." as const, ...middleRange, "..." as const, totalPages]
    }, [currentPage, totalPages, siblingCount])

    const canPrev = currentPage > 1
    const canNext = currentPage < totalPages

    /**
     * Builds a page URL preserving existing search params.
     * Set page to the base path when page=1 for cleaner URLs.
     */
    const buildPageUrl = (basePath: string, page: number, existingParams?: URLSearchParams): string => {
        const params = new URLSearchParams(existingParams?.toString() ?? "")

        if (page <= 1) {
            params.delete("page")
        } else {
            params.set("page", String(page))
        }

        const qs = params.toString()
        return qs ? `${basePath}?${qs}` : basePath
    }

    return {
        pages,
        currentPage,
        totalPages,
        canPrev,
        canNext,
        buildPageUrl,
    }
}

/* ─── Types ──────────────────────────────────────────────────────────── */

export type PageItem = number | "..."

export interface UsePaginationProps {
    currentPage: number
    totalPages: number
    /** Number of sibling pages on each side. Default: 1 */
    siblingCount?: number
}

export interface UsePaginationReturn {
    /** Array of page numbers and ellipsis markers */
    pages: PageItem[]
    currentPage: number
    totalPages: number
    canPrev: boolean
    canNext: boolean
    /** Build a page URL preserving existing search params */
    buildPageUrl: (basePath: string, page: number, existingParams?: URLSearchParams) => string
}
