import { StoreProductCategory } from "@medusajs/types";
import { ArrowRight, ChevronRight } from "lucide-react";
import Link from "next/link";
import LeafScrollRow from "../components/leaf-category";
import Button from "@/ui/button";

export default function CategorySection({ category, isLast, index }: { category: StoreProductCategory; isLast: boolean; index: number }) {
    const leaves = getLeafCategories(category);
    const seed = hashString(category.handle + 'section');

    return (
        <section
            className={`relative animate-fade-in-up ${isLast ? "" : "pb-10 sm:pb-12 lg:pb-16"}`}
            style={{ animationDelay: `${index * 80}ms` }}
        >
            <div className="flex items-start gap-4 sm:gap-5 mb-5 sm:mb-6">
                <div className="flex-1 min-w-0">
                    <Link
                        href={`/categories/${category.handle}`}
                        className="group inline-flex items-center gap-2 mb-2"
                    >
                        <h2 className="font-heading text-xl sm:text-2xl md:text-[1.75rem] font-semibold text-text-primary group-hover:text-primary transition-colors tracking-tight">
                            {category.name}
                        </h2>
                        <ArrowRight className="size-5 text-text-tertiary group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-200 shrink-0" />
                    </Link>
                    {category.description && (
                        <p className="text-sm text-text-secondary leading-relaxed max-w-2xl line-clamp-2">
                            {category.description}
                        </p>
                    )}
                </div>
                <Button
                    href={`/categories/${category.handle}`}
                    size={"sm"}
                    className="hidden lg:inline-flex shrink-0"
                    shape='pill'
                    variant="outline"
                    icon={<ChevronRight size={12} />}
                    iconPosition='right'
                >
                    View All
                </Button>
            </div>
            <LeafScrollRow leaves={leaves} maxRows={3} />
        </section>
    );
}

export function hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash |= 0;
    }
    return Math.abs(hash);
}

export function getLeafCategories(category: StoreProductCategory): StoreProductCategory[] {
    if (!category.category_children || category.category_children.length === 0) {
        return [category];
    }
    return category.category_children.flatMap(getLeafCategories);
}
