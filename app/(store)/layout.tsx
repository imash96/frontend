import { Suspense } from "react";
import { announcements } from "@/data/announcement";
import AnnouncementBar from "@/layout/home/templates/announcement-new";
import BottomTabs from "@/layout/home/templates/bottom-tab";
import CartDrawer from "@/layout/home/templates/cart-drawer";
import Footer from "@/layout/home/templates/footer";
import Header from "@/layout/home/templates/header";

export default function StoreLayout({ children }: LayoutProps<"/">) {
    return (
        <>
            <Suspense fallback={<div className="h-9 w-full bg-card-foreground" />}>
                <AnnouncementBar items={announcements} />
            </Suspense>
            <Suspense fallback={<header className="h-16 lg:h-20 w-full" />}>
                <Header />
            </Suspense>
            <Suspense fallback={null}>
                <CartDrawer />
            </Suspense>
            <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none outline-none">
                {children}
            </main>
            <BottomTabs />
            <Suspense fallback={<footer className="h-64 w-full bg-card-foreground" />}>
                <Footer />
            </Suspense>
        </>
    );
}