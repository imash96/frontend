import { Star } from "lucide-react";

type RatingProps = {
    averageRating: number;
    reviewCount?: number;
    size?: "xs" | "sm" | "md";
    showCount?: boolean;
    className?: string;
};

const sizeMap = { xs: 10, sm: 12, md: 14 } as const;
const textMap = { xs: "text-[10px]", sm: "text-xs", md: "text-sm" } as const;

export default function RatingSystem({
    averageRating,
    reviewCount = 0,
    size = "sm",
    showCount = true,
    className = "",
}: RatingProps) {
    const rounded = Math.floor(averageRating);

    return (
        <div
            className={`flex items-center gap-0.5 ${className}`}
            aria-label={`${averageRating.toFixed(1)} out of 5 stars`}
        >
            {[0, 1, 2, 3, 4].map((i) => (
                <Star
                    key={i}
                    size={sizeMap[size]}
                    className={`shrink-0 ${i < rounded ? "fill-rating-filled text-rating-filled" : "fill-rating-empty text-rating-empty"}`}
                />
            ))}
            {showCount && (
                <span className={`text-muted-foreground ml-1 tabular-nums ${textMap[size]}`}>
                    ({reviewCount})
                </span>
            )}
        </div>
    );
}
