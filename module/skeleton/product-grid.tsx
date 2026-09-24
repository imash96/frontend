export default function ProductGridSkeleton() {
    return (
        <div>
            {/* Toolbar skeleton */}
            <div className="flex items-center justify-between gap-3 mb-8 pb-5 border-b border-divider">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-28 bg-surface-sunken rounded-xl animate-pulse" />
                    <div className="h-5 w-20 bg-surface-sunken rounded animate-pulse hidden sm:block" />
                </div>
                <div className="h-10 w-36 bg-surface-sunken rounded-xl animate-pulse" />
            </div>

            {/* Grid skeleton — matches the product grid breakpoints */}
            <div
                className="grid gap-x-4 gap-y-8
                    grid-cols-1
                    xs:grid-cols-2
                    sm:gap-x-5 sm:gap-y-10
                    md:grid-cols-3 md:gap-x-6 md:gap-y-12
                    lg:grid-cols-4 lg:gap-x-7
                    xl:gap-x-8 xl:gap-y-14"
            >
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="animate-pulse">
                        <div className="aspect-3/4 rounded-xl sm:rounded-2xl bg-surface-sunken mb-3 sm:mb-4" />
                        <div className="space-y-2 px-0.5">
                            <div className="h-3 w-16 bg-surface-sunken rounded" />
                            <div className="h-4 w-3/4 bg-surface-sunken rounded" />
                            <div className="h-3.5 w-20 bg-surface-sunken rounded" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}