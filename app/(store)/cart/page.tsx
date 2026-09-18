import Link from "next/link";
import { notFound } from "next/navigation";
import { retrieveCart } from "@/lib/action/cart";
import { retrieveCustomer } from "@/lib/action/customer";
import CartEditQuantity from "@/module/cart/components/quantity-button";
import CartSummary from "@/module/cart/templates/cart-summary";
import LineItemPrice from "@/module/cart/templates/lineitem-price";
import SignInPrompt from "@/module/cart/templates/sign-in-prompt";
import EmptyCart from "@/module/common/templates/empty-cart";
import ProductThumbnail from "@/module/products/components/product-thumbnail";
import Container from "@/ui/custom/create-section";

export default async function Page() {
  const [customer, cart] = await Promise.all([
    retrieveCustomer(),
    retrieveCart(),
  ]);
  if (!cart) return notFound();

  const { items } = cart;
  return (
    <Container
      width={7}
      className="grid grid-cols-1 lg:gap-x-6 xl:gap-x-14 gap-y-8 lg:grid-cols-10 py-8 md:py-10 lg:py-14"
    >
      <div className="lg:col-span-6 space-y-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-medium text-templateBrown">
            Shopping Cart
          </h1>
          <p className="text-sm font-light tracking-wide">
            <strong className="font-semibold">{items?.length} items</strong> in
            your cart
          </p>
        </div>
        {!customer && <SignInPrompt />}
        {items?.length ? (
          <ol>
            {items.map((item) => (
              <li
                key={item.id}
                className="flex gap-2 py-4 border-y border-border"
              >
                <div className="relative w-24 shrink-0">
                  <ProductThumbnail
                    src={item.thumbnail}
                    alt={item.title}
                    width={300}
                    height={400}
                  />
                </div>
                <div className="space-y-1 md:space-y-1.5 w-full">
                  <div className="flex flex-col gap-y-1 gap-x-2 md:flex-row md:justify-between">
                    <h2 className="text-sm leading-snug font-medium">
                      <Link
                        href={`/products/${item.product?.handle || ""}`}
                        className="hover:text-link transition-colors line-clamp-2 max-w-[35ch]"
                      >
                        {item.product?.title}
                      </Link>
                    </h2>

                    <LineItemPrice
                      item={item}
                      currencyCode={cart.currency_code}
                    />
                  </div>
                  <div className="flex flex-col gap-y-1 gap-x-2 md:flex-row md:justify-between">
                    <div className="text-sm text-foreground-muted truncate">
                      <p>{item.variant?.title ?? "Standard"}</p>
                      <p>
                        <strong>Type: </strong>
                        {item.product_type ?? "Standard"}
                      </p>
                    </div>
                    <CartEditQuantity
                      lineId={item.id}
                      quantity={item.quantity}
                    />
                  </div>
                  {/* {/Custom Size|One Size/.test(item.variant_title || "") && <div className="flex gap-x-2">
                                    <CustomSelect
                                        label="Measurement"
                                        options={options}
                                        className="min-w-36 max-w-64 w-full"
                                    />
                                    <Button>
                                        <Plus className="w-4 h-4" />
                                    </Button>
                                </div>} */}
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <EmptyCart className="min-h-[40vh]" />
        )}
      </div>
      <div className="lg:col-span-4 sticky top-24 self-start w-full">
        <CartSummary cart={cart} />
      </div>
    </Container>
  );
}

// const options = [
//   {
//     label: "Arshad Ansari",
//     value: "arshad",
//   },
//   {
//     label: "Afroz Ansari",
//     value: "afroz",
//   },
//   {
//     label: "Afroz Jolha",
//     value: "jolha",
//   },
// ];
