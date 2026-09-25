import { Heart } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wishlist | Velle Hide",
  description: "View and manage the products you've saved for later.",
};

export default function Page() {
  return (
    <section className="space-y-4 sm:space-y-6">
      {/* Header */}
      <header className="space-y-2 animate-fade-in-up">
        <div className="flex items-center gap-2">
          <Heart size={20} />
          <h2 className="text-lg lg:text-xl font-medium tracking-wide uppercase">
            Wishlist
          </h2>
        </div>
        <p className="text-sm text-muted-foreground max-w-prose">
          View and manage the products you&apos;ve saved for later. Your wishlist
          helps you keep track of items you love and makes it easy to add them
          to your cart.
        </p>
      </header>

      {/* Empty State */}
      <div className="flex flex-col items-center justify-center py-12 sm:py-16 text-center border border-dashed border-border rounded-xl animate-fade-in-up" style={{ animationDelay: "100ms" }}>
        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
          <Heart size={28} className="text-destructive" />
        </div>
        <p className="text-lg font-medium">No saved items yet</p>
        <p className="text-muted-foreground text-sm mt-1 max-w-xs">
          Start exploring to see your wishlist items here! Tap the heart icon on any product to save it.
        </p>
      </div>
    </section>
  );
}
