import { getLeafCategories } from "@/data/category-page"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import LeafScrollRow from "../components/leaf-scroll"
import { StoreProductCategory } from "@medusajs/types"

export default function ParentCategorySection({ parent }: { parent: StoreProductCategory }) {
    const leaves = getLeafCategories(parent.category_children)
    // Build the correct href for the parent category
    const parentHref = `/category/${parent.handle.split("/")[0]}`

    return (
        <section className="py-8 md:py-10 border-b border-divider last:border-b-0">
            {/* Header */}
            <div className="flex items-start sm:items-end justify-between gap-4 mb-6 md:mb-8">
                <div className="flex-1 min-w-0">
                    <Link
                        href={parentHref}
                        className="group inline-flex items-center gap-2 mb-2"
                    >
                        <h2 className="font-heading text-xl sm:text-2xl md:text-[1.75rem] font-semibold text-text-primary group-hover:text-primary transition-colors tracking-tight">
                            {parent.name}
                        </h2>
                        <ArrowRight className="size-5 text-text-tertiary group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-200 shrink-0" />
                    </Link>
                    {parent.description && (
                        <p className="text-sm text-text-secondary leading-relaxed max-w-2xl line-clamp-2">
                            {parent.description}
                        </p>
                    )}
                </div>

                {/* "View All" link - properly linked */}
                <Link
                    href={parentHref}
                    className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary-hover transition-colors shrink-0 group"
                >
                    View All
                    <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                </Link>
            </div>

            {/* Leaf categories */}
            <LeafScrollRow leaves={leaves} maxRows={3} />
        </section>
    )
}