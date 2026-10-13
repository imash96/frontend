"use client";

import { AnimatePresence, motion, MotionConfig, Transition, useReducedMotion } from "motion/react";
import { AlertCircle, ChevronDown, Loader2, Tag, X } from "lucide-react";
import { useActionState, useEffect, useRef } from "react";
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
    status: "idle" | "success" | "error";
    message?: string;
    code?: string;
};

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
            code
        };
    } catch (error) {
        return {
            status: "error",
            message: getErrorMessage(error, "Unable to apply this promo code."),
            code
        };
    }
}

export async function removeDiscountAction(): Promise<DiscountActionState> {
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
function ApplyButton() {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            aria-busy={pending}
            className="inline-flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-lg bg-accent px-4 text-sm font-semibold text-accent-foreground shadow-sm transition-all duration-150 hover:bg-accent-hover hover:shadow-md active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100"
        >
            {pending ? <Loader2 className="size-3.5 animate-spin" aria-hidden="true" /> : null}
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
    const appliedCode = promotions.map((promotion) => promotion.code).find((value): value is string => typeof value === "string" && value.length > 0);

    return (
        <MotionConfig reducedMotion="user">
            {/* grid, not block: stops the -m-1.5 on Collapse from collapsing margins through this box. */}
            <div className="grid w-full grid-cols-1">
                {/* Default "sync" mode on purpose: the outgoing state collapses while the incoming one
                    grows, so total height eases between the two instead of waiting, then jumping. */}
                <AnimatePresence initial={false}>
                    {appliedCode ? (
                        <Collapse key="applied">
                            <AppliedPromo appliedCode={appliedCode} />
                        </Collapse>
                    ) : (
                        <Collapse key="entry">
                            <PromoEntry />
                        </Collapse>
                    )}
                </AnimatePresence>

                {/* Persistent live region: a freshly mounted chip wouldn't be announced on its own. */}
                <p role="status" className="sr-only">
                    {appliedCode ? `Promo code ${appliedCode} applied.` : ""}
                </p>
            </div>
        </MotionConfig>

    );
}


function Collapse({ children, id }: { children: React.ReactNode; id?: string }) {
    const reduceMotion = useReducedMotion();

    return (
        <motion.div
            id={id}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1, transition: reduceMotion ? INSTANT : ENTER }}
            exit={{ height: 0, opacity: 0, transition: reduceMotion ? INSTANT : EXIT }}
            className="-m-1.5 overflow-clip p-1.5"
        >
            {children}
        </motion.div>
    );
}

function AppliedPromo({ appliedCode }: { appliedCode: string }) {

    const [removeState, removeFormAction] = useActionState(removeDiscountAction, initialDiscountActionState);
    return (
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
    )
}

function PromoEntry() {
    const [applyState, applyFormAction] = useActionState(applyDiscountAction, initialDiscountActionState);
    const inputRef = useRef<HTMLInputElement>(null);

    // Clear the input on successful apply
    useEffect(() => {
        if (applyState.status === "success" && inputRef.current) {
            inputRef.current.value = "";
        }
    }, [applyState]);

    const hasError = applyState.status === "error" && !!applyState.message;

    return (
        <details className="group/promo">
            <summary className="flex w-fit cursor-pointer list-none items-center gap-1.5 text-sm font-medium text-text-accent transition-colors hover:text-accent [&::-webkit-details-marker]:hidden">
                <Tag className="size-3.5" aria-hidden />
                {"Have a promo code?"}
                <ChevronDown className="size-3.5 transition-transform duration-300 group-open/promo:rotate-180" aria-hidden />
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
                    <form action={applyFormAction} className="flex gap-2 pt-3">
                        <input
                            ref={inputRef}
                            name="code"
                            type="text"
                            placeholder="Enter promo code"
                            autoComplete="off"
                            autoCapitalize="characters"
                            spellCheck={false}
                            aria-invalid={hasError}
                            aria-describedby={hasError ? "discount-error" : undefined}
                            className={`h-10 min-w-0 flex-1 rounded-lg border bg-input-background px-3.5 text-sm text-input-text outline-none transition-colors placeholder:text-input-placeholder focus:ring-2 ${hasError ? "border-destructive focus:border-destructive focus:ring-destructive/20" : "border-input-border focus:border-input-border-focus focus:ring-accent/20"}`}
                        />

                        <ApplyButton />
                    </form>

                    {/* Error message below the input */}
                    <AnimatePresence mode="wait" initial={false}>
                        {hasError && (
                            <motion.p
                                id="discount-error"
                                key={`error-${applyState.message}`}
                                initial={{ opacity: 0, height: 0, y: -4 }}
                                animate={{ opacity: 1, height: "auto", y: 0 }}
                                exit={{ opacity: 0, height: 0, y: -4 }}
                                transition={{
                                    height: { type: "spring", stiffness: 320, damping: 32 },
                                    opacity: { duration: 0.18 },
                                }}
                                role="alert"
                                aria-live="polite"
                                className="flex items-center gap-1.5 overflow-hidden pt-2 text-xs text-destructive"
                            >
                                <AlertCircle className="size-3.5 shrink-0" aria-hidden />
                                {applyState.message}
                            </motion.p>
                        )}
                    </AnimatePresence>
                </motion.div>
            </motion.div>
        </details>
    )
}

const EASE_OUT_QUART = [0.25, 1, 0.5, 1] as const


const INSTANT: Transition = { duration: 0 };

const ENTER: Transition = {
    height: { duration: 0.32, ease: EASE_OUT_QUART },
    // Held back a beat so content never shows through a still-tiny box.
    opacity: { duration: 0.24, delay: 0.06, ease: "easeOut" },
};

const EXIT: Transition = {
    height: { duration: 0.28, ease: EASE_OUT_QUART },
    opacity: { duration: 0.14, ease: "easeIn" },
};