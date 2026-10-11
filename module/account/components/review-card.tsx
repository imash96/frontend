"use client";

import { LoaderCircle, Star, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useTransition } from "react";
import type { CustomerReview } from "@/lib/action/review";
import { deleteReview } from "@/lib/action/review";
import { AlertModal } from "@/ui/alert-modal";

export default function ReviewCard({ review }: { review: CustomerReview }) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, startTransition] = useTransition();
  const [isDeleted, setIsDeleted] = useState(false);

  const date = new Date(review.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });

  const rating = review.rating;

  if (isDeleted) return null;

  return (
    <>
      <div className="border border-border rounded-lg bg-surface-elevated p-4 sm:p-5 transition-shadow hover:shadow-md group">
        {/* Product Info */}
        <div className="flex items-start gap-3 mb-3">
          {review.product?.thumbnail && (
            <Link
              href={`/products/${review.product.handle}`}
              className="w-14 h-16 rounded-md overflow-hidden bg-muted shrink-0"
            >
              <Image
                src={review.product.thumbnail}
                alt={review.product?.title ?? ""}
                width={56}
                height={64}
                className="w-full h-full object-cover"
              />
            </Link>
          )}
          <div className="flex-1 min-w-0">
            {review.product && (
              <Link
                href={`/products/${review.product.handle}`}
                className="text-sm font-medium text-link hover:underline underline-offset-2 line-clamp-1"
              >
                {review.product.title}
              </Link>
            )}
            {/* Stars */}
            <div
              role="img"
              className="flex items-center gap-0.5 mt-1"
              aria-label={`${rating} out of 5 stars`}
            >
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  size={14}
                  className={`shrink-0 ${i <= rating
                    ? "fill-rating-filled text-rating-filled"
                    : "fill-rating-empty text-rating-empty"
                    }`}
                />
              ))}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-xs text-muted-foreground">{date}</p>
              {review.status === "pending" && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-warning/10 text-warning border border-warning/20">
                  Pending
                </span>
              )}
              {review.verified && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-success/10 text-success border border-success/20">
                  Verified
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              aria-label="Delete review"
              className="p-2 text-foreground-tertiary hover:text-destructive hover:bg-destructive/20 rounded-md transition"
              onClick={() => setShowDeleteConfirm(true)}
            >
              {isDeleting ? (
                <LoaderCircle size={14} className="animate-spin" />
              ) : (
                <Trash2 size={14} />
              )}
            </button>
          </div>
        </div>

        {/* Review Content */}
        {review.title && (
          <h4 className="text-sm font-semibold mb-1">{review.title}</h4>
        )}
        {review.content && (
          <p className="text-sm text-foreground-secondary leading-relaxed line-clamp-3">
            {review.content}
          </p>
        )}

        {/* Admin Response */}
        {review.response && (
          <div className="mt-3 pl-3 border-l-2 border-accent/30">
            <p className="text-xs font-medium text-accent mb-0.5">Store Response</p>
            <p className="text-sm text-foreground-secondary">{review.response.content}</p>
          </div>
        )}
      </div>

      <AlertModal
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        variant="danger"
        title="Delete Review"
        description="Are you sure you want to delete this review? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        isLoading={isDeleting}
        onConfirm={() => {
          startTransition(async () => {
            await deleteReview(review.id);
            setIsDeleted(true);
            setShowDeleteConfirm(false);
          });
        }}
      />
    </>
  );
}
