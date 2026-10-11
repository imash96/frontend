"use client"

import { Check, Edit3 } from "lucide-react"
import { AnimatePresence } from "motion/react"
import { div as Div } from "motion/react-client"
import { selectIsBusy, useCheckoutStore, useStepStatus } from "@/lib/store/checkout-store"
import type { StepType } from "@/types/common"

function Collapse({ id, children }: { id: string; children: React.ReactNode }) {
    return (
        <Div
            id={id}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ height: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
            className="overflow-hidden"
        >
            <div className="p-4 sm:p-6">{children}</div>
        </Div>
    )
}

export default function CheckoutStepHeader({ title, subtitle, number, stepId, children, completedContent, }: Props) {
    // Same status rules as the progress bar, so the tick and "Edit" can never disagree with it.
    const status = useStepStatus(stepId)
    const setStep = useCheckoutStore((s) => s.setStep)
    const isBusy = useCheckoutStore(selectIsBusy)

    const isOpen = status === "current"
    const isDone = status === "complete"
    const canOpen = isDone || status === "reachable"
    const hasBody = isOpen || (isDone && Boolean(completedContent))
    const panelId = `checkout-step-${stepId}-panel`

    return (
        <section
            aria-labelledby={`checkout-step-${stepId}`}
            className="overflow-hidden rounded-2xl border border-border bg-surface shadow-xs"
        >
            {/* The divider only exists when there is a body below it (collapsed cards had a double border). */}
            <div
                className={`flex items-center justify-between gap-3 bg-background-secondary/40 px-4 py-3 sm:px-6 sm:py-4 ${hasBody ? "border-b border-divider" : ""}`}
            >
                <div className="flex items-center gap-3">
                    <span
                        aria-hidden="true"
                        className={`flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${isDone ? "bg-success text-success-foreground" : "bg-primary text-primary-foreground"}`}
                    >
                        {isDone ? <Check className="size-4" strokeWidth={2.5} /> : number}
                    </span>
                    <div>
                        <h2
                            id={`checkout-step-${stepId}`}
                            className="font-heading text-base font-semibold text-foreground sm:text-lg"
                        >
                            {title}
                        </h2>
                        <p className="text-xs text-foreground-tertiary sm:text-sm">{subtitle}</p>
                    </div>
                </div>

                {canOpen && (
                    <button
                        type="button"
                        onClick={() => setStep(stepId)}
                        disabled={isBusy}
                        aria-controls={panelId}
                        aria-label={`${isDone ? "Edit" : "Go to"} ${title}`}
                        className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <Edit3 className="size-3.5" aria-hidden="true" />
                        {isDone ? "Edit" : "Open"}
                    </button>
                )}
            </div>

            <AnimatePresence initial={false} mode="wait">
                {isOpen ? (
                    <Collapse key="open" id={panelId}>
                        {children}
                    </Collapse>
                ) : isDone && completedContent ? (
                    <Collapse key="summary" id={panelId}>
                        {completedContent}
                    </Collapse>
                ) : null}
            </AnimatePresence>
        </section>
    )
}

type Props = {
    title: string
    subtitle: string
    number: number
    stepId: StepType
    children?: React.ReactNode
    completedContent?: React.ReactNode
}