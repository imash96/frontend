import type { StoreCartLineItem } from "@medusajs/types";
import { convertToLocale } from "@/lib/util/money";

export default function LineItemPrice({
  item,
  currencyCode,
}: LineItemPriceProps) {
  const currentPrice = item.total ?? 0;
  const originalPrice = item.original_total ?? currentPrice;
  const hasReducedPrice = currentPrice < originalPrice;
  return (
    <div className="flex md:flex-col gap-x-1.5 md:gap-y-0.5 items-center md:items-end shrink-0">
      <span
        className={`font-medium ${hasReducedPrice ? "text-destructive" : ""}`}
      >
        {convertToLocale({ amount: currentPrice, currency_code: currencyCode })}
      </span>
      {hasReducedPrice && (
        <del className="text-xs text-text-disabled line-through">
          {convertToLocale({
            amount: originalPrice,
            currency_code: currencyCode,
          })}
        </del>
      )}
    </div>
  );
}

type LineItemPriceProps = {
  item: StoreCartLineItem;
  currencyCode: string;
};