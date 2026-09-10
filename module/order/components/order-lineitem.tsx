import { StoreOrderLineItem } from "@medusajs/types";
import ProductThumbnail from "@/module/product/components/product-thumbnail";
import Link from "next/link";
import { convertToLocale } from "@/lib/util/money";

export default function OrderLineitem({ item, currencyCode, className = "" }: OrderLineitemProp) {
    return (
        <li key={item.id} className={`flex gap-2 ${className}`}>
            <div className="relative w-24 shrink-0">
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
                        <Link href={`/product/${item.product?.handle || ''}`} className="text-link underline line-clamp-2 max-w-[35ch]">
                            {item.product?.title}
                        </Link>
                    </h2>
                    <span className="font-medium">
                        {convertToLocale({ amount: item.total, currency_code: currencyCode })}
                    </span>
                </div>
                <div className="text-sm text-foreground-muted truncate">
                    <p><strong>Variant: </strong>{item.variant?.title ?? "Standard"}</p>
                    <p><strong>Type: </strong>{item.product_type ?? "Standard"}</p>
                    <p><strong>Qty: </strong>{item.quantity}</p>
                </div>

            </div>
        </li>
    )
}

type OrderLineitemProp = {
    item: StoreOrderLineItem,
    currencyCode: string,
    className?: string
}