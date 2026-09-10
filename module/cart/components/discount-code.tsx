"use client";

import type { StoreCartPromotion } from "@medusajs/types";
import { Loader, Tag, X } from "lucide-react";
import { useActionState, useEffect, useState, useTransition } from "react";
import { applyPromotions } from "@/lib/action/cart";
import Button from "@/ui/button";
import CustomInput from "@/ui/input";
import type { FormState } from "@/types/common";

const handlePromoCode = async (
  prevState: FormState,
  formData: FormData,
): Promise<FormState> => {
  const code = formData.get("code")?.toString().trim();

  if (!code) {
    return {
      success: false,
      error: "Coupon code cannot be empty.",
    };
  }

  try {
    await applyPromotions([code]);

    return {
      success: true,
      error: null,
      message: code,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to apply promotion code.",
    };
  }
};

export default function DiscountCode({
  promotions,
}: {
  promotions: StoreCartPromotion[];
}) {
  const [appliedCode, setAppliedCode] = useState<string | undefined>(
    promotions[0]?.code,
  );

  const initialState: FormState = {
    success: false,
    error: null,
    message: undefined,
  };

  const [state, formAction, isPending] = useActionState(handlePromoCode, initialState as FormState);
  const [isRemoving, startTransition] = useTransition();

  useEffect(() => {
    if (state.success && state.message) setAppliedCode(state.message);
  }, [state]);

  const removePromotionCode = (code: string) => {
    const remainingPromotions = promotions.filter((p) => p.code !== code);
    startTransition(() =>
      applyPromotions(
        remainingPromotions.map((p) => p.code!).filter(Boolean),
      ).then(() => setAppliedCode(undefined)),
    );
  };

  // ✅ Show applied coupon
  if (appliedCode) {
    return (
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm">Promo Code Applied:</p>
          <p className="font-semibold text-badge-sale flex items-center gap-2">
            <Tag className="w-5 h-5" />
            {appliedCode}
          </p>
        </div>
        <button
          onClick={() => removePromotionCode(appliedCode)}
          className="text-sm font-medium text-destructive hover:text-destructive/80 flex items-center gap-1"
        >
          {isRemoving ? (
            <Loader className="w-4 h-4 animate-spin" />
          ) : (
            <X className="w-4 h-4" />
          )}
          Remove
        </button>
      </div>
    );
  }

  // ✅ Show coupon input form
  return (
    <div className="">
      <h3 className="font-semibold">Apply Discount Code</h3>
      <p className="text-sm text-foreground-muted mt-1">
        Enter your coupon below to save instantly.
      </p>

      <form action={formAction} className="flex items-start gap-2 w-full mt-3">
        <div className="grow">
          <CustomInput
            type="text"
            name="code"
            label="Enter Discount code"
            disabled={isPending}
            helperText={state.error ?? undefined}
            error={state.error ? "error" : "default"}
          />
        </div>
        <Button type="submit" disabled={isPending} className="h-11 w-18">
          {isPending ? <Loader className="w-5 h-5 animate-spin" /> : "Apply"}
        </Button>
      </form>
    </div>
  );
}
