"use client"

import { ArrowRight, ArrowUpRight, ChevronDown, Sparkles } from "lucide-react"
import { AnimatePresence, } from "motion/react"
import { span as Span, div as Div, img as Img } from "motion/react-client"
import type { Route } from "next";
import Link from "next/link"
import { useCallback, useRef, useState } from "react"
import { features, getMegaCategories, type MegaMenu, navLinks } from "@/data/header"
import { ProductCategory } from "@/types/common"
import Container from "@/ui/container"

// ─── Types ────────────────────────────────────────────────────────────────────

type MegaPanelProps = {
    category: ProductCategory
    onMouseEnter: () => void
    onMouseLeave: () => void
    onClose: () => void
}

// ─── Constants ────────────────────────────────────────────────────────────────

const CLOSE_DELAY_MS = 150
const megaCats = getMegaCategories()

// ─── HeaderNav ───────────────────────────────────────────────────────────────

export default function HeaderNav() {
    const [activeMenu, setActiveMenu] = useState<string | null>(null)
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    /** Cancel any pending delayed close */
    const clearCloseTimeout = useCallback(() => {
        if (timeoutRef.current !== null) {
            clearTimeout(timeoutRef.current)
            timeoutRef.current = null
        }
    }, [])

    /** Schedule a close with a small delay so the user can cross from
     *  the trigger button into the panel without the menu collapsing. */
    const scheduleClose = useCallback(() => {
        clearCloseTimeout()
        timeoutRef.current = setTimeout(() => setActiveMenu(null), CLOSE_DELAY_MS)
    }, [clearCloseTimeout])

    const handleTriggerEnter = useCallback((name: string) => {
        clearCloseTimeout()
        setActiveMenu(name)
    }, [clearCloseTimeout])

    const handleToggleClick = useCallback((name: string) => {
        if (activeMenu) setActiveMenu(null)
        clearCloseTimeout()
        setActiveMenu(name)
    }, [clearCloseTimeout, activeMenu])

    // Passed to MegaPanel so hovering BACK into the panel cancels any pending close
    const handlePanelEnter = useCallback(() => {
        clearCloseTimeout()
    }, [clearCloseTimeout])

    const handleClose = useCallback(() => {
        setActiveMenu(null)
    }, [])

    return (
        <nav
            className="hidden lg:flex items-center gap-1 xl:gap-x-2"
            aria-label="Main navigation"
        >
            {megaCats.map((cat) => (
                <div
                    key={`nav-${cat.handle}`}
                    onMouseEnter={() => handleTriggerEnter(cat.name)}
                    onMouseLeave={scheduleClose}
                >
                    {/* Trigger button */}
                    <button
                        className={`relative flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-colors duration-150 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring rounded-sm ${activeMenu === cat.name ? "text-accent" : "text-foreground-secondary hover:text-foreground"}`}
                        onClick={() => handleToggleClick(cat.name)}
                        aria-expanded={activeMenu === cat.name}
                        aria-haspopup="true"
                    >
                        {cat.name}
                        <ChevronDown
                            className={`size-3.5 transition-transform duration-200 ${activeMenu === cat.name ? "rotate-180 text-accent" : "text-foreground-tertiary group-hover:text-foreground-secondary"}`}
                            strokeWidth={2}
                        />
                        {/* Animated active underline */}
                        {activeMenu === cat.name && (
                            <Span
                                layoutId="nav-underline"
                                className="absolute -bottom-px left-3 right-3 h-px bg-accent"
                                transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
                            />
                        )}
                    </button>

                    {/* Mega panel - rendered as a DOM child so pointer events
                        remain inside this container div */}
                    <AnimatePresence>
                        {activeMenu === cat.name && (
                            <MegaPanel
                                key={cat.id}
                                category={cat}
                                onMouseEnter={handlePanelEnter}
                                onMouseLeave={scheduleClose}
                                onClose={handleClose}
                            />
                        )}
                    </AnimatePresence>
                </div>
            ))}

            {/* Divider */}
            <div className="w-px h-4 bg-divider mx-2" aria-hidden="true" />

            {/* Flat nav links */}
            {navLinks.map((link) => (
                <Link
                    key={link.href}
                    href={link.href as Route}
                    className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-foreground-secondary hover:text-foreground transition-colors duration-150"
                >
                    {link.label}
                    {link.badge && (
                        <span className="text-[8px] px-1 py-0.5 bg-warning text-warning-foreground rounded font-bold leading-none">
                            {link.badge}
                        </span>
                    )}
                </Link>
            ))}
        </nav>
    )
}

// ─── MegaPanel ───────────────────────────────────────────────────────────────

function MegaPanel({ category, onMouseEnter, onMouseLeave, onClose }: MegaPanelProps) {
    const subCategories = category.category_children ?? []
    const feats = features[category.name as MegaMenu] ?? []

    const [hoveredSub, setHoveredSub] = useState<ProductCategory | null>(null)

    // Derive hero image from hovered sub-category, or fall back to the category thumbnail
    const heroImage: string | undefined = hoveredSub ? feats[subCategories.indexOf(hoveredSub) % feats.length]?.thumbnail : (category.metadata?.thumbnail as string | undefined) ?? feats[0]?.thumbnail

    const heroLabel = hoveredSub?.name ?? category.name
    const heroDesc = hoveredSub?.description ?? category.description ?? ""
    const heroHref = `/categories/${hoveredSub?.handle ?? category.handle}`
    const heroBadge = hoveredSub ? "Category" : "Collection"

    return (
        <Div
            role="region"
            aria-label={`${category.name} mega menu`}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
            className="absolute inset-x-0 top-full z-50 pointer-events-auto"
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            {/* Top accent rule */}
            <div
                aria-hidden="true"
                className="h-px"
                style={{
                    background: "linear-gradient(to right, transparent, var(--accent) 30%, var(--accent) 70%, transparent)",
                }}
            />

            <div className="bg-popover shadow-2xl border-b border-border">
                <Container size="2xl">
                    <div className="grid grid-cols-12 gap-0 min-h-100">
                        {/* Hero image pane */}
                        <div className="col-span-3 relative overflow-hidden">
                            <HeroPanelImageV1
                                src={heroImage}
                                label={heroLabel}
                                description={heroDesc}
                                href={heroHref}
                                badge={heroBadge}
                                onClose={onClose}
                            />
                        </div>

                        {/* Category columns */}
                        <div className="col-span-9 py-8 px-6">
                            <div className="flex h-full">
                                {subCategories.map((sub, idx) => {
                                    if ((sub.category_children || []).length < 1) return
                                    return (
                                        <div key={sub.handle} className="flex-1 px-6 first:pl-2">
                                            <MegaColumn
                                                category={sub}
                                                isActive={
                                                    hoveredSub?.handle === sub.handle ||
                                                    (!hoveredSub && idx === 0)
                                                }
                                                onHover={() => setHoveredSub(sub)}
                                                onClose={onClose}
                                                index={idx}
                                            />
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Bottom bar */}
                    <div className="border-t border-border/50 py-3.5 flex items-center justify-between gap-4 flex-wrap">
                        <div className="flex items-center gap-4 flex-wrap">
                            <span className="text-[10px] font-bold text-foreground-tertiary uppercase tracking-[0.15em]">
                                Featured Collections
                            </span>
                            <div className="w-px h-3 bg-divider" aria-hidden="true" />
                            {feats.map((fc) => (
                                <Link
                                    key={fc.id}
                                    href={`/collections/${fc.handle}` as Route}
                                    onClick={onClose}
                                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border text-[11px] font-medium text-foreground-secondary hover:text-accent hover:border-accent transition-colors duration-150 cursor-pointer"
                                >
                                    {fc.name}
                                    <ArrowRight className="w-3 h-3" aria-hidden="true" />
                                </Link>
                            ))}
                        </div>

                        <Link
                            href={`/categories/${category.handle}`}
                            onClick={onClose}
                            className="text-[13px] font-semibold text-accent hover:text-accent-hover transition-colors inline-flex items-center gap-1.5 cursor-pointer group"
                        >
                            View All {category.name}
                            <ArrowRight
                                className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform"
                                aria-hidden="true"
                            />
                        </Link>
                    </div>
                </Container>
            </div>
        </Div>
    )
}

// ─── HeroPanelImage ───────────────────────────────────────────────────────────

type HeroPanelImageProps = {
    src?: string
    label: string
    description?: string
    href: string
    badge: string
    onClose: () => void
}

export function HeroPanelImage({ src, label, description, href, badge, onClose }: HeroPanelImageProps) {
    return (
        <div className="relative w-full shrink-0 overflow-hidden self-stretch min-h-65 h-full flex items-center justify-center">
            {/* Background image */}
            <AnimatePresence mode="wait">
                {src && (
                    <Img
                        key={src}
                        src={src}
                        alt={label}
                        loading="lazy"
                        decoding="async"
                        initial={{ opacity: 0, scale: 1.08 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.08 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                )}
            </AnimatePresence>
            {/* Heavy overlay for readability */}
            <div className="absolute inset-0 bg-neutral-950/55" aria-hidden="true" />
            {/* Decorative corner accents */}
            <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-accent/50" aria-hidden="true" />
            <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-accent/50" aria-hidden="true" />
            {/* Center content */}
            <div className="relative z-10 text-center px-5">
                <AnimatePresence mode="wait">
                    <Div
                        key={label}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -16 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    >
                        {/* Glassmorphism badge */}
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 mb-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[9px] font-bold uppercase tracking-[0.25em] text-white/90">
                            <Sparkles className="w-2.5 h-2.5" />
                            {badge}
                        </span>
                        <h3 className="text-lg font-bold font-heading text-white leading-tight mb-2">{label}</h3>
                        {description && (
                            <p className="text-[11px] line-clamp-2 leading-relaxed mb-4 text-white/70 max-w-55 mx-auto">
                                {description.length > 80 ? `${description.slice(0, 80)}…` : description}
                            </p>
                        )}
                        <Link
                            href={href as Route}
                            onClick={() => { onClose(); }}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground text-[11px] font-bold uppercase tracking-wider rounded-sm hover:bg-accent-hover transition-colors duration-200 group"
                        >
                            Shop Now
                            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                        </Link>
                    </Div>
                </AnimatePresence>
            </div>
        </div>
    );
}

type HeroPanelImageV1Props = {
    src?: string;
    label: string;
    description?: string;
    href: string;
    badge: string;
    onClose: () => void;
};

function HeroPanelImageV1({
    src,
    label,
    description,
    href,
    badge,
    onClose,
}: HeroPanelImageV1Props) {
    return (
        <div className="relative w-full shrink-0 overflow-hidden self-stretch h-full min-h-90">
            {/* Background image */}
            <AnimatePresence mode="wait">
                {src && (
                    <Img
                        key={src}
                        src={src}
                        alt={label}
                        loading="lazy"
                        decoding="async"
                        initial={{ opacity: 0, scale: 1.04 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.04 }}
                        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                )}
            </AnimatePresence>

            {/* linear overlays */}
            <div
                className="absolute inset-0 bg-linear-to-r from-neutral-950/60 to-transparent"
                aria-hidden="true"
            />
            <div
                className="absolute inset-0 bg-linear-to-t from-neutral-950/80 via-transparent to-transparent"
                aria-hidden="true"
            />

            {/* Text content */}
            <div className="absolute bottom-0 left-0 right-0 p-5">
                <AnimatePresence mode="wait">
                    <Div
                        key={label}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2 }}
                        className="text-white"
                    >
                        <p className="text-[9px] font-bold uppercase tracking-[0.32em] text-accent mb-1.5">
                            {badge}
                        </p>
                        <h3 className="text-base font-bold font-heading text-accent leading-tight mb-1">
                            {label}
                        </h3>
                        {description && (
                            <p className="text-xs line-clamp-2 leading-relaxed mb-3 text-white/80">
                                {description.length > 80 ? `${description.slice(0, 80)}…` : description}
                            </p>
                        )}
                        <Link
                            href={href as Route}
                            onClick={(e) => {
                                e.preventDefault();
                                onClose();
                            }}
                            className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-accent hover:text-accent-hover transition-colors group"
                        >
                            Shop Now
                            <ArrowRight
                                className="w-3 h-3 group-hover:translate-x-0.5 transition-transform"
                                aria-hidden="true"
                            />
                        </Link>
                    </Div>
                </AnimatePresence>
            </div>
        </div>
    );
}


// ─── MegaColumn ──────────────────────────────────────────────────────────────

type MegaColumnProps = {
    category: ProductCategory
    isActive: boolean
    onHover: () => void
    onClose: () => void
    index?: number
}

function MegaColumn({
    category,
    isActive,
    onHover,
    onClose,
    index = 0,
}: MegaColumnProps) {
    const children = category.category_children ?? [];
    return (
        <Div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04, duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
            onMouseEnter={onHover}
            className="group/col h-full"
        >
            <Link href={`/categories/${category.handle}`} className="block mb-4 group/head">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <Div
                            className="w-2 h-2 rounded-xs shrink-0"
                            initial={false}
                            animate={{
                                backgroundColor: isActive ? "var(--accent)" : "var(--border)",
                                rotate: isActive ? 45 : 0,
                            }}
                            transition={{ duration: 0.25 }}
                        />
                        <h3 className={`font-heading font-bold text-sm uppercase tracking-[0.12em] transition-colors duration-200 ${isActive ? "text-accent" : "text-foreground group-hover/head:text-accent"}`}>
                            {category.name}
                        </h3>
                    </div>
                    <ArrowRight
                        className={`w-3.5 h-3.5 transition-all duration-200 ${isActive ? "text-accent opacity-100 translate-x-0" : "opacity-0 -translate-x-2 group-hover/head:opacity-60 group-hover/head:translate-x-0"}`}
                        strokeWidth={1.5}
                    />
                </div>
                {/* Animated accent underline */}


                {/* linear underline */}
                <div
                    className={`mt-1.5 mb-3 h-0.5 rounded-full transition-all duration-300 ${isActive ? "w-full" : "w-8 group-hover/head:w-full"}`}
                    style={{
                        background: isActive ? "linear-linear(to right, var(--accent), transparent)" : "linear-linear(to right, var(--border-strong), transparent)",
                    }}
                />
            </Link>
            {/* Numbered items */}
            {children.length > 0 && (
                <ul className="space-y-0" role="list">
                    {children.map((child) => (
                        <li key={child.handle}>
                            <Link
                                href={`/categories/${child.handle}`}
                                className="group/link flex items-center gap-3 py-2.5 border-b border-border-subtle last:border-b-0 transition-colors duration-150 hover:bg-muted/50 -ml-5 pl-5 pr-3"
                                onClick={() => { onClose(); }}
                            >
                                {/* Sliding dash indicator */}
                                <span className="relative w-4 h-px shrink-0">
                                    <span className="absolute inset-y-0 left-0 w-0 group-hover/link:w-full bg-accent transition-all duration-200 ease-out" />
                                    <span className="absolute inset-y-0 left-0 w-full bg-border-subtle" />
                                </span>
                                {/* Label */}
                                <span className="flex-1 text-[13px] font-medium text-foreground-secondary group-hover/link:text-foreground transition-colors">
                                    {child.name}
                                </span>
                                {/* Arrow */}
                                <ArrowUpRight
                                    className="w-3.5 h-3.5 text-foreground-tertiary opacity-0 -translate-x-1 translate-y-1 group-hover/link:opacity-100 group-hover/link:translate-x-0 group-hover/link:translate-y-0 transition-all duration-200"
                                    strokeWidth={1.5}
                                />
                                {(child.category_children?.length ?? 0) > 0 && (
                                    <span
                                        className={`text-[9px] font-bold px-1 py-px rounded-full transition-colors ${isActive ? "bg-accent/20 text-accent group-hover/tag:bg-accent-foreground/20 group-hover/tag:text-accent-foreground" : "bg-muted text-foreground-tertiary group-hover/tag:bg-accent/20 group-hover/tag:text-accent"}`}
                                    >
                                        {child.category_children!.length}
                                    </span>
                                )}
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
            {/* Explore link */}
            <div className="mt-4">
                <Link
                    href={`/categories/${category.handle}`}
                    className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.15em] text-accent hover:text-accent-hover transition-colors duration-150 group/all"
                    onClick={() => { onClose(); }}
                >
                    <span className="relative">
                        Explore All
                        <span className="absolute left-0 -bottom-px w-0 group-hover/all:w-full h-px bg-accent transition-all duration-200" />
                    </span>
                    <ArrowUpRight className="w-3 h-3 group-hover/all:translate-x-0.5 group-hover/all:-translate-y-0.5 transition-transform" />
                </Link>
            </div>

        </Div>
    );
}