export default function StoreLoading() {
    return (
        <div aria-hidden="true" className="animate-pulse">
            <div className="h-[70vh] max-h-175 min-h-100 w-full bg-muted" />

            <div className="border-y border-border bg-background-secondary py-8">
                <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 lg:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="h-14 rounded-lg bg-muted" />
                    ))}
                </div>
            </div>

            {Array.from({ length: 3 }).map((_, section) => (
                <div key={section} className="mx-auto max-w-7xl px-4 py-12">
                    <div className="mb-8 h-8 w-64 rounded bg-muted" />
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="aspect-3/4 rounded-sm bg-muted" />
                        ))}
                    </div>
                </div>
            ))}
            <span className="sr-only">Loading page content…</span>
        </div>
    );
}