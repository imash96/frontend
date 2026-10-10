"use client"

import { Lock } from "lucide-react"
import Button, { type ButtonElementProps } from "@/ui/button"

/** Primary pay / place-order button with the security note. Own file to avoid circular imports. */
export function CheckoutButton({
    isLoading = false,
    disabled = false,
    icon,
    children,
    className = "",
    ...props
}: ButtonElementProps) {
    return (
        <div className="space-y-3">
            <Button
                type="button"
                variant="accent"
                size="lg"
                fullWidth
                isLoading={isLoading}
                disabled={disabled}
                icon={icon ? <span className="flex size-full [&>svg]:size-full">{icon}</span> : undefined}
                aria-busy={isLoading}
                className={`font-semibold ${className}`}
                {...props}
            >
                {children ?? (isLoading ? "Processing..." : "Pay")}
            </Button>
            <p className="flex items-center justify-center gap-1.5 text-xs text-foreground-muted">
                <Lock className="size-3.5 shrink-0" aria-hidden="true" />
                Transactions are secured and encrypted
            </p>
        </div>
    )
}

export function NotReadyHint() {
    return (
        <p role="status" className="text-center text-xs text-foreground-muted sm:text-sm">
            Add your address and choose a delivery method to continue.
        </p>
    )
}