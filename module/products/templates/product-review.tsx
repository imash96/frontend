import Image from "next/image";
import Button from "@/ui/button";
import RatingSystem from "@/ui/rating-system";
import RatingBreakdown from "../components/rating-breakdown";

const reviews = {
  rating: {
    average_rating: 4.4,
    review_count: 1624,
    rating_count_1: 147,
    rating_count_2: 162,
    rating_count_3: 97,
    rating_count_4: 199,
    rating_count_5: 1019,
  },
  featured: [
    {
      id: 1,
      rating: 5,
      content:
        "Absolutely love this bag! The leather feels premium and the stitching is flawless. I’ve been using it daily for work and it easily fits my laptop, charger, and a few extras without looking bulky. Already received a lot of compliments.",
      author: "Emily Selman",
    },
    {
      id: 2,
      rating: 4,
      content:
        "The bag is very versatile and stylish. I use it both for office and casual outings. The only reason I gave 4 stars instead of 5 is because I wish the strap was a little more padded for long carries, but otherwise it’s perfect.",
      author: "Mark Edwards",
    },
    {
      id: 3,
      rating: 5,
      content:
        "I was hesitant at first because of the price, but honestly, this bag is worth every penny. It looks elegant, feels durable, and even smells like real leather. I’ll be buying another one as a gift.",
      author: "Lina Moreno",
      avatarSrc:
        "https://images.vellehide.com/storefront/images/prod_review/photo-1996070704220-ee32371fefbe.jpg",
    },
    {
      id: 4,
      rating: 5,
      content:
        "This exceeded my expectations. The leather is soft yet sturdy, and the compartments are well thought out. It feels like it will last for years. Definitely worth the price.",
      author: "Hector Gibbons",
    },
  ],
};

export default function ProductReview() {
  return (
    <section aria-labelledby="product-review-heading" className="py-16">
      <div className="lg:grid lg:grid-cols-12 lg:gap-x-12">
        {/* LEFT PANEL */}
        <div className="lg:col-span-4">
          <h2 id="product-review-heading" className="text-2xl font-semibold">
            Customer Reviews
          </h2>

          <div className="mt-3 flex items-center gap-2">
            <RatingSystem
              averageRating={reviews.rating.average_rating}
              size="md"
              showCount
            />
            <p className="text-sm text-foreground-muted">
              Based on {reviews.rating.review_count.toLocaleString()} reviews
            </p>
          </div>

          <RatingBreakdown reviews={reviews.rating} />

          <div className="mt-10">
            <h3 className="text-lg font-medium">Share your thoughts</h3>
            <p className="mt-1 text-sm text-foreground-muted">
              If you&apos;ve used this product, share your experience with
              others.
            </p>

            <Button
              href="#"
              variant="outline"
              className="w-full mt-4 rounded-lg text-sm"
            >
              Write a review
            </Button>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="mt-12 lg:mt-0 lg:col-span-8">
          <h2 className="text-2xl font-semibold mb-4">Recent Reviews</h2>

          <div className="space-y-4">
            {reviews.featured.slice(0, 6).map((review) => (
              <div key={review.id} className="border-b border-border py-6">
                <div className="flex items-center">
                  <Image
                    src={review.avatarSrc || "https://images.vellehide.com/storefront/images/prod_review/user.png"}
                    alt={review.author}
                    width={48}
                    height={48}
                    className="rounded-sm border"
                  />
                  <div className="ml-3">
                    <h3 className="text-sm font-semibold">{review.author}</h3>
                    <RatingSystem
                      averageRating={reviews.rating.average_rating}
                      size="sm"
                      showCount
                    />
                  </div>
                </div>

                <p className="mt-4 text-base text-foreground-disabled leading-relaxed">
                  {review.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
