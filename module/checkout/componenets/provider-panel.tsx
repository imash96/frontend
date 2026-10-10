import { Loader2 } from "lucide-react"

/** Shared shell for every payment-method preview, so spacing is defined in one place. */
export default function ProviderPanel({ children }: { children: React.ReactNode }) {
    return <div className="border-t border-divider p-4 sm:p-5">{children}</div>
}

/** Centered icon + title + copy used by the info-only providers (PayPal, PayU, Pay Later). */
export function ProviderInfo({
    icon,
    title,
    children,
}: {
    icon?: React.ReactNode
    title?: string
    children: React.ReactNode
}) {
    return (
        <div className="flex flex-col items-center gap-3 text-center">
            {icon}
            {title && <h3 className="font-heading text-sm font-semibold text-foreground sm:text-base">{title}</h3>}
            <div className="max-w-sm text-xs text-foreground-muted sm:text-sm">{children}</div>
        </div>
    )
}

export function ProviderLoading({ children }: { children: React.ReactNode }) {
    return (
        <div role="status" className="flex items-center justify-center gap-2 py-4 text-xs text-foreground-muted sm:text-sm">
            <Loader2 className="size-5 animate-spin" aria-hidden="true" />
            {children}
        </div>
    )
}