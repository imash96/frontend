"use client";

import type { StoreCartPromotion } from "@medusajs/types";
import { Loader2, Tag, X } from "lucide-react";
import { useActionState, useEffect, useState, useTransition } from "react";
import { applyPromotions } from "@/lib/action/cart";
import type { FormState } from "@/types/common";
import Button from "@/ui/button";
import CustomInput from "@/ui/input";

const handlePromoCode = async (
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> => {
  const code = formData.get("code")?.toString().trim();

  if (!code) {
    return { success: false, error: "Enter a discount code.", message: undefined };
  }

  try {
    await applyPromotions([code]);
    return { success: true, error: null, message: code };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to apply promotion code.",
      message: undefined,
    };
  }
};

export default function DiscountCode({ promotions, }: { promotions: StoreCartPromotion[]; }) {
  const [appliedCode, setAppliedCode] = useState<string | undefined>(promotions[0]?.code);

  const initialState: FormState = { success: false, error: null, message: undefined };
  const [state, formAction, isPending] = useActionState(handlePromoCode, initialState);
  const [isRemoving, startTransition] = useTransition();

  useEffect(() => {
    if (state.success && state.message) setAppliedCode(state.message);
  }, [state]);

  const removePromotionCode = (code: string) => {
    const remainingPromotions = promotions.filter((p) => p.code !== code);
    startTransition(() =>
      applyPromotions(remainingPromotions.map((p) => p.code!).filter(Boolean)).then(() =>
        setAppliedCode(undefined),
      ),
    );
  };

  if (appliedCode) {
    return (
      <div className="flex items-center justify-between gap-3 rounded-lg border border-success bg-success-subtle px-4 py-3">
        <div className="min-w-0">
          <p className="text-xs text-text-secondary">Promo code applied</p>
          <p className="flex items-center gap-1.5 truncate font-semibold text-success">
            <Tag className="h-4 w-4 shrink-0" />
            {appliedCode}
          </p>
        </div>
        <button
          type="button"
          onClick={() => removePromotionCode(appliedCode)}
          disabled={isRemoving}
          className="flex shrink-0 items-center gap-1.5 text-xs font-medium text-text-secondary transition-colors hover:text-destructive disabled:pointer-events-none disabled:opacity-50"
        >
          {isRemoving ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
          Remove
        </button>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-sm font-semibold text-text-primary">Have a discount code?</h3>
      <form action={formAction} className="mt-2 flex items-start gap-2">
        <div className="grow">
          <CustomInput
            type="text"
            name="code"
            label="Enter code"
            disabled={isPending}
            error={state.error ?? undefined}
          />
        </div>
        <Button type="submit" disabled={isPending} variant="outline" className="h-11 min-w-20 shrink-0">
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Apply"}
        </Button>
      </form>
    </div>
  );
}