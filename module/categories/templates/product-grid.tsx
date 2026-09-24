import { StoreProduct } from "@medusajs/types"
import EmptyState from "../components/empty-state"
import ProductCard from "../components/product-card"
import Pagination from "../components/pagination"

type Props = {
    products: StoreProduct[]
    totalPages: number
    currentPage: number
    href: string
}

export default function ProductGrid({
    products,
    totalPages,
    currentPage,
    href,
}: Props) {
    if (products.length === 0) {
        return <EmptyState />
    }

    return (
        <div className="space-y-8">
            {/* Product Grid — spacious, breathable layout */}
            <div
                className="grid gap-x-4 gap-y-8 grid-cols-1 xs:grid-cols-2 sm:gap-x-5 sm:gap-y-10 md:grid-cols-3 md:gap-x-6 md:gap-y-12 lg:grid-cols-4 lg:gap-x-7 xl:gap-x-8 xl:gap-y-14"
            >
                {products.map((product, idx) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        priority={idx < 4}
                    />
                ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    href={href}
                />
            )}
        </div>
    )
}