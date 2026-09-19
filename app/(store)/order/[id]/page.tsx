import CreditCard from "@/icon/checkout-creditcard"
import { retrieveOrder } from "@/lib/action/order"
import { convertToLocale } from "@/lib/util/money"
import OrderLineitem from "@/module/order/components/order-lineitem"
import Container from "@/ui/container"
import { CheckCircle, MapPin, Package, Truck } from "lucide-react"
import { notFound } from "next/navigation"
import Script from "next/script"

export default async function Page(props: PageProps<"/order/[id]">) {
    const { id } = await props.params
    const order = await retrieveOrder(id).catch(() => null)
    if (!order) return notFound()
    // const trackingNumber = order.fulfillments?.[0]?.tracking_numbers?.[0] || "5249863524" // Fallback to hardcoded if not available; ideally fetch from data
    const formattedDate = (date: string | Date) => new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    const productSkus = order.items?.map(item => item.variant_sku)
    const tags = [...new Set(order.items?.map(item => item.product_type))]
    const products = order.items?.map(item => ({
        productUrl: `https://vellehide.com/products/${item.product_handle}`,
        imageUrl: item.thumbnail,
        name: item.title,
        brand: 'Velle Hide',
        sku: item.variant_sku,
        mnp: item.variant_barcode
    }))
    return (
        <Container size="lg" className="py-12 sm:py-16 lg:py-20 space-y-6 bg-background">
            <div className="grid lg:grid-cols-10 gap-x-8 gap-y-8">
                <div className="lg:col-span-6 space-y-8">
                    <div className="border-b border-border pb-6">
                        <div className="flex items-center gap-3 mb-4">
                            <CheckCircle className="w-8 h-8 text-success" />
                            <div>
                                <h1 className="text-lg font-semibold text-foreground">Thank you for your order!</h1>
                                <p className="text-3xl font-bold tracking-tight sm:text-4xl text-primary">It's on the way.</p>
                            </div>
                        </div>
                        <p className="text-base text-foreground-muted">Order #{order.custom_display_id} has been confirmed and will be with you soon.</p>
                        <p className="mt-1 text-sm text-foreground-muted">Placed on {formattedDate(order.created_at)}</p>
                        <p className="mt-1 text-sm text-foreground">Email: {order.email}</p>
                        {/* {trackingNumber && ( */}
                        <p className="mt-2 text-sm font-medium text-foreground">
                            Tracking number: <span className="text-link">{"trackingNumber"}</span>
                        </p>
                        {/* )} */}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="flex items-center gap-3 p-4 border border-border rounded-lg bg-background-elevated shadow-sm">
                            <Package className="w-6 h-6 text-primary" />
                            <div>
                                <p className="text-xs text-foreground-muted">Order Status</p>
                                <p className="font-medium capitalize text-foreground">{order.status}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 border border-border rounded-lg bg-background-elevated shadow-sm">
                            <Truck className="w-6 h-6 text-success" />
                            <div>
                                <p className="text-xs text-foreground-muted">Fulfillment</p>
                                <p className="font-medium capitalize text-foreground">{order.fulfillment_status}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 border border-border rounded-lg bg-background-elevated shadow-sm">
                            <CreditCard className="w-6 h-6 text-accent" />
                            <div>
                                <p className="text-xs text-foreground-muted">Payment</p>
                                <p className="font-medium capitalize text-foreground">{order.payment_status}</p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-foreground mb-4">Order Items</h2>
                        <ul role="list" className="space-y-4 divide-y divide-border">
                            {order.items?.map(item => (
                                <OrderLineitem key={item.id} item={item} currencyCode={order.currency_code} className="bg-background-elevated shadow-sm rounded-lg p-6 border border-border" />
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-background-elevated shadow-sm rounded-lg p-6 border border-border">
                        <h2 className="text-lg font-semibold text-foreground mb-4">Order Summary</h2>
                        <div className="space-y-3 text-sm text-foreground-muted">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span className="text-foreground">{convertToLocale({ amount: order.subtotal, currency_code: order.currency_code })}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Shipping {order.shipping_methods?.[0]?.name ? `(${order.shipping_methods[0].name})` : ''}</span>
                                <span className="text-foreground">{convertToLocale({ amount: order.shipping_total, currency_code: order.currency_code })}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Discount</span>
                                <span className="text-foreground">{convertToLocale({ amount: order.discount_total, currency_code: order.currency_code })}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Tax</span>
                                <span className="text-foreground">{convertToLocale({ amount: order.tax_total, currency_code: order.currency_code })}</span>
                            </div>
                            <div className="flex justify-between font-semibold text-foreground border-t border-border pt-3">
                                <span>Total</span>
                                <span>{convertToLocale({ amount: order.total, currency_code: order.currency_code })}</span>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-3 gap-y-6 lg:gap-x-6 lg:grid-cols-1">
                        <div className="bg-background-elevated shadow-sm rounded-lg p-4 border border-border">
                            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-primary" /> Shipping Address
                            </h2>
                            <div className="text-sm text-foreground-muted space-y-1">
                                <p>{order.shipping_address?.first_name} {order.shipping_address?.last_name}</p>
                                <p>{order.shipping_address?.company}</p>
                                <p>{order.shipping_address?.address_1}<br />{order.shipping_address?.address_2 ? `${order.shipping_address.address_2}` : ''}</p>
                                <p>{order.shipping_address?.city}, {order.shipping_address?.province} {order.shipping_address?.postal_code}</p>
                                <p className="uppercase">{order.shipping_address?.country_code}</p>
                                {order.shipping_address?.phone && <p className="text-foreground-disabled">{order.shipping_address.phone}</p>}
                            </div>
                        </div>
                        <div className="bg-background-elevated shadow-sm rounded-lg p-4 border border-border">
                            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                                <CreditCard className="w-5 h-5 text-accent" /> Billing Address
                            </h2>
                            <div className="text-sm text-foreground-muted space-y-1">
                                <p>{order.billing_address?.first_name} {order.billing_address?.last_name}</p>
                                <p>{order.shipping_address?.company}</p>
                                <p>{order.billing_address?.address_1}<br />{order.billing_address?.address_2 ? `${order.billing_address.address_2}` : ''}</p>
                                <p>{order.billing_address?.city}, {order.billing_address?.province} {order.billing_address?.postal_code}</p>
                                <p className="uppercase">{order.billing_address?.country_code}</p>
                                {order.billing_address?.phone && <p className="text-foreground-disabled">{order.billing_address.phone}</p>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-3 gap-y-6 lg:gap-x-6">
                <div className="bg-background-elevated shadow-sm rounded-lg p-6 border border-border">
                    <h2 className="text-lg font-semibold text-foreground mb-4">Payment Details</h2>
                    <div className="text-sm text-foreground-muted space-y-1">
                        <p>Status: <span className="capitalize text-foreground">{order.payment_status}</span></p>
                        <p>Amount Paid: <span className="text-foreground">{convertToLocale({ amount: order.total || order.total, currency_code: order.currency_code })}</span></p>
                    </div>
                </div>

                <div className="bg-background-elevated shadow-sm rounded-lg p-6 border border-border">
                    <h2 className="text-lg font-semibold text-foreground mb-4">Fulfillment Details</h2>
                    <div className="text-sm text-foreground-muted space-y-1">
                        {
                            (order.fulfillments && order.fulfillments.length) ? <>
                                <p>Status: <span className="capitalize text-foreground">{order.fulfillment_status}</span></p>
                                {order.fulfillments[0].packed_at && <p>Packed: {new Date(order.fulfillments[0].packed_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>}
                                {order.fulfillments[0].shipped_at && <p>Shipped: {new Date(order.fulfillments[0].shipped_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>}
                                {order.fulfillments[0].delivered_at && <p>Delivered: {new Date(order.fulfillments[0].delivered_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>}
                            </> : <></>
                        }
                    </div>
                </div>

            </div>
            <div className="text-center py-8 border-t border-border mt-8">
                <CheckCircle className="w-12 h-12 text-success mx-auto mb-2" />
                <p className="text-lg font-medium text-foreground mb-1">Thank you for shopping with us!</p>
                <p className="text-sm text-foreground-muted">
                    Need help? Contact us at{' '}
                    <a href="mailto:support@vellehide.com" className="text-link hover:underline font-medium">
                        support@vellehide.com
                    </a>
                </p>
            </div>
            {process.env.NEXT_PUBLIC_TRUST_PILOT_ID &&
                <Script
                    id="trustpilot-script"
                    strategy="lazyOnload"
                    dangerouslySetInnerHTML={{
                        __html: `document.addEventListener('DOMContentLoaded', function() { const trustpilot_invitation = { recipientEmail: '${order.email}', recipientName: '${order.shipping_address?.first_name} ${order.shipping_address?.last_name}', referenceId: '${order.id}', source: 'InvitationScript', productSkus: ${JSON.stringify(productSkus)}, products: ${JSON.stringify(products)}, tags: '${JSON.stringify(tags)}' }; tp('createInvitation', trustpilot_invitation); });`,
                    }}
                />
            }
        </Container>
    )
}