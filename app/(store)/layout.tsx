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
            <main id="main-content" tabIndex={-1} className="focus:outline-none">
                {children}
            </main>
            <BottomTabs />
            <Footer />
        </>
    );
}