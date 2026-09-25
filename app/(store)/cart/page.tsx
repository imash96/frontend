import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { retrieveCart } from "@/lib/action/cart";
import { retrieveCustomer } from "@/lib/action/customer";
import CartEditQuantity, { CartRemoveButton } from "@/module/cart/components/quantity-button";
import CartSummary from "@/module/cart/templates/cart-summary";
import LineItemPrice from "@/module/cart/templates/lineitem-price";
import SignInPrompt from "@/module/cart/templates/sign-in-prompt";
import EmptyCart from "@/module/common/templates/empty-cart";
import ProductThumbnail from "@/module/products/components/product-thumbnail";
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

        <div className="flex w-full flex-col items-center gap-3 rounded-xs bg-background-secondary px-4 py-4 sm:flex-row sm:items-center sm:gap-4 sm:px-5 sm:py-0 sm:min-h-18">
          <Image
            src="https://www.leathercult.com/cdn/shop/files/6ee84f472e24cc8805a841276b21378459c95dca.png"
            alt="Cart - free return policy"
            width={64}
            height={64}
            className="block h-auto w-12 shrink-0 object-contain sm:w-16 md:max-w-21"
          />

          <div className="flex flex-col items-center gap-1 text-center font-body not-italic sm:flex-row sm:items-center sm:gap-4 sm:text-left">
            <span className="text-base text-center font-bold uppercase leading-5 text-black sm:text-lg sm:leading-6 md:text-xl">
              Order Risk-free
            </span>

            <span className="text-[11px] font-normal leading-4 text-foreground-secondary sm:text-xs sm:leading-5">
              If our measurements differ from what you submitted, we will follow our
              return policy and give a free replacement accordingly.
            </span>
          </div>
        </div>
      </div>

      <div className="w-full self-start lg:sticky lg:top-24 lg:col-span-4">
        <CartSummary cart={cart} />
      </div>
    </Container>
  );
}