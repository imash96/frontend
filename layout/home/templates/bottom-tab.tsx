"use client"

import { usePathname } from "next/navigation"
import { House, Menu, Search, ShoppingBag, User } from "lucide-react"
import { useUIStore } from "@/lib/store/ui-store"
import Link from "next/link"
import type { Route } from "next"

type Tab =
    | { type: "link"; href: Route; label: string; Icon: typeof House }
    | { type: "button"; onClick: () => void; label: string; Icon: typeof House }

export default function BottomTabs() {
    const pathname = usePathname()
    const { toggle } = useUIStore()

    // Hide on product pages for better UX
    if (pathname.includes("/product")) return null

    const isActive = (path: string) => pathname === path

    const tabs: Tab[] = [
        { type: "link", href: "/", label: "Home", Icon: House },
        { type: "button", onClick: toggle.bind(null, 'menu'), label: "Menu", Icon: Menu },
        { type: "button", onClick: toggle.bind(null, 'search'), label: "Search", Icon: Search },
        { type: "button", onClick: toggle.bind(null, 'cart'), label: "Cart", Icon: ShoppingBag },
        { type: "link", href: "/account", label: "Account", Icon: User },
    ]

    const commonClasses =
        "grid gap-1 place-content-center place-items-center transition-all duration-200 active:scale-95 active:bg-accent/10 focus:outline-none focus:ring-2 focus:ring-focus-ring focus:ring-inset hover:bg-muted/5 relative"

    return (
        <nav className="lg:hidden fixed bottom-0 left-0 z-20 w-full h-16 border-t border-border bg-surface/98 backdrop-blur-xl shadow-lg rounded-t-2xl grid grid-cols-5 select-none" aria-label="Mobile Bottom Navigation">
            {tabs.map((tab) => {
                if (tab.type === "link") {
                    const active = isActive(tab.href)
                    return (
                        <Link
                            key={tab.label}
                            href={tab.href}
                            aria-label={tab.label}
                            aria-current={active ? "page" : undefined}
                            className={`${commonClasses} ${active ? "text-primary" : "text-foreground-secondary"}`}
                        >
                            <tab.Icon
                                size={22}
                                strokeWidth={active ? 2.5 : 1.5}
                                className={active ? "text-primary" : "text-foreground-secondary"}
                            />
                            <span className={`text-xs font-light tracking-wide ${active ? "font-medium text-primary" : "text-foreground-tertiary"}`}>
                                {tab.label}
                            </span>
                        </Link>
                    )
                }
                return (
                    <button
                        key={tab.label}
                        onClick={tab.onClick}
                        aria-label={tab.label}
                        className={`${commonClasses} text-foreground-secondary`}
                    >
                        <tab.Icon size={22} strokeWidth={1.5} className="text-foreground-secondary" aria-hidden="true" />
                        <span className="text-xs font-light tracking-wide text-foreground-tertiary">{tab.label}</span>
                    </button>
                )
            })}
        </nav>
    )
}