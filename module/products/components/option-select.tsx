import { StoreProductOption } from "@medusajs/types"

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
            {
                isColor ? (
                    <>
                        <div className="flex items-center justify-between mb-2.5">
                            <span className="text-xs font-semibold uppercase tracking-wider text-foreground-secondary">Color</span>
                            <span className="text-xs text-foreground-tertiary">{value}</span>
                        </div>
                        <div className="flex gap-2.5">
                            {values.map((c, i) => {
                                const selected = c === value
                                return (
                                    <button
                                        key={c}
                                        type="button"
                                        onClick={() => onSelect(c)}
                                        className={`w-10 h-10 rounded-full border-2 transition-all duration-200 ${selected ? 'border-primary ring-2 ring-primary/20 scale-110' : 'border-border hover:border-border-strong hover:scale-105'}`}
                                        style={{ backgroundColor: c }}
                                        title={c}
                                        aria-label={c}
                                    />
                                )
                            })}
                        </div>
                    </>
                ) : (
                    <>
                        <div className="flex items-center justify-between mb-2.5">
                            <span className="text-xs font-semibold uppercase tracking-wider text-foreground-secondary">Size</span>
                            <button className="text-xs text-link hover:text-link-hover underline underline-offset-2 transition-colors">Size Guide</button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {values.map((c, i) => {
                                const selected = c === value
                                return (
                                    <button
                                        key={c}
                                        type="button"
                                        onClick={() => onSelect(c)}
                                        disabled={disabled}
                                        className={`min-w-12 px-4 py-2.5 text-sm font-medium border rounded-lg transition-all duration-200 ${selected ? 'bg-primary text-primary-foreground border-primary shadow-primary' : !disabled ? 'border-border text-foreground hover:border-border-strong hover:bg-muted' : 'border-border-subtle text-text-disabled line-through opacity-50 cursor-not-allowed'}`}
                                    >
                                        {c}
                                    </button>
                                )
                            })}
                        </div>
                    </>
                )
            }
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