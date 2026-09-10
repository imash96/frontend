import type { StoreCartLineItem } from "@medusajs/types";
import { convertToLocale } from "@/lib/util/money";

// TODO check logic of discount again for item.adjustment
export default function LineItemPrice({
  item,
  currencyCode,
}: LineItemPriceProps) {
  const { total, original_total } = item;
  const originalPrice = original_total!;
  const currentPrice = total!;
  const hasReducedPrice = currentPrice < originalPrice;
  return (
    <div className="flex md:flex-col gap-x-1 items-center">
      <span
        className={`font-medium ${hasReducedPrice ? "text-destructive" : ""}`}
      >
        {convertToLocale({ amount: currentPrice, currency_code: currencyCode })}
      </span>
      {hasReducedPrice && (
        <del className="text-xs text-foreground-disabled line-through">
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
