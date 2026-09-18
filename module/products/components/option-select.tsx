import { StoreProduct, StoreProductOption } from "@medusajs/types"
import Image from "next/image"
import Link from "next/link"

/**
 * Find the variant image URL for a given color value.
 * Walks all variants, finds the one whose "color"/"colour" option matches,
 * and returns its first image. Falls back to product.images[0].
 */
function getSwatchUrl(product: StoreProduct, colorValue: string): string | null {
    const variants = product.variants ?? []
    for (const v of variants) {
        const colorOpt = v.options?.find((o) => {
            const title = (o as any).option?.title?.toLowerCase?.() ?? ""
            return title === "color" || title === "colour"
        })
        if (colorOpt && colorOpt.value === colorValue) {
            if (v.images && v.images.length > 0) return v.images[0].url
        }
    }
    // Fallback to product's first image
    return product.images?.[0]?.url ?? null
}

export default function OptionSelect({ option, value, onSelect, disabled, product }: OptionSelectProps) {
    const title = option.title ?? ""
    const key = title.toLowerCase()
    const isSize = key === "size"
    const isColor = key === "color" || key === "colour"

    // Sort values by rank when available
    const sortedValues = [...(option.values ?? [])].sort((a, b) => {
        const rankA = (a as any).rank ?? Infinity
        const rankB = (b as any).rank ?? Infinity
        return rankA - rankB
    })
    const values = sortedValues.map((v) => v.value)

    if (values.length <= 1) {
        return (
            <div className="flex items-center gap-2 text-sm">
                <span className="font-medium text-text-primary">{title}:</span>
                <span className="text-text-secondary">{value ?? values[0] ?? "-"}</span>
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
                            const swatchUrl = product ? getSwatchUrl(product, c) : null
                            return (
                                <button
                                    key={c}
                                    type="button"
                                    onClick={() => onSelect(c)}
                                    disabled={disabled}
                                    className={`relative flex size-12 items-center justify-center overflow-hidden rounded-full border-2 transition-all duration-200 ${selected
                                            ? "scale-110 border-primary ring-2 ring-primary/20"
                                            : "border-border opacity-70 hover:scale-105 hover:border-border-strong hover:opacity-100"
                                        }`}
                                    title={c}
                                    aria-label={c}
                                    aria-pressed={selected}
                                >
                                    {swatchUrl ? (
                                        <Image
                                            src={swatchUrl}
                                            alt={c}
                                            width={48}
                                            height={48}
                                            sizes="48px"
                                            quality={50}
                                            className="size-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-[9px] font-semibold uppercase text-text-primary">
                                            {c.slice(0, 3)}
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
                                    className={`min-w-12 rounded-lg border px-4 py-2.5 text-sm font-medium transition-all duration-200 ${selected
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
    product?: StoreProduct
}
