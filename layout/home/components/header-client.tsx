"use client"

import { Menu, User } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import Logo from "@/icon/logo"
import { useDrawerStore } from "@/lib/store/drawer-store"
import Container from "@/ui/container"
import { SearchModal } from "../templates/search-modal"
import MobileDrawer from "../templates/mobile-drawer"
import CartDrawerButton from "./button-cart-drawer"
import ThemeButton from "./button-theme"

type HeaderClientProps = {
    initialTheme: 'light' | 'dark'
    totalItems: number;
} & React.PropsWithChildren

export default function HeaderClient({ initialTheme, totalItems, children }: HeaderClientProps) {
    const [isScrolled, setIsScrolled] = useState(false)

    // Handle scroll effect
    useEffect(() => {
        let last = false

        const handleScroll = () => {
            const next = window.scrollY > 40
            if (next !== last) {
                last = next
                setIsScrolled(next)
            }
        };
        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const active = useDrawerStore((s) => s.active)
    const openMenu = useDrawerStore((s) => s.open)

    return (
        <>
            {/* Main Header */}
            <header aria-label="Main Navigation" className={isScrolled ? "sticky top-0 z-50 transition-all duration-300 ease-out bg-surface/98 backdrop-blur-xl text-foreground shadow-md" : "sticky top-0 z-50 transition-all duration-300 ease-out bg-surface/98"}>
                <Container size="2xl" className="relative flex items-center justify-between h-16 lg:h-20">
                    {/* Logo */}
                    <Link
                        href="/"
                        aria-label="Home"
                        className="transition-opacity hover:opacity-80 duration-300 z-10"
                    >
                        <Logo className="text-primary w-22 lg:w-28" />
                    </Link>
                    {/* Desktop Navigation */}
                    {children}
                    {/* Right Actions */}
                    <div className="flex items-center gap-2 lg:gap-4">
                        {/* Search Button */}
                        <SearchModal />

                        {/* Theme Toggle */}
                        <ThemeButton
                            initialTheme={initialTheme}
                            className="p-2 rounded-md duration-200 hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-focus-ring"
                        />

                        {/* Account Link - Hidden on mobile */}
                        <Link
                            href="/account"
                            className="hidden md:flex p-2 rounded-md duration-200 hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-focus-ring"
                            aria-label="Account"
                        >
                            <User className="w-5 h-5" strokeWidth={1.5} aria-hidden />
                        </Link>

                        {/* Cart Button */}
                        <CartDrawerButton
                            totalItems={totalItems}
                            className="relative p-2 rounded-md duration-200 hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-focus-ring"
                        />
                        {/* Mobile Menu Button */}
                        <button
                            onClick={openMenu.bind(null, 'menu')}
                            className="lg:hidden p-2 rounded-md duration-200 hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-focus-ring"
                            aria-label="Open menu"
                            aria-expanded={active === 'menu'}
                        >
                            <Menu className="w-6 h-6" strokeWidth={1.5} aria-hidden />
                        </button>
                    </div>
                </Container>
                {/* Progress Bar on Scroll */}
                {isScrolled && (
                    <div
                        aria-hidden="true"
                        className={`absolute bottom-0 left-0 right-0 h-0.5 transition-opacity duration-300 ${isScrolled ? "opacity-50" : "opacity-0"} bg-linear-to-r from-transparent via-accent to-transparent`}
                    />
                )}
            </header>
            {/* Mobile Menu Overlay */}
            <MobileDrawer />
        </>
    )
}