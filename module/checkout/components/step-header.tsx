"use client";

import { Edit } from "lucide-react";
import { useCheckout } from "@/lib/store/checkout-context";
import type { StepType } from "@/types/common";

export default function StepHeader({
  title,
  subtitle,
  Icon,
  showEdit,
  name,
}: StepHeaderProps) {
  const { setCurrentStep } = useCheckout();
  const handleEdit = () => setCurrentStep(name);

  return (
    <div className="flex items-center justify-between mb-4">
      {/* Left Side: Icon + Title + Subtitle */}
      <div className="space-y-1">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
          <Icon className="w-5 h-5 text-accent" aria-hidden="true" />
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm text-muted-foreground leading-snug">
            {subtitle}
          </p>
        )}
      </div>

      {/* Right Side: Edit Button */}
      {showEdit && (
        <button
          onClick={handleEdit}
          className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-sm font-medium text-accent hover:bg-accent/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent transition"
          aria-label={`Edit ${title}`}
        >
          <Edit className="w-5" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}

type StepHeaderProps = {
  title: string;
  subtitle?: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  showEdit?: boolean;
  name: StepType;
};
