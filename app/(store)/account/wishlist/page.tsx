import { Heart } from "lucide-react";

export default function Page() {
  return (
    <section className="space-y-4">
      {/* Header */}
      <header className="space-y-2">
        <div className="flex items-center gap-2">
          <Heart size={20} />
          <h2 className="text-lg lg:text-xl font-medium tracking-wide uppercase">
            Wishlist
          </h2>
        </div>
        <p className="text-sm text-foreground-muted max-w-prose">
          View and manage the products you’ve saved for later. Your wishlist
          helps you keep track of items you love and makes it easy to add them
          to your cart.
        </p>
      </header>
      <div className="">Wishlist here</div>
      {/* Wishlist Items */}
      {/* {wishlist?.items && wishlist.items.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {wishlist.items.map(({ product_id, product }) => (
                        <ProductCard key={product_id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-10 text-center border border-dashed border-border rounded-lg">
                    <Heart size={36} className="mb-2 text-wishlist" />
                    <p className="text-lg">No product found.</p>
                    <p className="text-foreground-muted text-sm">Start exploring to see your wishlist items here!</p>
                </div>
            )} */}
    </section>
  );
}
