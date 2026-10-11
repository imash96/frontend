export default function RootLoading() {
    return (
        <div
            role="status"
            aria-label="Loading Velle Hide"
            className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-background"
        >
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-border border-t-primary" />
            <p className="text-sm tracking-wide text-foreground-tertiary">Loading…</p>
        </div>
    );
}