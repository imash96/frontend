import Container from "@/ui/container"

export default function Loading() {
    return (
        <Container size="2xl" className="py-6 sm:py-8 md:py-10 lg:py-14">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
                <div className="lg:col-span-7 xl:col-span-8">
                    <div className="flex flex-col gap-3 md:flex-row">
                        <div className="order-2 flex gap-2 md:order-1 md:w-20 md:flex-col">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="aspect-3/4 w-16 shrink-0 animate-pulse rounded-md bg-muted md:w-full" />
                            ))}
                        </div>
                        <div className="order-1 aspect-3/4 flex-1 animate-pulse rounded-lg bg-muted md:order-2" />
                    </div>
                </div>
                <div className="space-y-6 lg:col-span-5 xl:col-span-4">
                    <div className="space-y-3">
                        <div className="h-3 w-32 animate-pulse rounded bg-muted" />
                        <div className="h-8 w-3/4 animate-pulse rounded bg-muted" />
                        <div className="h-4 w-40 animate-pulse rounded bg-muted" />
                    </div>
                    <div className="h-10 w-36 animate-pulse rounded bg-muted" />
                    <div className="space-y-3">
                        <div className="h-16 w-full animate-pulse rounded bg-muted" />
                        <div className="h-16 w-full animate-pulse rounded bg-muted" />
                    </div>
                    <div className="h-12 w-full animate-pulse rounded bg-muted" />
                </div>
            </div>
        </Container>
    )
}