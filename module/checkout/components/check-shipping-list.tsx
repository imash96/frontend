"use client"

import type { StoreCartShippingOption } from "@medusajs/types"
import { CheckCircle, Clock, Loader2, Truck, TruckElectric } from "lucide-react"
import { useState, useTransition } from "react"
import { setCheckShipping } from "@/lib/action/checkout"
import { useCheckStore } from "@/lib/store/checkout-store"
import { convertToLocale } from "@/lib/util/money"
import { button as Button, div as Div } from "motion/react-client";

export default function CheckShippingList({
  availableMethods,
  cartId,
  currencyCode,
  selectedMethodId,
}: CheckShippingListProps) {
  const [isPending, startTransition] = useTransition()
  const [pendingOptionId, setPendingOptionId] = useState<string | null>(null)
  const setStep = useCheckStore((s) => s.setStep)
  const markCompleted = useCheckStore((s) => s.markCompleted)

  function handleShippingMethod(optionId: string) {
    if (isPending || optionId === selectedMethodId) return
    setPendingOptionId(optionId)
    startTransition(async () => {
      const res = await setCheckShipping(cartId, optionId)
      if (res?.success) {
        markCompleted("shipping")
        setStep("payment")
      }
      setPendingOptionId(null)
    })
  }

  return (
    <div
      className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4"
      role="radiogroup"
      aria-label="Shipping methods"
    >
      {availableMethods.map((method, index) => {
        const isSelected = selectedMethodId === method.id
        const isLoading = isPending && pendingOptionId === method.id
        const isExpress = method.type?.code === "expedite"
        return (
          <Button
            key={method.id}
            type="button"
            disabled={isPending}
            onClick={() => handleShippingMethod(method.id)}
            role="radio"
            aria-checked={isSelected}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.2 }}
            whileHover={!isPending ? { scale: 1.01 } : undefined}
            whileTap={!isPending ? { scale: 0.99 } : undefined}
            className={`relative flex w-full items-start rounded-xl border p-3 sm:p-4 text-left shadow-sm transition-all duration-200 ${isSelected
              ? "bg-accent/5 ring-2 ring-offset-1 ring-accent border-accent"
              : "border-border hover:border-accent hover:shadow-md"
              } ${isPending ? "opacity-50 cursor-wait" : "cursor-pointer"}`}
          >
            <span className="flex-1 min-w-0">
              <h3 className="flex items-center font-semibold text-sm sm:text-base">
                {isExpress ? (
                  <TruckElectric className="w-4 h-4 mr-1.5 shrink-0 text-accent" />
                ) : (
                  <Truck className="w-4 h-4 mr-1.5 shrink-0" />
                )}
                <span className="truncate">{method.name}</span>
              </h3>
              <p className="mt-1 flex items-center text-xs sm:text-sm text-muted-foreground">
                <Clock className="w-3.5 h-3.5 mr-1 text-warning shrink-0" />
                <span className="line-clamp-1">{method.type?.description}</span>
              </p>
              <span className="mt-2 sm:mt-3 inline-block text-xs sm:text-sm font-semibold">
                {method.amount === 0
                  ? "Free Shipping"
                  : convertToLocale({
                    amount: method.amount,
                    currency_code: currencyCode,
                  })}
              </span>
            </span>
            {isLoading ? (
              <Loader2
                className="h-5 w-5 text-accent shrink-0 ml-2 animate-spin"
                aria-hidden="true"
              />
            ) : isSelected ? (
              <Div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 15 }}
              >
                <CheckCircle
                  className="h-5 w-5 text-accent shrink-0 ml-2"
                  aria-hidden="true"
                />
              </Div>
            ) : null}
          </Button>
        )
      })}
    </div>
  )
}

type CheckShippingListProps = {
  availableMethods: StoreCartShippingOption[]
  cartId: string
  currencyCode: string
  selectedMethodId?: string
}
