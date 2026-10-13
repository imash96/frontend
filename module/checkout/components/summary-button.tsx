"use client";

import { ChevronDown, ShoppingBag } from "lucide-react";
import { useState } from "react";

/**
 * Summary accordion wrapper:
 * - Mobile: collapsible with a step-header–styled trigger (rounded card, icon badge, subtitle)
 * - Desktop (lg+): always expanded, no toggle, clean card look
 */
export default function SummaryAccordion({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="overflow-hidden rounded-2xl border border-border/60 bg-linear-to-br from-card to-background-secondary shadow-md">
            {/* ── Trigger: step-header look on mobile, static heading on desktop ── */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex w-full items-center justify-between gap-3 text-left transition-colors bg-background-secondary/40 px-4 py-3 lg:pointer-events-none lg:bg-transparent lg:border-b lg:border-border/60 lg:px-6 lg:py-4 ${isOpen ? "border-b border-divider" : ""}`}
                aria-expanded={isOpen}
            >
                <div className="flex items-center gap-3">
                    {/* Badge – only on mobile */}
                    <span
                        aria-hidden="true"
                        className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-semibold lg:hidden"
                    >
                        <ShoppingBag className="size-3.5" strokeWidth={2.5} />
                    </span>

                    <div>
                        <h2 className="font-heading text-base font-semibold text-foreground sm:text-lg">
                            {title}
                        </h2>
                        <p className="text-xs text-foreground-tertiary sm:text-sm lg:hidden">
                            Review your items & total
                        </p>
                    </div>
                </div>

                <ChevronDown
                    className={`size-4 text-foreground-tertiary transition-transform duration-200 lg:hidden ${isOpen ? "rotate-180" : ""}`}
                    strokeWidth={1.5}
                />
            </button>

            <div
                className={`transition-all duration-300 ease-in-out lg:max-h-none lg:opacity-100 ${isOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0 overflow-hidden"}`}
            >
                {children}
            </div>
        </div>
    );
}