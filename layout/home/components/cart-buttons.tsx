"use client"

import { LoaderCircle, Trash } from "lucide-react";
import { deleteLineItem, updateLineItem } from "@/lib/action/cart";
import { useTransition } from "react";


export function QuntityButton({ itemId, quantity, children }: { itemId: string, quantity: number } & React.PropsWithChildren) {
    const [isPending, startTransition] = useTransition();
    const handleClick = () => startTransition(() => (quantity <= 0) ? deleteLineItem(itemId) : updateLineItem({ lineId: itemId, quantity }));

    return (
        <button onClick={handleClick} className={`p-1.5 hover:bg-primary-hover transition-all duration-200 rounded disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-focus-ring focus:ring-offset-1 active:scale-95 ${isPending ? "pointer-events-none" : ""}`} aria-label={quantity <= 0 ? "Remove item from cart" : `${quantity <= 1 ? "Decrease" : "Set"} quantity to ${quantity}`}>
            {isPending ? <LoaderCircle className="size-3.5 animate-spin" strokeWidth={2} aria-hidden="true" /> : children}
        </button>
    )
}

export function RemoveButton({ itemId }: { itemId: string }) {
    const [isPending, startTransition] = useTransition();
    const handleClick = () => startTransition(() => deleteLineItem(itemId));
    return (
        <button className={`flex items-center gap-1.5 text-xs text-destructive hover:text-destructive-hover font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-destructive/20 focus:ring-offset-1 rounded px-1 py-0.5 hover:bg-destructive/5 disabled:opacity-50 disabled:cursor-not-allowed ${isPending ? "pointer-events-none" : ""}`} onClick={handleClick} disabled={isPending} aria-label="Remove item from cart">
            {isPending ? (
                <LoaderCircle
                    className="size-3 animate-spin"
                    strokeWidth={2}
                    aria-hidden="true"
                />
            ) : (
                <Trash
                    className="size-3"
                    strokeWidth={2}
                    aria-hidden="true"
                />
            )}
            <span>Remove</span>
        </button>
    )
}