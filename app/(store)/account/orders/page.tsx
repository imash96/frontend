import { Package } from "lucide-react";
import type { Metadata } from "next";
import { listOrders } from "@/lib/action/order";
import OrderCard from "@/module/account/templates/order-card";

export const metadata: Metadata = {
  title: "Order History | Velle Hide",
  description: "View your order history, track shipments, and manage returns.",
};

export default async function Page() {
  const orders = await listOrders();
  return (
    <section aria-labelledby="order-history-title" className="space-y-4 sm:space-y-6">
      <header className="space-y-2 animate-fade-in-up">
        <div className="flex items-center gap-2">
          <Package size={20} />
          <h2
            id="order-history-title"
            className="text-lg lg:text-xl uppercase tracking-wide font-medium"
          >
            Order history
          </h2>
        </div>
        <p className="text-sm text-muted-foreground max-w-prose">
          Check the status of recent orders. Track shipping progress, manage
          returns, and discover similar products.
        </p>
      </header>

      {/* Order Items */}
      {orders && orders.length > 0 ? (
        <div className="space-y-4 sm:space-y-6">
          {orders.map((order, i) => (
            <div
              key={order.id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${(i + 1) * 80}ms` }}
            >
              <OrderCard order={order} />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 sm:py-16 text-center border border-dashed border-border rounded-xl animate-fade-in-up">
          <Package size={40} className="mb-3 text-muted-foreground" />
          <p className="text-lg font-medium">No orders found.</p>
          <p className="text-muted-foreground text-sm mt-1">
            Start shopping to see your order history here!
          </p>
        </div>
      )}
    </section>
  );
}
