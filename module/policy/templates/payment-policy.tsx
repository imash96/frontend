import Link from "next/link";

export default function PaymentPolicy() {
    return (
        <>
            <header className="mb-8">
                <h1 className="text-3xl uppercase text-templateBrown font-light tracking-tight">Payment Policy</h1>
                <p className="mt-2 text-sm text-foreground-muted">Effective Date: August 28, 2025</p>
            </header>
            <section className="max-w-none space-y-4">
                <p className="text-sm tracking-wide font-light">
                    At VelleHide, we offer secure and convenient payment options for our cross-border retail exports from India. This Payment Policy outlines the accepted methods, processing, security measures, and related procedures to ensure a smooth transaction experience. All payments are handled in compliance with Indian laws, including the Payment and Settlement Systems Act, 2007, and RBI guidelines for e-commerce exports.
                </p>

                {/* 1. Accepted Payment Methods */}
                <div className="space-y-2">
                    <h2 className="text-xl uppercase text-templateBrown font-light">1. Accepted Payment Methods</h2>
                    <p className="text-sm tracking-wide font-light">
                        We support a variety of payment options to accommodate both domestic and international customers:
                    </p>
                    <ul className="list-inside list-disc space-y-2 text-sm tracking-wide font-light">
                        <li><strong>Credit/Debit Cards:</strong> Visa, MasterCard, American Express, and others processed via secure gateways.</li>
                        <li><strong>UPI and Wallets:</strong> Google Pay, PhonePe, Paytm, and other RBI-approved digital wallets (for Indian customers).</li>
                        <li><strong>Net Banking:</strong> Available for major Indian banks.</li>
                        <li><strong>International Payments:</strong> Via Stripe or PayPal for global cards and methods, supporting multiple currencies.</li>
                        <li><strong>Cash on Delivery (COD):</strong> Limited to select Indian locations with additional fees; not available for international orders.</li>
                    </ul>
                    <p className="text-sm tracking-wide font-light">
                        Payment methods are displayed at checkout based on your location and order details.
                    </p>
                </div>

                {/* 2. Currency and Pricing */}
                <div className="space-y-2">
                    <h2 className="text-xl uppercase text-templateBrown font-light">2. Currency and Pricing</h2>
                    <p className="text-sm tracking-wide font-light">
                        All prices on our Site are listed in Indian Rupees (INR). For international customers, payments may be converted to your local currency by your bank or payment provider at the prevailing exchange rate. You are responsible for any currency conversion fees or international transaction charges imposed by your financial institution.
                    </p>
                    <p className="text-sm tracking-wide font-light">
                        Prices include Indian GST where applicable but exclude any import duties, taxes, or customs fees in your country. Final charges are confirmed at checkout.
                    </p>
                </div>

                {/* 3. Payment Processing */}
                <div className="space-y-2">
                    <h2 className="text-xl uppercase text-templateBrown font-light">3. Payment Processing</h2>
                    <p className="text-sm tracking-wide font-light">
                        Payments are processed securely through third-party gateways (e.g., Razorpay for India, Stripe for international). We do not store your full card details on our servers. Upon successful payment, you will receive an email confirmation with order details.
                    </p>
                    <p className="text-sm tracking-wide font-light">
                        Orders are only processed after payment authorization. In case of payment failure, you will be notified, and the order will not proceed until resolved.
                    </p>
                </div>

                {/* 4. Security Measures */}
                <div className="space-y-2">
                    <h2 className="text-xl uppercase text-templateBrown font-light">4. Security Measures</h2>
                    <p className="text-sm tracking-wide font-light">
                        We prioritize your security:
                    </p>
                    <ul className="list-inside list-disc space-y-2 text-sm tracking-wide font-light">
                        <li>All transactions are encrypted using SSL/TLS technology.</li>
                        <li>Our payment partners are PCI-DSS compliant to protect card information.</li>
                        <li>We implement fraud detection tools to safeguard against unauthorized transactions.</li>
                    </ul>
                    <p className="text-sm tracking-wide font-light">
                        For more on data protection, refer to our <Link href="/policy/privacy-policy" className="text-templateBrown hover:underline">Privacy Policy</Link>.
                    </p>
                </div>

                {/* 5. Billing and Charges */}
                <div className="space-y-2">
                    <h2 className="text-xl uppercase text-templateBrown font-light">5. Billing and Charges</h2>
                    <p className="text-sm tracking-wide font-light">
                        You will be charged the total amount displayed at checkout, including product price, shipping (as per our <Link href="/policy/shipping-policy" className="text-templateBrown hover:underline">Shipping Policy</Link>), and applicable taxes. No hidden fees will be added post-checkout.
                    </p>
                    <p className="text-sm tracking-wide font-light">
                        For recurring or subscription services (if applicable), charges will be automatic based on your selected plan.
                    </p>
                </div>

                {/* 6. Failed or Disputed Payments */}
                <div className="space-y-2">
                    <h2 className="text-xl uppercase text-templateBrown font-light">6. Failed or Disputed Payments</h2>
                    <p className="text-sm tracking-wide font-light">
                        If a payment fails due to insufficient funds, expired card, or other issues, we will notify you via email. You can retry with an alternative method. For disputes or chargebacks, contact us within 7 days; unwarranted chargebacks may result in account suspension.
                    </p>
                </div>

                {/* 7. Refunds and Cancellations */}
                <div className="space-y-2">
                    <h2 className="text-xl uppercase text-templateBrown font-light">7. Refunds and Cancellations</h2>
                    <p className="text-sm tracking-wide font-light">
                        Refunds are processed as per our <Link href="/policy/return-and-refund-policy" className="text-templateBrown hover:underline">Return & Refund Policy</Link>. Approved refunds are issued to the original payment method within 2 business days, though bank processing may take 5–10 days. For international refunds, currency conversion applies.
                    </p>
                    <p className="text-sm tracking-wide font-light">
                        Orders can be canceled before shipment for a full refund; post-shipment cancellations follow the return policy.
                    </p>
                </div>

                {/* 8. Policy Updates */}
                <div className="space-y-2">
                    <h2 className="text-xl uppercase text-templateBrown font-light">8. Policy Updates</h2>
                    <p className="text-sm tracking-wide font-light">
                        We may update this Payment Policy periodically. Changes will be posted here with a revised effective date. Continued use of our Site constitutes acceptance.
                    </p>
                </div>

                {/* 9. Contact Us */}
                <div className="space-y-2">
                    <h2 className="text-xl uppercase text-templateBrown font-light">9. Contact Us</h2>
                    <p className="text-sm tracking-wide font-light">
                        For payment-related inquiries, contact us at <Link href="mailto:support@vellehide.com" className="text-templateBrown hover:underline">support@vellehide.com</Link>. We're committed to resolving issues promptly.
                    </p>
                </div>
            </section>
        </>
    )
}