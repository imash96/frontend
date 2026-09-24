import AnnouncementBar from "@/layout/home/templates/announcement-new";
import { announcements } from "@/data/announcement";
import Header from "@/layout/home/templates/header";
import CartDrawer from "@/layout/home/templates/cart-drawer";
import Footer from "@/layout/home/templates/footer";
import BottomTabs from "@/layout/home/templates/bottom-tab";
import { Suspense } from "react";

export default function StoreLayout({ children }: LayoutProps<"/">) {
    return (
        <>
            <AnnouncementBar items={announcements} />
            <Suspense fallback={<header className="h-20 w-full" />}>
                <Header />
            </Suspense>
            <Suspense fallback={null}>
                <CartDrawer />
            </Suspense>
            <main id="main-content" tabIndex={-1} className="focus:outline-none">
                {children}
            </main>
            <BottomTabs />
            <Suspense fallback={<footer className="h-64 w-full bg-card-foreground" />}>
                <Footer />
            </Suspense>
        </>
    );
}