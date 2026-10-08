"use client"

import { Edit } from "lucide-react"
import { useCheckoutStore } from "@/lib/store/checkout-store"
import type { StepType } from "@/types/common"

export default function CheckStepHeader({
  title,
  subtitle,
  Icon,
  showEdit,
  name,
}: CheckStepHeaderProps) {
  const setStep = useCheckoutStore((s) => s.setStep)
  const handleEdit = () => setStep(name)

  return (
    <div className="flex items-center justify-between mb-3 sm:mb-4 lg:mb-5">
      <div className="space-y-0.5 sm:space-y-1">
        <h2 className="flex items-center gap-1.5 sm:gap-2 text-base sm:text-lg font-semibold text-foreground">
          <Icon
            className="w-4 h-4 sm:w-5 sm:h-5 text-accent shrink-0"
            aria-hidden="true"
          />
          {title}
        </h2>
        {subtitle && (
          <p className="text-xs sm:text-sm text-muted-foreground leading-snug pl-5.5 sm:pl-7">
            {subtitle}
          </p>
        )}
      </div>

      {showEdit && (
        <button
          onClick={handleEdit}
          className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-sm font-medium text-accent hover:bg-accent/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent transition shrink-0"
          aria-label={`Edit ${title}`}
        >
          <Edit className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
          <span className="hidden sm:inline">Edit</span>
        </button>
      )}
    </div>
  )
}

type CheckStepHeaderProps = {
  title: string
  subtitle?: string
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  showEdit?: boolean
  name: StepType
}
