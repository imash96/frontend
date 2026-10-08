"use client"

import { Check, CreditCard, MapPin, Truck } from "lucide-react";
import { useCheckoutCompleted, useCheckoutStep, useCheckoutSetStep } from "@/lib/store/checkout-store";
import { span as Span } from "motion/react-client";
import type { StepType } from "@/types/common";

export default function CheckoutProgress() {
    const currentStep = useCheckoutStep()
    const completedSteps = useCheckoutCompleted()
    const setStep = useCheckoutSetStep()
    const currentIndex = steps.findIndex((step) => step.id === currentStep)

    return (
        <nav aria-label="Checkout progress" className="w-full mb-8">
            <ol className="flex w-full items-start">
                {steps.map((step, index) => {
                    const isCompleted = completedSteps.includes(step.id)
                    const isCurrent = step.id === currentStep
                    const isClickable = !isCurrent && (isCompleted || index < currentIndex)

                    const content = (
                        <>
                            <span
                                className={[
                                    "flex size-9 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300 sm:size-10",
                                    isCompleted &&
                                    "border-primary bg-primary text-primary-foreground shadow-sm",
                                    isCurrent &&
                                    !isCompleted &&
                                    "border-accent text-accent ring-4 ring-accent/10",
                                    !isCompleted &&
                                    !isCurrent &&
                                    "border-foreground-muted/30 text-foreground-muted/50",
                                ]
                                    .filter(Boolean)
                                    .join(" ")}
                            >
                                <Span
                                    key={isCompleted ? "completed" : "pending"}
                                    initial={isCompleted ? { opacity: 0, scale: 0.5, rotate: -90, } : false}
                                    animate={{
                                        opacity: 1,
                                        scale: 1,
                                        rotate: 0,
                                    }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 500,
                                        damping: 24,
                                    }}
                                >
                                    {isCompleted ? (
                                        <Check className="size-4 sm:size-5" />
                                    ) : (
                                        <step.Icon className="size-4 sm:size-5" />
                                    )}
                                </Span>
                            </span>

                            <span className="min-w-0 text-center sm:ml-3 sm:text-left">
                                <span
                                    className={[
                                        "block text-[11px] font-semibold leading-tight transition-colors sm:text-sm",
                                        isCurrent &&
                                        "text-accent",
                                        isCompleted &&
                                        !isCurrent &&
                                        "text-primary",
                                        !isCompleted &&
                                        !isCurrent &&
                                        "text-foreground-muted/50",
                                    ]
                                        .filter(Boolean)
                                        .join(" ")}
                                >
                                    {step.name}
                                </span>

                                <span
                                    className={[
                                        "mt-0.5 hidden text-xs leading-tight transition-colors sm:block",
                                        isCurrent &&
                                        "text-foreground",
                                        isCompleted &&
                                        !isCurrent &&
                                        "text-foreground-muted",
                                        !isCompleted &&
                                        !isCurrent &&
                                        "text-foreground-disabled",
                                    ]
                                        .filter(Boolean)
                                        .join(" ")}
                                >
                                    {step.subtitle}
                                </span>
                            </span>
                        </>
                    )

                    return (
                        <li
                            key={step.id}
                            className="flex min-w-0 flex-1 items-center last:flex-none"
                        >
                            {isClickable ? (
                                <button
                                    type="button"
                                    onClick={() => setStep(step.id)}
                                    aria-label={`${step.name} step, completed`}
                                    className="group flex min-w-0 items-center gap-1.5 rounded-lg text-left outline-none sm:gap-0"
                                >
                                    {content}
                                </button>
                            ) : (
                                <div
                                    aria-current={isCurrent ? "step" : undefined}
                                    aria-disabled={!isCurrent ? true : undefined}
                                    aria-label={`${step.name} step${isCurrent ? ", current" : isCompleted ? ", completed" : ""}`}
                                    className={[
                                        "flex min-w-0 items-center gap-1.5 sm:gap-0",
                                        !isCurrent && !isCompleted && "cursor-not-allowed",
                                    ].filter(Boolean).join(" ")}
                                >
                                    {content}
                                </div>
                            )}

                            {index < steps.length - 1 && (
                                <div
                                    aria-hidden="true"
                                    className="mx-2 h-0.5 min-w-3 flex-1 overflow-hidden rounded-full bg-border sm:mx-4"
                                >
                                    <Span
                                        className="block h-full origin-left rounded-full bg-primary"
                                        initial={false}
                                        animate={{ scaleX: isCompleted ? 1 : 0 }}
                                        transition={{ duration: 0.4, ease: "easeOut" }}
                                    />
                                </div>
                            )}
                        </li>
                    )
                })}
            </ol>
        </nav>
    );
}

const steps = [
    {
        id: "address",
        name: "Address",
        subtitle: "Shipping & billing",
        Icon: MapPin,
    },
    {
        id: "shipping",
        name: "Shipping",
        subtitle: "Delivery method",
        Icon: Truck,
    },
    {
        id: "payment",
        name: "Payment",
        subtitle: "Payment details",
        Icon: CreditCard,
    },
] as const satisfies readonly StepsType[]

type StepsType = {
    id: StepType
    name: string
    subtitle: string
    Icon: typeof MapPin
}