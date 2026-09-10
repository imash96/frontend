import type { StoreOrder } from "@medusajs/types";
import { CheckCircle } from "lucide-react";
import type { Route } from "next";
import { convertToLocale } from "@/lib/util/money";
import Button from "@/ui/button";
import OrderLineitem from "../components/order-lineitem";

export default function OrderCard({ order }: { order: StoreOrder }) {
  const order_paced = new Date(order.created_at).toLocaleDateString();
  const order_id = `${order.id.split("_")[1]}_${order.display_id}`;
  const delivery = new Date(order.updated_at).toLocaleDateString();
  return (
    <section
      aria-labelledby={`order-${order.id}-title`}
      className="bg-background-elevated rounded-lg border border-border p-5"
    >
      <div className="flex flex-col md:flex-row gap-4 mb-4 sm:mb-6 pb-4 sm:pb-6 border-b">
        <div className="flex-1">
          <h3
            id={`order-${order.id}-title`}
            className="text-xs sm:text-lg font-semibold mb-2"
          >
            Order Id: {order_id}
          </h3>
          <div className="grid grid-cols-3 gap-x-5 gap-y-2 text-xs sm:text-sm w-fit">
            <div className="min-w-0">
              <dt className="font-medium text-foreground-muted">Date placed</dt>
              <dd className="font-semibold">
                <time dateTime={order_paced}>{order_paced}</time>
              </dd>
            </div>
            <div className="min-w-0">
              <dt className="font-medium text-foreground-muted">
                Total amount
              </dt>
              <dd className="font-semibold">
                {convertToLocale({
                  amount: order.total,
                  currency_code: order.currency_code,
                })}
              </dd>
            </div>
            <div className="min-w-0">
              <dt className="font-medium text-foreground-muted">Status</dt>
              <dd className="font-semibold">{order.fulfillment_status}</dd>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 w-auto">
          <Button href={`/order/${order.id}` as Route} variant="outline">
            <span>View Order</span>
            <span className="sr-only"> {order_id}</span>
          </Button>
          <Button variant="outline">
            <span>View Invoice</span>
            <span className="sr-only"> for order {order_id}</span>
          </Button>
        </div>
      </div>
      <ul className="space-y-4">
        {order.items?.map((item) => (
          <OrderLineitem
            key={item.id}
            item={item}
            currencyCode={order.currency_code}
          />
        ))}
      </ul>
      <div className="flex items-center gap-2 text-xs sm:text-sm mt-4">
        <CheckCircle className="w-4 h-4 text-success shrink-0" />
        <p>
          Delivered on <time dateTime={delivery}>{delivery}</time>
        </p>
      </div>
    </section>
  );
}
