import type { StoreCartLineItem } from "@medusajs/types";
import { convertToLocale } from "@/lib/util/money";

export default function LineItemPrice({
  item,
  currencyCode,
}: LineItemPriceProps) {
  const current = item.total ?? 0;
  const original = item.original_total ?? current;
  const reduced = current < original;
  return (
    <div className="flex shrink-0 flex-col items-end gap-0.5">
      <span
        className={`font-medium tabular-nums ${reduced ? "text-price-save" : "text-text-primary"
          }`}
      >
        {convertToLocale({ amount: current, currency_code: currencyCode })}
      </span>
      {reduced && (
        <del className="text-xs text-text-disabled">
          {convertToLocale({ amount: original, currency_code: currencyCode })}
        </del>
      )}
    </div>
  );
}

type LineItemPriceProps = {
  item: StoreCartLineItem;
  currencyCode: string;
};