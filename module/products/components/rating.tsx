import { Star } from "lucide-react";

export function StarRating({
    rating,
    count,
    className = "",
}: {
    rating: number;
    count: number;
    className?: string;
}) {
    return (
        <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`w-4 h-4 ${star <= Math.floor(rating) ? "text-rating-filled fill-rating-filled" : star - 0.5 <= rating ? "text-rating-filled fill-rating-filled/50" : "text-rating-empty"}`}
                    />
                ))}
            </div>
            <span className="text-sm text-foreground-secondary">
                {rating} ({count} reviews)
            </span>
        </div>
    );
}