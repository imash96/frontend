import { Star } from "lucide-react";



export default function Rating({
    rating,
    size = "sm",
    className = "",
}: {
    rating: number;
    size?: "sm" | "md" | "lg";
    className?: string;
}) {
    const sizeMap = { sm: 13, md: 16, lg: 19 } as const;

    return (
        <div
            className={`flex items-center gap-0.5 ${className}`}
            aria-label={`${rating} out of 5 stars`}
        >
            {Array.from({ length: 5 }, (_, i) => (
                <Star
                    key={i}
                    size={sizeMap[size]}
                    className={i < rating ? "fill-rating-filled text-rating-filled" : "fill-rating-empty text-rating-empty"}
                />
            ))}
        </div>
    );
}