import { ArrowLeft, BadgeCheck, Ruler } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { retrieveCart } from "@/lib/action/cart";
import { retrieveCustomer } from "@/lib/action/customer";
import CartEditQuantity, { CartRemoveButton } from "@/module/cart/components/quantity-button";
import CartSummary from "@/module/cart/templates/cart-summary";
import LineItemPrice from "@/module/cart/templates/lineitem-price";
import SignInPrompt from "@/module/cart/templates/sign-in-prompt";
import EmptyCart from "@/module/common/templates/empty-cart";
import { ProductThumbnailN as ProductThumbnail } from "@/module/products/components/product-thumbnail";
import Container from "@/ui/container";

export const metadata: Metadata = {
  title: "Shopping Cart | Velle Hide",
  description: "Review the items in your cart before checkout.",
  robots: { index: false, follow: true },
};
/* Cart is fully user-specific (reads cookies for auth + cart ID) */
export const instant = false;

export default async function Page() {
  const [customer, cart] = await Promise.all([
    retrieveCustomer(),
    retrieveCart(),
  ]);

  const items = cart?.items ?? [];

  // A missing cart (new visitor, or an expired/invalid cart cookie) isn't a
  // 404 — it just means there's nothing in the bag yet. Same UI either way.
  if (!cart || items.length === 0) {
    return (
      <Container size="lg" className="py-8 md:py-10 lg:py-14">
        <EmptyCart className="min-h-[50vh]" />
      </Container>
    );
  }

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Container
      size="xl"
      className="grid grid-cols-1 gap-x-14 gap-y-8 lg:grid-cols-10 py-8 md:py-10 lg:py-14"
    >
      <div className="lg:col-span-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 border-b border-divider pb-4">
          <div className="space-y-1">
            <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">
              Shopping Cart
            </h1>
            <p className="text-sm text-text-secondary">
              <strong className="font-semibold text-text-primary">{itemCount}</strong>{" "}
              {itemCount === 1 ? "item" : "items"} in your cart
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-text-secondary transition-colors hover:text-primary"
          >
            <ArrowLeft className="size-3.5" />
            <span className="hidden sm:inline">Continue Shopping</span>
          </Link>
        </div>

        {!customer && <SignInPrompt />}

        {/* Items */}
        <ul className="divide-y divide-divider">
          {items.map((item) => (
            <li key={item.id} className="flex gap-4 py-5 first:pt-0">
              <Link
                href={`/products/${item.product?.handle || ""}`}
                className="relative w-24 shrink-0 sm:w-28"
              >
                <ProductThumbnail
                  src={item.thumbnail}
                  alt={item.title}
                  width={300}
                  height={400}
                  className="rounded-lg"
                />
              </Link>

              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 space-y-1">
                    <Link
                      href={`/products/${item.product?.handle || ""}`}
                      className="line-clamp-2 text-sm font-medium text-text-primary transition-colors hover:text-primary sm:text-base"
                    >
                      {item.product?.title}
                    </Link>
                    <p className="text-xs text-text-tertiary sm:text-sm">
                      {item.variant?.title ?? "Standard"}
                    </p>
                  </div>
                  <LineItemPrice item={item} currencyCode={cart.currency_code} />
                </div>

                <div className="mt-auto flex items-center justify-between gap-3 pt-2">
                  <CartEditQuantity lineId={item.id} quantity={item.quantity} />
                  <CartRemoveButton itemId={item.id} />
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="relative overflow-hidden rounded-xl border border-border/70 bg-linear-to-br from-card to-background-secondary px-4 pb-7 pt-4 @md:px-5 @md:pb-8 @md:pt-5 @4xl:px-7 @4xl:pb-9 @4xl:pt-6">
          <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-4 gap-y-4 @2xl:grid-cols-[auto_minmax(0,1fr)_auto] @2xl:gap-x-5 @4xl:gap-x-6">
            {/* Icon tile */}
            <span className="grid size-11 place-items-center rounded-xl bg-accent/10 text-accent ring-1 ring-inset ring-accent/20 @md:size-12 @4xl:size-14">
              <Ruler aria-hidden="true" className="size-5 @4xl:size-6" />
            </span>

            {/* Copy: below the icon row when narrow, middle column when wide */}
            <div className="col-span-2 row-start-2 min-w-0 @2xl:col-span-1 @2xl:col-start-2 @2xl:row-start-1">
              <h3 className="font-heading text-base font-semibold leading-snug text-text-primary @md:text-lg">
                Order risk-free
              </h3>
              <p className="mt-1.5 max-w-[60ch] text-sm leading-relaxed text-text-secondary @md:text-[15px]">
                Every jacket is cut to the measurements you submit. If our measurements
                differ from yours, our return policy covers a free replacement.
              </p>
            </div>

            {/* Warranty badge: top-right on narrow, trailing column when wide */}
            <div className="col-start-2 row-start-1 inline-flex w-fit items-center gap-2 justify-self-end whitespace-nowrap rounded-full border border-accent/25 bg-background/80 py-1.5 pl-2.5 pr-3.5 text-sm font-medium text-text-accent @2xl:col-start-3">
              <BadgeCheck aria-hidden="true" className="size-5 shrink-0" />
              2-year warranty
            </div>
          </div>

          {/* Decorative tape-measure edge */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-4 text-accent/40"
            style={TAPE_EDGE}
          />
        </div>
      </div>

      <div className="w-full self-start lg:sticky lg:top-24 lg:col-span-4">
        <CartSummary cart={cart} />
      </div>
    </Container>
  );
}

const TAPE_EDGE: React.CSSProperties = {
  backgroundImage: "repeating-linear-gradient(90deg, currentColor 0 1px, transparent 1px 6px), repeating-linear-gradient(90deg, currentColor 0 1px, transparent 1px 30px)",
  backgroundSize: "100% 8px, 100% 16px",
  backgroundPosition: "0 100%, 0 100%",
  backgroundRepeat: "no-repeat",
}