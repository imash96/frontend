import { Star } from "lucide-react";
import type { RatingType } from "@/types/common";

type RatingBreakdownProps = {
    reviews: RatingType;
};

export default function RatingBreakdown({ reviews }: RatingBreakdownProps) {
    if (!reviews) return null;

    const totalReviews = reviews.review_count || 0;

    return (
        <div className="mt-6">
            <h3 className="sr-only">Review data</h3>

            <dl className="space-y-2">
                {[5, 4, 3, 2, 1].map((star) => {
                    const count = reviews[
                        `rating_count_${star}` as keyof RatingType
                    ] as number;
                    const percentage =
                        totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;

                    return (
                        <div key={star} className="flex items-center gap-3 text-sm">
                            <dt className="flex items-center w-8">
                                <Star
                                    className={`h-4 w-4 ${count > 0 ? "text-accent fill-accent" : "text-foreground-secondary fill-foreground-secondary"}`}
                                    aria-hidden="true"
                                />
                                <span className="ml-1 text-accent">{star}</span>
                            </dt>

                            <div className="flex-1 relative h-2 rounded-full bg-foreground-tertiary">
                                {count > 0 && (
                                    <div
                                        className="absolute inset-y-0 left-0 rounded-full bg-accent"
                                        style={{ width: `${percentage}%` }}
                                    />
                                )}
                            </div>

                            <dd className="w-8 text-right tabular-nums text-foreground-secondary">
                                {percentage}%
                            </dd>
                        </div>
                    );
                })}
            </dl>
        </div>
    );
}
