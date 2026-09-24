export default function CollectionLoading() {
    const heroTiles = [
        { col: "md:col-span-5 md:col-start-5 md:row-span-2 md:row-start-1", hidden: true },
        { col: "md:col-span-3 md:col-start-2 md:row-span-2 md:row-start-2", hidden: true },
        { col: "md:col-span-3 md:col-start-3 md:row-span-2 md:row-start-5", hidden: true },
        { col: "md:col-span-2 md:col-start-6 md:row-span-2 md:row-start-5", hidden: true },
        { col: "md:col-span-3 md:col-start-9 md:row-span-2 md:row-start-3", hidden: true },
    ];

    return (
        <div className="animate-pulse">
            {/* Hero skeleton */}
            <section className="container-xl relative py-12 md:py-20">
                <div className="grid min-h-[70vh] grid-cols-1 gap-4 md:grid-cols-12 md:grid-rows-6 md:gap-6">
                    <div className="order-1 flex flex-col items-center justify-center rounded-3xl border border-card-border bg-card p-8 text-center shadow-lg md:col-span-4 md:col-start-5 md:row-span-2 md:row-start-3">
                        <div className="skeleton h-10 w-48 rounded-lg" />
                        <div className="skeleton mt-4 h-16 w-full max-w-sm rounded-lg" />
                        <div className="skeleton mt-6 h-10 w-32 rounded-full" />
                    </div>

                    {heroTiles.map((tile, i) => (
                        <SkeletonTile key={i} className={`hidden h-full md:block ${tile.col}`} />
                    ))}
                    <div className="order-2 grid grid-cols-2 gap-4 md:hidden">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <SkeletonTile key={i} className="aspect-4/5" />
                        ))}
                    </div>
                </div>
            </section>

            {/* Grid skeleton */}
            <section className="container-xl py-16 md:py-24">
                <div className="mb-10 md:mb-14">
                    <div className="skeleton h-8 w-56 rounded-lg" />
                    <div className="skeleton mt-3 h-5 w-full max-w-2xl rounded-lg" />
                </div>

                <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] auto-rows-45 grid-flow-dense gap-4 md:grid-cols-[repeat(auto-fill,minmax(240px,1fr))] md:auto-rows-60 md:gap-6">
                    {Array.from({ length: 20 }).map((_, i) => {
                        const sizes = [
                            "col-span-1 row-span-1",
                            "col-span-1 row-span-2",
                            "col-span-2 row-span-1",
                            "col-span-2 row-span-2",
                        ];
                        const size = sizes[i % sizes.length];
                        return <SkeletonTile key={i} className={size} />;
                    })}
                </div>
            </section>
        </div>
    );
}

function SkeletonTile({ className, }: { className?: string; }) {
    return (
        <div
            className={`skeleton rounded-2xl border border-card-border bg-card ${className}`}
        />
    );
}