import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { retrieveCart } from "@/lib/action/cart";
import { retrieveCustomer } from "@/lib/action/customer";
import CartEditQuantity, { CartRemoveButton } from "@/module/cart/components/quantity-button";
import CartSummary from "@/module/cart/templates/cart-summary";
import LineItemPrice from "@/module/cart/templates/lineitem-price";
import SignInPrompt from "@/module/cart/templates/sign-in-prompt";
import EmptyCart from "@/module/common/templates/empty-cart";
import ProductThumbnail from "@/module/products/components/product-thumbnail";
import Container from "@/ui/container";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Shopping Cart | Velle Hide",
  description: "Review the items in your cart before checkout.",
  robots: { index: false, follow: true },
};
/* Cart is fully user-specific (reads cookies for auth + cart ID) */
export const instant = false

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

        <div className="flex min-h-18 w-full items-center rounded-xs bg-background-secondary">
          <Image
            src="https://www.leathercult.com/cdn/shop/files/6ee84f472e24cc8805a841276b21378459c95dca.png"
            alt="Cart - free return policy"
            width={64}
            height={64}
            className="ml-5 mr-4 block h-auto w-full max-w-21 object-contain"
          />

          <div className="flex items-center font-body not-italic">
            <span className="mr-4 text-xl font-bold text-center uppercase leading-6 text-black">
              Order Risk-free
            </span>

            <span className="text-xs font-normal leading-5 text-foreground-secondary">
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