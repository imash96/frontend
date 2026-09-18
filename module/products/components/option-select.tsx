import { StoreProductOption } from "@medusajs/types"
import Link from "next/link"

const NAMED_COLORS: Record<string, string> = {
    black: "#1a1a1a",
    white: "#f4f1ea",
    brown: "#6b3e26",
    cognac: "#8b4513",
    tan: "#c4a574",
    navy: "#1a1a3e",
    blue: "#1e3a5f",
    red: "#7f1d1d",
    oxblood: "#4a0000",
    green: "#1f3d2b",
    grey: "#6b7280",
    gray: "#6b7280",
    beige: "#d6c4a8",
    olive: "#556b2f",
}

function toCssColor(value: string) {
    const trimmed = value.trim()
    if (/^#([0-9a-f]{3,8})$/i.test(trimmed) || /^(rgb|hsl)a?\(/i.test(trimmed)) return trimmed
    return NAMED_COLORS[trimmed.toLowerCase()] ?? null
}

export default function OptionSelect({ option, value, onSelect, disabled }: OptionSelectProps) {
    const title = option.title ?? ""
    const key = title.toLowerCase()
    const isSize = key === "size"
    const isColor = key === "color" || key === "colour"
    const values = option.values?.map((v) => v.value) ?? []

    if (values.length <= 1) {
        return (
            <div className="flex items-center gap-2 text-sm">
                <span className="font-medium text-text-primary">{title}:</span>
                <span className="text-text-secondary">{value ?? values[0] ?? "—"}</span>
            </div>
        )
    }

    return (
        <div className="space-y-2.5">
            {isColor ? (
                <>
                    <div className="mb-2.5 flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                            Color
                        </span>
                        <span className="text-xs text-text-tertiary">{value}</span>
                    </div>
                    <div className="flex flex-wrap gap-2.5">
                        {values.map((c) => {
                            const selected = c === value
                            const css = toCssColor(c)
                            return (
                                <button
                                    key={c}
                                    type="button"
                                    onClick={() => onSelect(c)}
                                    disabled={disabled}
                                    className={`flex size-10 items-center justify-center rounded-full border-2 transition-all duration-200 ${
                                        selected
                                            ? "scale-110 border-primary ring-2 ring-primary/20"
                                            : "border-border hover:scale-105 hover:border-border-strong"
                                    }`}
                                    style={css ? { backgroundColor: css } : undefined}
                                    title={c}
                                    aria-label={c}
                                    aria-pressed={selected}
                                >
                                    {!css && (
                                        <span className="text-[9px] font-semibold uppercase text-text-primary">
                                            {c.slice(0, 2)}
                                        </span>
                                    )}
                                </button>
                            )
                        })}
                    </div>
                </>
            ) : (
                <>
                    <div className="mb-2.5 flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                            {title}
                        </span>
                        {isSize && (
                            <Link
                                href="/size-guide"
                                className="text-xs text-link underline underline-offset-2 transition-colors hover:text-link-hover"
                            >
                                Size Guide
                            </Link>
                        )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {values.map((c) => {
                            const selected = c === value
                            return (
                                <button
                                    key={c}
                                    type="button"
                                    onClick={() => onSelect(c)}
                                    disabled={disabled}
                                    aria-pressed={selected}
                                    className={`min-w-12 rounded-lg border px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                                        selected
                                            ? "border-primary bg-primary text-primary-foreground shadow-primary"
                                            : disabled
                                              ? "cursor-not-allowed border-border-subtle text-text-disabled line-through opacity-50"
                                              : "border-border text-text-primary hover:border-border-strong hover:bg-muted"
                                    }`}
                                >
                                    {c}
                                </button>
                            )
                        })}
                    </div>
                </>
            )}
            {isSize && (
                <p className="text-xs font-medium text-warning">
                    {value ? "Refer to our size chart for the best fit." : "Select a size to check availability."}
                </p>
            )}
        </div>
    )
}

type OptionSelectProps = {
    option: StoreProductOption
    value?: string
    onSelect: (value: string) => void
    disabled?: boolean
}
