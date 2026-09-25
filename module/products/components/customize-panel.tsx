"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import Image from "next/image"
import { Type } from "lucide-react"

// ─── Customization data ───

const LINING_OPTIONS = [
    { id: "classic-satin", label: "Classic Satin", image: "https://images.artisanhide.com/storefront/images/custom/lining-satin.webp" },
    { id: "premium-silk", label: "Premium Silk", image: "https://images.artisanhide.com/storefront/images/custom/lining-silk.webp" },
    { id: "quilted-wool", label: "Quilted Wool", image: "https://images.artisanhide.com/storefront/images/custom/lining-wool.webp" },
    { id: "paisley-print", label: "Paisley Print", image: "https://images.artisanhide.com/storefront/images/custom/lining-paisley.webp" },
]

const ZIPPER_OPTIONS = [
    { id: "silver-chrome", label: "Silver Chrome", image: "https://images.artisanhide.com/storefront/images/custom/zipper-silver.webp" },
    { id: "antique-brass", label: "Antique Brass", image: "https://images.artisanhide.com/storefront/images/custom/zipper-brass.webp" },
    { id: "matte-black", label: "Matte Black", image: "https://images.artisanhide.com/storefront/images/custom/zipper-black.webp" },
    { id: "gold", label: "Gold", image: "https://images.artisanhide.com/storefront/images/custom/zipper-gold.webp" },
]

const LINING_PRICE = 10
const ZIPPER_PRICE = 10
const MONOGRAM_PRICE = 5

// ─── Types ───

export type CustomizationState = {
    lining: string | null
    zipper: string | null
    monogramLine1: string
    monogramLine2: string
}

export const INITIAL_CUSTOMIZATION: CustomizationState = {
    lining: null,
    zipper: null,
    monogramLine1: "",
    monogramLine2: "",
}

export function getCustomizationSurcharge(state: CustomizationState): number {
    let total = 0
    if (state.lining) total += LINING_PRICE
    if (state.zipper) total += ZIPPER_PRICE
    if (state.monogramLine1.trim() || state.monogramLine2.trim()) total += MONOGRAM_PRICE
    return total
}

// ─── Component ───

export default function CustomizePanel({ open, state, onChange }: CustomizePanelProps) {
    const contentRef = useRef<HTMLDivElement>(null)
    const [height, setHeight] = useState(0)

    useEffect(() => {
        if (!contentRef.current) return
        // Measure on open and on any content change
        const measure = () => {
            if (contentRef.current) setHeight(contentRef.current.scrollHeight)
        }
        measure()
        // ResizeObserver for dynamic content (e.g. monogram text)
        const ro = new ResizeObserver(measure)
        ro.observe(contentRef.current)
        return () => ro.disconnect()
    }, [open, state])

    const surcharge = getCustomizationSurcharge(state)
    const hasMonogram = state.monogramLine1.trim().length > 0 || state.monogramLine2.trim().length > 0

    const setLining = useCallback(
        (id: string) => onChange({ ...state, lining: state.lining === id ? null : id }),
        [state, onChange]
    )

    const setZipper = useCallback(
        (id: string) => onChange({ ...state, zipper: state.zipper === id ? null : id }),
        [state, onChange]
    )

    const setMonogram = useCallback(
        (line: 1 | 2, value: string) => {
            const clamped = value.slice(0, 20)
            onChange(line === 1 ? { ...state, monogramLine1: clamped } : { ...state, monogramLine2: clamped })
        },
        [state, onChange]
    )

    return (
        <div
            className="overflow-hidden transition-all duration-400 ease-in-out"
            style={{ maxHeight: open ? `${height}px` : "0px", opacity: open ? 1 : 0 }}
            aria-hidden={!open}
        >
            <div ref={contentRef} className="space-y-5 pb-5">
                {/* ─── Lining ─── */}
                <SwatchSection
                    title="Lining"
                    priceLabel={`+$${LINING_PRICE}`}
                    options={LINING_OPTIONS}
                    selectedId={state.lining}
                    onSelect={setLining}
                />

                {/* ─── Zipper Color ─── */}
                <SwatchSection
                    title="Zipper Color"
                    priceLabel={`+$${ZIPPER_PRICE}`}
                    options={ZIPPER_OPTIONS}
                    selectedId={state.zipper}
                    onSelect={setZipper}
                />

                {/* ─── Monogram ─── */}
                <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                            Jacket Monogram
                        </span>
                        <span className="text-xs font-medium text-accent">+${MONOGRAM_PRICE}</span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-text-tertiary">
                        Monogram your name or a message inside the jacket. Max 20 characters on each line.
                    </p>
                    <div className="space-y-2">
                        <MonogramInput
                            label="Line 1"
                            value={state.monogramLine1}
                            onChange={(v) => setMonogram(1, v)}
                        />
                        <MonogramInput
                            label="Line 2"
                            value={state.monogramLine2}
                            onChange={(v) => setMonogram(2, v)}
                        />
                    </div>
                </div>

                {/* ─── Price Summary ─── */}
                {surcharge > 0 && (
                    <div className="flex items-center justify-between rounded-lg border border-accent/20 bg-accent/5 px-4 py-2.5">
                        <span className="text-xs font-medium text-text-secondary">Customization total</span>
                        <span className="text-sm font-bold text-accent">+${surcharge}</span>
                    </div>
                )}
            </div>
        </div>
    )
}

// ─── Sub-components ───

function SwatchSection({ title, priceLabel, options, selectedId, onSelect }: SwatchSectionProps) {
    return (
        <div className="space-y-2.5">
            <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">{title}</span>
                <span className="text-xs font-medium text-accent">{priceLabel}</span>
            </div>
            <div className="grid grid-cols-4 gap-2 sm:flex sm:flex-wrap sm:gap-2.5">
                {options.map((opt) => {
                    const selected = opt.id === selectedId
                    return (
                        <button
                            key={opt.id}
                            type="button"
                            onClick={() => onSelect(opt.id)}
                            aria-pressed={selected}
                            className={`group relative flex flex-col items-center gap-1.5 rounded-lg border-2 p-1.5 transition-all duration-200 sm:w-18 ${selected ? "border-primary bg-primary/5 shadow-sm" : "border-border hover:border-border-strong hover:bg-muted/50"}`}
                            title={opt.label}
                        >
                            <div className="relative aspect-square w-full overflow-hidden rounded bg-surface-sunken">
                                <Image
                                    src={opt.image}
                                    alt={opt.label}
                                    width={56}
                                    height={56}
                                    sizes="56px"
                                    quality={60}
                                    className="size-full object-cover"
                                />
                            </div>
                            <span className={`text-center text-[9px] font-medium leading-tight ${selected ? "text-primary" : "text-text-tertiary"}`}>
                                {opt.label}
                            </span>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}

function MonogramInput({ label, value, onChange }: MonogramInputProps) {
    return (
        <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Type className="size-3.5 text-text-tertiary" strokeWidth={1.5} />
            </div>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                maxLength={20}
                placeholder={label}
                aria-label={label}
                className="w-full rounded-lg border border-border bg-surface py-2.5 pl-9 pr-14 text-sm text-text-primary placeholder:text-text-disabled transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
            />
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-[10px] tabular-nums text-text-tertiary">
                {value.length}/20
            </span>
        </div>
    )
}

// ─── Types ───

type CustomizePanelProps = {
    open: boolean
    state: CustomizationState
    onChange: (state: CustomizationState) => void
}

type SwatchOption = {
    id: string
    label: string
    image: string
}

type SwatchSectionProps = {
    title: string
    priceLabel: string
    options: SwatchOption[]
    selectedId: string | null
    onSelect: (id: string) => void
}

type MonogramInputProps = {
    label: string
    value: string
    onChange: (value: string) => void
}
