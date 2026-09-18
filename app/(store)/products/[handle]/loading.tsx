import Container from "@/ui/container"

export default function Loading() {
    return (
        <Container size="2xl" className="pt-4 pb-6 lg:pt-8 lg:pb-10">
            <div className="grid grid-cols-1 gap-y-6 lg:grid-cols-12 lg:gap-x-8">
                    <div className="-mx-[var(--container-px)] lg:mx-0 lg:col-span-7 xl:col-span-8">
                    <div className="flex flex-col gap-2 lg:flex-row">
                        <div className="order-2 flex gap-2 lg:order-1 lg:w-20 lg:flex-col">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="aspect-3/4 w-16 shrink-0 animate-pulse bg-muted lg:w-full" />
                            ))}
                        </div>
                        <div className="order-1 aspect-3/4 flex-1 animate-pulse bg-muted lg:order-2" />
                    </div>
                </div>
                <div className="space-y-5 lg:col-span-5 xl:col-span-4">
                    <div className="h-3 w-40 animate-pulse bg-muted" />
                    <div className="h-8 w-3/4 animate-pulse bg-muted" />
                    <div className="h-4 w-36 animate-pulse bg-muted" />
                    <div className="h-9 w-40 animate-pulse bg-muted" />
                    <div className="h-px bg-divider" />
                    <div className="grid grid-cols-4 gap-3">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="h-20 animate-pulse bg-muted" />
                        ))}
                    </div>
                    <div className="h-12 w-full animate-pulse bg-muted" />
                    <div className="h-12 w-full animate-pulse bg-muted" />
                </div>
            </div>
        </Container>
    )
}
