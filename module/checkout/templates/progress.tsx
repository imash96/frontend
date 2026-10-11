"use client"

import { memo } from "react"
import { AnimatePresence, MotionConfig } from "motion/react"
import { div as MotionDiv, span as MotionSpan } from "motion/react-client"
import { Check, CreditCard, MapPin, Truck, type LucideIcon } from "lucide-react"
import { useCheckoutStore } from "@/lib/store/checkout-store"
import type { StepType } from "@/types/common"
import Container from "@/ui/container"
import { STEP_INDEX } from "@/lib/store/checkout-steps"

const StepItem = memo(function StepItem({ step, status, connectorFilled, isLast, disabled, onSelect, }: StepItemProps) {
    const { id, name, subtitle, Icon } = step

    return (
        <li className={`flex items-start sm:items-center ${isLast ? "" : "flex-1"}`}>
            <button
                type="button"
                onClick={() => onSelect(id)}
                disabled={disabled}
                aria-current={status === "current" ? "step" : undefined}
                className={`flex flex-col items-center gap-1.5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 sm:flex-row sm:gap-0 ${BUTTON_CLASS[status]}`}
            >
                <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-xs font-medium transition-colors duration-300 sm:h-10 sm:w-10 sm:text-sm ${CIRCLE_CLASS[status]}`}
                >
                    {/* initial={false}: no check-mark animation for steps already done on page load */}
                    <AnimatePresence initial={false}>
                        {status === "complete" ? (
                            <MotionSpan
                                key="check"
                                className="flex"
                                initial={{ scale: 0, rotate: -90 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: "spring", stiffness: 500, damping: 25 }}
                            >
                                <Check aria-hidden="true" className="h-4 w-4 sm:h-5 sm:w-5" />
                            </MotionSpan>
                        ) : (
                            <Icon key="icon" aria-hidden="true" className="h-4 w-4 sm:h-5 sm:w-5" />
                        )}
                    </AnimatePresence>
                </span>

                {/* <span> not <p>: block elements are invalid inside <button>. */}
                <span className="text-center sm:ml-3 sm:text-left">
                    <span
                        className={`block text-[10px] font-semibold leading-tight transition-colors sm:text-sm ${TITLE_CLASS[status]}`}
                    >
                        {name}
                        <span className="sr-only">{SR_STATUS[status]}</span>
                    </span>
                    <span
                        className={`hidden text-xs leading-tight transition-colors sm:block ${SUBTITLE_CLASS[status]}`}
                    >
                        {subtitle}
                    </span>
                </span>
            </button>

            {!isLast && (
                <div
                    aria-hidden="true"
                    className="relative mx-2 mt-3.75 h-0.5 flex-1 overflow-hidden rounded-full bg-border sm:mx-4 sm:mt-0"
                >
                    <MotionDiv
                        className="absolute inset-0 origin-left rounded-full bg-primary"
                        initial={false}
                        animate={{ scaleX: connectorFilled ? 1 : 0 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                    />
                </div>
            )}
        </li>
    )
})

export default function CheckoutProgress() {
    // Individual selectors: this component only re-renders when one of these changes.
    const { currentStep, completedSteps, maxStepIndex, isPending, setStep } = useCheckoutStore();
    const currentIndex = STEP_INDEX[currentStep]

    return (
        <div className="border-b border-divider bg-surface/90 backdrop-blur-md">
            <Container as="nav" size="xl" className="flex items-center justify-center py-3">
                <MotionConfig reducedMotion="user">
                    <ol aria-label="Checkout steps" className="flex w-full max-w-md items-start sm:items-center">
                        {STEPS.map((step, index) => {
                            const stepIndex = STEP_INDEX[step.id]
                            // A tick only shows for confirmed steps behind the current one, so going back
                            // to a step clears its tick (and every later one) while keeping them clickable.
                            const status: StepStatus =
                                step.id === currentStep
                                    ? "current"
                                    : stepIndex < currentIndex && completedSteps.includes(step.id)
                                        ? "complete"
                                        : stepIndex <= maxStepIndex
                                            ? "reachable"
                                            : "upcoming"

                            return (
                                <StepItem
                                    key={step.id}
                                    step={step}
                                    status={status}
                                    connectorFilled={status === "complete"}
                                    isLast={index === STEPS.length - 1}
                                    // Locked steps are inert; while a request is in flight nothing is clickable.
                                    disabled={status === "upcoming" || isPending}
                                    onSelect={setStep}
                                />
                            )
                        })}
                    </ol>
                </MotionConfig>
            </Container>
        </div>
    )
}

type StepStatus = "complete" | "current" | "reachable" | "upcoming"

type StepConfig = {
    id: StepType
    name: string
    subtitle: string
    Icon: LucideIcon
}

const STEPS = [
    { id: "address", name: "Address", subtitle: "Shipping & billing", Icon: MapPin },
    { id: "shipping", name: "Shipping", subtitle: "Delivery method", Icon: Truck },
    { id: "payment", name: "Payment", subtitle: "Payment details", Icon: CreditCard },
] as const satisfies readonly StepConfig[]

// Static class maps (instead of nested template ternaries) keep Tailwind's scanner happy
// and make each state easy to read.
const BUTTON_CLASS = {
    complete: "cursor-pointer",
    current: "cursor-default",
    reachable: "cursor-pointer",
    upcoming: "cursor-not-allowed",
} as const satisfies Record<StepStatus, string>

const CIRCLE_CLASS = {
    complete: "border-success bg-success text-success-foreground shadow-sm",
    current: "border-accent text-accent ring-4 ring-accent/10",
    reachable: "border-foreground-tertiary/60 text-foreground-tertiary",
    upcoming: "border-foreground-tertiary/30 text-foreground-tertiary/50",
} as const satisfies Record<StepStatus, string>

const TITLE_CLASS = {
    complete: "text-primary",
    current: "text-accent",
    reachable: "text-foreground-tertiary",
    upcoming: "text-foreground-tertiary/50",
} as const satisfies Record<StepStatus, string>

const SUBTITLE_CLASS = {
    complete: "text-foreground-tertiary",
    current: "text-foreground",
    reachable: "text-foreground-tertiary",
    upcoming: "text-foreground-tertiary",
} as const satisfies Record<StepStatus, string>

const SR_STATUS = {
    complete: ", completed. Activate to edit",
    current: "",
    reachable: ", available. Activate to go to this step",
    upcoming: ", not available yet",
} as const satisfies Record<StepStatus, string>

type StepItemProps = {
    step: (typeof STEPS)[number]
    status: StepStatus
    /** The connector after this step fills once the step itself is completed. */
    connectorFilled: boolean
    isLast: boolean
    disabled: boolean
    onSelect: (step: StepType) => boolean
}