"use client";

import { Loader, Minus, Plus, Trash } from "lucide-react";
import { useTransition } from "react";
import { deleteLineItem, updateLineItem } from "@/lib/action/cart";

export default function CartEditQuantity({
  lineId,
  quantity,
}: {
  lineId: string;
  quantity: number;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center w-fit border rounded-md overflow-hidden bg-button-primary text-button-primary-foreground">
        <QuntityButton
          lineId={lineId}
          quantity={quantity - 1}
          ariaLabel={quantity === 1 ? "Remove item" : "Decrease quantity"}
          position="left"
        >
          {quantity === 1 ? (
            <Trash className="w-4 h-4" />
          ) : (
            <Minus className="w-4 h-4" />
          )}
        </QuntityButton>
        <span
          className="px-2.5 py-1 text-xs font-medium min-w-8 text-center"
          aria-live="polite"
        >
          {quantity}
        </span>
        <QuntityButton
          lineId={lineId}
          quantity={quantity + 1}
          ariaLabel="Increase quantity"
          position="right"
        >
          <Plus className="w-4 h-4" />
        </QuntityButton>
      </div>

      <CartRemoveButton
        itemId={lineId}
        className="inline-flex items-center gap-1 text-xs font-medium text-destructive hover:text-destructive/80 transition-colors"
      />
    </div>
  );
}

function QuntityButton({
  lineId,
  quantity,
  children,
  ariaLabel,
  position,
}: {
  lineId: string;
  quantity: number;
  ariaLabel: string;
  position: "left" | "right";
} & React.PropsWithChildren) {
  const [isPending, startTransition] = useTransition();
  const handleClick = () =>
    startTransition(() => {
      quantity <= 0 ? deleteLineItem(lineId) : updateLineItem({ lineId, quantity });
    });

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={handleClick}
      aria-label={ariaLabel}
      className={`flex items-center justify-center h-8 w-8 p-1 hover:bg-button-primary-hover transition-colors disabled:opacity-50 disabled:pointer-events-none ${position === "left" ? "rounded-l-md" : "rounded-r-md"}`}
    >
      {isPending ? <Loader className="w-4 h-4 animate-spin" /> : children}
    </button>
  );
}

function CartRemoveButton({ itemId, className = "" }: CartRemoveButtonProps) {
  const [isPending, startTransition] = useTransition();
  const handleClick = () =>
    startTransition(() => {
      deleteLineItem(itemId);
    });

  return (
    <button
      type="button"
      aria-label="Remove item from cart"
      onClick={handleClick}
      disabled={isPending}
      className={`disabled:opacity-50 disabled:pointer-events-none ${className}`}
    >
      {isPending ? (
        <Loader className="w-3.5 h-3.5 animate-spin" />
      ) : (
        <Trash className="w-3.5 h-3.5" />
      )}
      <span>Remove</span>
    </button>
  );
}

type CartRemoveButtonProps = {
  itemId: string;
  className?: string;
};