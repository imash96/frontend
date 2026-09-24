"use client"

import { ShoppingBag, X } from "lucide-react"
import { Drawer } from "@/ui/drawer";
import { div as Div } from "motion/react-client";
import { useDrawerStore } from "@/lib/store/drawer-store"

export default function CartDrawerClient({ children }: React.PropsWithChildren) {
    const { active, close: closeCart } = useDrawerStore()
    return (
        <Drawer
            isOpen={active === 'cart'}
            onClose={closeCart}
            direction="right"
            size="sm"
            showCloseButton={false}
        >
            <div className="flex flex-col h-full bg-background">
                {/* Custom Header */}
                <Div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.15 }}
                    className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-divider shrink-0 bg-surface sticky top-0 z-10"
                >
                    <div className="flex items-center gap-2.5">
                        <ShoppingBag
                            className="size-5 text-accent"
                            strokeWidth={1.5}
                            aria-hidden="true"
                        />
                        <h2 className="font-heading font-semibold text-lg text-foreground tracking-tight">
                            Shopping Cart
                        </h2>
                    </div>

                    <button
                        className="p-2 rounded-md text-foreground-secondary hover:bg-muted hover:text-foreground transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-focus-ring hover:scale-110 active:scale-95"
                        onClick={closeCart}
                        aria-label="Close cart drawer"
                    >
                        <X className="size-5" strokeWidth={2} />
                    </button>
                </Div>

                {/* Content */}
                {children}
            </div>
        </Drawer>
    )
}