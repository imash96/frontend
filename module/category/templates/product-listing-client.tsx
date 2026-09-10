"use client"

import { useCallback, useState } from "react"
import FilterDrawer from "../components/filter-drawer"
import ProductGrid from "../components/product-grid"
import { StoreProductCategory, StoreProduct } from "@medusajs/types"

interface ProductListingClientProps {
    products: StoreProduct[]
    count: number
    currentPage: number
    limit: number
    sort: string
    category: StoreProductCategory | null
    sizes: string[] | null
    activeFilters: {
        sizes: string[]
        colors: string[]
        minPrice: string
        maxPrice: string
    }
}

export default function ProductListingClient({
    products,
    count,
    currentPage,
    limit,
    sort,
    category,
    sizes,
    activeFilters,
}: ProductListingClientProps) {
    const [drawerOpen, setDrawerOpen] = useState(false)

    // Stable callbacks — prevent unnecessary child re-renders
    const openDrawer = useCallback(() => setDrawerOpen(true), [])
    const closeDrawer = useCallback(() => setDrawerOpen(false), [])

    const activeFilterCount =
        activeFilters.sizes.length +
        activeFilters.colors.length +
        (activeFilters.minPrice || activeFilters.maxPrice ? 1 : 0)

    return (
        <div className="pt-6 sm:pt-8">
            <FilterDrawer
                isOpen={drawerOpen}
                onClose={closeDrawer}
                currentCategory={category}
                sizes={sizes}
                activeFilters={activeFilters}
            />

            <ProductGrid
                products={products}
                count={count}
                currentPage={currentPage}
                limit={limit}
                sort={sort}
                onFilterOpen={openDrawer}
                activeFilterCount={activeFilterCount}
            />
        </div>
    )
}