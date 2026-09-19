"use client";

import type { CustomerReview } from "@/lib/action/review";
import { deleteReview } from "@/lib/action/review";
import { Edit, Star, Trash2, LoaderCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useTransition } from "react";
import { AlertModal } from "@/ui/alert-modal";
import ReviewModal from "./review-modal";

export default function ReviewCard({ review }: { review: CustomerReview }) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, startTransition] = useTransition();

  const date = new Date(review.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const rating = review.rating;

  return (
    <>
      <div className="border border-border rounded-lg bg-background-elevated p-4 sm:p-5 transition-shadow hover:shadow-md group">
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
              className="flex items-center gap-0.5 mt-1"
              aria-label={`${rating} out of 5 stars`}
            >
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  size={14}
                  className={`shrink-0 ${
                    i <= rating
                      ? "fill-rating-filled text-rating-filled"
                      : "fill-rating-empty text-rating-empty"
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-1">{date}</p>
          </div>

          {/* Actions */}
          <div className="flex gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
            <ReviewModal
              productId={review.product_id}
              productTitle={review.product?.title ?? "Product"}
              productThumbnail={review.product?.thumbnail}
              existingReview={review}
            >
              <button
                aria-label="Edit review"
                className="p-2 text-foreground-muted hover:text-warning-foreground hover:bg-warning/20 rounded-md transition"
              >
                <Edit size={14} />
              </button>
            </ReviewModal>
            <button
              aria-label="Delete review"
              className="p-2 text-foreground-muted hover:text-destructive hover:bg-destructive/20 rounded-md transition"
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
            setShowDeleteConfirm(false);
          });
        }}
      />
    </>
  );
}
