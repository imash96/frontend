import { ChevronRight } from "lucide-react"
import Link from "next/link"
import type { Crumb } from "@/types/common"
import type { Route } from "next";

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
    if (items.length < 2) return null

    return (
        <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center text-xs text-text-secondary">
                {items.map((item, index) => {
                    const isLast = index === items.length - 1
                    return (
                        <li key={`${index}-${item.href}`} className="flex items-center">
                            {index > 0 && <ChevronRight aria-hidden="true" className="mx-1 size-3 text-text-disabled" />}
                            {isLast ? (
                                <span aria-current="page" className="max-w-44 truncate font-medium text-text-primary">
                                    {item.label}
                                </span>
                            ) : (
                                <Link
                                    href={item.href as Route}
                                    className="whitespace-nowrap transition-colors hover:text-text-primary hover:underline"
                                >
                                    {item.label}
                                </Link>
                            )}
                        </li>
                    )
                })}
            </ol>
        </nav>
    )
}