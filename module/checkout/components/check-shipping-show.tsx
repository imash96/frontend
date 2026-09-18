import type { StoreCartShippingMethod } from "@medusajs/types"
import { CheckCircle, Clock, Truck, TruckElectric } from "lucide-react"
import { convertToLocale } from "@/lib/util/money"

export default function CheckShippingShow({
  currencyCode,
  methods,
}: CheckShippingShowProps) {
  return (
    <div className="space-y-3">
      {methods?.map((method) => {
        const isExpress = method.name.toLowerCase().includes("expedite")
        return (
          <div
            key={method.id}
            className="relative flex rounded-xl border p-3 sm:p-4 shadow-sm ring-1 ring-offset-0 ring-accent bg-accent/5"
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
                {/* @ts-ignore */}
                <span className="line-clamp-1">{method.shipping_option?.type?.description}</span>
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
            <CheckCircle
              className="h-5 w-5 text-accent shrink-0 ml-2"
              aria-hidden="true"
            />
          </div>
        )
      })}
    </div>
  )
}

type CheckShippingShowProps = {
  methods?: StoreCartShippingMethod[] | undefined
  currencyCode: string
}
