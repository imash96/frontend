"use client"

import { ArrowRight, Clock, Search, TrendingUp, X } from "lucide-react"
import type { Route } from "next";
import Image from "next/image"
import Link from "next/link"
import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react"
import { useDrawerStore } from "@/lib/store/drawer-store"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/ui/modal"

const LISTBOX_ID = "search-results-listbox"
const MIN_QUERY_LENGTH = 2

export function SearchModal() {
    const [query, setQuery] = useState("")
    const inputRef = useRef<HTMLInputElement>(null)
    const { active, toggle: toggleSearch, close: closeSearch } = useDrawerStore()

    /* ─────────────────────────────────────────────
       Autofocus when opened
    ───────────────────────────────────────────── */
    useEffect(() => {
        if (active === 'search') {
            requestAnimationFrame(() => {
                inputRef.current?.focus()
            })
        }
    }, [active])

    const closeModal = () => {
        closeSearch()
        setQuery("")
    }

    /* ─────────────────────────────────────────────
       Minimum 2 characters before filtering
    ───────────────────────────────────────────── */
    const filteredResults = useMemo(() => {
        const trimmed = query.trim().toLowerCase()
        if (trimmed.length < 2) return []
        return products.filter(
            (item) =>
                item.name.toLowerCase().includes(trimmed) ||
                item.category.toLowerCase().includes(trimmed)
        )
    }, [query])

    const handleSubmit = () => {
        if (query.trim().length > 1) {
            // Replace with router push to search page
            closeModal()
        }
    }

    const deferredQuery = useDeferredValue(query)
    const isStale = query !== deferredQuery
    const showEmpty = deferredQuery.trim().length < MIN_QUERY_LENGTH
    const hasResults = filteredResults.length > 0

    return (
        <Dialog open={active === 'search'} onOpenChange={toggleSearch.bind(null, 'search')} key="search-modal">
            <DialogTrigger asChild>
                <button
                    aria-label="Open search"
                    aria-haspopup="dialog"
                    aria-expanded={active === 'search'}
                    className="flex p-2 rounded-md duration-200 hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-focus-ring"
                >
                    <Search className="size-5 text-foreground" strokeWidth={1.5} aria-hidden />
                </button>
            </DialogTrigger>

            <DialogContent
                rounded={false}
                size="lg"
                className="bg-surface-elevated shadow-2xl max-w-2xl w-full h-[80vh] lg:h-[60vh] max-h-160 flex flex-col overflow-hidden"
                aria-label="Search products"
                aria-describedby="Search produts"
            >
                {/* HEADER */}
                <DialogHeader className="border-b border-divider">
                    <DialogTitle hidden />
                    <DialogDescription hidden />
                    <div className="flex items-center w-full gap-3 px-5 py-4">
                        <Search className="size-5 text-text-tertiary" />

                        <input
                            ref={inputRef}
                            name="search"
                            type="search"
                            autoComplete="off"
                            autoCorrect="off"
                            autoCapitalize="off"
                            spellCheck={false}
                            role="combobox"
                            aria-controls={LISTBOX_ID}
                            aria-expanded={query.length > 1}
                            aria-autocomplete="list"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") handleSubmit()
                                if (e.key === "Escape") closeModal()
                            }}
                            placeholder="Search..."
                            className="flex-1 min-w-0 bg-transparent text-base text-text-primary outline-none placeholder:text-input-placeholder"
                        />

                        {query && (
                            <button
                                aria-label="Clear search"
                                onClick={() => setQuery("")}
                                className="rounded-md p-1 text-text-tertiary transition hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-1"
                            >
                                <X className="size-4" aria-hidden />
                            </button>
                        )}
                    </div>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto overscroll-contain"
                    style={{ scrollbarGutter: "stable" }}
                >
                    {showEmpty ? (
                        <DiscoveryPanel onSelectQuery={setQuery} />
                    ) : (
                        <div className="px-5 py-5 space-y-4">
                            {/* RESULT COUNT */}
                            <div className="flex items-center justify-between">
                                <p className="text-[12px] font-medium text-text-tertiary uppercase tracking-wider">
                                    {isStale ? (
                                        "Searching…"
                                    ) : (
                                        <>
                                            {filteredResults.length}{" "}
                                            {filteredResults.length === 1
                                                ? "result"
                                                : "results"}{" "}
                                            for{" "}
                                            <span className="text-text-primary font-semibold">
                                                &ldquo;{query}&rdquo;
                                            </span>
                                        </>
                                    )}
                                </p>

                                {/* View all results link */}
                                {hasResults && !isStale && (
                                    <Link
                                        href={`/search?q=${encodeURIComponent(query.trim())}` as Route}
                                        className="inline-flex items-center gap-1 text-[12px] font-semibold tracking-wider uppercase text-primary hover:text-primary-hover transition-colors duration-150"
                                    >
                                        View all
                                        <ArrowRight className="size-3" aria-hidden />
                                    </Link>
                                )}
                            </div>

                            {isStale ? (
                                <SearchSkeleton />
                            ) : hasResults ? (
                                <div
                                    id={LISTBOX_ID}
                                    role="listbox"
                                    aria-label="Search results"
                                    className="space-y-1.5"
                                >
                                    {filteredResults.map((item) => (
                                        <Link
                                            key={item.handle}
                                            href={`/products/${item.handle}`}
                                            className="group flex w-full items-center gap-4 rounded-xl border border-border-subtle hover:border-border-strong hover:bg-card-hover bg-card p-4 text-left transition hover:shadow-primary"
                                        >
                                            <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                                                <Image
                                                    src={item.image}
                                                    alt={item.name}
                                                    fill
                                                    sizes="64px"
                                                    className="object-cover motion-safe:transition-transform motion-safe:duration-300 group-hover:scale-105"
                                                />
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 min-w-0 space-y-0.5">
                                                {/* Highlighted name */}
                                                <p className="text-sm font-medium text-text-primary truncate">
                                                    <HighlightMatch text={item.name} query={query} />
                                                </p>
                                                <p className="text-xs text-text-tertiary truncate">
                                                    {item.category}
                                                </p>
                                            </div>

                                            {/* Price */}
                                            <div className="shrink-0 text-right space-y-0.5">
                                                <p className="text-sm font-semibold text-price-current tabular-nums">
                                                    {item.price}
                                                </p>
                                                {item.originalPrice && (
                                                    <p className="text-xs text-price-original line-through tabular-nums">
                                                        {item.originalPrice}
                                                    </p>
                                                )}
                                            </div>

                                            <ArrowRight
                                                className="shrink-0 size-4 text-text-tertiary opacity-0 transition-all duration-150 group-hover:opacity-100 group-hover:translate-x-0.5"
                                                aria-hidden
                                            />
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <EmptyResults query={query} />
                            )}
                        </div>
                    )}
                </div>
                <SearchFooter onSubmit={handleSubmit} hasQuery={query.trim().length >= MIN_QUERY_LENGTH} />
            </DialogContent>
        </Dialog>
    )
}

function HighlightMatch({ text, query }: { text: string; query: string }) {
    const trimmed = query.trim()
    if (!trimmed) return <>{text}</>

    const regex = new RegExp(`(${trimmed.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi")
    const parts = text.split(regex)

    return (
        <>
            {parts.map((part, i) =>
                regex.test(part) ? (
                    <mark
                        key={i}
                        className="bg-transparent text-primary font-semibold"
                    >
                        {part}
                    </mark>
                ) : (
                    <span key={i}>{part}</span>
                )
            )}
        </>
    )
}

function DiscoveryPanel({ onSelectQuery, }: { onSelectQuery: (q: string) => void }) {
    return (
        <div className="px-5 py-5 space-y-7">
            {/* RECENT */}
            <section aria-labelledby="recent-label">
                <h3 id="recent-label" className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-text-tertiary">
                    <Clock className="size-3.5" aria-hidden />
                    Recent
                </h3>
                <div className="flex flex-wrap gap-2">
                    {recent.map((item) => (
                        <button
                            key={item}
                            onClick={() => onSelectQuery(item)}
                            className="rounded-full bg-muted px-4 py-1.5 text-sm text-text-secondary transition hover:bg-muted-hover"
                        >
                            {item}
                        </button>
                    ))}
                </div>
            </section>

            {/* Divider */}
            <div className="h-px bg-divider" aria-hidden />

            {/* TRENDING */}
            <section aria-labelledby="trending-label">
                <h3 id="trending-label" className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-text-tertiary">
                    <TrendingUp className="size-3.5" aria-hidden />
                    Trending
                </h3>

                <div className="space-y-0.5">
                    {trending.map((item, i) => (
                        <div key={item}>
                            <button
                                onClick={() => onSelectQuery(item)}
                                className="group flex w-full items-center justify-between px-3 py-2.5 rounded-lg text-left transition-colors duration-50 hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-1"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="flex size-6 items-center justify-center rounded-md bg-primary-subtle text-xs font-bold text-primary tabular-nums">
                                        {i + 1}
                                    </span>
                                    <span className="text-sm text-text-primary">{item}</span>
                                </div>
                                <ArrowRight className="size-4 text-text-tertiary opacity-0 transition-all duration-150 group-hover:opacity-100 group-hover:translate-x-0.5" />
                            </button>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    )
}

function SearchSkeleton() {
    return (
        <ul className="space-y-1.5" aria-label="Loading results" aria-busy="true">
            {Array.from({ length: 3 }).map((_, i) => (
                <li
                    key={i}
                    className="flex items-center gap-4 border border-border-subtle bg-card p-3.5"
                >
                    <div className="skeleton size-14 shrink-0" />
                    <div className="flex-1 space-y-2 min-w-0">
                        <div className="skeleton h-3.5 w-3/5" />
                        <div className="skeleton h-3 w-2/5" />
                    </div>
                    <div className="skeleton h-4 w-12 shrink-0" />
                </li>
            ))}
        </ul>
    )
}

function EmptyResults({ query }: { query: string }) {
    return (
        <div className="flex flex-col items-center justify-center py-14 text-center">
            <div className="mb-4 flex size-12 items-center justify-center bg-muted text-text-tertiary">
                <Search className="size-5" strokeWidth={1.5} aria-hidden />
            </div>
            <p className="text-sm font-medium text-text-primary">
                No results for &ldquo;{query}&rdquo;
            </p>
            <p className="mt-1.5 text-[13px] text-text-tertiary">
                Try &ldquo;biker jacket&rdquo; or &ldquo;suede coat&rdquo;
            </p>
        </div>
    )
}


function SearchFooter({
    onSubmit,
    hasQuery,
}: {
    onSubmit: () => void
    hasQuery: boolean
}) {
    return (
        <div className="flex items-center justify-between border-t border-divider px-5 py-3 bg-background-secondary">
            <div className="flex items-center gap-4 text-[11px] text-text-tertiary">
                {/* <span className="flex items-center gap-1.5">
                    <kbd className="inline-flex h-5 items-center px-1.5 border border-border-strong text-[10px] font-mono">↑↓</kbd>
                    navigate
                </span> */}
                <span className="flex items-center gap-1.5">
                    <kbd className="inline-flex h-5 items-center px-1.5 border border-border-strong text-[10px] font-mono">↵</kbd>
                    select
                </span>
                <span className="flex items-center gap-1.5">
                    <kbd className="inline-flex h-5 items-center px-1.5 border border-border-strong text-[10px] font-mono">esc</kbd>
                    close
                </span>
            </div>

            {hasQuery && (
                <button
                    onClick={onSubmit}
                    className="inline-flex items-center gap-1.5 text-[12px] font-semibold tracking-wider uppercase text-primary hover:text-primary-hover transition-colors duration-150"
                >
                    Search all
                    <ArrowRight className="size-3.5" aria-hidden />
                </button>
            )}
        </div>
    )
}

/* ─────────────────────────────────────────────
   DATA (Replace with Medusa search API)
   ───────────────────────────────────────────── */

const trending = [
    "Biker Leather Jacket",
    "Suede Long Coat",
    "Vintage Bomber Jacket",
    "Shearling Aviator",
    "Women's Moto Jacket",
]

const recent = [
    "Black Leather Jacket",
    "Men's Brown Blazer",
    "Women's Cropped Jacket",
    "Suede Skirt",
]

const products = [
    {
        handle: "mens-black-biker-jacket-1",
        name: "Men's Black Biker Jacket",
        category: "Leather Jackets",
        price: "$289",
        image: "/images/products/biker-1.jpg",
    },
    {
        handle: "womens-cropped-leather-jacket-1",
        name: "Women's Cropped Leather Jacket",
        category: "Women's Collection",
        price: "$249",
        image: "/images/products/women-crop.jpg",
    },
    {
        handle: "brown-suede-long-coat-1",
        name: "Brown Suede Long Coat",
        category: "Winter Collection",
        price: "$349",
        originalPrice: "$420",
        image: "/images/products/suede-coat.jpg",
    },
    {
        handle: "shearling-aviator-jacket-1",
        name: "Shearling Aviator Jacket",
        category: "Men's Collection",
        price: "$399",
        image: "/images/products/aviator.jpg",
    },
    {
        handle: "vintage-bomber-jacket-1",
        name: "Vintage Bomber Jacket",
        category: "Leather Jackets",
        price: "$319",
        originalPrice: "$380",
        image: "/images/products/bomber.jpg",
    },
    {
        handle: "mens-black-biker-jacket-2",
        name: "Men's Black Biker Jacket",
        category: "Leather Jackets",
        price: "$289",
        image: "/images/products/biker-1.jpg",
    },
    {
        handle: "womens-cropped-leather-jacket-2",
        name: "Women's Cropped Leather Jacket",
        category: "Women's Collection",
        price: "$249",
        image: "/images/products/women-crop.jpg",
    },
    {
        handle: "brown-suede-long-coat-2",
        name: "Brown Suede Long Coat",
        category: "Winter Collection",
        price: "$349",
        originalPrice: "$420",
        image: "/images/products/suede-coat.jpg",
    },
    {
        handle: "shearling-aviator-jacket-2",
        name: "Shearling Aviator Jacket",
        category: "Men's Collection",
        price: "$399",
        image: "/images/products/aviator.jpg",
    },
    {
        handle: "vintage-bomber-jacket-2",
        name: "Vintage Bomber Jacket",
        category: "Leather Jackets",
        price: "$319",
        originalPrice: "$380",
        image: "/images/products/bomber.jpg",
    },
    {
        handle: "mens-black-biker-jacket-3",
        name: "Men's Black Biker Jacket",
        category: "Leather Jackets",
        price: "$289",
        image: "/images/products/biker-1.jpg",
    },
    {
        handle: "womens-cropped-leather-jacket-3",
        name: "Women's Cropped Leather Jacket",
        category: "Women's Collection",
        price: "$249",
        image: "/images/products/women-crop.jpg",
    },
    {
        handle: "brown-suede-long-coat-3",
        name: "Brown Suede Long Coat",
        category: "Winter Collection",
        price: "$349",
        originalPrice: "$420",
        image: "/images/products/suede-coat.jpg",
    },
    {
        handle: "shearling-aviator-jacket-3",
        name: "Shearling Aviator Jacket",
        category: "Men's Collection",
        price: "$399",
        image: "/images/products/aviator.jpg",
    },
    {
        handle: "vintage-bomber-jacket-3",
        name: "Vintage Bomber Jacket",
        category: "Leather Jackets",
        price: "$319",
        originalPrice: "$380",
        image: "/images/products/bomber.jpg",
    },
]