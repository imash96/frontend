"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";
import Button from "@/ui/button";
import Container from "@/ui/container";

export default function StoreError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <Container size="sm" className="flex min-h-[60vh] flex-col items-center justify-center gap-5 py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
                <AlertTriangle className="h-7 w-7 text-destructive" aria-hidden="true" />
            </div>
            <div className="max-w-sm space-y-1.5">
                <h1 className="text-lg font-semibold text-text-primary">This page hit a snag</h1>
                <p className="text-sm leading-relaxed text-text-secondary">
                    Something went wrong loading this part of Velle Hide. Try again, or
                    head back to shopping.
                </p>
                {error.digest && (
                    <p className="font-mono text-xs text-text-tertiary">Error ID: {error.digest}</p>
                )}
            </div>
            <div className="flex gap-3">
                <Button onClick={reset} variant="secondary" icon={<RefreshCw className="h-4 w-4" />}>
                    Try again
                </Button>
                <Button href="/" variant="outline">
                    Continue shopping
                </Button>
            </div>
        </Container>
    );
}