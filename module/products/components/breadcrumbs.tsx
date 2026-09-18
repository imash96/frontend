import { ChevronRight } from "lucide-react"
import Link from "next/link"

interface BreadcrumbItem {
    label: string
    href: string
}

export default function Breadcrumbs({ items, }: { items: BreadcrumbItem[] }) {
    return (
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center text-xs text-text-secondary">
            {items.map((item, i) => (
                <span key={i} className="flex items-center">
                    {i > 0 && <ChevronRight className="size-3 text-text-disabled mx-1" />}
                    {i === items.length - 1 ? (
                        <span className="font-medium truncate max-w-44">{item.label}</span>
                    ) : (
                        <Link href={item.href} className="whitespace-nowrap transition-colors hover:text-text-primary">
                            {item.label}
                        </Link>
                    )}
                </span>
            ))}
        </nav>
    );
}