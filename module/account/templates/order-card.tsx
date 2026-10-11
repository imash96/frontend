import type { StoreOrder } from "@medusajs/types";
import {
  CheckCircle,
  Clock,
  Package,
  Truck,
  XCircle,
} from "lucide-react";
import type { Route } from "next";
import { convertToLocale } from "@/lib/util/money";
import Button from "@/ui/button";
import OrderLineitem from "../components/order-lineitem";

const statusConfig: Record<
  string,
  { label: string; icon: typeof CheckCircle; className: string }
> = {
  not_fulfilled: {
    label: "Processing",
    icon: Clock,
    className: "text-warning bg-warning/10 border-warning/20",
  },
  requires_action: {
    label: "Action Required",
    icon: Clock,
    className: "text-warning bg-warning/10 border-warning/20",
  },
  partially_fulfilled: {
    label: "Partially Shipped",
    icon: Truck,
    className: "text-info bg-info/10 border-info/20",
  },
  shipped: {
    label: "Shipped",
    icon: Truck,
    className: "text-info bg-info/10 border-info/20",
  },
  partially_shipped: {
    label: "Partially Shipped",
    icon: Truck,
    className: "text-info bg-info/10 border-info/20",
  },
  fulfilled: {
    label: "Delivered",
    icon: CheckCircle,
    className: "text-success bg-success/10 border-success/20",
  },
  delivered: {
    label: "Delivered",
    icon: CheckCircle,
    className: "text-success bg-success/10 border-success/20",
  },
  canceled: {
    label: "Cancelled",
    icon: XCircle,
    className: "text-destructive bg-destructive/10 border-destructive/20",
  },
  returned: {
    label: "Returned",
    icon: Package,
    className: "text-destructive bg-destructive/10 border-destructive/20",
  },
};

const defaultStatus = {
  label: "Processing",
  icon: Clock,
  className: "text-muted-foreground bg-muted border-border",
};

export default function OrderCard({ order }: { order: StoreOrder }) {
  const order_placed = new Date(order.created_at).toLocaleDateString("en-US", { timeZone: "UTC" });
  const status = statusConfig[order.fulfillment_status ?? ""] ?? defaultStatus;
  const StatusIcon = status.icon;

  return (
    <section
      aria-labelledby={`order-${order.custom_display_id}-title`}
      className="bg-surface-elevated rounded-lg border border-border p-5"
    >
      <div className="flex flex-col md:flex-row gap-4 mb-4 sm:mb-6 pb-4 sm:pb-6 border-b">
        <div className="flex-1">
          <h3
            id={`order-${order.id}-title`}
            className="text-xs sm:text-lg font-semibold mb-2"
          >
            Order Id: {order.custom_display_id}
          </h3>
          <div className="grid grid-cols-3 gap-x-5 gap-y-2 text-xs sm:text-sm w-fit">
            <div className="min-w-0">
              <dt className="font-medium text-foreground-tertiary">Date placed</dt>
              <dd className="font-semibold">
                <time dateTime={order_placed}>{order_placed}</time>
              </dd>
            </div>
            <div className="min-w-0">
              <dt className="font-medium text-foreground-tertiary">
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
              <dt className="font-medium text-foreground-tertiary">Status</dt>
              <dd>
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${status.className}`}
                >
                  <StatusIcon className="w-3.5 h-3.5 shrink-0" />
                  {status.label}
                </span>
              </dd>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 w-auto">
          <Button href={`/order/${order.id}` as Route} variant="outline">
            <span>View Order</span>
            <span className="sr-only"> {order.custom_display_id}</span>
          </Button>
          <Button variant="outline">
            <span>View Invoice</span>
            <span className="sr-only"> for order {order.custom_display_id}</span>
          </Button>
        </div>
      </div>
      {/* Order Items */}
      <ul className="space-y-4">
        {order.items?.map((item) => (
          <OrderLineitem
            key={item.id}
            item={item}
            currencyCode={order.currency_code}
            orderId={order.id}
            orderFulfillmentStatus={order.fulfillment_status}
          />
        ))}
      </ul>
    </section>
  );
}
