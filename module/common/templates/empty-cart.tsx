import CartEmpty from "@/icon/empty-cart";
import Button from "@/ui/button";

export default function EmptyCart({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex flex-col items-center justify-center p-6 text-center gap-y-4 ${className}`}
    >
      <CartEmpty className="w-24 opacity-90" />
      <h2 className="text-lg tracking-wide">YOUR CART IS EMPTY</h2>
      <p className="text-sm tracking-wide font-light text-foreground-tertiary max-w-xs">
        Looks like you haven’t added anything yet.
      </p>
      <Button
        href={"/"}
        variant="outline"
        className="tracking-wide text-xs font-medium uppercase"
      >
        Continue Shopping
      </Button>
    </div>
  );
}
