import Button from "@/ui/button"
import RatingSystem from "@/ui/rating-system"
import RatingBreakdown from "../components/review"
import Container from "@/ui/container"

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
        },
        {
            id: 4,
            rating: 5,
            content:
                "This exceeded my expectations. The leather is soft yet sturdy, and the compartments are well thought out. It feels like it will last for years. Definitely worth the price.",
            author: "Hector Gibbons",
        },
    ],
}

export default function ProductReview() {
    return (
        <Container
            size="2xl"
            as="section"
            aria-labelledby="product-review-heading"
            className="border-t border-divider py-12 md:py-16"
        >
            <div id="reviews" className="lg:grid lg:grid-cols-12 lg:gap-x-12">
                <div className="lg:col-span-3">
                    <h2 id="product-review-heading" className="font-heading text-2xl font-semibold text-text-primary">
                        Customer Reviews
                    </h2>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                        <RatingSystem averageRating={reviews.rating.average_rating} size="md" showCount={false} />
                        <p className="text-sm text-text-secondary">
                            Based on {reviews.rating.review_count.toLocaleString()} reviews
                        </p>
                    </div>

                    <RatingBreakdown reviews={reviews.rating} />

                    <div className="mt-10">
                        <h3 className="font-heading text-lg font-medium text-text-primary">Share your thoughts</h3>
                        <p className="mt-1 text-sm text-text-secondary">
                            If you&apos;ve used this product, share your experience with others.
                        </p>

                        <Button href="#" variant="outline" className="mt-4 w-full text-sm">
                            Write a review
                        </Button>
                    </div>
                </div>

                <div className="mt-12 lg:mt-0 lg:col-span-9">
                    <h3 className="mb-2 font-heading text-2xl font-semibold text-text-primary">Recent Reviews</h3>

                    <div>
                        {reviews.featured.map((review) => (
                            <article key={review.id} className="border-b border-border py-6 last:border-b-0">
                                <div className="flex items-center">
                                    <div
                                        aria-hidden
                                        className="flex size-12 shrink-0 items-center justify-center rounded-sm border border-border bg-muted font-heading text-sm font-semibold text-text-secondary"
                                    >
                                        {review.author
                                            .split(" ")
                                            .map((n) => n[0])
                                            .join("")
                                            .slice(0, 2)}
                                    </div>
                                    <div className="ml-3">
                                        <h4 className="text-sm font-semibold text-text-primary">{review.author}</h4>
                                        <RatingSystem averageRating={review.rating} size="sm" showCount={false} />
                                    </div>
                                </div>

                                <p className="mt-4 text-sm leading-relaxed text-text-secondary max-w-[100ch]">{review.content}</p>
                            </article>
                        ))}
                    </div>
                </div>
            </div>
        </Container>
    )
}
