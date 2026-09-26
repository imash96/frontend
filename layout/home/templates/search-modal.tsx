"use client"

import { ArrowRight, Clock, Loader2, Search, Sparkles, TrendingUp, X } from "lucide-react"
import type { Route } from "next"
import Image from "next/image"
import Link from "next/link"
import { useCallback, useEffect, useRef, useState } from "react"
import { useAlgoliaSearch, type AlgoliaHit } from "@/lib/hook/use-algolia-search"
import { useDrawerStore } from "@/lib/store/drawer-store"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/ui/modal"

const LISTBOX_ID = "search-results-listbox"
const MIN_QUERY_LENGTH = 2
const RECENT_SEARCHES_KEY = "vellehide_recent_searches"
const MAX_RECENT_SEARCHES = 6

/* ─────────────────────────────────────────────
   Recent searches (localStorage)
   ───────────────────────────────────────────── */
function getRecentSearches(): string[] {
    if (typeof window === "undefined") return []
    try {
        const raw = localStorage.getItem(RECENT_SEARCHES_KEY)
        return raw ? JSON.parse(raw) : []
    } catch {
        return []
    }
}

function addRecentSearch(query: string) {
    if (typeof window === "undefined") return
    const trimmed = query.trim()
    if (trimmed.length < MIN_QUERY_LENGTH) return
    try {
        const existing = getRecentSearches()
        const filtered = existing.filter((s) => s.toLowerCase() !== trimmed.toLowerCase())
        const updated = [trimmed, ...filtered].slice(0, MAX_RECENT_SEARCHES)
        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated))
    } catch { }
}

function clearRecentSearches() {
    if (typeof window === "undefined") return
    try {
        localStorage.removeItem(RECENT_SEARCHES_KEY)
    } catch { }
}

/* ─────────────────────────────────────────────
   Main component
   ───────────────────────────────────────────── */
export function SearchModal() {
    const [query, setQuery] = useState("")
    const [activeIndex, setActiveIndex] = useState(-1)
    const inputRef = useRef<HTMLInputElement>(null)
    const resultsRef = useRef<HTMLDivElement>(null)
    const { active, toggle: toggleSearch, close: closeSearch } = useDrawerStore()

    const { hits, isLoading, totalHits } = useAlgoliaSearch(query)

    /* ─────────────────────────────────────────────
       Autofocus when opened
    ───────────────────────────────────────────── */
    useEffect(() => {
        if (active === "search") {
            requestAnimationFrame(() => {
                inputRef.current?.focus()
            })
        }
    }, [active])

    // Reset active index when results change
    useEffect(() => {
        setActiveIndex(-1)
    }, [hits])

    const closeModal = useCallback(() => {
        closeSearch()
        setQuery("")
        setActiveIndex(-1)
    }, [closeSearch])

    const handleSubmit = useCallback(() => {
        const trimmed = query.trim()
        if (trimmed.length >= MIN_QUERY_LENGTH) {
            addRecentSearch(trimmed)
            closeModal()
            // Navigate to search results page
            window.location.href = `/search?q=${encodeURIComponent(trimmed)}`
        }
    }, [query, closeModal])

    const handleResultClick = useCallback((hit: AlgoliaHit) => {
        addRecentSearch(query.trim())
        closeModal()
    }, [query, closeModal])

    /* ─────────────────────────────────────────────
       Keyboard navigation
    ───────────────────────────────────────────── */
    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === "Escape") {
            closeModal()
            return
        }

        if (e.key === "Enter") {
            if (activeIndex >= 0 && activeIndex < hits.length) {
                const hit = hits[activeIndex]
                addRecentSearch(query.trim())
                closeModal()
                window.location.href = `/products/${hit.handle}`
            } else {
                handleSubmit()
            }
            return
        }

        if (e.key === "ArrowDown") {
            e.preventDefault()
            setActiveIndex((prev) => (prev < hits.length - 1 ? prev + 1 : 0))
            return
        }

        if (e.key === "ArrowUp") {
            e.preventDefault()
            setActiveIndex((prev) => (prev > 0 ? prev - 1 : hits.length - 1))
            return
        }
    }, [activeIndex, hits, query, closeModal, handleSubmit])

    // Scroll active item into view
    useEffect(() => {
        if (activeIndex >= 0 && resultsRef.current) {
            const items = resultsRef.current.querySelectorAll("[role='option']")
            items[activeIndex]?.scrollIntoView({ block: "nearest" })
        }
    }, [activeIndex])

    const showEmpty = query.trim().length < MIN_QUERY_LENGTH
    const hasResults = hits.length > 0

    return (
        <Dialog open={active === "search"} onOpenChange={toggleSearch.bind(null, "search")} key="search-modal">
            <DialogTrigger asChild>
                <button
                    aria-label="Open search"
                    aria-haspopup="dialog"
                    aria-expanded={active === "search"}
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
                aria-describedby="Search products"
            >
                {/* HEADER */}
                <DialogHeader className="border-b border-divider">
                    <DialogTitle hidden />
                    <DialogDescription hidden />
                    <div className="flex items-center w-full gap-3 px-5 py-4">
                        {isLoading ? (
                            <Loader2 className="size-5 text-primary animate-spin" aria-hidden />
                        ) : (
                            <Search className="size-5 text-text-tertiary" aria-hidden />
                        )}

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
                            aria-expanded={hasResults}
                            aria-autocomplete="list"
                            aria-activedescendant={activeIndex >= 0 ? `search-result-${activeIndex}` : undefined}
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Search for products..."
                            className="flex-1 min-w-0 bg-transparent text-base text-text-primary outline-none placeholder:text-input-placeholder"
                        />

                        {query && (
                            <button
                                aria-label="Clear search"
                                onClick={() => {
                                    setQuery("")
                                    inputRef.current?.focus()
                                }}
                                className="rounded-md p-1 text-text-tertiary transition hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-1"
                            >
                                <X className="size-4" aria-hidden />
                            </button>
                        )}
                    </div>
                </DialogHeader>

                {/* BODY */}
                <div
                    className="flex-1 overflow-y-auto overscroll-contain"
                    style={{ scrollbarGutter: "stable" }}
                >
                    {showEmpty ? (
                        <DiscoveryPanel
                            onSelectQuery={(q) => {
                                setQuery(q)
                                inputRef.current?.focus()
                            }}
                        />
                    ) : (
                        <div className="px-5 py-5 space-y-4">
                            {/* RESULT COUNT */}
                            <div className="flex items-center justify-between">
                                <p className="text-[12px] font-medium text-text-tertiary uppercase tracking-wider">
                                    {isLoading ? (
                                        <span className="inline-flex items-center gap-1.5">
                                            <span className="inline-block size-1.5 rounded-full bg-primary animate-pulse" />
                                            Searching...
                                        </span>
                                    ) : (
                                        <>
                                            {totalHits}{" "}
                                            {totalHits === 1 ? "result" : "results"} for{" "}
                                            <span className="text-text-primary font-semibold">
                                                &ldquo;{query.trim()}&rdquo;
                                            </span>
                                        </>
                                    )}
                                </p>

                                {/* View all results link */}
                                {hasResults && !isLoading && (
                                    <Link
                                        href={`/search?q=${encodeURIComponent(query.trim())}` as Route}
                                        onClick={() => {
                                            addRecentSearch(query.trim())
                                            closeModal()
                                        }}
                                        className="inline-flex items-center gap-1 text-[12px] font-semibold tracking-wider uppercase text-primary hover:text-primary-hover transition-colors duration-150"
                                    >
                                        View all
                                        <ArrowRight className="size-3" aria-hidden />
                                    </Link>
                                )}
                            </div>

                            {isLoading ? (
                                <SearchSkeleton />
                            ) : hasResults ? (
                                <div
                                    ref={resultsRef}
                                    id={LISTBOX_ID}
                                    role="listbox"
                                    aria-label="Search results"
                                    className="space-y-1.5"
                                >
                                    {hits.map((hit, index) => (
                                        <Link
                                            key={hit.objectID}
                                            id={`search-result-${index}`}
                                            role="option"
                                            aria-selected={activeIndex === index}
                                            href={`/products/${hit.handle}` as Route}
                                            onClick={() => handleResultClick(hit)}
                                            className={`group flex w-full items-center gap-4 rounded-xl border p-4 text-left transition duration-150 ${activeIndex === index
                                                    ? "border-primary/40 bg-primary/5 shadow-sm"
                                                    : "border-border-subtle hover:border-border-strong hover:bg-card-hover bg-card hover:shadow-primary"
                                                }`}
                                        >
                                            {/* Thumbnail */}
                                            <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                                                {hit.thumbnail ? (
                                                    <Image
                                                        src={hit.thumbnail}
                                                        alt={hit.title}
                                                        fill
                                                        sizes="64px"
                                                        className="object-cover motion-safe:transition-transform motion-safe:duration-300 group-hover:scale-105"
                                                    />
                                                ) : (
                                                    <div className="flex items-center justify-center size-full text-text-tertiary">
                                                        <Search className="size-5" strokeWidth={1.5} aria-hidden />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 min-w-0 space-y-0.5">
                                                <p className="text-sm font-medium text-text-primary truncate">
                                                    <HighlightMatch text={hit.title} query={query} />
                                                </p>
                                                {hit.categories && hit.categories.length > 0 && (
                                                    <p className="text-xs text-text-tertiary truncate">
                                                        {hit.categories.map((c) => c.name).join(", ")}
                                                    </p>
                                                )}
                                                {hit.tags && hit.tags.length > 0 && (
                                                    <div className="flex gap-1 mt-1">
                                                        {hit.tags.slice(0, 3).map((tag) => (
                                                            <span
                                                                key={tag.id}
                                                                className="inline-block px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-text-tertiary bg-muted rounded"
                                                            >
                                                                {tag.value}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            <ArrowRight
                                                className={`shrink-0 size-4 transition-all duration-150 ${activeIndex === index
                                                        ? "text-primary opacity-100 translate-x-0.5"
                                                        : "text-text-tertiary opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5"
                                                    }`}
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

                {/* FOOTER */}
                <SearchFooter onSubmit={handleSubmit} hasQuery={query.trim().length >= MIN_QUERY_LENGTH} />
            </DialogContent>
        </Dialog>
    )
}

/* ─────────────────────────────────────────────
   Subcomponents
   ───────────────────────────────────────────── */

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

function DiscoveryPanel({ onSelectQuery }: { onSelectQuery: (q: string) => void }) {
    const [recentSearches, setRecentSearches] = useState<string[]>([])

    useEffect(() => {
        setRecentSearches(getRecentSearches())
    }, [])

    const handleClearRecent = () => {
        clearRecentSearches()
        setRecentSearches([])
    }

    return (
        <div className="px-5 py-5 space-y-7">
            {/* RECENT SEARCHES */}
            {recentSearches.length > 0 && (
                <>
                    <section aria-labelledby="recent-label">
                        <div className="flex items-center justify-between mb-3">
                            <h3
                                id="recent-label"
                                className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-text-tertiary"
                            >
                                <Clock className="size-3.5" aria-hidden />
                                Recent searches
                            </h3>
                            <button
                                onClick={handleClearRecent}
                                className="text-[11px] font-medium text-text-tertiary hover:text-text-primary transition-colors duration-150"
                            >
                                Clear all
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {recentSearches.map((item) => (
                                <button
                                    key={item}
                                    onClick={() => onSelectQuery(item)}
                                    className="rounded-full bg-muted px-4 py-1.5 text-sm text-text-secondary transition hover:bg-muted-hover hover:text-text-primary"
                                >
                                    {item}
                                </button>
                            ))}
                        </div>
                    </section>

                    <div className="h-px bg-divider" aria-hidden />
                </>
            )}

            {/* TRENDING */}
            <section aria-labelledby="trending-label">
                <h3
                    id="trending-label"
                    className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-text-tertiary"
                >
                    <TrendingUp className="size-3.5" aria-hidden />
                    Popular searches
                </h3>

                <div className="space-y-0.5">
                    {TRENDING_SEARCHES.map((item, i) => (
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

            {/* QUICK CATEGORIES */}
            <div className="h-px bg-divider" aria-hidden />
            <section aria-labelledby="quick-categories-label">
                <h3
                    id="quick-categories-label"
                    className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-text-tertiary"
                >
                    <Sparkles className="size-3.5" aria-hidden />
                    Quick categories
                </h3>
                <div className="flex flex-wrap gap-2">
                    {QUICK_CATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => onSelectQuery(cat)}
                            className="rounded-full border border-border-subtle px-4 py-1.5 text-sm text-text-secondary transition hover:border-border-strong hover:bg-muted hover:text-text-primary"
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </section>
        </div>
    )
}

function SearchSkeleton() {
    return (
        <ul className="space-y-1.5" aria-label="Loading results" aria-busy="true">
            {Array.from({ length: 4 }).map((_, i) => (
                <li
                    key={i}
                    className="flex items-center gap-4 rounded-xl border border-border-subtle bg-card p-4"
                    style={{ animationDelay: `${i * 75}ms` }}
                >
                    <div className="skeleton size-16 shrink-0 rounded-lg" />
                    <div className="flex-1 space-y-2 min-w-0">
                        <div className="skeleton h-3.5 w-3/5 rounded" />
                        <div className="skeleton h-3 w-2/5 rounded" />
                    </div>
                    <div className="skeleton h-4 w-12 shrink-0 rounded" />
                </li>
            ))}
        </ul>
    )
}

function EmptyResults({ query }: { query: string }) {
    return (
        <div className="flex flex-col items-center justify-center py-14 text-center">
            <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-muted text-text-tertiary">
                <Search className="size-6" strokeWidth={1.5} aria-hidden />
            </div>
            <p className="text-sm font-medium text-text-primary">
                No results for &ldquo;{query.trim()}&rdquo;
            </p>
            <p className="mt-1.5 text-[13px] text-text-tertiary max-w-xs">
                Try searching for a different term or browse our popular categories below
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
                {QUICK_CATEGORIES.slice(0, 4).map((cat) => (
                    <span
                        key={cat}
                        className="rounded-full bg-muted px-3 py-1 text-xs text-text-secondary"
                    >
                        {cat}
                    </span>
                ))}
            </div>
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
                <span className="flex items-center gap-1.5">
                    <kbd className="inline-flex h-5 items-center px-1.5 border border-border-strong text-[10px] font-mono rounded">
                        ↑↓
                    </kbd>
                    navigate
                </span>
                <span className="flex items-center gap-1.5">
                    <kbd className="inline-flex h-5 items-center px-1.5 border border-border-strong text-[10px] font-mono rounded">
                        ↵
                    </kbd>
                    select
                </span>
                <span className="flex items-center gap-1.5">
                    <kbd className="inline-flex h-5 items-center px-1.5 border border-border-strong text-[10px] font-mono rounded">
                        esc
                    </kbd>
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
   Static data
   ───────────────────────────────────────────── */

const TRENDING_SEARCHES = [
    "Biker Leather Jacket",
    "Suede Long Coat",
    "Vintage Bomber Jacket",
    "Shearling Aviator",
    "Women's Moto Jacket",
]

const QUICK_CATEGORIES = [
    "Leather Jackets",
    "Suede Coats",
    "Men's Collection",
    "Women's Collection",
    "Winter Wear",
    "Accessories",
]