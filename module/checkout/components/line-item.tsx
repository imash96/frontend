import type { StoreCartLineItem } from "@medusajs/types";
import { convertToLocale } from "@/lib/util/money";
import ProductThumbnail from "@/module/product/components/product-thumbnail";

export default function CheckoutLineItem({
  item,
  currency_code,
}: CheckoutLineItemProps) {
  const adjustmentsSum = (item.adjustments || []).reduce(
    (acc, adjustment) => adjustment.amount + acc,
    0,
  );
  const currentPrice = item.total! - adjustmentsSum;
  return (
    <div className="flex gap-x-2">
      {/* Product Image */}
      <ProductThumbnail
        src={item.thumbnail}
        alt={item.title}
        width={300}
        height={400}
        className="shrink-0 w-15"
      />

      {/* Product Details */}
      <div className="flex flex-col min-w-0 gap-y-1">
        <h3 className="text-sm leading-tight line-clamp-2">{item.title}</h3>
        <div className="text-xs text-foreground-muted">
          {item.variant && <span>Variant: {item.variant?.title}</span>}
          <br />
          {/* {item.variant_sku && <span>SKU: {item.variant_sku}</span>}<br /> */}
          <span>Qty: {item.quantity}</span>
        </div>
      </div>
      <div className="flex flex-col justify-between items-center w-20">
        <div className="text-sm">
          {convertToLocale({
            amount: currentPrice,
            currency_code: currency_code,
          })}
        </div>
      </div>
    </div>
  );
}

type CheckoutLineItemProps = {
  item: StoreCartLineItem;
  currency_code: string;
};
