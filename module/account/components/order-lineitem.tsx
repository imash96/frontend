import type { StoreOrderLineItem } from "@medusajs/types";
import { MessageSquare } from "lucide-react";
import Link from "next/link";
import { convertToLocale } from "@/lib/util/money";
import ProductThumbnail from "@/module/products/components/product-thumbnail";
import ReviewModal from "./review-modal";

export default function OrderLineitem({
  item,
  currencyCode,
  orderId,
  orderFulfillmentStatus,
}: {
  item: StoreOrderLineItem;
  currencyCode: string;
  orderId: string;
  orderFulfillmentStatus?: string | null;
}) {
  const isFulfilled =
    orderFulfillmentStatus === "fulfilled" ||
    orderFulfillmentStatus === "delivered";

  return (
    <li key={item.id} className="flex gap-2">
      <div className="relative w-24 shrink-0 my-auto">
        <ProductThumbnail
          src={item.thumbnail}
          alt={item.title}
          width={300}
          height={400}
          loading="lazy"
          decoding="async"
          sizes="(min-width: 768px) 8rem, (min-width: 640px) 7rem, 5.5rem"
        />
      </div>
      <div className="space-y-1 md:space-y-1.5 w-full">
        <div className="flex flex-col gap-y-1 gap-x-2 md:flex-row md:justify-between">
          <h2 className="text-sm leading-snug font-medium">
            <Link
              href={`/products/${item.product?.handle || ""}`}
              className="text-link underline line-clamp-2 max-w-[35ch]"
            >
              {item.product?.title}
            </Link>
          </h2>
          <span className="font-medium">
            {convertToLocale({
              amount: item.total,
              currency_code: currencyCode,
            })}
          </span>
        </div>
        <div className="text-sm text-foreground-muted truncate">
          <p>
            <strong>Variant: </strong>
            {item.variant?.title ?? "Standard"}
          </p>
          <p>
            <strong>Type: </strong>
            {item.product_type ?? "Standard"}
          </p>
          <p>
            <strong>Qty: </strong>
            {item.quantity}
          </p>
        </div>

        {/* Write Review Button - only for fulfilled orders */}
        {isFulfilled && item.product_id && (
          <ReviewModal
            productId={item.product_id}
            productTitle={item.product?.title ?? "Product"}
            productThumbnail={item.thumbnail}
            orderId={orderId}
            orderLineItemId={item.id}
          >
            <button className="inline-flex items-center gap-1.5 mt-1 px-3 py-1.5 text-xs font-medium text-accent border border-accent/30 rounded-md hover:bg-accent/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1">
              <MessageSquare size={12} />
              <span className="hidden sm:inline">Write Review</span>
              <span className="sm:hidden">Review</span>
            </button>
          </ReviewModal>
        )}
      </div>
    </li>
  );
}
