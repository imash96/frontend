"use client"

import { useDrawerStore } from "@/lib/store/drawer-store";
import { Drawer } from "@/ui/drawer";
import { ShoppingBagIcon, X } from "lucide-react";

export default function CartDrawerClient({ children }: React.PropsWithChildren) {
    const { active, close: closeCart } = useDrawerStore()
    return (
        <Drawer
            isOpen={active === 'cart'}
            onClose={closeCart}
            direction="right"
            size="sm"
            showCloseButton={false}
            headerSlot={<HeaderSlot onClose={closeCart} />}
        >
            {children}
        </Drawer>
    )
}

const HeaderSlot = ({ onClose }: { onClose: () => void }) => (
    <>
        {/* Accent top line */}
        <div className="h-0.5 shrink-0" style={{
            background: "linear-gradient(90deg, var(--accent), var(--primary), var(--accent))",
        }}
        />
        <div className="flex items-center justify-between px-5 py-4 border-b border-divider shrink-0">
            <div className="flex items-center gap-3">
                <div className="relative">
                    <div className="w-10 h-10 rounded-xl bg-linear-to-br from-accent/20 to-primary/20 flex items-center justify-center">
                        <ShoppingBagIcon className="w-5 h-5 text-accent" strokeWidth={1.5} />
                    </div>
                </div>
                <div>
                    <h2 className="font-heading font-bold text-lg text-foreground tracking-tight">
                        Your Cart
                    </h2>
                    <p className="text-[10px] text-foreground-tertiary tracking-wider uppercase">
                        Premium Collection
                    </p>
                </div>
            </div>
            <button
                onClick={onClose}
                className="p-2 rounded-full text-foreground-secondary bg-muted/50 hover:text-foreground hover:bg-muted active:scale-95"
                aria-label="Close"
            >
                <X className="size-5" strokeWidth={1.5} />
            </button>
        </div>
    </>
)