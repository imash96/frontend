import { Crumb } from "@/types/common";
import { ChevronRight } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";

type BreadcrumbProps = {
    crumbs: Crumb[];
    className?: string;
};

export default function Breadcrumb({ crumbs, className = "" }: BreadcrumbProps) {
    return (
        <nav aria-label="Breadcrumb" className={`flex flex-wrap text-sm font-medium ${className}`}>
            <ol role="list" className="flex items-center text-foreground-muted">
                {crumbs.map((item, idx) => (
                    <li key={item.href} className={`flex items-center ${idx === crumbs.length - 1 ? "font-semibold" : ""}`} aria-current={idx === crumbs.length - 1 ? "page" : undefined}>
                        <Link href={item.href as Route} className="" >
                            {item.label}
                        </Link>
                        {/* {idx < crumbs.length - 1 && */}
                        <ChevronRight className="h-4 w-4 text-foreground-muted mx-1" aria-hidden="true" />
                        {/* } */}
                    </li>
                ))}
            </ol>
        </nav>
    );
}
