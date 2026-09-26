import { Heart, Trash2 } from "lucide-react"
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { fetchWishlist } from "@/lib/action/wishlist"
import WishlistItemActions from "./wishlist-actions"

export const metadata: Metadata = {
    title: "Wishlist | Velle Hide",
    description: "View and manage the products you've saved for later.",
}

export const instant = false;

export default async function Page() {
    const wishlist = await fetchWishlist()
    const items = wishlist?.items ?? []
    const hasItems = items.length > 0

    return (
        <section className="space-y-4 sm:space-y-6">
            {/* Header */}
            <header className="space-y-2 animate-fade-in-up">
                <div className="flex items-center gap-2">
                    <Heart size={20} />
                    <h2 className="text-lg lg:text-xl font-medium tracking-wide uppercase">
                        Wishlist
                    </h2>
                    {hasItems && (
                        <span className="text-sm text-muted-foreground">
                            ({items.length} {items.length === 1 ? "item" : "items"})
                        </span>
                    )}
                </div>
                <p className="text-sm text-muted-foreground max-w-prose">
                    View and manage the products you&apos;ve saved for later. Your wishlist
                    helps you keep track of items you love and makes it easy to add them
                    to your cart.
                </p>
            </header>

            {hasItems ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {items.map((item, i) => (
                        <div
                            key={item.id}
                            className="group border border-border rounded-lg bg-background-elevated overflow-hidden transition-shadow hover:shadow-md animate-fade-in-up"
                            style={{ animationDelay: `${(i + 1) * 60}ms` }}
                        >
                            {/* Product Image */}
                            <Link
                                href={`/products/${item.product_variant?.product?.handle || ""}`}
                                className="block aspect-3/4 bg-muted relative overflow-hidden"
                            >
                                {item.product_variant?.product?.thumbnail ? (
                                    <Image
                                        src={item.product_variant.product.thumbnail}
                                        alt={item.product_variant?.title ?? "Product"}
                                        fill
                                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-muted-foreground">
                                        <Heart size={32} />
                                    </div>
                                )}
                            </Link>

                            {/* Product Details */}
                            <div className="p-3 sm:p-4 space-y-2">
                                <Link
                                    href={`/products/${item.product_variant?.product?.handle || ""}`}
                                    className="text-sm font-medium text-link hover:underline underline-offset-2 line-clamp-2"
                                >
                                    {item.product_variant?.title ?? "Product"}
                                </Link>

                                <div className="flex items-center justify-between gap-2">
                                    <p className="text-xs text-muted-foreground">
                                        Added {new Date(item.created_at).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                        })}
                                    </p>

                                    <WishlistItemActions
                                        wishlistId={item.wishlist_id}
                                        itemId={item.id}
                                        productHandle={item.product_variant?.product?.handle}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                /* Empty State */
                <div
                    className="flex flex-col items-center justify-center py-12 sm:py-16 text-center border border-dashed border-border rounded-xl animate-fade-in-up"
                    style={{ animationDelay: "100ms" }}
                >
                    <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                        <Heart size={28} className="text-destructive" />
                    </div>
                    <p className="text-lg font-medium">No saved items yet</p>
                    <p className="text-muted-foreground text-sm mt-1 max-w-xs">
                        Start exploring to see your wishlist items here! Tap the heart icon on any product to save it.
                    </p>
                    <Link
                        href="/categories"
                        className="mt-4 inline-flex items-center px-4 py-2 text-sm font-medium text-accent border border-accent/30 rounded-md hover:bg-accent/10 transition-colors"
                    >
                        Browse Products
                    </Link>
                </div>
            )}
        </section>
    )
}
