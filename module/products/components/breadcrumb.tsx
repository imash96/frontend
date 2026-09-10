import { ChevronRight } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import type { Crumb } from "@/types/common";

export default function Breadcrumb({ handle, crumbs = [] }: BreadcrumbProps) {
  if (!crumbs.length) {
    const pathSegments = handle.split("/").filter(Boolean);
    let currentPath = "";
    crumbs = [];
    pathSegments.forEach((segment) => {
      currentPath += `/${segment}`;
      // Convert kebab-case to title case for display
      const label = segment
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      crumbs.push({ label, href: currentPath });
    });
  }

  if (crumbs.length === 0) return null;
  const isLastItem = (index: number) => index === crumbs.length - 1;

  return (
    <nav
      aria-label="Breadcrumb"
      className="py-0.5 pl-1 text-xs sm:text-sm leading-tight text-foreground-muted"
    >
      <ol className="flex flex-nowrap overflow-x-auto no-scrollbar gap-0">
        {crumbs.map((crumb, index) => {
          const last = isLastItem(index);
          return (
            <li
              key={crumb.href}
              className="flex items-center whitespace-nowrap"
            >
              <Link
                href={crumb.href as Route}
                className={`text-link hover:text-secondary transition-colors duration-200 focus-visible:outline-0 ${last ? "underline" : ""}`}
              >
                {crumb.label}
              </Link>
              {!last && (
                <ChevronRight
                  className="h-4 w-4 text-foreground-muted mx-1"
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

type BreadcrumbProps = {
  crumbs: Crumb[];
  handle: string;
  separator?: string;
};
