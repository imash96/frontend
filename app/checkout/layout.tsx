import type { Metadata } from "next";
import CheckoutFooter from "@/layout/checkout/templates/footer";
import CheckoutHeader from "@/layout/checkout/templates/header";
import Container from "@/ui/container";

export default function Layout({ children }: LayoutProps<"/checkout">) {
    return (
        <>
            <CheckoutHeader />
            <Container
                as="main"
                size="lg"
                className="grid grid-cols-1 gap-x-14 gap-y-8 lg:grid-cols-10 py-8 md:py-10 lg:py-14"
            >
                {children}
            </Container>
            <CheckoutFooter />
        </>
    );
}

export const metadata: Metadata = {
    title: "Checkout | Velle Hide Store",
    description: "Checkout Page for Velle Hide Store",
};
