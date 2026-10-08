"use client"

import Link from "next/link"
import Container from "@/ui/container"

export default function CheckoutPreviewError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    return (
        <Container size="lg" className="py-16 text-center">
            <div className="mx-auto max-w-md space-y-4 rounded-2xl border border-border bg-surface p-8">
                <h1 className="font-heading text-xl font-bold text-text-primary">
                    Unable to Load Checkout Preview
                </h1>
                <p className="text-xs leading-relaxed text-text-secondary">
                    {error?.message ||
                        "An unexpected issue occurred while preparing your checkout session."}
                </p>
                <div className="flex items-center justify-center gap-3 pt-2">
                    <button
                        type="button"
                        onClick={reset}
                        className="rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary-hover"
                    >
                        Try Again
                    </button>
                    <Link
                        href="/product-preview/milano-asymmetric-moto-jacket"
                        className="rounded-xl border border-border px-4 py-2 text-xs font-semibold text-text-secondary hover:bg-muted"
                    >
                        Back to Product Preview
                    </Link>
                </div>
            </div>
        </Container>
    )
}
