export default function TermsOfSale() {
    return (
        <>
            <header className="mb-8">
                <h1 className="text-3xl uppercase tracking-tight">Terms and Conditions</h1>
                <p className="mt-2 text-sm text-foreground-muted">Effective Date: August 28, 2025</p>
            </header>
            <section className="max-w-none space-y-4">
                <p className="text-sm tracking-wide font-light">
                    Welcome to VelleHide. These Terms and Conditions ("Terms") govern your access to and use of our website ("Site"), products, and services. By accessing or using the Site, placing an order, or engaging with our services, you agree to be bound by these Terms, our Privacy Policy, Shipping Policy, and Return & Refund Policy. If you do not agree, please do not use our Site or services. VelleHide specializes in cross-border retail exports from India via our e-commerce platform, and these Terms are compliant with Indian laws including the Information Technology Act, 2000, Consumer Protection Act, 2019, and export regulations under the Foreign Trade (Development and Regulation) Act, 1992.
                </p>

                {/* 1. Acceptance of Terms */}
                <div className="space-y-2">
                    <h2 className="text-xl uppercase">1. Acceptance of Terms</h2>
                    <p className="text-sm tracking-wide font-light">
                        By using our Site, you confirm that you are at least 18 years old or have the legal capacity to enter into a binding agreement. You agree to comply with all applicable laws, including those of your country of residence for cross-border purchases.
                    </p>
                </div>

                {/* 2. User Accounts */}
                <div className="space-y-2">
                    <h2 className="text-xl uppercase">2. User Accounts</h2>
                    <p className="text-sm tracking-wide font-light">
                        To place orders or access certain features, you may need to create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account. Notify us immediately of any unauthorized use at <a href="mailto:support@vellehide.com" className="hover:underline">support@vellehide.com</a>. We reserve the right to terminate accounts for violations of these Terms.
                    </p>
                </div>

                {/* 3. Product Information and Availability */}
                <div className="space-y-2">
                    <h2 className="text-xl uppercase">3. Product Information and Availability</h2>
                    <p className="text-sm tracking-wide font-light">
                        We strive to provide accurate product descriptions, images, pricing, and availability. However, as handcrafted items, slight variations may occur. Prices are in INR or equivalent currencies and exclude import duties, taxes, or fees applicable in your country. We reserve the right to correct errors, change prices, or discontinue products without notice. Availability is subject to stock; we may cancel orders if items are unavailable.
                    </p>
                </div>

                {/* 4. Orders, Pricing, and Payments */}
                <div className="space-y-2">
                    <h2 className="text-xl uppercase">4. Orders, Pricing, and Payments</h2>
                    <p className="text-sm tracking-wide font-light">
                        All orders are subject to acceptance and availability. By placing an order, you authorize us to charge your payment method. We accept payments via secure third-party gateways (e.g., Razorpay, Stripe). For cross-border sales, prices include Indian GST where applicable, but you are responsible for any import duties, customs fees, VAT, or taxes in your country. We comply with Indian export regulations; prohibited items will not be shipped. Order confirmation emails are sent upon acceptance.
                    </p>
                </div>

                {/* 5. Shipping and Delivery */}
                <div className="space-y-2">
                    <h2 className="text-xl uppercase">5. Shipping and Delivery</h2>
                    <p className="text-sm tracking-wide font-light">
                        Shipping is handled as per our <a href="/policy/shipping-policy" className="hover:underline">Shipping Policy</a>. For international orders, delivery times may vary due to customs processing. You bear the risk of loss once the order is shipped. We are not liable for delays caused by carriers, customs, or force majeure events.
                    </p>
                </div>

                {/* 6. Returns, Exchanges, and Refunds */}
                <div className="space-y-2">
                    <h2 className="text-xl uppercase">6. Returns, Exchanges, and Refunds</h2>
                    <p className="text-sm tracking-wide font-light">
                        Returns and refunds are governed by our <a href="/policy/return-and-refund-policy" className="hover:underline">Return & Refund Policy</a>. For cross-border returns, you are responsible for return shipping and any associated duties or fees.
                    </p>
                </div>

                {/* 7. Intellectual Property */}
                <div className="space-y-2">
                    <h2 className="text-xl uppercase">7. Intellectual Property</h2>
                    <p className="text-sm tracking-wide font-light">
                        All content on the Site, including text, images, logos, designs, and trademarks, is owned by VelleHide or licensed to us and protected under Indian and international intellectual property laws. You may not reproduce, distribute, or create derivative works without our prior written consent. Unauthorized use may result in legal action.
                    </p>
                </div>

                {/* 8. User Conduct */}
                <div className="space-y-2">
                    <h2 className="text-xl uppercase">8. User Conduct</h2>
                    <p className="text-sm tracking-wide font-light">
                        You agree not to use the Site for unlawful purposes, including but not limited to: transmitting harmful code, infringing IP rights, or engaging in fraudulent activities. We may monitor usage to ensure compliance.
                    </p>
                </div>

                {/* 9. Limitation of Liability */}
                <div className="space-y-2">
                    <h2 className="text-xl uppercase">9. Limitation of Liability</h2>
                    <p className="text-sm tracking-wide font-light">
                        To the fullest extent permitted by law, VelleHide, its affiliates, and agents shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Site or products, even if advised of the possibility. Our total liability shall not exceed the amount paid by you for the relevant product.
                    </p>
                </div>

                {/* 10. Indemnification */}
                <div className="space-y-2">
                    <h2 className="text-xl uppercase">10. Indemnification</h2>
                    <p className="text-sm tracking-wide font-light">
                        You agree to indemnify and hold harmless VelleHide, its officers, directors, employees, and agents from any claims, damages, losses, or expenses arising from your violation of these Terms, misuse of the Site, or infringement of third-party rights.
                    </p>
                </div>

                {/* 11. Privacy Policy */}
                <div className="space-y-2">
                    <h2 className="text-xl uppercase">11. Privacy Policy</h2>
                    <p className="text-sm tracking-wide font-light">
                        Your use of the Site is also subject to our <a href="/policy/privacy-policy" className="hover:underline">Privacy Policy</a>, which explains how we collect, use, and protect your personal information.
                    </p>
                </div>

                {/* 12. Governing Law and Dispute Resolution */}
                <div className="space-y-2">
                    <h2 className="text-xl uppercase">12. Governing Law and Dispute Resolution</h2>
                    <p className="text-sm tracking-wide font-light">
                        These Terms are governed by the laws of India, without regard to conflict of laws principles. Any disputes arising shall be resolved through arbitration in Mumbai, Maharashtra, under the Arbitration and Conciliation Act, 1996, or in the exclusive jurisdiction of courts in Mumbai if arbitration is not applicable.
                    </p>
                </div>

                {/* 13. Force Majeure */}
                <div className="space-y-2">
                    <h2 className="text-xl uppercase">13. Force Majeure</h2>
                    <p className="text-sm tracking-wide font-light">
                        We shall not be liable for delays or failures due to events beyond our control, including natural disasters, wars, strikes, or governmental actions.
                    </p>
                </div>

                {/* 14. Modifications to Terms */}
                <div className="space-y-2">
                    <h2 className="text-xl uppercase">14. Modifications to Terms</h2>
                    <p className="text-sm tracking-wide font-light">
                        We may update these Terms at any time. Changes will be posted on the Site with a revised effective date. Continued use constitutes acceptance of the updated Terms.
                    </p>
                </div>

                {/* 15. Severability and Entire Agreement */}
                <div className="space-y-2">
                    <h2 className="text-xl uppercase">15. Severability and Entire Agreement</h2>
                    <p className="text-sm tracking-wide font-light">
                        If any provision is held invalid, the remainder shall remain in effect. These Terms, along with incorporated policies, constitute the entire agreement between you and VelleHide.
                    </p>
                </div>

                {/* 16. Contact Us */}
                <div className="space-y-2">
                    <h2 className="text-xl uppercase">16. Contact Us</h2>
                    <p className="text-sm tracking-wide font-light">
                        For questions or concerns, contact us at <a href="mailto:support@vellehide.com" className="hover:underline">support@vellehide.com</a>.
                    </p>
                </div>
            </section>
        </>
    )
}