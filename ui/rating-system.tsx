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
            role="img"
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

export function RatingSystemN({
    averageRating,
    reviewCount = 0,
    size = "sm",
    showCount = true,
    className = "",
}: RatingProps) {
    const value = Math.min(5, Math.max(0, averageRating))
    const px = sizeMap[size]
    const label = `${value.toFixed(1)} out of 5 stars${reviewCount > 0 ? `, ${reviewCount.toLocaleString("en-US")} reviews` : ""}`

    return (
        <div role="img" aria-label={label} className={`flex items-center gap-0.5 ${className}`}>
            {[0, 1, 2, 3, 4].map((index) => {
                // Partial stars: 4.4 fills the fifth star 40%.
                const fill = Math.min(1, Math.max(0, value - index))
                return (
                    <span key={index} aria-hidden="true" className="relative inline-flex shrink-0">
                        <Star size={px} className="shrink-0 fill-rating-empty text-rating-empty" />
                        {fill > 0 && (
                            <span className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
                                <Star size={px} className="shrink-0 fill-rating-filled text-rating-filled" />
                            </span>
                        )}
                    </span>
                )
            })}
            {showCount && (
                <span aria-hidden="true" className={`ml-1 tabular-nums text-muted-foreground ${textMap[size]}`}>
                    ({reviewCount.toLocaleString("en-US")})
                </span>
            )}
        </div>
    )
}