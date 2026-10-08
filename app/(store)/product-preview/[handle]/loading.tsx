import Container from "@/ui/container"

export default function ProductPreviewLoading() {
    return (
        <Container size="2xl" className="pt-6 pb-16">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                <div className="space-y-3 lg:col-span-7">
                    <div className="aspect-3/4 w-full animate-pulse rounded-2xl bg-muted" />
                    <div className="grid grid-cols-5 gap-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div
                                key={i}
                                className="aspect-3/4 animate-pulse rounded-xl bg-muted"
                            />
                        ))}
                    </div>
                </div>
                <div className="space-y-5 lg:col-span-5">
                    <div className="h-4 w-36 animate-pulse rounded bg-muted" />
                    <div className="h-9 w-4/5 animate-pulse rounded bg-muted" />
                    <div className="h-6 w-1/3 animate-pulse rounded bg-muted" />
                    <div className="h-24 w-full animate-pulse rounded-2xl bg-muted" />
                    <div className="h-12 w-full animate-pulse rounded-xl bg-muted" />
                    <div className="h-12 w-full animate-pulse rounded-xl bg-muted" />
                    <div className="h-14 w-full animate-pulse rounded-xl bg-muted" />
                </div>
            </div>
        </Container>
    )
}
