import Link from "next/link";

export default function ReturnRefundPolicy() {
    return (
        <>
            <header className="mb-8">
                <h1 className="text-3xl uppercase tracking-tight">Return & Refund Policy</h1>
                <p className="mt-2 text-sm text-foreground-muted">Effective Date: August 28, 2025</p>
            </header>
            <section className="max-w-none space-y-4">
                <p className="text-sm tracking-wide font-light">
                    At Velle Hide, we take pride in our craftsmanship and are committed to ensuring your satisfaction. We want you to love your purchase. If something isn’t right, we’re here to help with an easy and transparent process. This policy covers returns and exchanges for orders shipped within India.
                </p>

                {/* 1. Eligibility for Returns */}
                <div className="space-y-2">
                    <h2 className="text-xl uppercase">1. Eligibility for Returns</h2>
                    <p className="text-sm tracking-wide font-light">
                        We accept returns for both defective and non-defective products. To be eligible for a return:
                    </p>
                    <ul className="list-inside list-disc space-y-2 text-sm tracking-wide font-light">
                        <li>The item must be new, unused, and unworn with all original tags and packaging intact.</li>
                        <li>Requests must be initiated within 14 days of delivery.</li>
                        <li>Custom-made or personalized products are non-returnable unless defective or damaged on arrival.</li>
                        <li>Items marked as final sale, clearance, gift cards, or downloadable content are non-returnable.</li>
                    </ul>
                </div>

                {/* 2. Return Process */}
                <div className="space-y-2">
                    <h2 className="text-xl uppercase">2. Return Process</h2>
                    <p className="text-sm tracking-wide font-light">
                        To initiate a return:
                    </p>
                    <ol className="list-inside list-decimal space-y-2 text-sm tracking-wide font-light">
                        <li>Go to your order on our website or contact our support team at <Link href="mailto:support@vellehide.com" className="hover:underline">support@vellehide.com</Link> with your order number and reason for return.</li>
                        <li>Download and print the free return label.</li>
                        <li>Pack your item securely, attach the label, and send it back by mail to the provided return shipping address.</li>
                    </ol>
                    <p className="text-sm tracking-wide font-light">
                        Once your item reaches us, we’ll inspect it and update you by email on the approval status.
                    </p>
                </div>

                {/* 3. Fees & Refunds */}
                <div className="space-y-2">
                    <h2 className="text-xl uppercase">3. Fees & Refunds</h2>
                    <ul className="list-inside list-disc space-y-2 text-sm tracking-wide font-light">
                        <li><strong>Non-defective returns:</strong> A 15% restocking fee is deducted from the product price.</li>
                        <li><strong>Defective items:</strong> The restocking fee is waived. You may choose a refund or exchange.</li>
                        <li><strong>Refund timing:</strong> Approved refunds are issued to the original payment method within 2 business days after inspection.</li>
                        <li>Original shipping charges are non-refundable unless the item is defective or incorrect.</li>
                    </ul>
                </div>

                {/* 4. Exchanges */}
                <div className="space-y-2">
                    <h2 className="text-xl uppercase">4. Exchanges</h2>
                    <p className="text-sm tracking-wide font-light">
                        Exchanges are accepted for reasons like size, fit, or style, as well as for defective items. If there’s a price difference, we’ll charge or refund the difference accordingly once your original item is received and approved. For defective or damaged products, contact us within 48 hours of delivery with photos and a description for expedited handling.
                    </p>
                </div>

                {/* 5. Shipping Costs */}
                <div className="space-y-2">
                    <h2 className="text-xl uppercase">5. Shipping Costs</h2>
                    <p className="text-sm tracking-wide font-light">
                        You are responsible for return shipping costs unless the item is defective or incorrect. We recommend using a trackable shipping service or purchasing shipping insurance, as we cannot guarantee receipt of your returned item without it.
                    </p>
                </div>

                {/* 6. Late or Missing Refunds */}
                <div className="space-y-2">
                    <h2 className="text-xl uppercase">6. Late or Missing Refunds</h2>
                    <p className="text-sm tracking-wide font-light">
                        If you haven’t received a refund yet:
                    </p>
                    <ul className="list-inside list-disc space-y-2 text-sm tracking-wide font-light">
                        <li>Double-check your bank account or credit card statement.</li>
                        <li>Contact your payment provider; it may take additional time to post the refund.</li>
                        <li>If you still have not received your refund after 10 business days, contact us at <Link href="mailto:support@vellehide.com" className="hover:underline">support@vellehide.com</Link>.</li>
                    </ul>
                </div>

                {/* 7. Policy Updates */}
                <div className="space-y-2">
                    <h2 className="text-xl uppercase">7. Policy Updates</h2>
                    <p className="text-sm tracking-wide font-light">
                        We may update this Return & Refund Policy at any time. Changes will be posted on this page with a revised effective date. Continued use of our services implies your acceptance of the updated policy.
                    </p>
                </div>

                {/* Quick Summary */}
                <div className="space-y-2">
                    <h2 className="text-xl uppercase">Quick Summary</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full border border-border text-sm">
                            <thead className="bg-background-muted">
                                <tr>
                                    <th className="p-3 text-left">Item Type</th>
                                    <th className="p-3 text-left">Window</th>
                                    <th className="p-3 text-left">Condition</th>
                                    <th className="p-3 text-left">Restocking Fee</th>
                                    <th className="p-3 text-left">Refund Timing*</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-t">
                                    <td className="p-3">Defective & Exchange</td>
                                    <td className="p-3">14 days</td>
                                    <td className="p-3">New, unused</td>
                                    <td className="p-3">0%</td>
                                    <td className="p-3">2 business days</td>
                                </tr>
                                <tr className="border-t">
                                    <td className="p-3">Non-defective Return</td>
                                    <td className="p-3">14 days</td>
                                    <td className="p-3">New, unused</td>
                                    <td className="p-3">15%</td>
                                    <td className="p-3">2 business days</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <p className="mt-2 text-xs text-foreground-disabled">*After your return is received and approved.</p>
                </div>

                {/* Contact Us */}
                <div className="space-y-2">
                    <h2 className="text-xl uppercase">Questions?</h2>
                    <p className="text-sm tracking-wide font-light">
                        We’re here to help. Email us at <Link href="mailto:support@vellehide.com" className="hover:underline">support@vellehide.com</Link> and we’ll get back to you quickly.
                    </p>
                </div>
            </section>
        </>
    )
}