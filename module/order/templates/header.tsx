import CreditCard from "@/icon/checkout-creditcard";
import { StoreOrder } from "@medusajs/types";
import { Package, Truck } from "lucide-react";

// TODO color
export default function OrderHeader({ order }: { order: StoreOrder }) {
    const order_id = `${order.id.split("_")[1]}_${order.display_id}`
    return (
        <div className="border-b">
            <h1 className="text-base font-medium text-accent">Thank you!</h1>
            <p className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">It's on the way!</p>
            <p className="mt-2 text-base text-foreground-muted">Your order #{order_id} has shipped and will be with you soon.</p>
            <p className="mt-2 text-sm text-gray-500">
                Placed on {(new Date(order.created_at).toDateString())}
            </p>
            <div className="mt-2 text-sm font-medium">
                Tracking number: <span className="mt-2 text-link">{5249863524}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
                <div className="flex items-center gap-3 p-4 border rounded-lg bg-gray-50">
                    <Package className="w-6 h-6 text-blue-600" />
                    <div>
                        <p className="text-xs text-gray-500">Order Status</p>
                        <p className="font-medium capitalize">{order.status}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 p-4 border rounded-lg bg-gray-50">
                    <Truck className="w-6 h-6 text-green-600" />
                    <div>
                        <p className="text-xs text-gray-500">Fulfillment</p>
                        <p className="font-medium capitalize">{order.fulfillment_status}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 p-4 border rounded-lg bg-gray-50">
                    <CreditCard className="w-6 h-6 text-purple-600" />
                    <div>
                        <p className="text-xs text-gray-500">Payment</p>
                        <p className="font-medium capitalize">{order.payment_status}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

type OrderHeaderProps = {
    order_id: string;
    tracking_number: string | undefined
}