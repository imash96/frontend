"use client";

import { Loader2, Minus, Plus, Trash2 } from "lucide-react";
import { useTransition } from "react";
import { deleteLineItem, updateLineItem } from "@/lib/action/cart";

export default function CartEditQuantity({ lineId, quantity, }: { lineId: string; quantity: number; }) {
  return (
    <div className="inline-flex items-center overflow-hidden rounded-md border border-border bg-surface">
      <StepButton
        lineId={lineId}
        quantity={quantity - 1}
        ariaLabel={quantity === 1 ? "Remove item" : "Decrease quantity"}
      >
        {quantity === 1 ? (
          <Trash2 className="h-3.5 w-3.5" />
        ) : (
          <Minus className="h-3.5 w-3.5" />
        )}
      </StepButton>
      <span className="min-w-8 px-1 text-center text-sm font-medium tabular-nums text-text-primary">
        {quantity}
      </span>
      <StepButton lineId={lineId} quantity={quantity + 1} ariaLabel="Increase quantity">
        <Plus className="h-3.5 w-3.5" />
      </StepButton>
    </div>
  );
}

function StepButton({ lineId, quantity, ariaLabel, children, }: { lineId: string; quantity: number; ariaLabel: string; } & React.PropsWithChildren) {
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
      className="flex h-8 w-8 items-center justify-center text-text-secondary transition-colors hover:bg-muted hover:text-text-primary disabled:pointer-events-none disabled:opacity-40"
    >
      {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : children}
    </button>
  );
}

export function CartRemoveButton({ itemId }: { itemId: string }) {
  const [isPending, startTransition] = useTransition();
  const handleClick = () => startTransition(() => deleteLineItem(itemId));

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      aria-label="Remove item from cart"
      className="inline-flex items-center gap-1.5 rounded px-1 py-0.5 text-xs font-medium text-destructive transition-colors hover:bg-destructive-subtle hover:text-destructive-hover disabled:pointer-events-none disabled:opacity-50"
    >
      {isPending ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : (
        <Trash2 className="h-3.5 w-3.5" />
      )}
      Remove
    </button>
  );
}