"use client"

import { ArrowRight, LoaderCircle } from "lucide-react";
import { useTransition } from "react";
import { deleteLineItem, updateLineItem } from "@/lib/action/cart";
import { useDrawerStore } from "@/lib/store/drawer-store";
import CartEmpty from "@/icon/empty-cart";
import Button from "@/ui/button";

export function QuantityButton({ itemId, quantity, ariaLabel, children }: { itemId: string, quantity: number, ariaLabel: string } & React.PropsWithChildren) {
    const [isPending, startTransition] = useTransition();
    const handleClick = () => startTransition(() => (quantity <= 0) ? deleteLineItem(itemId) : updateLineItem({ lineId: itemId, quantity }));
    return (
        <button onClick={handleClick}
            className="w-8 h-8 flex items-center justify-center transition-colors hover:bg-[#f2ede6]"
            aria-label={ariaLabel}>
            {isPending ? <LoaderCircle className="size-3.5 animate-spin" strokeWidth={2} aria-hidden="true" /> : children}
        </button>
    )
}



export function EmptyCart() {
    const close = useDrawerStore((s) => s.close)
    return (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <div className="space-y-6" >
                <div className="relative w-32 h-32 mx-auto">
                    <div className="absolute inset-0 rounded-3xl bg-linear-to-br from-accent/5 to-primary/5 rotate-6" />
                    <div className="absolute inset-0 rounded-3xl bg-linear-to-br from-primary/5 to-accent/5 -rotate-3" />
                    <div className="relative w-full h-full rounded-3xl bg-surface-elevated flex items-center justify-center">
                        <CartEmpty className="size-12 text-accent/40 opacity-90" strokeWidth={1} />
                    </div>
                </div>
                <div>
                    <h3 className="font-serif text-2xl font-semibold text-foreground tracking-tight">
                        Begin Your Journey
                    </h3>
                    <p className="text-sm text-foreground-tertiary mt-2 max-w-60 mx-auto leading-relaxed">
                        Every great wardrobe starts with a single piece. Explore our genuine leather collection.
                    </p>
                </div>
                <Button
                    onClick={close}
                    href="/"
                    shape='pill'
                    icon={<ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                    iconPosition="right"
                    className="px-10 py-3.5 text-sm font-serif font-semibold tracking-wide hover:bg-button-primary-hover transition-all flex items-center gap-2 mx-auto group shadow-primary active:scale-[0.98]"
                >
                    <span>Explore</span>
                </Button>
            </div>
        </div>
    );
}

export function CompleteOrder() {
    const { close } = useDrawerStore()
    return (
        <Button
            onClick={close}
            icon={<ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
            iconPosition="right"
            href={'/cart'}
            className="w-full bg-button-primary text-button-primary-foreground py-3.5 rounded-lg font-semibold text-sm uppercase tracking-wider hover:bg-button-primary-hover transition-all duration-200 flex items-center justify-center gap-2 group shadow-primary active:scale-[0.98]"
        >
            <span>Complete Order</span>
        </Button>
    )
}