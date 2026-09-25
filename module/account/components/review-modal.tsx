"use client";

import Image from "next/image";
import { useActionState, useEffect, useState } from "react";
import type { CustomerReview, ReviewFormState } from "@/lib/action/review";
import { submitReview, updateReview } from "@/lib/action/review";
import Button from "@/ui/button";
import Input from "@/ui/input";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/ui/modal";
import StarRatingInput from "./star-rating-input";

interface ReviewModalProps {
  productId: string;
  productTitle: string;
  productThumbnail?: string | null;
  existingReview?: CustomerReview;
  children: React.ReactNode;
}

export default function ReviewModal({
  productId,
  productTitle,
  productThumbnail,
  existingReview,
  children,
}: ReviewModalProps) {
  const [open, setOpen] = useState(false);
  const isEdit = Boolean(existingReview);

  const action = isEdit
    ? updateReview.bind(null, existingReview!.id)
    : submitReview;

  const [state, formAction, isPending] = useActionState(action, {
    success: false,
    error: null,
  } as ReviewFormState);

  const [charCount, setCharCount] = useState(
    existingReview?.content?.length ?? 0,
  );

  useEffect(() => {
    if (state.success) {
      setTimeout(() => setOpen(false), 500);
    }
  }, [state.success]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent size="md">
        <DialogHeader>
          <div className="flex items-center gap-3 flex-1">
            {productThumbnail && (
              <div className="w-12 h-14 rounded-md overflow-hidden bg-muted shrink-0">
                <Image
                  src={productThumbnail}
                  alt={productTitle}
                  width={48}
                  height={56}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="space-y-1 min-w-0">
              <DialogTitle>
                {isEdit ? "Edit Review" : "Write a Review"}
              </DialogTitle>
              <DialogDescription className="truncate">
                {productTitle}
              </DialogDescription>
            </div>
          </div>
          <DialogClose />
        </DialogHeader>

        <form action={formAction} className="p-4 sm:p-6 space-y-5">
          <input type="hidden" name="product_id" value={productId} />

          {/* Star Rating */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Your Rating <span className="text-destructive">*</span>
            </label>
            <StarRatingInput
              name="rating"
              defaultValue={existingReview?.rating ?? 0}
              size="lg"
            />
          </div>

          {/* Title */}
          <Input
            name="title"
            label="Summarize your experience"
            defaultValue={existingReview?.title ?? ""}
          />

          {/* Body */}
          <div className="space-y-1.5">
            <label
              htmlFor="review-content"
              className="text-sm font-medium text-foreground"
            >
              Your Review
            </label>
            <textarea
              id="review-content"
              name="content"
              rows={4}
              minLength={20}
              maxLength={1000}
              defaultValue={existingReview?.content ?? ""}
              onChange={(e) => setCharCount(e.target.value.length)}
              placeholder="Tell others about your experience with this product (minimum 20 characters)"
              className="w-full rounded-md border border-input-border bg-input-background px-3 py-2.5 text-sm text-input-text placeholder:text-input-placeholder focus:outline-none focus:ring-2 focus:ring-input-border-focus focus:border-input-border-focus transition-colors resize-y min-h-25"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{charCount < 20 ? `${20 - charCount} more characters needed` : ""}</span>
              <span className="tabular-nums">{charCount}/1000</span>
            </div>
          </div>

          {/* Error Message */}
          {state.error && (
            <p className="text-destructive text-sm animate-fade-in-up" role="alert">
              {state.error}
            </p>
          )}

          {/* Success Message */}
          {state.success && (
            <p className="text-success text-sm animate-fade-in-up" role="status">
              Review {isEdit ? "updated" : "submitted"} successfully!
            </p>
          )}

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-2">
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isPending}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" variant="secondary" isLoading={isPending}>
              {isEdit ? "Update Review" : "Submit Review"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
