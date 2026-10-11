import { ChevronLeft, ChevronRight, Contact, Home, Info, Menu, TableOfContents, User, X } from "lucide-react";
import { AnimatePresence } from "motion/react";
import { div as Div } from "motion/react-client";
import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useState } from "react";
import { product_categories } from "@/data/category";
import { useDrawerStore } from "@/lib/store/drawer-store";
import { ProductCategory } from "@/types/common";
import { Drawer } from "@/ui/drawer";

export default function MobileDrawer() {
    const active = useDrawerStore((s) => s.active)
    const closeMenu = useDrawerStore((s) => s.close)
    const [navStack, setNavStack] = useState<NavState[]>([
        { level: 0, category: null, breadcrumb: [] },
    ]);
    const handleClose = useCallback(() => {
        setNavStack([{ level: 0, category: null, breadcrumb: [] }]);
        closeMenu();
    }, [closeMenu]);

    const goBack = () => {
        if (navStack.length > 1) setNavStack((prev) => prev.slice(0, -1));
    };

    const current = navStack[navStack.length - 1];

    const pushCategory = (cat: ProductCategory) => {
        if (!cat.category_children?.length) return

        setNavStack((s) => [
            ...s,
            { level: current.level + 1, category: cat, breadcrumb: [...current.breadcrumb, cat.name] },
        ]);

    };

    const categories = current.level === 0 ? product_categories : current.category?.category_children || [];
    return (
        <Drawer
            isOpen={active === 'menu'}
            onClose={handleClose}
            direction="left"
            size="xs"
            showCloseButton={false}
            headerSlot={<HeaderSlot goBack={goBack} handleClose={handleClose} navStack={navStack} current={current} />}
            footerSlot={<FooterSlot handleClose={handleClose} />}
        >
            {/* ─── Content ─── */}
            <AnimatePresence mode="wait">
                <Div
                    key={`v1-nav-${current.level}-${current.category?.handle || "root"}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.16, ease: [0.4, 0, 0.2, 1] }}
                    className="flex-1 min-h-0 overflow-y-auto overscroll-contain"
                >
                    {/* ─── Hero banner for sub-categories ─── */}
                    {current.category && current.level === 1 && (
                        <div className="relative w-full shrink-0 overflow-hidden self-stretch max-h-48 h-full flex items-center justify-center">
                            <Image
                                src={(current.category.metadata?.thumbnail as string) || "/svg/placeholder.svg"}
                                alt={current.category.name}
                                fill
                                sizes="(max-width:768px) 100vw"
                                priority={false}
                                className="w-full h-full object-cover"
                            />
                            {/* Gradient overlay for readability */}
                            {/* Heavy overlay for readability */}
                            <div className="absolute inset-0 bg-neutral-950/55" aria-hidden="true" />

                            <div className="absolute inset-0 flex flex-col justify-end p-4">
                                <span className="inline-flex w-fit items-center gap-1.5 px-3 py-1 mb-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[9px] font-bold uppercase tracking-[0.25em] text-white/90">
                                    Category
                                </span>
                                <h3 className="font-heading text-xl font-bold text-white tracking-tight">{current.category.name}</h3>
                                {current.category.description && (
                                    <p className="text-xs text-white/70 mt-1 line-clamp-2">{current.category.description}</p>
                                )}
                            </div>
                        </div>
                    )}
                    {/* Category links */}
                    <div className="px-3 py-3">
                        {categories.map((cat, i) => {
                            const hasChildren = (cat.category_children?.length ?? 0) > 0;
                            return (
                                <Div
                                    key={cat.handle + i}
                                    initial={{ opacity: 0, x: 12 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.03, duration: 0.15 }}
                                >
                                    {hasChildren ? (
                                        <button
                                            aria-expanded={hasChildren}
                                            aria-controls={`cat-${cat.handle}`}
                                            onClick={() => pushCategory(cat)}
                                            className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-foreground font-medium hover:bg-muted/70 transition-all duration-200 group active:scale-[0.98] border-l-2 border-transparent hover:border-accent"
                                        >
                                            <span className="text-left text-[15px]">{cat.name}</span>
                                            <div className="flex items-center gap-2" id={`cat-${cat.handle}`}>
                                                {cat.category_children && (
                                                    <span className="text-[10px] font-semibold text-foreground-tertiary bg-muted px-1.5 py-0.5 rounded-full">
                                                        {cat.category_children.length}
                                                    </span>
                                                )}
                                                <ChevronRight className="size-4 text-foreground-tertiary group-hover:text-accent group-hover:translate-x-0.5 transition-all duration-200" strokeWidth={1.5} />
                                            </div>
                                        </button>
                                    ) : (
                                        <Link
                                            href={`/${cat.handle}` as Route}
                                            onClick={(e) => { e.preventDefault(); handleClose(); }}
                                            className="block w-full px-4 py-3.5 rounded-xl text-[15px] text-foreground font-medium hover:bg-muted/70 transition-all duration-200 active:scale-[0.98] border-l-2 border-transparent hover:border-accent"
                                        >
                                            {cat.name}
                                        </Link>
                                    )}
                                </Div>
                            );
                        })}
                    </div>
                </Div>
            </AnimatePresence>
            {/* Promo Card */}
            {/* <div className="px-4 sm:px-6 py-4">
                <div className="relative overflow-hidden rounded-xl bg-linear-to-br from-neutral-900 to-neutral-800 p-5">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-accent/10 rounded-full -translate-y-8 translate-x-8" />
                    <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-accent mb-1">Limited Offer</p>
                    <h3 className="font-heading text-base font-bold text-white mb-1">20% Off First Order</h3>
                    <p className="text-xs text-neutral-400 mb-3">Use code LEATHER20 at checkout</p>
                    <button
                        onClick={handleClose}
                        className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-accent hover:text-accent-hover transition-colors"
                    >
                        Shop Now <ArrowRight className="w-3 h-3" />
                    </button>
                </div>
            </div> */}

        </Drawer>
    )
}

const HeaderSlot = ({ navStack, current, goBack, handleClose }: HeaderSlotProps) => (
    <>
        {/* Accent top line */}
        <div className="h-0.5 shrink-0" style={{
            background: "linear-gradient(90deg, var(--accent), var(--primary), var(--accent))",
        }}
        />
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-divider shrink-0">
            {navStack.length > 1 ? (
                <button
                    onClick={goBack}
                    className="flex items-center gap-2 text-foreground hover:text-accent transition-colors group"
                >
                    <ChevronLeft className="size-5 group-hover:-translate-x-0.5 transition-transform" strokeWidth={2} />
                    <span className="font-medium text-sm">Back</span>
                </button>
            ) : (
                <div className="flex items-center gap-3">
                    <div className="size-8 rounded-lg bg-primary flex items-center justify-center">
                        <Menu className="size-4 text-primary-foreground" strokeWidth={2} />
                    </div>
                    <div>
                        <h2 className="font-heading font-bold text-lg text-foreground tracking-tight leading-none">
                            Menu
                        </h2>
                        <p className="text-[10px] text-foreground-tertiary uppercase tracking-[0.15em] mt-0.5">
                            Explore Collection
                        </p>
                    </div>
                </div>
            )}
            <button
                onClick={handleClose}
                className="p-2 rounded-full text-foreground-secondary bg-muted/50 hover:text-foreground hover:bg-muted active:scale-95"
                aria-label="Close menu"
            >
                <X className="size-5" strokeWidth={1.5} />
            </button>
        </div>
        {/* ─── Breadcrumb ─── */}
        {current.breadcrumb.length > 0 && (
            <Div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.15, delay: 0.05 }} className="px-5 py-3 bg-muted/30 border-b border-divider">
                <div className="flex items-center gap-1.5 text-xs overflow-x-auto no-scrollbar">
                    <Home className="size-3.5 text-foreground-tertiary shrink-0" />
                    {current.breadcrumb.map((cat, index) => (
                        <div key={`bc-${cat}-${index}`} className="flex items-center gap-1.5 shrink-0">
                            <ChevronRight className="size-3 text-foreground-tertiary" />
                            <span className={index === current.breadcrumb.length - 1 ? 'text-accent font-semibold' : 'text-foreground-secondary'}>{cat}</span>
                        </div>
                    ))}
                </div>
            </Div>
        )}
    </>
)


{/* Footer */ }
const FooterSlot = ({ handleClose }: Pick<HeaderSlotProps, "handleClose">) => (
    <div className="border-t border-divider px-4 sm:px-6 py-4 shrink-0 bg-surface-sunken/50">
        <div className="grid grid-cols-4 gap-1">
            {[
                { icon: User, label: "My Account", href: "/account" },
                { icon: Contact, label: "Contact Us", href: "/contact-us" },
                { icon: Info, label: "About Us", href: "/about-us" },
                { icon: TableOfContents, label: "Faqs", href: "/faqs" },
            ].map(({ icon: Icon, label, href }) => (
                <Link
                    key={label}
                    href={href as Route}
                    onClick={handleClose}
                    className="flex flex-col items-center gap-1 py-2 rounded-lg text-foreground-tertiary hover:text-foreground hover:bg-muted/50 transition-colors"
                >
                    <Icon className="size-4.5" strokeWidth={1.5} />
                    <span className="text-[9px] font-medium uppercase tracking-wider">{label}</span>
                </Link>
            ))}
        </div>
    </div>
)

type NavState = {
    level: number;
    category: ProductCategory | null;
    breadcrumb: string[];
};

type HeaderSlotProps = {
    navStack: NavState[],
    current: NavState,
    goBack: () => void,
    handleClose: () => void
};