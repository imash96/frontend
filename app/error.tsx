"use client";

import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Button from "@/ui/button";

export default function RootError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <main className="flex min-h-dvh flex-col items-center justify-center gap-6 px-5 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
                <AlertTriangle className="h-8 w-8 text-destructive" aria-hidden="true" />
            </div>
            <div className="max-w-sm space-y-2">
                <h1 className="text-xl font-semibold">Something went wrong</h1>
                <p className="text-sm leading-relaxed text-foreground-muted">
                    We hit an unexpected error loading Velle Hide. Try again, or head
                    back to the homepage.
                </p>
                {error.digest && (
                    <p className="font-mono text-xs text-foreground-muted">Error ID: {error.digest}</p>
                )}
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
                <Button onClick={reset} variant="secondary" icon={<RefreshCw className="h-4 w-4" />}>
                    Try again
                </Button>
                <Button href="/" variant="outline" icon={<Home className="h-4 w-4" />}>
                    Go home
                </Button>
            </div>
        </main>
    );
}