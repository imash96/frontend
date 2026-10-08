"use client"

import { CheckCircle2, Ruler, Sparkles, X } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { createPortal } from "react-dom"

type SizeGuideModalProps = {
    open: boolean
    onClose: () => void
    availableSizes?: string[]
    selectedSize?: string
    onSelectSize?: (size: string) => void
}

const SIZE_CHART_IN = [
    { size: "XS", chest: "34–36", shoulder: "16.5", sleeve: "24.5", waist: "28–30", length: "24.5" },
    { size: "S", chest: "36–38", shoulder: "17.2", sleeve: "25.0", sleeveCm: "63.5", waist: "30–32", length: "25.0" },
    { size: "M", chest: "38–40", shoulder: "18.0", sleeve: "25.5", waist: "32–34", length: "25.5" },
    { size: "L", chest: "40–42", shoulder: "18.8", sleeve: "26.0", waist: "34–36", length: "26.0" },
    { size: "XL", chest: "42–44", shoulder: "19.5", sleeve: "26.5", waist: "36–38", length: "26.5" },
    { size: "2XL", chest: "44–46", shoulder: "20.3", sleeve: "27.0", waist: "38–40", length: "27.0" },
]

const SIZE_CHART_CM = [
    { size: "XS", chest: "86–91", shoulder: "42.0", sleeve: "62.0", waist: "71–76", length: "62.0" },
    { size: "S", chest: "91–97", shoulder: "43.7", sleeve: "63.5", waist: "76–81", length: "63.5" },
    { size: "M", chest: "97–102", shoulder: "45.7", sleeve: "64.8", waist: "81–86", length: "64.8" },
    { size: "L", chest: "102–107", shoulder: "47.8", sleeve: "66.0", waist: "86–91", length: "66.0" },
    { size: "XL", chest: "107–112", shoulder: "49.5", sleeve: "67.3", waist: "91–97", length: "67.3" },
    { size: "2XL", chest: "112–117", shoulder: "51.5", sleeve: "68.5", waist: "97–102", length: "68.5" },
]

export default function SizeGuideModal({
    open,
    onClose,
    availableSizes = ["XS", "S", "M", "L", "XL", "2XL"],
    selectedSize,
    onSelectSize,
}: SizeGuideModalProps) {
    const [tab, setTab] = useState<"chart" | "finder">("chart")
    const [unit, setUnit] = useState<"in" | "cm">("in")

    // Fit Finder inputs
    const [heightCm, setHeightCm] = useState(178)
    const [weightKg, setWeightKg] = useState(76)
    const [build, setBuild] = useState<"slim" | "regular" | "athletic" | "broad">("regular")
    const [fitPreference, setFitPreference] = useState<"tailored" | "classic" | "layering">("classic")

    useEffect(() => {
        if (!open) return
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose()
        }
        const prev = document.body.style.overflow
        document.body.style.overflow = "hidden"
        window.addEventListener("keydown", onKey)
        return () => {
            document.body.style.overflow = prev
            window.removeEventListener("keydown", onKey)
        }
    }, [open, onClose])

    const recommendedSize = useMemo(() => {
        let score = weightKg + (heightCm - 170) * 0.35
        if (build === "slim") score -= 4
        if (build === "athletic") score += 2
        if (build === "broad") score += 6
        if (fitPreference === "tailored") score -= 3
        if (fitPreference === "layering") score += 4

        let target = "M"
        if (score < 64) target = "XS"
        else if (score < 73) target = "S"
        else if (score < 83) target = "M"
        else if (score < 93) target = "L"
        else if (score < 104) target = "XL"
        else target = "2XL"

        if (availableSizes.includes(target)) return target
        return availableSizes[Math.min(2, availableSizes.length - 1)] || "M"
    }, [heightCm, weightKg, build, fitPreference, availableSizes])

    if (!open || typeof document === "undefined") return null

    const rows = unit === "in" ? SIZE_CHART_IN : SIZE_CHART_CM

    return createPortal(
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="size-guide-title"
            className="fixed inset-0 z-100 flex items-center justify-center bg-overlay p-3 backdrop-blur-xs sm:p-6"
            onClick={onClose}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-border bg-surface text-text-primary shadow-2xl"
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-divider px-5 py-4 sm:px-6">
                    <div className="flex items-center gap-2.5">
                        <span className="flex size-9 items-center justify-center rounded-full bg-accent/15 text-accent">
                            <Ruler className="size-4.5" />
                        </span>
                        <div>
                            <h2 id="size-guide-title" className="font-heading text-base font-semibold sm:text-lg">
                                Atelier Sizing &amp; Fit Guide
                            </h2>
                            <p className="text-xs text-text-tertiary">
                                Tailored architectural silhouette · Full-grain leather molds to your frame
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close size guide"
                        className="flex size-8 items-center justify-center rounded-full text-text-secondary transition-colors hover:bg-muted hover:text-text-primary"
                    >
                        <X className="size-4.5" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex items-center justify-between border-b border-divider bg-background-secondary/60 px-5 py-2.5 sm:px-6">
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => setTab("chart")}
                            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all sm:text-sm ${
                                tab === "chart"
                                    ? "bg-primary text-primary-foreground shadow-xs"
                                    : "text-text-secondary hover:text-text-primary"
                            }`}
                        >
                            Measurement Chart
                        </button>
                        <button
                            type="button"
                            onClick={() => setTab("finder")}
                            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all sm:text-sm ${
                                tab === "finder"
                                    ? "bg-primary text-primary-foreground shadow-xs"
                                    : "text-text-secondary hover:text-text-primary"
                            }`}
                        >
                            <Sparkles className="size-3.5" />
                            <span>Find My Size</span>
                        </button>
                    </div>

                    {tab === "chart" && (
                        <div className="inline-flex rounded-lg border border-border bg-surface p-0.5 text-xs">
                            <button
                                type="button"
                                onClick={() => setUnit("in")}
                                className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
                                    unit === "in"
                                        ? "bg-accent text-accent-foreground"
                                        : "text-text-secondary"
                                }`}
                            >
                                IN
                            </button>
                            <button
                                type="button"
                                onClick={() => setUnit("cm")}
                                className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
                                    unit === "cm"
                                        ? "bg-accent text-accent-foreground"
                                        : "text-text-secondary"
                                }`}
                            >
                                CM
                            </button>
                        </div>
                    )}
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-5 sm:p-6">
                    {tab === "chart" ? (
                        <div className="space-y-5">
                            <div className="overflow-x-auto rounded-xl border border-border">
                                <table className="w-full text-left text-xs sm:text-sm">
                                    <thead className="bg-background-secondary text-xs uppercase tracking-wider text-text-secondary">
                                        <tr>
                                            <th className="px-3.5 py-3 font-semibold">Size</th>
                                            <th className="px-3.5 py-3 font-semibold">Chest ({unit})</th>
                                            <th className="px-3.5 py-3 font-semibold">Shoulder ({unit})</th>
                                            <th className="px-3.5 py-3 font-semibold">Sleeve ({unit})</th>
                                            <th className="px-3.5 py-3 font-semibold">Waist ({unit})</th>
                                            <th className="px-3.5 py-3 font-semibold">Back Length ({unit})</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-divider">
                                        {rows.map((r) => {
                                            const isCurrent = selectedSize === r.size
                                            return (
                                                <tr
                                                    key={r.size}
                                                    onClick={() => {
                                                        if (onSelectSize && availableSizes.includes(r.size)) {
                                                            onSelectSize(r.size)
                                                        }
                                                    }}
                                                    className={`transition-colors ${
                                                        isCurrent
                                                            ? "bg-accent/15 font-semibold text-text-primary"
                                                            : "hover:bg-muted/60 cursor-pointer"
                                                    }`}
                                                >
                                                    <td className="px-3.5 py-2.5 font-heading font-bold">
                                                        {r.size}
                                                        {isCurrent && (
                                                            <span className="ml-1.5 rounded bg-primary px-1.5 py-0.5 text-[10px] text-primary-foreground">
                                                                Selected
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-3.5 py-2.5 tabular-nums">{r.chest}</td>
                                                    <td className="px-3.5 py-2.5 tabular-nums">{r.shoulder}</td>
                                                    <td className="px-3.5 py-2.5 tabular-nums">{r.sleeve}</td>
                                                    <td className="px-3.5 py-2.5 tabular-nums">{r.waist}</td>
                                                    <td className="px-3.5 py-2.5 tabular-nums">{r.length}</td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            <div className="grid grid-cols-1 gap-3 rounded-xl border border-border bg-background-secondary/50 p-4 sm:grid-cols-3">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wider text-text-primary">
                                        1. Chest
                                    </p>
                                    <p className="mt-1 text-xs leading-relaxed text-text-secondary">
                                        Measure around the fullest part of your chest, keeping the tape horizontal under your arms.
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wider text-text-primary">
                                        2. Shoulders
                                    </p>
                                    <p className="mt-1 text-xs leading-relaxed text-text-secondary">
                                        Measure across the upper back from the tip of one shoulder bone to the other.
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wider text-text-primary">
                                        3. Natural Break-In
                                    </p>
                                    <p className="mt-1 text-xs leading-relaxed text-text-secondary">
                                        Full-grain lambskin relaxes ~0.5&quot; at stress points within 5–7 wears to contour your torso.
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-5">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="rounded-xl border border-border p-4">
                                    <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-text-secondary">
                                        <span>Height</span>
                                        <span className="font-mono text-sm text-text-primary">
                                            {heightCm} cm ({Math.floor(heightCm / 30.48)}&apos;
                                            {Math.round((heightCm % 30.48) / 2.54)}&quot;)
                                        </span>
                                    </div>
                                    <input
                                        type="range"
                                        min={152}
                                        max={202}
                                        value={heightCm}
                                        onChange={(e) => setHeightCm(Number(e.target.value))}
                                        aria-label="Height in centimeters"
                                        className="mt-3 w-full accent-primary"
                                    />
                                </div>

                                <div className="rounded-xl border border-border p-4">
                                    <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-text-secondary">
                                        <span>Weight</span>
                                        <span className="font-mono text-sm text-text-primary">
                                            {weightKg} kg ({Math.round(weightKg * 2.20462)} lbs)
                                        </span>
                                    </div>
                                    <input
                                        type="range"
                                        min={48}
                                        max={125}
                                        value={weightKg}
                                        onChange={(e) => setWeightKg(Number(e.target.value))}
                                        aria-label="Weight in kilograms"
                                        className="mt-3 w-full accent-primary"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-text-secondary">
                                        Chest &amp; Shoulder Build
                                    </label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {(["slim", "regular", "athletic", "broad"] as const).map((b) => (
                                            <button
                                                key={b}
                                                type="button"
                                                onClick={() => setBuild(b)}
                                                className={`rounded-lg border px-3 py-2 text-xs font-medium capitalize transition-all ${
                                                    build === b
                                                        ? "border-primary bg-primary text-primary-foreground"
                                                        : "border-border bg-surface text-text-secondary hover:border-border-strong"
                                                }`}
                                            >
                                                {b}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-text-secondary">
                                        Fit Preference
                                    </label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {(["tailored", "classic", "layering"] as const).map((f) => (
                                            <button
                                                key={f}
                                                type="button"
                                                onClick={() => setFitPreference(f)}
                                                className={`rounded-lg border px-2.5 py-2 text-xs font-medium capitalize transition-all ${
                                                    fitPreference === f
                                                        ? "border-primary bg-primary text-primary-foreground"
                                                        : "border-border bg-surface text-text-secondary hover:border-border-strong"
                                                }`}
                                            >
                                                {f}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Recommendation Result Card */}
                            <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-accent/40 bg-accent/10 p-5 sm:flex-row">
                                <div className="flex items-center gap-3.5 text-center sm:text-left">
                                    <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary font-heading text-xl font-bold text-primary-foreground shadow-sm">
                                        {recommendedSize}
                                    </div>
                                    <div>
                                        <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-accent">
                                            <CheckCircle2 className="size-3.5" />
                                            97% Atelier Fit Match
                                        </p>
                                        <p className="mt-0.5 font-heading text-base font-semibold text-text-primary">
                                            We recommend Size {recommendedSize}
                                        </p>
                                        <p className="text-xs text-text-secondary">
                                            Ideal for a {fitPreference} silhouette with your {build} frame.
                                        </p>
                                    </div>
                                </div>

                                {onSelectSize && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            onSelectSize(recommendedSize)
                                            onClose()
                                        }}
                                        className="w-full rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-primary-foreground transition-all hover:bg-primary-hover sm:w-auto"
                                    >
                                        Select Size {recommendedSize}
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>,
        document.body,
    )
}
