import Container from "@/ui/container"

export default function CheckoutPreviewLoading() {
    return (
        <Container size="2xl" className="py-8">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                <div className="space-y-6 lg:col-span-7">
                    <div className="h-72 animate-pulse rounded-2xl bg-muted" />
                    <div className="h-48 animate-pulse rounded-2xl bg-muted" />
                    <div className="h-64 animate-pulse rounded-2xl bg-muted" />
                </div>
                <div className="lg:col-span-5">
                    <div className="h-96 animate-pulse rounded-2xl bg-muted" />
                </div>
            </div>
        </Container>
    )
}
