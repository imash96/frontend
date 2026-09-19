"use client";

import { Star } from "lucide-react";
import { useCallback, useState } from "react";

interface StarRatingInputProps {
  name?: string;
  defaultValue?: number;
  onChange?: (rating: number) => void;
  size?: "sm" | "md" | "lg";
}

const sizeMap = { sm: 18, md: 24, lg: 30 } as const;

export default function StarRatingInput({
  name = "rating",
  defaultValue = 0,
  onChange,
  size = "md",
}: StarRatingInputProps) {
  const [rating, setRating] = useState(defaultValue);
  const [hover, setHover] = useState(0);

  const handleSelect = useCallback(
    (value: number) => {
      setRating(value);
      onChange?.(value);
    },
    [onChange],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowUp") {
        e.preventDefault();
        const next = Math.min(5, rating + 1);
        handleSelect(next);
      } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
        e.preventDefault();
        const prev = Math.max(1, rating - 1);
        handleSelect(prev);
      }
    },
    [rating, handleSelect],
  );

  const starSize = sizeMap[size];
  const displayRating = hover || rating;

  return (
    <div
      role="radiogroup"
      aria-label="Rating"
      className="inline-flex items-center gap-0.5"
      onKeyDown={handleKeyDown}
    >
      <input type="hidden" name={name} value={rating} />
      {[1, 2, 3, 4, 5].map((value) => {
        const isFilled = value <= displayRating;
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={value === rating}
            aria-label={`${value} star${value > 1 ? "s" : ""}`}
            tabIndex={value === rating || (rating === 0 && value === 1) ? 0 : -1}
            className={`
              p-0.5 rounded transition-all duration-150 cursor-pointer
              hover:scale-110 active:scale-95
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rating-filled focus-visible:ring-offset-1
            `}
            onClick={() => handleSelect(value)}
            onMouseEnter={() => setHover(value)}
            onMouseLeave={() => setHover(0)}
          >
            <Star
              size={starSize}
              className={`shrink-0 transition-colors duration-150 ${
                isFilled
                  ? "fill-rating-filled text-rating-filled"
                  : "fill-transparent text-rating-empty"
              }`}
            />
          </button>
        );
      })}
      {rating > 0 && (
        <span className="ml-2 text-sm text-muted-foreground tabular-nums">
          {rating}/5
        </span>
      )}
    </div>
  );
}
