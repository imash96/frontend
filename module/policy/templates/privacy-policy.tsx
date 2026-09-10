export default function PrivacyPolicy() {
    return (
        <>
            <header className="mb-8">
                <h1 className="text-3xl uppercase tracking-tight">Privacy Policy</h1>
                <p className="mt-2 text-sm text-foreground-muted">Effective Date: August 28, 2025</p>
            </header>
            <section className="max-w-none space-y-4">
                <p className="text-sm tracking-wide font-light">
                    At VelleHide, your privacy is of utmost importance to us. This Privacy Policy outlines how we collect, use, disclose, and safeguard your personal information when you visit our website, make a purchase, or interact with our services. We are committed to complying with applicable Indian laws, including the Information Technology Act, 2000, the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011, and the Digital Personal Data Protection Act, 2023 (DPDP Act). By using our website, you consent to the practices described in this policy.
                </p>

                {/* 1. Information We Collect */}
                <div className="space-y-2">
                    <h2 className="text-xl uppercase">1. Information We Collect</h2>
                    <p className="text-sm tracking-wide font-light">
                        We collect various types of information to provide and improve our services. This includes personal data and sensitive personal data as defined under Indian law.
                    </p>
                    <ul className="list-inside list-disc space-y-2 text-sm tracking-wide font-light">
                        <li><strong>Personal Information:</strong> Name, email address, phone number, billing and shipping addresses.</li>
                        <li><strong>Payment Information:</strong> Processed securely via third-party providers (e.g., Razorpay, Stripe). We do not store your full card details, but may retain partial information for transaction records.</li>
                        <li><strong>Order History:</strong> Details of products purchased, returns, exchanges, and support communications.</li>
                        <li><strong>Usage Data:</strong> IP address, browser type, device information, pages visited, and interaction data (collected via cookies and analytics tools like Google Analytics).</li>
                        <li><strong>Sensitive Personal Data:</strong> Financial information (e.g., bank or payment details), if applicable, handled with enhanced security measures.</li>
                        <li><strong>Data from Social Networks and Third Parties:</strong> If you connect via social media (e.g., Facebook, Google), we may collect profile information with your consent.</li>
                        <li><strong>Mobile Device Data:</strong> If accessing via mobile, device ID, location (with consent), and push notification preferences.</li>
                    </ul>
                </div>

                {/* 2. How We Use Your Information */}
                <div className="space-y-2">
                    <h2 className="text-xl uppercase">2. How We Use Your Information</h2>
                    <p className="text-sm tracking-wide font-light">
                        Your information helps us deliver a seamless experience and is used solely for legitimate purposes:
                    </p>
                    <ul className="list-inside list-disc space-y-2 text-sm tracking-wide font-light">
                        <li>Processing and fulfilling orders, including shipping and payment handling.</li>
                        <li>Sending order updates, shipping notifications, and promotional offers (with your consent).</li>
                        <li>Improving website functionality, customer service, and personalized recommendations.</li>
                        <li>Preventing fraud, detecting security threats, and ensuring compliance with laws.</li>
                        <li>Analyzing site usage for better user experience and marketing insights.</li>
                        <li>Complying with legal, tax, or regulatory obligations.</li>
                    </ul>
                </div>

                {/* 3. Sharing Your Information */}
                <div className="space-y-2">
                    <h2 className="text-xl uppercase">3. Sharing Your Information</h2>
                    <p className="text-sm tracking-wide font-light">
                        We do not sell, rent, or trade your personal information. Sharing occurs only when necessary and with trusted parties:
                    </p>
                    <ul className="list-inside list-disc space-y-2 text-sm tracking-wide font-light">
                        <li>Payment processors (e.g., Razorpay) to complete transactions.</li>
                        <li>Shipping and logistics providers (e.g., India Post, Delhivery) to deliver orders.</li>
                        <li>Marketing tools (e.g., Mailchimp, Klaviyo) for email campaigns, with opt-out options.</li>
                        <li>Analytics providers (e.g., Google Analytics) for site performance.</li>
                        <li>Legal authorities or regulators when required by law, such as under court orders or for fraud prevention.</li>
                        <li>Affiliates or business partners in case of mergers, acquisitions, or asset sales.</li>
                    </ul>
                    <p className="text-sm tracking-wide font-light">
                        All third parties are bound by contractual obligations to protect your data and use it only for specified purposes.
                    </p>
                </div>

                {/* 4. Cookies & Tracking */}
                <div className="space-y-2">
                    <h2 className="text-xl uppercase">4. Cookies & Tracking</h2>
                    <p className="text-sm tracking-wide font-light">
                        We use cookies, web beacons, and similar technologies to enhance your experience:
                    </p>
                    <ul className="list-inside list-disc space-y-2 text-sm tracking-wide font-light">
                        <li>Maintaining your shopping cart and preferences.</li>
                        <li>Analyzing traffic patterns and user behavior.</li>
                        <li>Delivering personalized ads via platforms like Google Ads.</li>
                    </ul>
                    <p className="text-sm tracking-wide font-light">
                        You can manage cookies through your browser settings or opt-out tools like the Network Advertising Initiative (NAI) opt-out page. Disabling cookies may limit site functionality.
                    </p>
                </div>

                {/* 5. Your Rights */}
                <div className="space-y-2">
                    <h2 className="text-xl uppercase">5. Your Rights</h2>
                    <p className="text-sm tracking-wide font-light">
                        Under the DPDP Act and other applicable laws, you have rights regarding your data:
                    </p>
                    <ul className="list-inside list-disc space-y-2 text-sm tracking-wide font-light">
                        <li>Access, correct, or update your personal information.</li>
                        <li>Request deletion or erasure of your data (subject to legal retention requirements).</li>
                        <li>Withdraw consent for data processing at any time.</li>
                        <li>Opt out of marketing communications via unsubscribe links or by contacting us.</li>
                        <li>Nominate a representative for data handling in case of incapacity.</li>
                    </ul>
                    <p className="text-sm tracking-wide font-light">
                        To exercise these rights, email us at <a href="mailto:support@vellehide.com" className="hover:underline">support@vellehide.com</a>. We will respond within the timelines prescribed by law.
                    </p>
                </div>

                {/* 6. Data Retention */}
                <div className="space-y-2">
                    <h2 className="text-xl uppercase">6. Data Retention</h2>
                    <p className="text-sm tracking-wide font-light">
                        We retain your data only as long as necessary for the purposes outlined, including:
                    </p>
                    <ul className="list-inside list-disc space-y-2 text-sm tracking-wide font-light">
                        <li>Fulfilling orders and providing ongoing support.</li>
                        <li>Meeting legal, accounting, or reporting requirements (e.g., tax records for 7 years).</li>
                        <li>Resolving disputes or enforcing agreements.</li>
                    </ul>
                    <p className="text-sm tracking-wide font-light">
                        After the retention period, data is securely deleted or anonymized.
                    </p>
                </div>

                {/* 7. Third-Party Links */}
                <div className="space-y-2">
                    <h2 className="text-xl uppercase">7. Third-Party Links</h2>
                    <p className="text-sm tracking-wide font-light">
                        Our site may link to external websites (e.g., social media, payment gateways). We are not responsible for their privacy practices. Review their policies before providing information.
                    </p>
                </div>

                {/* 8. Security */}
                <div className="space-y-2">
                    <h2 className="text-xl uppercase">8. Security</h2>
                    <p className="text-sm tracking-wide font-light">
                        We employ industry-standard measures, including SSL/TLS encryption, firewalls, and access controls, to protect your data. However, no method is 100% secure, and we cannot guarantee absolute security.
                    </p>
                </div>

                {/* 9. Children's Privacy */}
                <div className="space-y-2">
                    <h2 className="text-xl uppercase">9. Children's Privacy</h2>
                    <p className="text-sm tracking-wide font-light">
                        Our services are not directed at children under 18 years. We do not knowingly collect personal information from minors. If we discover such data, we will delete it promptly. Parents/guardians should contact us if they believe their child's data has been collected.
                    </p>
                </div>

                {/* 10. Grievance Officer */}
                <div className="space-y-2">
                    <h2 className="text-xl uppercase">10. Grievance Officer</h2>
                    <p className="text-sm tracking-wide font-light">
                        As required under the Information Technology Rules, we have appointed a Grievance Officer to address any concerns regarding data handling. Contact: [Name], Email: <a href="mailto:support@vellehide.com" className="hover:underline">support@vellehide.com</a>. Grievances will be resolved within one month.
                    </p>
                </div>

                {/* 11. Policy Updates */}
                <div className="space-y-2">
                    <h2 className="text-xl uppercase">11. Policy Updates</h2>
                    <p className="text-sm tracking-wide font-light">
                        We may update this policy periodically. Changes will be posted here with a revised effective date. Continued use of our site constitutes acceptance of the updates.
                    </p>
                </div>

                {/* 12. Contact Us */}
                <div className="space-y-2">
                    <h2 className="text-xl uppercase">12. Contact Us</h2>
                    <p className="text-sm tracking-wide font-light">
                        For questions, concerns, or to exercise your rights, contact us at:
                    </p>
                    <p className="text-sm tracking-wide font-light">
                        📧 <a href="mailto:support@vellehide.com" className="hover:underline">support@vellehide.com</a>
                    </p>
                </div>
            </section>
        </>
    )
}