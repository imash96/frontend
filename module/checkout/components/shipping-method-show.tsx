import type { StoreCartShippingMethod } from "@medusajs/types";
import { CheckCircle, Clock, Truck, TruckElectric } from "lucide-react";
import { convertToLocale } from "@/lib/util/money";

export default function ShippingCardShow({
  currencyCode,
  methods,
}: ShippingCardProps) {
  return (
    <div className="space-y-4">
      {methods?.map((method) => {
        const isExpress = method.name.toLowerCase().includes("expedite");
        return (
          <div
            key={method.id}
            className={`relative flex rounded-xl border p-4 shadow-sm ring-1 ring-offset-0 ring-accent bg-muted/30`}
          >
            <span className="flex-1">
              <h3 className="flex items-center font-semibold">
                {isExpress ? (
                  <TruckElectric className="w-4 h-4 mr-1" />
                ) : (
                  <Truck className="w-4 h-4 mr-1" />
                )}
                {method.name}
              </h3>
              <p className="mt-1 flex items-center text-sm text-muted-foreground">
                <Clock className="w-4 h-4 mr-1 text-warning" />
                {/* @ts-ignore */}
                {method.shipping_option.type.description}
              </p>
              <span className="mt-8 inline-block text-sm font-medium">
                {method.amount === 0
                  ? "Free Shipping"
                  : convertToLocale({
                      amount: method.amount,
                      currency_code: currencyCode,
                    })}
              </span>
            </span>
            <CheckCircle className="h-5 w-5 text-accent" aria-hidden="true" />
          </div>
        );
      })}
    </div>
  );
}

type ShippingCardProps = {
  methods?: StoreCartShippingMethod[] | undefined;
  currencyCode: string;
};
