"use client";

import { Check, CreditCard, MapPin, Truck } from "lucide-react";
import { useCheckout } from "@/lib/store/checkout-context";

const steps = [
  {
    id: "address" as const,
    name: "Address",
    subtitle: "Shipping & billing",
    Icon: MapPin,
  },
  {
    id: "delivery" as const,
    name: "Shipping",
    subtitle: "Delivery method",
    Icon: Truck,
  },
  {
    id: "payment" as const,
    name: "Payment",
    subtitle: "Payment details",
    Icon: CreditCard,
  },
];

export default function CheckoutProgress() {
  const { currentStep, setCurrentStep } = useCheckout();
  const currentIndex = steps.findIndex((s) => s.id === currentStep);

  return (
    <nav aria-label="Checkout progress" className="w-full max-w-5xl mx-auto">
      <ol className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          return (
            <li
              key={step.id}
              className={
                index === steps.length - 1
                  ? undefined
                  : "flex items-center flex-1"
              }
            >
              <div
                className="flex flex-col sm:flex-row items-start cursor-pointer"
                aria-current={isCurrent ? "step" : undefined}
                aria-label={`${step.name} step${isCompleted ? ", completed" : isCurrent ? ", current" : ""}`}
                onClick={() => setCurrentStep(step.id)}
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-medium ${isCompleted ? "border-primary bg-primary text-primary-foreground" : ""} ${isCurrent ? "border-accent text-accent" : ""} ${!isCompleted && !isCurrent ? "border-foreground-muted text-foreground-muted" : ""}`}
                >
                  {isCompleted ? (
                    <Check className="w-6 h-6" />
                  ) : (
                    <step.Icon className="w-6 h-6" />
                  )}
                </div>
                <div className="hidden sm:block sm:ml-4">
                  <p
                    className={`text-sm font-semibold leading-tight ${isCurrent ? "text-accent" : isCompleted ? "text-primary" : "text-foreground-muted"}`}
                  >
                    {step.name}
                  </p>
                  <p
                    className={`text-xs leading-tight ${isCurrent ? "text-foreground" : isCompleted ? "text-foreground-muted" : "text-foreground-disabled"}`}
                  >
                    {step.subtitle}
                  </p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`ml-4 h-0.5 flex-1 transition-colors duration-200 ${isCompleted ? "bg-primary" : isCurrent ? "bg-accent" : "bg-border"}`}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
