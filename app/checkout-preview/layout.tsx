import CheckoutFooter from "@/layout/checkout/templates/footer"
import CheckoutHeader from "@/layout/checkout/templates/header"

export default function CheckoutPreviewLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen flex-col bg-background text-foreground">
            <CheckoutHeader />
            <main className="flex-1">{children}</main>
            <CheckoutFooter />
        </div>
    )
}
