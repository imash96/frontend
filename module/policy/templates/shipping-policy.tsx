import Link from "next/link";

export default function ShippingPolicy() {
    return (
        <>
            <header className="mb-8">
                <h1 className="text-3xl uppercase tracking-tight">Shipping Policy</h1>
                <p className="mt-2 text-sm text-foreground-tertiary">Effective Date: August 28, 2025</p>
            </header>
            <section className="max-w-none space-y-4">
                <p className="text-sm tracking-wide font-light">
                    At VelleHide, we are dedicated to delivering your handcrafted leather goods safely, efficiently, and on time. This Shipping Policy outlines our shipping processes, timelines, costs, and procedures to ensure a seamless experience for our customers in India. For international inquiries, please reach out to us. We prioritize transparency to set clear expectations and build trust.
                </p>

                {/* 1. Shipping Locations */}
                <div className="space-y-2">
                    <h2 className="text-xl uppercase">1. Shipping Locations</h2>
                    <p className="text-sm tracking-wide font-light">
                        We ship to all locations across India, including metro cities, urban areas, and remote regions (subject to pin code coverage). For international shipping to select countries, additional customs duties, taxes, and fees may apply. Please contact us at <Link href="mailto:support@vellehide.com" className="hover:underline">support@vellehide.com</Link> for availability and quotes.
                    </p>
                </div>

                {/* 2. Order Processing Time */}
                <div className="space-y-2">
                    <h2 className="text-xl uppercase">2. Order Processing Time</h2>
                    <p className="text-sm tracking-wide font-light">
                        Orders are typically processed within 2-4 business days after payment confirmation. Custom or personalized items may require additional time (up to 7 days). During peak seasons, sales, or holidays, processing may extend slightly. You will receive an email confirmation once your order is ready for shipment.
                    </p>
                </div>

                {/* 3. Shipping Carriers and Methods */}
                <div className="space-y-2">
                    <h2 className="text-xl uppercase">3. Shipping Carriers and Methods</h2>
                    <p className="text-sm tracking-wide font-light">
                        We partner with reliable courier services such as Delhivery, BlueDart, and India Post to ensure secure and timely delivery. Shipping methods include:
                    </p>
                    <ul className="list-inside list-disc space-y-2 text-sm tracking-wide font-light">
                        <li><strong>Standard Shipping:</strong> Cost-effective for most orders.</li>
                        <li><strong>Express Shipping:</strong> Available at an additional cost for faster delivery (1-3 business days in metros).</li>
                        <li><strong>Cash on Delivery (COD):</strong> Offered in select areas with extra fees.</li>
                    </ul>
                    <p className="text-sm tracking-wide font-light">
                        All packages are shipped with eco-friendly, sturdy packaging to protect your items during transit.
                    </p>
                </div>

                {/* 4. Delivery Times */}
                <div className="space-y-2">
                    <h2 className="text-xl uppercase">4. Delivery Times</h2>
                    <p className="text-sm tracking-wide font-light">
                        Delivery times depend on your location and shipping method. Business days exclude weekends and national holidays. Estimated times after processing:
                    </p>
                    <div className="overflow-x-auto">
                        <table className="w-full border border-border text-sm">
                            <thead className="bg-muted">
                                <tr>
                                    <th className="p-3 text-left">Location</th>
                                    <th className="p-3 text-left">Standard Delivery</th>
                                    <th className="p-3 text-left">Express Delivery</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-t">
                                    <td className="p-3">Metro Cities (e.g., Mumbai, Delhi)</td>
                                    <td className="p-3">2-5 business days</td>
                                    <td className="p-3">1-3 business days</td>
                                </tr>
                                <tr className="border-t">
                                    <td className="p-3">Urban/Other Regions</td>
                                    <td className="p-3">5-9 business days</td>
                                    <td className="p-3">3-5 business days</td>
                                </tr>
                                <tr className="border-t">
                                    <td className="p-3">Remote Areas</td>
                                    <td className="p-3">7-14 business days</td>
                                    <td className="p-3">5-7 business days</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <p className="mt-2 text-xs text-foreground-tertiary">*Times are estimates and may vary due to external factors like weather or strikes.</p>
                </div>

                {/* 5. Shipping Charges */}
                <div className="space-y-2">
                    <h2 className="text-xl uppercase">5. Shipping Charges</h2>
                    <p className="text-sm tracking-wide font-light">
                        Shipping costs are calculated based on weight, dimensions, destination, and method. We offer:
                    </p>
                    <ul className="list-inside list-disc space-y-2 text-sm tracking-wide font-light">
                        <li>Free shipping on all prepaid orders over $149.</li>
                        <li>A flat shipping fee applies for orders below $149 (standard shipping).</li>
                        <li>Additional fees for COD orders, depending on location.</li>
                        <li>Express shipping available at an additional cost, based on package details.</li>
                        <li>International: Variable rates, plus customs duties where applicable.</li>
                    </ul>
                    <p className="text-sm tracking-wide font-light">
                        Costs are displayed at checkout. We recommend prepaid orders to avoid COD fees and qualify for free shipping.
                    </p>
                </div>

                {/* 6. Tracking Your Order */}
                <div className="space-y-2">
                    <h2 className="text-xl uppercase">6. Tracking Your Order</h2>
                    <p className="text-sm tracking-wide font-light">
                        Upon shipment, you will receive a tracking number via email and SMS. Track your order directly on our website or the courier's portal. For assistance, contact support.
                    </p>
                </div>

                {/* 7. Undeliverable or Returned Packages */}
                <div className="space-y-2">
                    <h2 className="text-xl uppercase">7. Undeliverable or Returned Packages</h2>
                    <p className="text-sm tracking-wide font-light">
                        If a package is undeliverable due to incorrect address, failed attempts, or refusal, it will be returned to us. We will contact you for reshipping, which may incur additional charges. Please ensure accurate address details at checkout.
                    </p>
                </div>

                {/* 8. Damaged, Lost, or Delayed Items */}
                <div className="space-y-2">
                    <h2 className="text-xl uppercase">8. Damaged, Lost, or Delayed Items</h2>
                    <p className="text-sm tracking-wide font-light">
                        Report any damaged or lost items within 48 hours of delivery attempt via <Link href="mailto:support@vellehide.com" className="hover:underline">support@vellehide.com</Link> with photos and order details. We offer shipping insurance for high-value items and will investigate claims promptly, providing replacements or refunds as per our return policy. Delays beyond our control (e.g., natural disasters) are not eligible for compensation.
                    </p>
                </div>

                {/* 9. Customs and International Shipping */}
                <div className="space-y-2">
                    <h2 className="text-xl uppercase">9. Customs and International Shipping</h2>
                    <p className="text-sm tracking-wide font-light">
                        For international orders, customers are responsible for customs duties, taxes, and import fees. Delivery times may extend to 10-21 days. We comply with all export regulations.
                    </p>
                </div>

                {/* 10. Policy Updates */}
                <div className="space-y-2">
                    <h2 className="text-xl uppercase">10. Policy Updates</h2>
                    <p className="text-sm tracking-wide font-light">
                        We may update this policy periodically. Changes will be posted here with a new effective date. Continued use of our services indicates acceptance.
                    </p>
                </div>

                {/* 11. Contact Us */}
                <div className="space-y-2">
                    <h2 className="text-xl uppercase">11. Contact Us</h2>
                    <p className="text-sm tracking-wide font-light">
                        For any shipping-related questions, reach out to us at <Link href="mailto:support@vellehide.com" className="hover:underline">support@vellehide.com</Link>. We're here to assist!
                    </p>
                </div>
            </section>
        </>
    )
}