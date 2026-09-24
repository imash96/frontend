import { retrieveOrder } from "@/lib/action/order"
import { convertToLocale } from "@/lib/util/money" // Assuming this is available; add if not
import Button from "@/ui/button"
import OrderLineitem from "@/module/order/components/order-lineitem"
import ConfettiWarapper from "@/module/order/templates/confetti-wrapper"
import { CheckCircle, CreditCard, MapPin } from "lucide-react"
import { notFound } from "next/navigation"
import Script from "next/script"
import Container from "@/ui/container"

/* Order confirmed is fully user-specific (auth cookies + dynamic [id]) */
export const instant = false

export default async function Page(props: PageProps<"/order/[id]">) {
    const { id } = await props.params
    const order = await retrieveOrder(id).catch(() => null)
    if (!order) return notFound()
    const order_id = order.display_id
    const formattedDate = new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
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
        <ConfettiWarapper>
            <Container className="py-12 sm:py-16 lg:py-20 space-y-8 bg-background">
                <div className="max-w-3xl mx-auto space-y-8">
                    <div className="text-center">
                        <CheckCircle className="w-12 h-12 text-success mx-auto mb-4" />
                        <h1 className="text-lg font-semibold text-foreground">Payment Successful</h1>
                        <p className="mt-2 text-3xl font-bold tracking-tight text-primary sm:text-4xl">Thanks for your order!</p>
                        <p className="mt-4 text-base text-foreground-muted">Order #{order_id} has been placed successfully on {formattedDate}.</p>
                        <p className="mt-2 text-base text-foreground-muted">
                            We appreciate your order. We're currently processing it and will send you a confirmation email soon.
                        </p>
                    </div>

                    <div className="bg-background-elevated rounded-lg p-6 border border-border">
                        <h2 className="text-lg font-semibold text-foreground">Order Items</h2>
                        <ul role="list" className="divide-y divide-border">
                            {order.items?.map(item => (
                                <OrderLineitem key={item.id} item={item} currencyCode={order.currency_code} className="py-4" />
                            ))}
                        </ul>
                    </div>

                    <div className="bg-background-elevated rounded-lg p-6 border border-border">
                        <h2 className="text-lg font-semibold text-foreground mb-4">Order Summary</h2>
                        <div className="space-y-3 text-sm text-foreground-muted">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span className="text-foreground">{convertToLocale({ amount: order.subtotal, currency_code: order.currency_code })}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Discount</span>
                                <span className="text-foreground">-{convertToLocale({ amount: order.discount_total, currency_code: order.currency_code })}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Shipping</span>
                                <span className="text-foreground">{convertToLocale({ amount: order.shipping_total, currency_code: order.currency_code })}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Taxes</span>
                                <span className="text-foreground">{convertToLocale({ amount: order.tax_total, currency_code: order.currency_code })}</span>
                            </div>
                            <div className="flex justify-between font-semibold text-foreground border-t border-border pt-3">
                                <span>Total</span>
                                <span>{convertToLocale({ amount: order.total, currency_code: order.currency_code })}</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-background-elevated rounded-lg p-6 border border-border">
                            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-primary" /> Shipping Address
                            </h2>
                            <div className="text-sm text-foreground-muted space-y-1">
                                <p>{order.shipping_address?.first_name} {order.shipping_address?.last_name}</p>
                                <p>{order.shipping_address?.company}</p>
                                <p>{order.shipping_address?.address_1}{order.shipping_address?.address_2 ? `, ${order.shipping_address.address_2}` : ''}</p>
                                <p>{order.shipping_address?.city}, {order.shipping_address?.province} {order.shipping_address?.postal_code}</p>
                                <p className="uppercase">{order.shipping_address?.country_code}</p>
                                {order.shipping_address?.phone && <p className="text-foreground-disabled">{order.shipping_address.phone}</p>}
                            </div>
                        </div>
                        <div className="bg-background-elevated rounded-lg p-6 border border-border">
                            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-primary" /> Billing Address
                            </h2>
                            <div className="text-sm text-foreground-muted space-y-1">
                                <p>{order.billing_address?.first_name} {order.billing_address?.last_name}</p>
                                <p>{order.billing_address?.company}</p>
                                <p>{order.billing_address?.address_1}{order.billing_address?.address_2 ? `, ${order.billing_address.address_2}` : ''}</p>
                                <p>{order.billing_address?.city}, {order.billing_address?.province} {order.billing_address?.postal_code}</p>
                                <p className="uppercase">{order.billing_address?.country_code}</p>
                                {order.billing_address?.phone && <p className="text-foreground-disabled">{order.billing_address.phone}</p>}
                            </div>
                        </div>
                    </div>
                    <div className="bg-background-elevated rounded-lg p-6 border border-border">
                        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                            <CreditCard className="w-5 h-5 text-accent" /> Payment Information
                        </h2>
                        <div className="text-sm text-foreground-muted space-y-1">
                            <p>Email: {order.email}</p>
                            <p>Method: {`Card (via Stripe)`}</p>
                            <p>Status: {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}</p>
                            <p>Amount: {convertToLocale({ amount: order.total, currency_code: order.currency_code })}</p>
                        </div>
                    </div>

                    <div className="text-center border-t border-border pt-6">
                        <Button href="/" className="">
                            Continue Shopping &rarr;
                        </Button>
                    </div>
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
        </ConfettiWarapper>
    )
}