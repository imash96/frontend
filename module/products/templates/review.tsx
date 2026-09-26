import Button from "@/ui/button"
import Container from "@/ui/container"
import RatingSystem from "@/ui/rating-system"
import RatingBreakdown from "../components/review"
import type { ProductReviewStats, StoreProductReview } from "@/types/product"

export default async function ProductReview({ reviews, rating }: { reviews?: StoreProductReview[], rating?: ProductReviewStats }) {
    console.log({ reviews, rating })
    if (!reviews || reviews.length === 0) return null
    const hasReviews = reviews.length > 0
    const hasStats = !!rating && rating.review_count > 0

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

                    {hasStats ? (
                        <>
                            <div className="mt-3 flex flex-wrap items-center gap-2">
                                <RatingSystem averageRating={rating.average_rating} size="md" showCount={false} />
                                <p className="text-sm text-text-secondary">
                                    Based on {rating.review_count.toLocaleString()} {rating.review_count === 1 ? "review" : "reviews"}
                                </p>
                            </div>

                            <RatingBreakdown reviews={rating} />
                        </>
                    ) : (
                        <p className="mt-3 text-sm text-text-secondary">
                            No reviews yet. Be the first to share your experience.
                        </p>
                    )}

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

                    {hasReviews ? (
                        <div>
                            {reviews.map((review) => (
                                <article key={review.id} className="border-b border-border py-6 last:border-b-0">
                                    <div className="flex items-center">
                                        <div
                                            aria-hidden
                                            className="flex size-12 shrink-0 items-center justify-center rounded-sm border border-border bg-muted font-heading text-sm font-semibold text-text-secondary"
                                        >
                                            {(review.name || "A")
                                                .split(" ")
                                                .map((n) => n[0])
                                                .join("")
                                                .slice(0, 2)
                                                .toUpperCase()}
                                        </div>
                                        <div className="ml-3">
                                            <h4 className="text-sm font-semibold text-text-primary">
                                                {review.name || "Anonymous"}
                                                {review.verified && (
                                                    <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-success/10 text-success">
                                                        Verified
                                                    </span>
                                                )}
                                            </h4>
                                            <RatingSystem averageRating={review.rating} size="sm" showCount={false} />
                                        </div>
                                    </div>

                                    {review.title && (
                                        <h5 className="mt-3 text-sm font-semibold text-text-primary">{review.title}</h5>
                                    )}

                                    <p className="mt-2 text-sm leading-relaxed text-text-secondary max-w-[100ch]">
                                        {review.content}
                                    </p>

                                    {/* Review Images */}
                                    {review.images && review.images.length > 0 && (
                                        <div className="mt-3 flex gap-2 flex-wrap">
                                            {review.images.map((img) => (
                                                <div key={img.id} className="w-16 h-16 rounded-md overflow-hidden bg-muted">
                                                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Admin Response */}
                                    {review.response && (
                                        <div className="mt-3 pl-3 border-l-2 border-accent/30">
                                            <p className="text-xs font-medium text-accent mb-0.5">Store Response</p>
                                            <p className="text-sm text-text-secondary">{review.response.content}</p>
                                        </div>
                                    )}
                                </article>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed border-border rounded-xl">
                            <p className="text-lg font-medium text-text-primary">No reviews yet</p>
                            <p className="text-text-secondary text-sm mt-1 max-w-xs">
                                Be the first to review this product and help others make informed decisions.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </Container>
    )
}
