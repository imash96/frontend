"use client";

import { ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { product_categories } from "@/data/category";
import { ProductCategory } from "@/types/common";
import { AnimatePresence } from "motion/react";
import { div as Div } from "motion/react-client";
import { MEGA_MENU, MegaMenu } from "@/data/header";

type NavigationProps = {
    links: Array<{
        label: string;
        href?: string;
    }>;
};

export default function HeaderServer({ links }: NavigationProps) {
    const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
    const pathname = usePathname();

    const handleMouseEnter = (categoryName: string) => {
        setActiveMegaMenu(categoryName);
    };

    const handleMouseLeave = () => {
        setActiveMegaMenu(null);
    };

    // Get top-level categories (Men, Women)
    const megaMenuCategories = product_categories?.filter(category => MEGA_MENU.includes(category.name as MegaMenu));

    return (
        <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {/* Dynamic Product Categories with Mega Menu */}
            {megaMenuCategories.map((category) => {
                const isActive = pathname.startsWith(`/${category.handle}`);
                const hasChildren = category.category_children && category.category_children.length > 0;

                return (
                    <div
                        key={`nav-${category.handle}`}
                        onMouseEnter={() => hasChildren && handleMouseEnter(category.name)}
                        onMouseLeave={handleMouseLeave}
                    >
                        <Link
                            href={`/category/${category.handle}`}
                            className={`flex items-center gap-1 px-3 xl:px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${isActive ? "text-accent bg-accent/10" : "text-foreground over:text-accent hover:bg-muted/50"}`}
                        >
                            {category.name}
                            {hasChildren && (
                                <ChevronDown
                                    className={`w-4 h-4 transition-transform duration-200 ${activeMegaMenu === category.name ? "rotate-180" : ""}`}
                                    strokeWidth={1.5}
                                />
                            )}
                        </Link>

                        {/* Mega Menu */}
                        <AnimatePresence>
                            {hasChildren && activeMegaMenu === category.name && (
                                <Div
                                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.98 }}
                                    transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
                                    className="absolute inset-x-0 top-full z-50"
                                >
                                    <div className="w-screen max-w-6xl bg-popover border border-popover-border rounded-xl shadow-2xl overflow-hidden">
                                        <div className="grid grid-cols-5 gap-0">
                                            {/* Categories Section */}
                                            <div className="col-span-4 p-8">
                                                <div className="grid grid-cols-3 gap-x-8 gap-y-6">
                                                    {category.category_children?.map((subCategory) => {
                                                        if (!subCategory.category_children) return
                                                        return (
                                                            <MegaMenuColumn
                                                                key={`mega-${subCategory.id || subCategory.handle}`}
                                                                category={subCategory}
                                                            />
                                                        )
                                                    })}
                                                </div>
                                            </div>

                                            {/* Featured Section */}
                                            <div className="col-span-1 bg-muted/30 p-6 flex flex-col">
                                                <div className="mb-4">
                                                    <h4 className="font-heading font-semibold text-xs uppercase tracking-wider text-foreground-secondary mb-3">
                                                        Featured
                                                    </h4>
                                                </div>

                                                {category.metadata?.thumbnail as string && (
                                                    <Link
                                                        href={`/category/${category.handle}`}
                                                        className="relative overflow-hidden rounded-lg group mb-4 aspect-3/4 block"
                                                    >
                                                        <Image
                                                            src={category.metadata?.thumbnail as string}
                                                            alt={category.name}
                                                            fill
                                                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                                                        />
                                                        <div className="absolute inset-0 bg-linear-to-t from-overlay-heavy via-overlay-light to-transparent" />
                                                        <div className="absolute bottom-0 left-0 right-0 p-4">
                                                            <h5 className="font-heading font-bold text-white text-sm mb-1">
                                                                New Collection
                                                            </h5>
                                                            <p className="text-white/90 text-xs">
                                                                {category.description?.slice(0, 60)}...
                                                            </p>
                                                        </div>
                                                    </Link>
                                                )}

                                                <Link
                                                    href={`/category/${category.handle}`}
                                                    className="mt-auto text-sm font-medium text-accent hover:text-accent-hover transition-colors duration-200 flex items-center gap-2 group"
                                                >
                                                    <span>Shop All {category.name}</span>
                                                    <ChevronDown className="w-4 h-4 -rotate-90 group-hover:translate-x-1 transition-transform duration-200" />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </Div>
                            )}
                        </AnimatePresence>
                    </div>
                );
            })}

            {/* Static Navigation Links */}
            {links.map((link) => {
                if (!link.href) return null;
                const isActive = pathname === link.href;

                return (
                    <Link
                        key={`link-${link.href}`}
                        href={link.href}
                        className={`px-3 xl:px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${isActive ? "text-accent bg-accent/10" : "text-foreground hover:text-accent hover:bg-muted/50"}`}
                    >
                        {link.label}
                    </Link>
                );
            })}
        </nav>
    );
}

// Mega Menu Column Component
function MegaMenuColumn({ category }: { category: ProductCategory }) {
    return (
        <div className="space-y-3">
            <Link
                href={`/category/${category.handle}`}
                className="block group"
            >
                <h3 className="font-heading font-semibold text-sm uppercase tracking-wide text-foreground mb-3 group-hover:text-accent transition-colors duration-200">
                    {category.name}
                </h3>
            </Link>

            {category.category_children && category.category_children.length > 0 && (
                <ul className="space-y-2">
                    {category.category_children.slice(0, 6).map((subCat) => (
                        <li key={`submenu-${subCat.id || subCat.handle}`}>
                            <Link
                                href={`/category/${subCat.handle}`}
                                className="text-sm text-foreground-secondary hover:text-accent transition-colors duration-200 flex items-center gap-2 group"
                            >
                                <span className="group-hover:translate-x-1 transition-transform duration-200">
                                    {subCat.name}
                                </span>
                                {subCat.metadata?.badge as string && (
                                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-badge-new text-badge-new-foreground">
                                        {subCat.metadata?.badge as string}
                                    </span>
                                )}
                            </Link>
                        </li>
                    ))}
                    {category.category_children.length > 6 && (
                        <li>
                            <Link
                                href={`/category/${category.handle}`}
                                className="text-sm font-medium text-accent hover:text-accent-hover transition-colors duration-200 inline-flex items-center gap-1 mt-2"
                            >
                                <span>View All</span>
                                <ChevronDown className="w-3.5 h-3.5 -rotate-90" />
                            </Link>
                        </li>
                    )}
                </ul>
            )}
        </div>
    );
}