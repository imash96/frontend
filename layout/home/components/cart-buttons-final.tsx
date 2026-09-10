"use client"

import { deleteLineItem, updateLineItem } from "@/lib/action/cart";
import { LoaderCircle } from "lucide-react";
import { useTransition } from "react";

export function QuntityButton({ itemId, quantity, ariaLabel, children }: { itemId: string, quantity: number, ariaLabel: string } & React.PropsWithChildren) {
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