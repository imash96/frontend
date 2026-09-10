import type { Metadata } from "next";
import AnnouncementBar from "@/layout/home/templates/announcement-new";
import { announcements } from "@/data/announcement";
import Header from "@/layout/home/templates/header";
import CartDrawer from "@/layout/home/templates/cart-drawer";
import Footer from "@/layout/home/templates/footer";
import BottomTabs from "@/layout/home/templates/bottom-tab";

export default function StoreLayout({ children }: LayoutProps<"/">) {
    return (
        <>
            <AnnouncementBar items={announcements} />
            <Header />
            <CartDrawer />
            {children}
            <BottomTabs />
            <Footer />
        </>
    );
}

/* ================================================================
   ANNOUNCEMENT BAR
   ================================================================ */


export async function generateMetadata(): Promise<Metadata> {
    return {
        title:
            "Shop Premium Leather Goods Online | Jackets, Wallets & Shoes at Velle Hide",
        description:
            "Discover high-quality leather goods from top brands at bmtraders.com. Explore our collection of stylish leather jackets, wallets, shoes, and more. Shop now for premium craftsmanship and timeless designs at Velle Hide. Free shipping available!",
        openGraph: {
            siteName: "Velle Hide Store",
            title:
                "Shop Premium Leather Goods Online | Jackets, Wallets & Shoes at Velle Hide",
            description:
                "Discover high-quality leather goods from top brands at bmtraders.com. Explore our collection of stylish leather jackets, wallets, shoes, and more. Shop now for premium craftsmanship and timeless designs at Velle Hide. Free shipping available!",
            url: `${process.env.NEXT_PUBLIC_BASE_URL}`,
            type: "website",
            images: [
                {
                    url: `${process.env.NEXT_PUBLIC_BASE_URL}/men2.jpg`,
                    width: 1200,
                    height: 630,
                    alt: "Shop Premium Leather Goods Online | Jackets, Wallets & Shoes at Velle Hide",
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title:
                "Shop Premium Leather Goods Online | Jackets, Wallets & Shoes at Velle Hide",
            description:
                "Discover high-quality leather goods from top brands at bmtraders.com. Explore our collection of stylish leather jackets, wallets, shoes, and more. Shop now for premium craftsmanship and timeless designs at Velle Hide. Free shipping available!",
            images: [`${process.env.NEXT_PUBLIC_BASE_URL}/men2.jpg`],
        },
        alternates: {
            canonical: `${process.env.NEXT_PUBLIC_BASE_URL}`,
        },
        icons: "/favicon.ico",
    };
}