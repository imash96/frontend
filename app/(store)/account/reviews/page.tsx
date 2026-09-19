import type { Metadata } from "next";
import { MessageSquare } from "lucide-react";
import { listCustomerReviews } from "@/lib/action/review";
import ReviewCard from "@/module/account/components/review-card";

export const metadata: Metadata = {
  title: "My Reviews | Velle Hide",
  description: "View and manage all the product reviews you've written.",
};

export default async function Page() {
  const reviews = await listCustomerReviews();

  return (
    <section
      aria-labelledby="reviews-title"
      className="space-y-4 sm:space-y-6"
    >
      <header className="space-y-2 animate-fade-in-up">
        <div className="flex items-center gap-2">
          <MessageSquare size={20} />
          <h2
            id="reviews-title"
            className="text-lg lg:text-xl uppercase tracking-wide font-medium"
          >
            My Reviews
          </h2>
        </div>
        <p className="text-sm text-muted-foreground max-w-prose">
          View and manage the product reviews you&apos;ve written. Edit or
          delete your reviews at any time.
        </p>
      </header>

      {reviews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map((review, i) => (
            <div
              key={review.id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${(i + 1) * 80}ms` }}
            >
              <ReviewCard review={review} />
            </div>
          ))}
        </div>
      ) : (
        <div
          className="flex flex-col items-center justify-center py-12 sm:py-16 text-center border border-dashed border-border rounded-xl animate-fade-in-up"
          style={{ animationDelay: "100ms" }}
        >
          <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-4">
            <MessageSquare size={28} className="text-accent" />
          </div>
          <p className="text-lg font-medium">No reviews yet</p>
          <p className="text-muted-foreground text-sm mt-1 max-w-xs">
            After receiving your orders, you can write reviews for the products
            you&apos;ve purchased.
          </p>
        </div>
      )}
    </section>
  );
}
