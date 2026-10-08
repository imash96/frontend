"use client"

import { Check, RotateCcw, Scissors, Sparkles, Type } from "lucide-react"
import { useCallback } from "react"

export type BespokeCustomizationState = {
    lining: string | null
    zipper: string | null
    monogramLine1: string
    monogramLine2: string
    customFitNotes: string
}

export const DEFAULT_BESPOKE_CUSTOMIZATION: BespokeCustomizationState = {
    lining: null,
    zipper: null,
    monogramLine1: "",
    monogramLine2: "",
    customFitNotes: "",
}

export const LINING_CHOICES = [
    {
        id: "Classic Bemberg Satin",
        label: "Bemberg Satin",
        desc: "Breathable obsidian cupro",
        swatch: "linear-gradient(135deg, #1f1b18 0%, #3a322d 100%)",
        price: 10,
    },
    {
        id: "Mulberry Silk Lining",
        label: "Mulberry Silk",
        desc: "Champagne gold 22-momme silk",
        swatch: "linear-gradient(135deg, #b88b4a 0%, #6e4f26 100%)",
        price: 10,
    },
    {
        id: "Quilted Merino Wool",
        label: "Quilted Merino",
        desc: "Thermal diamond-quilted wool",
        swatch: "linear-gradient(135deg, #4b3628 0%, #2a1d15 100%)",
        price: 10,
    },
    {
        id: "Florentine Paisley",
        label: "Artisan Paisley",
        desc: "Burgundy & gold jacquard weave",
        swatch: "linear-gradient(135deg, #5e1d24 0%, #2d1216 100%)",
        price: 10,
    },
]

export const ZIPPER_CHOICES = [
    {
        id: "YKK Silver Chrome",
        label: "Silver Chrome",
        desc: "Mirror-polished Excella",
        swatch: "linear-gradient(135deg, #e5e7eb 0%, #6b7280 100%)",
        price: 10,
    },
    {
        id: "Antique Brass YKK",
        label: "Antique Brass",
        desc: "Hand-aged Florentine brass",
        swatch: "linear-gradient(135deg, #c59b27 0%, #715311 100%)",
        price: 10,
    },
    {
        id: "Matte Gunmetal",
        label: "Matte Gunmetal",
        desc: "Stealth PVD brushed dark",
        swatch: "linear-gradient(135deg, #374151 0%, #111827 100%)",
        price: 10,
    },
    {
        id: "Brushed 18K Gold Tone",
        label: "Brushed Gold",
        desc: "Warm satin gold finish",
        swatch: "linear-gradient(135deg, #f3d078 0%, #b48327 100%)",
        price: 10,
    },
]

export function getBespokeSurcharge(state: BespokeCustomizationState): number {
    let total = 0
    if (state.lining) total += 10
    if (state.zipper) total += 10
    if (state.monogramLine1.trim() || state.monogramLine2.trim()) total += 5
    return total
}

export function buildCustomizationMetadata(
    state: BespokeCustomizationState,
): Record<string, unknown> | undefined {
    const meta: Record<string, unknown> = {}
    if (state.lining) meta.lining = state.lining
    if (state.zipper) meta.zipper = state.zipper
    const mono = [state.monogramLine1.trim(), state.monogramLine2.trim()]
        .filter(Boolean)
        .join(" · ")
    if (mono) meta.monogram = mono
    if (state.customFitNotes.trim()) meta.bespoke_notes = state.customFitNotes.trim()
    return Object.keys(meta).length > 0 ? meta : undefined
}

type PreviewCustomizeProps = {
    open: boolean
    state: BespokeCustomizationState
    onChange: (next: BespokeCustomizationState) => void
    onReset: () => void
}

export default function PreviewCustomize({
    open,
    state,
    onChange,
    onReset,
}: PreviewCustomizeProps) {
    const surcharge = getBespokeSurcharge(state)
    const hasAny =
        Boolean(state.lining) ||
        Boolean(state.zipper) ||
        Boolean(state.monogramLine1.trim()) ||
        Boolean(state.monogramLine2.trim()) ||
        Boolean(state.customFitNotes.trim())

    const toggleLining = useCallback(
        (id: string) => {
            onChange({ ...state, lining: state.lining === id ? null : id })
        },
        [state, onChange],
    )

    const toggleZipper = useCallback(
        (id: string) => {
            onChange({ ...state, zipper: state.zipper === id ? null : id })
        },
        [state, onChange],
    )

    if (!open) return null

    return (
        <div className="space-y-5 rounded-2xl border border-accent/35 bg-surface p-4 shadow-sm sm:p-5">
            <div className="flex items-center justify-between border-b border-divider pb-3">
                <div className="flex items-center gap-2">
                    <span className="flex size-8 items-center justify-center rounded-full bg-accent/15 text-accent">
                        <Sparkles className="size-4" />
                    </span>
                    <div>
                        <h3 className="font-heading text-sm font-semibold text-text-primary sm:text-base">
                            Bespoke Atelier Customization
                        </h3>
                        <p className="text-[11px] text-text-tertiary">
                            Hand-finished to order by our master leatherworkers
                        </p>
                    </div>
                </div>
                {hasAny && (
                    <button
                        type="button"
                        onClick={onReset}
                        className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium text-text-secondary transition-colors hover:bg-muted hover:text-text-primary"
                    >
                        <RotateCcw className="size-3" />
                        <span>Reset</span>
                    </button>
                )}
            </div>

            {/* 1. Interior Lining */}
            <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                        1. Interior Lining Upgrade
                    </span>
                    <span className="text-xs font-semibold text-accent">+$10</span>
                </div>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {LINING_CHOICES.map((opt) => {
                        const selected = state.lining === opt.id
                        return (
                            <button
                                key={opt.id}
                                type="button"
                                onClick={() => toggleLining(opt.id)}
                                aria-pressed={selected}
                                className={`relative flex flex-col items-start gap-1.5 rounded-xl border p-2.5 text-left transition-all ${
                                    selected
                                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                                        : "border-border hover:border-border-strong"
                                }`}
                            >
                                <div className="flex w-full items-center justify-between">
                                    <span
                                        className="size-6 rounded-full border border-white/20 shadow-xs"
                                        style={{ background: opt.swatch }}
                                    />
                                    {selected && (
                                        <span className="flex size-4 items-center justify-center rounded-full bg-primary text-primary-foreground">
                                            <Check className="size-2.5" />
                                        </span>
                                    )}
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-text-primary">
                                        {opt.label}
                                    </p>
                                    <p className="line-clamp-1 text-[10px] text-text-tertiary">
                                        {opt.desc}
                                    </p>
                                </div>
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* 2. Hardware & Zipper Finish */}
            <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                        2. YKK Excella Hardware Finish
                    </span>
                    <span className="text-xs font-semibold text-accent">+$10</span>
                </div>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {ZIPPER_CHOICES.map((opt) => {
                        const selected = state.zipper === opt.id
                        return (
                            <button
                                key={opt.id}
                                type="button"
                                onClick={() => toggleZipper(opt.id)}
                                aria-pressed={selected}
                                className={`relative flex flex-col items-start gap-1.5 rounded-xl border p-2.5 text-left transition-all ${
                                    selected
                                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                                        : "border-border hover:border-border-strong"
                                }`}
                            >
                                <div className="flex w-full items-center justify-between">
                                    <span
                                        className="size-6 rounded-full border border-black/15 shadow-xs"
                                        style={{ background: opt.swatch }}
                                    />
                                    {selected && (
                                        <span className="flex size-4 items-center justify-center rounded-full bg-primary text-primary-foreground">
                                            <Check className="size-2.5" />
                                        </span>
                                    )}
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-text-primary">
                                        {opt.label}
                                    </p>
                                    <p className="line-clamp-1 text-[10px] text-text-tertiary">
                                        {opt.desc}
                                    </p>
                                </div>
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* 3. Interior Leather Monogram + Live Patch Preview */}
            <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                        3. Interior Gold-Foil Leather Monogram
                    </span>
                    <span className="text-xs font-semibold text-accent">+$5</span>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="space-y-2">
                        <div className="relative">
                            <Type className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-text-tertiary" />
                            <input
                                type="text"
                                maxLength={20}
                                value={state.monogramLine1}
                                onChange={(e) =>
                                    onChange({
                                        ...state,
                                        monogramLine1: e.target.value.slice(0, 20),
                                    })
                                }
                                placeholder="Line 1 (e.g. JULIAN STERLING)"
                                aria-label="Monogram line 1"
                                className="w-full rounded-lg border border-border bg-background py-2 pl-8 pr-12 text-xs text-text-primary placeholder:text-text-disabled focus:border-primary focus:outline-none"
                            />
                            <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 font-mono text-[10px] text-text-tertiary">
                                {state.monogramLine1.length}/20
                            </span>
                        </div>
                        <div className="relative">
                            <Type className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-text-tertiary" />
                            <input
                                type="text"
                                maxLength={20}
                                value={state.monogramLine2}
                                onChange={(e) =>
                                    onChange({
                                        ...state,
                                        monogramLine2: e.target.value.slice(0, 20),
                                    })
                                }
                                placeholder="Line 2 (e.g. FIRENZE MMXXVI)"
                                aria-label="Monogram line 2"
                                className="w-full rounded-lg border border-border bg-background py-2 pl-8 pr-12 text-xs text-text-primary placeholder:text-text-disabled focus:border-primary focus:outline-none"
                            />
                            <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 font-mono text-[10px] text-text-tertiary">
                                {state.monogramLine2.length}/20
                            </span>
                        </div>
                    </div>

                    {/* Live Leather Patch Preview */}
                    <div
                        className="flex flex-col items-center justify-center rounded-xl border border-amber-900/40 px-4 py-3 text-center shadow-inner"
                        style={{
                            background:
                                "radial-gradient(circle at center, #3b2314 0%, #24140b 100%)",
                        }}
                    >
                        <span className="text-[9px] uppercase tracking-[0.25em] text-amber-200/60">
                            Velle Hide · Bespoke
                        </span>
                        <p className="mt-1 font-heading text-xs font-semibold tracking-[0.18em] text-amber-300 uppercase">
                            {state.monogramLine1.trim() || "YOUR MONOGRAM"}
                        </p>
                        {state.monogramLine2.trim() && (
                            <p className="mt-0.5 font-mono text-[10px] tracking-[0.15em] text-amber-200/85 uppercase">
                                {state.monogramLine2.trim()}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* 4. Complimentary Custom Fit / Tailoring Notes */}
            <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-text-secondary">
                        <Scissors className="size-3.5 text-accent" />
                        <span>4. Custom Tailoring / Fit Notes (Optional)</span>
                    </span>
                    <span className="text-[11px] font-medium text-success">Complimentary</span>
                </div>
                <input
                    type="text"
                    maxLength={120}
                    value={state.customFitNotes}
                    onChange={(e) =>
                        onChange({
                            ...state,
                            customFitNotes: e.target.value.slice(0, 120),
                        })
                    }
                    placeholder="Optional: e.g. Sleeve length 25.5 in, Chest 40 in, athletic shoulders..."
                    aria-label="Custom tailoring notes"
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-text-primary placeholder:text-text-disabled focus:border-primary focus:outline-none"
                />
            </div>

            {surcharge > 0 && (
                <div className="flex items-center justify-between rounded-xl border border-accent/30 bg-accent/10 px-3.5 py-2.5 text-xs">
                    <span className="font-medium text-text-primary">
                        Bespoke Customization Add-On Total
                    </span>
                    <span className="font-heading text-sm font-bold text-accent">
                        +${surcharge}.00
                    </span>
                </div>
            )}
        </div>
    )
}
