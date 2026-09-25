import Link from "next/link"

export default function WarrantyRepairs() {
    return (
        <>
            <header className="mb-8">
                <h1 className="text-3xl uppercase tracking-tight">Warranty & Repairs</h1>
                <p className="mt-2 text-sm text-foreground-muted">Our Commitment to Quality — Built to Last, Backed by Us</p>
            </header>
            <section className="max-w-none space-y-6">
                <p className="text-sm tracking-wide font-light">
                    Every VelleHide product is handcrafted with precision and pride in our own manufacturing workshop. We stand behind the quality of our craftsmanship and materials. If something doesn&apos;t meet our standards, we&apos;ll make it right.
                </p>

                {/* 1. Warranty Coverage */}
                <div className="space-y-3">
                    <h2 className="text-xl uppercase">1. Warranty Coverage</h2>
                    <p className="text-sm tracking-wide font-light">
                        All VelleHide products come with a craftsmanship warranty from the date of delivery:
                    </p>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm border-collapse">
                            <thead>
                                <tr className="border-b border-border">
                                    <th className="text-left py-3 px-4 font-semibold uppercase text-xs tracking-wider">Product Category</th>
                                    <th className="text-left py-3 px-4 font-semibold uppercase text-xs tracking-wider">Warranty Period</th>
                                </tr>
                            </thead>
                            <tbody className="font-light tracking-wide">
                                <tr className="border-b border-border/50"><td className="py-3 px-4">Leather Jackets, Coats & Blazers</td><td className="py-3 px-4">1 Year</td></tr>
                                <tr className="border-b border-border/50"><td className="py-3 px-4">Leather Pants, Skirts & Shorts</td><td className="py-3 px-4">1 Year</td></tr>
                                <tr className="border-b border-border/50"><td className="py-3 px-4">Bags, Wallets & Accessories</td><td className="py-3 px-4">6 Months</td></tr>
                                <tr className="border-b border-border/50"><td className="py-3 px-4">Pillow Covers & Home Goods</td><td className="py-3 px-4">6 Months</td></tr>
                                <tr><td className="py-3 px-4">Bespoke / Custom Orders</td><td className="py-3 px-4">1 Year</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* 2. What's Covered */}
                <div className="space-y-3">
                    <h2 className="text-xl uppercase">2. What&apos;s Covered</h2>
                    <ul className="list-inside list-disc space-y-2 text-sm tracking-wide font-light">
                        <li><strong>Stitching Defects:</strong> Unraveling seams, loose threads, or stitching failures under normal use.</li>
                        <li><strong>Hardware Failures:</strong> Zippers, snaps, buckles, or rivets that break or malfunction due to manufacturing defects.</li>
                        <li><strong>Leather Defects:</strong> Peeling, delamination, or cracking of the leather surface not caused by misuse or neglect.</li>
                        <li><strong>Lining Issues:</strong> Tearing or separation of the inner lining from the shell under normal wear.</li>
                        <li><strong>Color Defects:</strong> Excessive or uneven dye bleeding not caused by external factors.</li>
                    </ul>
                </div>

                {/* 3. What's Not Covered */}
                <div className="space-y-3">
                    <h2 className="text-xl uppercase">3. What&apos;s Not Covered</h2>
                    <ul className="list-inside list-disc space-y-2 text-sm tracking-wide font-light">
                        <li>Normal wear and tear, including natural aging, patina development, and minor surface scratches.</li>
                        <li>Damage caused by misuse, accidents, improper storage, or exposure to extreme conditions.</li>
                        <li>Water damage, chemical exposure, or contact with harsh substances.</li>
                        <li>Alterations or repairs performed by third parties.</li>
                        <li>Color fading due to prolonged sun exposure.</li>
                        <li>Products purchased from unauthorized resellers.</li>
                    </ul>
                </div>

                {/* 4. Repair Services */}
                <div className="space-y-3">
                    <h2 className="text-xl uppercase">4. Repair Services</h2>
                    <p className="text-sm tracking-wide font-light">
                        Even outside the warranty period, our workshop offers repair and restoration services:
                    </p>
                    <ul className="list-inside list-disc space-y-2 text-sm tracking-wide font-light">
                        <li><strong>Zipper Replacement:</strong> Full or partial zipper replacement with matching hardware.</li>
                        <li><strong>Re-stitching:</strong> Reinforcement or repair of seams and stitching.</li>
                        <li><strong>Lining Replacement:</strong> Complete or partial lining replacement in your choice of fabric.</li>
                        <li><strong>Leather Patch Repair:</strong> Matching leather patches for tears, holes, or worn areas.</li>
                        <li><strong>Hardware Replacement:</strong> Replacement of snaps, buckles, rivets, and buttons.</li>
                        <li><strong>Re-dyeing & Color Restoration:</strong> Professional re-dyeing to refresh faded or worn leather.</li>
                        <li><strong>Resizing & Alterations:</strong> Adjustments to fit — taking in, letting out, shortening sleeves, or adjusting hems.</li>
                    </ul>
                    <p className="text-sm tracking-wide font-light text-foreground-muted italic">
                        Repair pricing varies based on the type of service. Contact us for a quote.
                    </p>
                </div>

                {/* 5. How to File a Claim */}
                <div className="space-y-3">
                    <h2 className="text-xl uppercase">5. How to File a Warranty Claim</h2>
                    <ul className="list-inside list-disc space-y-2 text-sm tracking-wide font-light">
                        <li>Email us at <Link href="mailto:support@vellehide.com" className="hover:underline">support@vellehide.com</Link> with your order number and a description of the issue.</li>
                        <li>Include clear photos showing the defect or damage from multiple angles.</li>
                        <li>Our quality team will review your claim within 2–3 business days.</li>
                        <li>If approved, we&apos;ll provide a prepaid return label (for domestic orders) and repair or replace the item at no charge.</li>
                        <li>For international orders, shipping costs for warranty claims are shared.</li>
                    </ul>
                </div>

                {/* 6. Contact */}
                <div className="space-y-3">
                    <h2 className="text-xl uppercase">6. Contact Our Support Team</h2>
                    <p className="text-sm tracking-wide font-light">
                        For warranty claims, repair inquiries, or any quality concerns:
                    </p>
                    <p className="text-sm tracking-wide font-light">
                        📧 <Link href="mailto:support@vellehide.com" className="hover:underline">support@vellehide.com</Link>
                    </p>
                    <p className="text-sm tracking-wide font-light">
                        Visit our <Link href="/contact-us" className="underline hover:text-accent">Contact Page</Link> for additional support options.
                    </p>
                </div>
            </section>
        </>
    )
}
