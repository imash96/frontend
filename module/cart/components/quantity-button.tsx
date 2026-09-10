"use client";

import { Loader, Minus, Plus, Trash } from "lucide-react";
import { useTransition } from "react";
import { deleteLineItem, updateLineItem } from "@/lib/action/cart";

// TODO mix with cart drawer quantity button
export default function CartEditQuantity({
  lineId,
  quantity,
}: {
  lineId: string;
  quantity: number;
}) {
  return (
    // <div className="flex gap-x-1 justify-between">
    <div className="flex items-center w-fit border rounded-md bg-btn-primary text-btn-primary-foreground">
      <QuntityButton lineId={lineId} quantity={quantity - 1}>
        {quantity === 1 ? (
          <Trash className="w-4 h-4" />
        ) : (
          <Minus className="w-4 h-4" />
        )}
      </QuntityButton>
      <span className="px-2 py-1 text-xs font-medium min-w-6 text-center">
        {quantity}
      </span>
      <QuntityButton lineId={lineId} quantity={quantity + 1}>
        <Plus className="w-4 h-4" />
      </QuntityButton>
    </div>
    //{quantity > 1 && <CartRemoveButton itemId={lineId} className="px-2 py-1 border border-border bg-btn-destructive text-btn-destructive-foreground hover:bg-btn-destructive-hover rounded-md" />}
    // </div>
  );
}

function QuntityButton({
  lineId,
  quantity,
  children,
}: { lineId: string; quantity: number } & React.PropsWithChildren) {
  const [isPending, startTransition] = useTransition();
  const handleClick = () =>
    startTransition(() => {
      quantity <= 0 ? deleteLineItem(lineId) : updateLineItem({ lineId, quantity });
    });

  return (
    <button
      disabled={isPending}
      onClick={handleClick}
      className={`flex items-center justify-center h-8 w-8 p-1 hover:bg-btn-primary-hover transition-colors rounded-r-md ${isPending ? "pointer-events-none" : ""}`}
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
      aria-label="Remove cart item"
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className={`${className}`}
    >
      {isPending ? (
        <Loader className="w-4 h-4 animate-spin" />
      ) : (
        <Trash className="w-4 h-4 group-hover:text-foreground-muted" />
      )}
    </button>
  );
}

type CartRemoveButtonProps = {
  itemId: string;
  className?: string;
};
