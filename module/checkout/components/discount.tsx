"use client";

import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, Loader2, Tag, X } from "lucide-react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { StoreCartPromotion } from "@medusajs/types";
import { applyDiscount, removeDiscount } from "@/lib/action/checkout";

type DiscountCodeProps = {
    promotions: StoreCartPromotion[];
};

const initialDiscountActionState: DiscountActionState = {
    status: "idle",
};

type DiscountActionState = {
    status: DiscountActionStatus;
    message?: string;
};

type DiscountActionStatus = "idle" | "success" | "error";

const getErrorMessage = (error: unknown, fallback: string) => error instanceof Error ? error.message : fallback;

const SPRING = { type: "spring", stiffness: 380, damping: 30 } as const;

export async function applyDiscountAction(_prevState: DiscountActionState, formData: FormData,): Promise<DiscountActionState> {
    const code = formData.get("code")?.toString().trim().toUpperCase();

    if (!code) {
        return { status: "error", message: "Enter a promo code." };
    }

    try {
        await applyDiscount(code);

        return {
            status: "success",
            message: `Promo code applied`,
        };
    } catch (error) {
        return {
            status: "error",
            message: getErrorMessage(error, "Unable to apply this promo code."),
        };
    }
}

export async function removeDiscountAction(_prevState: DiscountActionState, formData: FormData,): Promise<DiscountActionState> {
    const code = formData.get("code")?.toString();

    if (!code) {
        return { status: "error", message: "Missing promo code." };
    }

    try {
        await removeDiscount();
        return { status: "idle" };
    } catch (error) {
        return {
            status: "error",
            message: getErrorMessage(error, "Unable to remove this promo code."),
        };
    }
}

/** Reads pending state from its enclosing <form> — no extra useState needed. */
function ApplySubmitButton() {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            className="inline-flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-lg bg-accent px-4 text-sm font-semibold text-accent-foreground shadow-sm transition-all duration-150 hover:bg-accent-hover hover:shadow-md active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100"
        >
            {pending ? <Loader2 className="size-3.5 animate-spin" /> : null}
            Apply
        </button>
    );
}

/** Same trick for the remove action: status comes from the wrapping <form>. */
function RemoveSubmitButton({ code }: { code: string }) {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            aria-label={`Remove promo code ${code}`}
            className="inline-flex size-6 shrink-0 items-center justify-center rounded-full text-accent-foreground/70 transition-colors hover:bg-black/10 hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 disabled:cursor-not-allowed disabled:opacity-60"
        >
            {pending ? <Loader2 className="size-3.5 animate-spin" /> : <X className="size-3.5" />}
        </button>
    );
}

export default function DiscountCode({ promotions }: DiscountCodeProps) {
    // Only one useState in the whole tree: purely presentational (disclosure).
    const [applyState, applyFormAction] = useActionState(applyDiscountAction, initialDiscountActionState);
    const [removeState, removeFormAction] = useActionState(removeDiscountAction, initialDiscountActionState);

    // Only one promo code is supported. If a cart somehow carries more than
    // one, the first one wins and the rest are not surfaced here.
    const appliedCode = promotions.map((promotion) => promotion.code).find((value): value is string => typeof value === "string" && value.length > 0);

    const hasAppliedCode = appliedCode !== undefined;
    const feedback = applyState.status !== "idle" ? applyState : removeState.status !== "idle" ? removeState : null;

    return (
        <div className="w-full max-w-md">
            <AnimatePresence mode="wait" initial={false}>
                {hasAppliedCode ? (
                    <motion.div
                        key="applied-code"
                        initial={{ opacity: 0, y: -6, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -6, scale: 0.98 }}
                        transition={SPRING}
                        className="flex items-center justify-between gap-3 rounded-xl border border-accent/25 bg-accent/10 px-3.5 py-2.5 sm:px-4 sm:py-3"
                    >
                        <div className="flex min-w-0 items-center gap-2.5">
                            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-accent text-success-foreground">
                                <Tag className="size-3.5" strokeWidth={2.5} />
                            </span>
                            <div className="min-w-0">
                                <p className="text-2xs font-medium uppercase tracking-wider text-foreground-tertiary">
                                    Promo applied
                                </p>
                                <p className="truncate text-sm font-semibold text-foreground">{appliedCode}</p>
                            </div>
                        </div>

                        <form action={removeFormAction} className="shrink-0">
                            <input type="hidden" name="code" value={appliedCode} />
                            <RemoveSubmitButton code={appliedCode} />
                        </form>
                    </motion.div>
                ) : (
                    <details className="group/promo">
                        <summary className="flex w-fit cursor-pointer list-none items-center gap-1.5 text-sm font-medium text-text-accent transition-colors hover:text-accent [&::-webkit-details-marker]:hidden">
                            <Tag className="size-3.5" aria-hidden />
                            {"Have a promo code?"}
                            <ChevronDown
                                className="size-3.5 transition-transform duration-300 group-open/promo:rotate-180"
                                aria-hidden
                            />
                        </summary>
                        <motion.div
                            key="promo-entry"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.18 }}
                        >
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{
                                    height: { type: "spring", stiffness: 320, damping: 32 },
                                    opacity: { duration: 0.18 },
                                }}
                                className="overflow-hidden"
                            >
                                <form action={applyFormAction} className="flex gap-2">
                                    <input
                                        name="code"
                                        type="text"
                                        placeholder="Enter promo code"
                                        autoComplete="off"
                                        autoCapitalize="characters"
                                        spellCheck={false}
                                        className="h-10 min-w-0 flex-1 rounded-lg border border-input-border bg-input-background px-3.5 text-sm text-input-text outline-none transition-colors placeholder:text-input-placeholder focus:border-input-border-focus focus:ring-2 focus:ring-accent/20"
                                    />

                                    <ApplySubmitButton />
                                </form>
                            </motion.div>
                        </motion.div>
                    </details>
                )}
            </AnimatePresence>

            <AnimatePresence mode="wait" initial={false}>
                {feedback?.message && feedback.status === "error" && (
                    <motion.p
                        key={`${feedback.status}-${feedback.message}`}
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.18 }}
                        role={"alert"}
                        aria-live="polite"
                        className="mt-2 text-xs text-destructive"
                    >
                        {feedback.message}
                    </motion.p>
                )}
            </AnimatePresence>
        </div>
    );
}