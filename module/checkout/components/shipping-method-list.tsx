import type { StoreCartShippingOption } from "@medusajs/types";
import { CheckCircle, Clock, Truck, TruckElectric } from "lucide-react";
import { useTransition } from "react";
import { setShippingMethod } from "@/lib/action/cart";
import { useCheckout } from "@/lib/store/checkout-context";
import { convertToLocale } from "@/lib/util/money";

export default function ListShippingMethods({
  availableMethods,
  cartId,
  currencyCode,
  selectedMethodId,
}: ShippingCardProps) {
  const [isPending, startTransition] = useTransition();
  const { setCurrentStep } = useCheckout();
  function handleShippingMethod(optionId: string) {
    if (isPending || optionId === selectedMethodId) return;
    startTransition(async () => {
      const res = await setShippingMethod({
        cartId,
        shippingMethodId: optionId,
      });
      if (res?.success) setCurrentStep("payment");
    });
  }
  return (
    <div
      className="grid grid-cols-1 gap-4 sm:grid-cols-2"
      role="radiogroup"
      aria-label="Shipping methods"
    >
      {availableMethods.map((method) => {
        const isSelected = selectedMethodId === method.id;
        const isExpress = method.type?.code === "expedite";
        return (
          <button
            key={method.id}
            type="button"
            disabled={isPending}
            onClick={() => handleShippingMethod(method.id)}
            role="radio"
            aria-checked={isSelected}
            className={`relative flex w-full items-start rounded-xl border p-4 text-left shadow-sm transition ${isSelected ? "bg-accent/5 ring-2 ring-offset-1 ring-accent" : "border-border hover:border-accent"}  ${isPending ? "opacity-50 cursor-wait" : "cursor-pointer"}`}
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
                {method.type?.description}
              </p>
              <span className="mt-3 inline-block text-sm font-medium">
                {method.amount === 0
                  ? "Free Shipping"
                  : convertToLocale({
                    amount: method.amount,
                    currency_code: currencyCode,
                  })}
              </span>
            </span>
            {isSelected && (
              <CheckCircle className="h-5 w-5 text-accent" aria-hidden="true" />
            )}
          </button>
        );
      })}
    </div>
  );
}

type ShippingCardProps = {
  availableMethods: StoreCartShippingOption[];
  cartId: string;
  currencyCode: string;
  selectedMethodId?: string;
};
