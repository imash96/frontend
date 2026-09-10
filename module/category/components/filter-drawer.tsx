"use client"

import { StoreProductCategory } from "@medusajs/types"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useRef, useState, useTransition } from "react"

interface FilterDrawerProps {
    isOpen: boolean
    onClose: () => void
    currentCategory: StoreProductCategory | null
    sizes: string[] | null
    activeFilters: {
        sizes: string[]
        colors: string[]
        minPrice: string
        maxPrice: string
    }
}

const COLORS = [
    { label: "Black", value: "black", hex: "#1a1a1a" },
    { label: "Brown", value: "brown", hex: "#6b3f1a" },
    { label: "Cognac", value: "cognac", hex: "#c4813c" },
    { label: "Camel", value: "camel", hex: "#c19a6b" },
    { label: "White", value: "white", hex: "#f5f0e8" },
    { label: "Burgundy", value: "burgundy", hex: "#6b1a2b" },
    { label: "Navy", value: "navy", hex: "#1a2b4a" },
    { label: "Olive", value: "olive", hex: "#4a4a1a" },
] as const

const toggleItem = (arr: string[], val: string) =>
    arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]

export default function FilterDrawer({
    isOpen,
    onClose,
    currentCategory,
    sizes,
    activeFilters,
}: FilterDrawerProps) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const [, startTransition] = useTransition()

    const closeBtnRef = useRef<HTMLButtonElement>(null)

    const [localSizes, setLocalSizes] = useState(activeFilters.sizes)
    const [localColors, setLocalColors] = useState(activeFilters.colors)
    const [localMinPrice, setLocalMinPrice] = useState(activeFilters.minPrice)
    const [localMaxPrice, setLocalMaxPrice] = useState(activeFilters.maxPrice)

    useEffect(() => {
        setLocalSizes(activeFilters.sizes)
        setLocalColors(activeFilters.colors)
        setLocalMinPrice(activeFilters.minPrice)
        setLocalMaxPrice(activeFilters.maxPrice)
    }, [activeFilters])

    useEffect(() => {
        if (!isOpen) return

        document.body.style.overflow = "hidden"
        setTimeout(() => closeBtnRef.current?.focus(), 60)

        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose()
        }

        document.addEventListener("keydown", handler)

        return () => {
            document.body.style.overflow = ""
            document.removeEventListener("keydown", handler)
        }
    }, [isOpen, onClose])

    const applyFilters = useCallback(() => {
        const params = new URLSearchParams(searchParams.toString())

        params.delete("page")

        params.delete("size")
        localSizes.forEach((s) => params.append("size", s))

        params.delete("color")
        localColors.forEach((c) => params.append("color", c))

        if (localMinPrice) params.set("minPrice", localMinPrice)
        else params.delete("minPrice")

        if (localMaxPrice) params.set("maxPrice", localMaxPrice)
        else params.delete("maxPrice")

        startTransition(() => {
            router.push(`${pathname}?${params.toString()}`, { scroll: false })
            onClose()
        })
    }, [
        localSizes,
        localColors,
        localMinPrice,
        localMaxPrice,
        pathname,
        router,
        searchParams,
        onClose,
    ])

    const clearAll = () => {
        setLocalSizes([])
        setLocalColors([])
        setLocalMinPrice("")
        setLocalMaxPrice("")
    }

    const navigateToCategory = (handle: string) => {
        const segments = handle.split("/")
        const [parentSeg, ...rest] = segments

        const path =
            rest.length === 0
                ? `/category/${parentSeg}`
                : `/category/${parentSeg}/${rest.join("/")}`

        router.push(path)
        onClose()
    }

    const children = currentCategory?.category_children ?? []
    const parent = currentCategory?.parent_category

    const totalActive =
        localSizes.length +
        localColors.length +
        (localMinPrice || localMaxPrice ? 1 : 0)

    return (
        <>
            {/* Overlay */}
            <div
                className={`fixed inset-0 z-40 bg-overlay transition-opacity duration-200 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                    }`}
                onClick={onClose}
            />

            {/* Drawer */}
            <aside
                role="dialog"
                aria-modal="true"
                className={`fixed left-0 top-0 z-50 h-full w-[92vw] max-w-md flex flex-col bg-surface border-r border-border shadow-2xl transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                {/* Header */}
                <header className="flex items-center justify-between px-5 py-4 border-b border-border">
                    <div>
                        <h2 className="text-sm font-semibold tracking-wide">
                            Filters
                        </h2>

                        {totalActive > 0 && (
                            <p className="text-xs text-accent mt-0.5">
                                {totalActive} active
                            </p>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        {totalActive > 0 && (
                            <button
                                onClick={clearAll}
                                className="text-xs underline text-text-tertiary hover:text-text-primary"
                            >
                                Clear
                            </button>
                        )}

                        <button
                            ref={closeBtnRef}
                            onClick={onClose}
                            className="p-2 rounded-md hover:bg-muted"
                        >
                            ✕
                        </button>
                    </div>
                </header>

                {/* Body */}
                <div className="flex-1 overflow-y-auto px-5 py-6 space-y-7">

                    {parent && (
                        <button
                            onClick={() => navigateToCategory(parent.handle)}
                            className="text-sm text-text-secondary hover:text-text-primary"
                        >
                            ← Back to {parent.name}
                        </button>
                    )}

                    {children.length > 0 && (
                        <FilterSection title="Browse">
                            {children.map((child) => {
                                const active = currentCategory?.handle === child.handle

                                return (
                                    <button
                                        key={child.id}
                                        onClick={() => navigateToCategory(child.handle)}
                                        className={`flex w-full items-center justify-between px-3 py-2 rounded-lg text-sm transition ${active
                                                ? "bg-muted text-text-primary"
                                                : "text-text-secondary hover:bg-muted"
                                            }`}
                                    >
                                        {child.name}
                                        →
                                    </button>
                                )
                            })}
                        </FilterSection>
                    )}

                    {sizes && sizes.length > 0 && (
                        <FilterSection title="Size">
                            <div className="flex flex-wrap gap-2">
                                {sizes.map((size) => {
                                    const active = localSizes.includes(size)

                                    return (
                                        <button
                                            key={size}
                                            onClick={() =>
                                                setLocalSizes(toggleItem(localSizes, size))
                                            }
                                            className={`px-3 py-1.5 text-xs rounded-md border transition ${active
                                                    ? "bg-accent-subtle text-accent border-accent"
                                                    : "border-border text-text-secondary hover:border-border-strong"
                                                }`}
                                        >
                                            {size}
                                        </button>
                                    )
                                })}
                            </div>
                        </FilterSection>
                    )}

                    <FilterSection title="Color">
                        <div className="flex flex-wrap gap-3">
                            {COLORS.map(({ label, value, hex }) => {
                                const active = localColors.includes(value)

                                return (
                                    <button
                                        key={value}
                                        onClick={() =>
                                            setLocalColors(toggleItem(localColors, value))
                                        }
                                        className="flex flex-col items-center gap-1"
                                    >
                                        <span
                                            className={`w-7 h-7 rounded-full border-2 ${active
                                                    ? "border-accent ring-2 ring-accent-subtle"
                                                    : "border-border"
                                                }`}
                                            style={{ background: hex }}
                                        />
                                        <span className="text-[10px] text-text-tertiary">
                                            {label}
                                        </span>
                                    </button>
                                )
                            })}
                        </div>
                    </FilterSection>

                    <FilterSection title="Price">
                        <div className="flex gap-3">
                            <PriceInput
                                placeholder="Min"
                                value={localMinPrice}
                                onChange={setLocalMinPrice}
                            />
                            <PriceInput
                                placeholder="Max"
                                value={localMaxPrice}
                                onChange={setLocalMaxPrice}
                            />
                        </div>
                    </FilterSection>
                </div>

                {/* Footer */}
                <footer className="px-5 py-4 border-t border-border">
                    <button
                        onClick={applyFilters}
                        className="w-full py-3 rounded-lg bg-accent text-accent-foreground font-semibold tracking-wide hover:bg-accent-hover transition"
                    >
                        Apply Filters
                        {totalActive > 0 && ` (${totalActive})`}
                    </button>
                </footer>
            </aside>
        </>
    )
}

function FilterSection({
    title,
    children,
}: {
    title: string
    children: React.ReactNode
}) {
    return (
        <section>
            <h3 className="text-[10px] uppercase tracking-widest text-text-tertiary mb-3">
                {title}
            </h3>
            {children}
        </section>
    )
}

function PriceInput({
    placeholder,
    value,
    onChange,
}: {
    placeholder: string
    value: string
    onChange: (v: string) => void
}) {
    return (
        <input
            type="number"
            inputMode="numeric"
            min={0}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-md border border-input-border bg-input-background text-input-text placeholder:text-input-placeholder focus:border-input-border-focus outline-none"
        />
    )
}