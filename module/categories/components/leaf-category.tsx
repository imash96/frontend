import { getCategoryImage } from "@/data/category-page";
import { StoreProductCategory } from "@medusajs/types";
import Image from "next/image";
import Link from "next/link";

export default function LeafScrollRow({ leaves, maxRows }: { leaves: StoreProductCategory[]; maxRows: number }) {
    const itemsPerRow = 6
    const threshold = maxRows * itemsPerRow
    const shouldScroll = leaves.length > threshold

    if (shouldScroll) {
        return (
            <div className="relative">
                <div
                    aria-label="Browse categories"
                    className="flex gap-4 sm:gap-5 overflow-x-auto pb-4 no-scrollbar scroll-smooth -mx-4 px-4 md:mx-0 md:px-0"
                >
                    {leaves.map((leaf) => (
                        <LeafCategoryCircle key={leaf.id} cat={leaf} />
                    ))}
                    {/* Trailing spacer so last item doesn't hide under fade */}
                    <div className="shrink-0 w-4 md:w-12" aria-hidden />
                </div>
                {/* Right fade - desktop only */}
                <div
                    className="hidden md:block absolute right-0 top-0 bottom-4 w-20 pointer-events-none"
                    style={{ background: "linear-gradient(to left, var(--background), transparent)" }}
                    aria-hidden="true"
                />
            </div>
        )
    }

    // Grid mode for fewer items
    return (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 sm:gap-5">
            {leaves.map((leaf) => (
                <div key={leaf.id} className="flex justify-center">
                    <LeafCategoryCircle cat={leaf} />
                </div>
            ))}
        </div>
    )
}

function LeafCategoryCircle({ cat }: { cat: StoreProductCategory }) {
    const img = getCategoryImage(cat.handle)

    const segments = cat.handle.split("/")
    const [parentSeg, ...rest] = segments

    return (
        <Link
            href={rest.length === 0 ? `/categories/${parentSeg}` : `/categories/${parentSeg}/${rest.join("/")}`}
            className="group flex flex-col items-center gap-2.5 shrink-0 w-22 sm:w-25"
        >
            <div className="relative w-18 h-18 sm:w-21 sm:h-21 rounded-full overflow-hidden border-2 border-border bg-surface-sunken group-hover:border-primary group-hover:shadow-md transition-all duration-300">
                <Image
                    src={img}
                    alt={cat.name}
                    fill
                    sizes="84px"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
            </div>
            <span className="text-[11px] sm:text-xs font-medium text-text-secondary group-hover:text-text-primary text-center leading-tight transition-colors line-clamp-2">
                {cat.name}
            </span>
        </Link>
    )
}