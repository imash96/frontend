import CartEmpty from "@/icon/empty-cart";
import Button from "./button";

export default function EmptyCart({ className = "" }: { className?: string }) {
    return (
        <div className={`flex flex-col items-center justify-center p-6 sm:p-8 lg:p-12 text-center gap-y-4 sm:gap-y-6 ${className}`}>
            <CartEmpty className="w-20 sm:w-24 lg:w-32 opacity-90 text-foreground-tertiary" aria-hidden="true" />
            <h2 className="text-lg sm:text-xl lg:text-2xl tracking-wide font-semibold text-foreground font-heading">
                YOUR CART IS EMPTY
            </h2>
            <p className="text-sm sm:text-base tracking-wide font-light text-foreground-secondary max-w-xs sm:max-w-sm leading-relaxed">
                Looks like you haven’t added anything yet.
            </p>
            <Button
                href={"/"}
                variant="primary"
                size="lg"
                className=" tracking-wide text-xs sm:text-sm font-medium uppercase mt-2"
            >
                Continue Shopping
            </Button>
        </div>
    )
}
