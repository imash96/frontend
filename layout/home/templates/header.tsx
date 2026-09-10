import { fetchCartItemCount } from "@/lib/action/cart";
import { getInitialTheme } from "@/lib/util/get-initial-theme";
import HeaderClient from "../components/header-client";
import HeaderNav from "../components/header-nav";

export default async function Header() {
    const [initialTheme, totalItems] = await Promise.all([
        getInitialTheme(),
        fetchCartItemCount(),
    ])

    return (
        <HeaderClient initialTheme={initialTheme} totalItems={totalItems ?? 0} >
            <HeaderNav />
        </HeaderClient>
    )
}