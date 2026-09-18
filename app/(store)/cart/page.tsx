import Link from "next/link";
import { retrieveCart } from "@/lib/action/cart";
import { retrieveCustomer } from "@/lib/action/customer";
import CartEditQuantity from "@/module/cart/components/quantity-button";
import CartSummary from "@/module/cart/templates/cart-summary";
import LineItemPrice from "@/module/cart/templates/lineitem-price";
import SignInPrompt from "@/module/cart/templates/sign-in-prompt";
import ProductThumbnail from "@/module/products/components/product-thumbnail";
import EmptyCart from "@/ui/empty-cart";
import Container from "@/ui/container";
import Image from "next/image";

export default async function Page() {
  const [customer, cart] = await Promise.all([
    retrieveCustomer(),
    retrieveCart(),
  ]);

  const items = cart?.items ?? [];
  const hasItems = items.length > 0;

  if (!cart || !hasItems) {
    return (
      <Container size="lg" as="main" className="py-8 md:py-10 lg:py-14">
        <h1 className="sr-only">Shopping Cart</h1>
        {!customer && <SignInPrompt />}
        <EmptyCart className="min-h-[40vh]" />
      </Container>
    );
  }

  return (
    <Container
      size="xl"
      as="main"
      className="grid grid-cols-1 lg:gap-x-6 xl:gap-x-14 gap-y-8 lg:grid-cols-10 py-8 md:py-10 lg:py-14"
    >
      <div className="lg:col-span-6 space-y-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">Shopping Cart</h1>
          <p className="text-sm font-light tracking-wide text-foreground-muted">
            <strong className="font-semibold text-foreground">
              {items.length}
            </strong>{" "}
            {items.length === 1 ? "item" : "items"} in your cart
          </p>
        </div>

        {!customer && <SignInPrompt />}

        <ol aria-label="Items in your cart" className="divide-y divide-border">
          {items.map((item) => (
            <li key={item.id} className="flex gap-3 py-4">
              <div className="relative w-24 shrink-0">
                <ProductThumbnail
                  src={item.thumbnail}
                  alt={item.title}
                  width={300}
                  height={400}
                />
              </div>
              <div className="space-y-2 w-full min-w-0">
                <div className="flex flex-col gap-y-1 gap-x-2 md:flex-row md:justify-between">
                  <h2 className="text-sm leading-snug font-medium">
                    <Link
                      href={`/products/${item.product?.handle || ""}`}
                      className="hover:text-link transition-colors line-clamp-2 max-w-[35ch]"
                    >
                      {item.product?.title}
                    </Link>
                  </h2>
                  <LineItemPrice item={item} currencyCode={cart.currency_code} />
                </div>
                <div className="flex flex-col gap-y-2 gap-x-2 md:flex-row md:items-end md:justify-between">
                  <div className="text-sm text-foreground-muted truncate">
                    <p>{item.variant?.title ?? "Standard"}</p>
                    <p>
                      <strong>Type: </strong>
                      {item.product_type ?? "Standard"}
                    </p>
                  </div>
                  <CartEditQuantity lineId={item.id} quantity={item.quantity} />
                </div>
              </div>
            </li>
          ))}
        </ol>
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

      <div className="lg:col-span-4 sticky top-24 self-start w-full">
        <CartSummary cart={cart} />
      </div>
    </Container>
  );
}