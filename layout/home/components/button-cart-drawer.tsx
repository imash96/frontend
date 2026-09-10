"use client"

import { ShoppingBag } from "lucide-react"
import { useUIStore } from "@/lib/store/ui-store";
import { motion } from "motion/react"

// TODO: mix cartbutton with cart drawer
export default function CartDrawerButton({ className, totalItems }: CartDrawerButtonProps) {
    const { open: openCart } = useUIStore();

    return (
        <button onClick={openCart.bind(null, 'cart')} className={`relative ${className}`} aria-label={`Shopping cart with ${totalItems} items`}>
            <ShoppingBag className="w-5 h-5" strokeWidth={1.5} aria-hidden />
            {/* Cart Badge */}
            <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30
                }}
                className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-[10px] font-semibold rounded-full w-5 h-5 flex items-center justify-center ring-2 ring-surface shadow-sm"
                aria-hidden="true"
            >
                {totalItems > 99 ? '99+' : totalItems}
            </motion.span>

            <span className="sr-only">
                {totalItems === 0 ? 'Cart is empty' : `${totalItems} ${totalItems === 1 ? 'item' : 'items'} in cart`}
            </span>
        </button>
    )
}

type CartDrawerButtonProps = {
    className: string;
    totalItems: number
}