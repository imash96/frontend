"use client"

import Button from "@/ui/button";

export default function CollectionError({ error, reset, }: { error: Error & { digest?: string }; reset: () => void; }) {
    return (
        <main className="grid min-h-screen place-items-center bg-background px-6">
            <section className="flex max-w-md flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive-subtle text-destructive">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="28"
                        height="28"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                    >
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" x2="12" y1="8" y2="12" />
                        <line x1="12" x2="12.01" y1="16" y2="16" />
                    </svg>
                </div>
                <h1 className="mt-6 text-2xl font-semibold tracking-tight text-text-primary">
                    Something went wrong
                </h1>
                <p className="mt-3 text-text-secondary">
                    We couldn&apos;t load the Closet collection. Please try again in a moment.
                </p>
                {error.digest && (
                    <p className="mt-2 text-xs text-text-tertiary">Error ID: {error.digest}</p>
                )}
                <Button
                    onClick={reset}
                >
                    Try Again
                </Button>
            </section>
        </main>
    );
}