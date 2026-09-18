"use client"

import { Check, CreditCard, MapPin, Truck } from "lucide-react"
import { motion } from "motion/react"
import { useCheckStore } from "@/lib/store/check-store"
import type { StepType } from "@/types/common"

const steps: {
  id: StepType
  name: string
  subtitle: string
  Icon: typeof MapPin
}[] = [
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
]

export default function CheckProgress() {
  const currentStep = useCheckStore((s) => s.currentStep)
  const completedSteps = useCheckStore((s) => s.completedSteps)
  const setStep = useCheckStore((s) => s.setStep)
  const currentIndex = steps.findIndex((s) => s.id === currentStep)

  return (
    <nav aria-label="Checkout progress" className="w-full">
      <ol className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.has(step.id)
          const isCurrent = index === currentIndex
          const isClickable = isCompleted

          return (
            <li
              key={step.id}
              className={
                index === steps.length - 1
                  ? "flex items-center"
                  : "flex items-center flex-1"
              }
            >
              <div
                className={`flex flex-col sm:flex-row items-center sm:items-start gap-1.5 sm:gap-0 ${
                  isClickable
                    ? "cursor-pointer"
                    : isCurrent
                      ? "cursor-default"
                      : "cursor-not-allowed"
                }`}
                aria-current={isCurrent ? "step" : undefined}
                aria-disabled={!isClickable && !isCurrent}
                aria-label={`${step.name} step${isCompleted ? ", completed" : isCurrent ? ", current" : ""}`}
                onClick={() => {
                  if (isClickable) setStep(step.id)
                }}
              >
                <motion.div
                  className={`flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full border-2 text-xs sm:text-sm font-medium transition-colors duration-300 ${
                    isCompleted
                      ? "border-primary bg-primary text-primary-foreground shadow-sm"
                      : ""
                  } ${
                    isCurrent
                      ? "border-accent text-accent ring-4 ring-accent/10"
                      : ""
                  } ${
                    !isCompleted && !isCurrent
                      ? "border-foreground-muted/30 text-foreground-muted/50"
                      : ""
                  }`}
                  layout
                >
                  {isCompleted ? (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 15,
                      }}
                    >
                      <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                    </motion.div>
                  ) : (
                    <step.Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                </motion.div>
                <div className="text-center sm:text-left sm:ml-3">
                  <p
                    className={`text-[10px] sm:text-sm font-semibold leading-tight transition-colors ${
                      isCurrent
                        ? "text-accent"
                        : isCompleted
                          ? "text-primary"
                          : "text-foreground-muted/50"
                    }`}
                  >
                    {step.name}
                  </p>
                  <p
                    className={`text-[9px] sm:text-xs leading-tight hidden sm:block ${
                      isCurrent
                        ? "text-foreground"
                        : isCompleted
                          ? "text-foreground-muted"
                          : "text-foreground-disabled"
                    }`}
                  >
                    {step.subtitle}
                  </p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className="mx-2 sm:ml-4 h-0.5 flex-1 rounded-full bg-border relative overflow-hidden">
                  <motion.div
                    className="absolute inset-y-0 left-0 bg-primary rounded-full"
                    initial={{ width: "0%" }}
                    animate={{
                      width: isCompleted
                        ? "100%"
                        : isCurrent
                          ? "50%"
                          : "0%",
                    }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                </div>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
