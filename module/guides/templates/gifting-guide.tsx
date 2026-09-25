import Link from "next/link"

const giftByOccasion = [
    {
        occasion: "Birthday",
        suggestions: [
            "Personalized leather jacket with embossed initials",
            "Monogrammed leather wallet or cardholder",
            "Custom leather belt with engraved buckle",
            "Leather journal or notebook cover",
        ],
    },
    {
        occasion: "Anniversary",
        suggestions: [
            "Bespoke couple's leather jackets in matching or complementary colors",
            "Custom leather handbag with a special date embossed inside",
            "Matching his-and-hers leather wallets",
            "Leather photo album or keepsake box",
        ],
    },
    {
        occasion: "Wedding / Groomsmen",
        suggestions: [
            "Groomsmen leather duffle bags or toiletry kits",
            "Personalized leather belts with name or wedding date",
            "Leather passport holders for honeymoon travel",
            "Custom leather cufflink boxes",
        ],
    },
    {
        occasion: "Corporate / Business",
        suggestions: [
            "Branded leather laptop sleeves or portfolios",
            "Custom leather desk accessories (pen holders, mouse pads)",
            "Premium leather bags with company logo embossed",
            "Bulk leather keychains or cardholders for events",
        ],
    },
    {
        occasion: "Festive Season / Holidays",
        suggestions: [
            "Gift-wrapped leather jackets or coats",
            "Leather gloves and scarf sets",
            "Statement leather bags for the new year",
            "Leather pillow covers for home decor refresh",
        ],
    },
    {
        occasion: "Father's Day / Mother's Day",
        suggestions: [
            "Handcrafted leather messenger bag",
            "Personalized leather keychain with a heartfelt message",
            "Custom leather tote bag in their favorite color",
            "Embossed leather bookmark or phone case",
        ],
    },
]

const budgetGuide = [
    { range: "Under ₹2,000", items: "Keychains, cardholders, bookmarks, leather coasters" },
    { range: "₹2,000 – ₹5,000", items: "Wallets, belts, phone cases, small pouches" },
    { range: "₹5,000 – ₹15,000", items: "Handbags, messenger bags, leather gloves, pillow covers" },
    { range: "₹15,000 – ₹30,000", items: "Leather jackets, blazers, duffle bags" },
    { range: "₹30,000+", items: "Bespoke jackets, custom-designed leather goods, luxury sets" },
]

export default function GiftingGuide() {
    return (
        <>
            <header className="mb-8">
                <h1 className="text-3xl uppercase tracking-tight">Gifting Guide</h1>
                <p className="mt-2 text-sm text-foreground-muted">Give the Gift of Handcrafted Leather — Timeless, Personal, Unforgettable</p>
            </header>
            <section className="max-w-none space-y-6">
                <p className="text-sm tracking-wide font-light">
                    Leather is the gift that ages beautifully — just like the best relationships. Whether it&apos;s a birthday, anniversary, festive occasion, or a corporate event, a handcrafted leather piece from VelleHide makes a statement that lasts a lifetime. And with our bespoke service, every gift can be personalized to perfection.
                </p>

                {/* Gift by Occasion */}
                <div className="space-y-4">
                    <h2 className="text-xl uppercase">Gift Ideas by Occasion</h2>
                    {giftByOccasion.map((item) => (
                        <div key={item.occasion} className="space-y-2">
                            <h3 className="text-base font-medium">{item.occasion}</h3>
                            <ul className="list-inside list-disc space-y-1.5 text-sm tracking-wide font-light">
                                {item.suggestions.map((s) => (
                                    <li key={s}>{s}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Budget Guide */}
                <div className="space-y-3">
                    <h2 className="text-xl uppercase">Gift by Budget</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm border-collapse">
                            <thead>
                                <tr className="border-b border-border">
                                    <th className="text-left py-3 px-4 font-semibold uppercase text-xs tracking-wider">Budget Range</th>
                                    <th className="text-left py-3 px-4 font-semibold uppercase text-xs tracking-wider">Gift Suggestions</th>
                                </tr>
                            </thead>
                            <tbody className="font-light tracking-wide">
                                {budgetGuide.map((item, idx) => (
                                    <tr key={item.range} className={idx < budgetGuide.length - 1 ? "border-b border-border/50" : ""}>
                                        <td className="py-3 px-4 font-medium whitespace-nowrap">{item.range}</td>
                                        <td className="py-3 px-4">{item.items}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Personalization Options */}
                <div className="space-y-3">
                    <h2 className="text-xl uppercase">Personalization for Gifts</h2>
                    <p className="text-sm tracking-wide font-light">
                        Make your gift one-of-a-kind with our personalization services:
                    </p>
                    <ul className="list-inside list-disc space-y-2 text-sm tracking-wide font-light">
                        <li><strong>Name / Initials Embossing:</strong> Hot-stamped or debossed on jackets, bags, wallets, and belts. Choose from gold, silver, or blind (natural) emboss.</li>
                        <li><strong>Custom Message Labels:</strong> A woven label with a personal message stitched inside the garment or bag. Perfect for anniversaries and milestones.</li>
                        <li><strong>Color Selection:</strong> Choose from 50+ leather colors in our <Link href="/guides/color-guide" className="underline hover:text-accent">Color Guide</Link> to match their style perfectly.</li>
                        <li><strong>Bespoke Design:</strong> For a truly unique gift, design a completely custom piece through our <Link href="/guides/bespoke-order" className="underline hover:text-accent">Bespoke Order</Link> service.</li>
                    </ul>
                </div>

                {/* Gift Wrapping */}
                <div className="space-y-3">
                    <h2 className="text-xl uppercase">Gift Wrapping & Packaging</h2>
                    <ul className="list-inside list-disc space-y-2 text-sm tracking-wide font-light">
                        <li><strong>Standard Packaging:</strong> Every VelleHide product comes in premium branded packaging — a dust bag inside a custom box with tissue wrapping.</li>
                        <li><strong>Gift Wrapping:</strong> Add our signature gift wrapping at checkout — includes a handwritten message card, ribbon, and upgraded gift box.</li>
                        <li><strong>Direct Gift Shipping:</strong> We can ship directly to the recipient with your message included. No invoice or pricing information will be included in the package.</li>
                    </ul>
                </div>

                {/* Sizing Help */}
                <div className="space-y-3">
                    <h2 className="text-xl uppercase">Buying Leather for Someone Else?</h2>
                    <p className="text-sm tracking-wide font-light">
                        Sizing can be tricky when gifting clothing. Here are our tips:
                    </p>
                    <ul className="list-inside list-disc space-y-2 text-sm tracking-wide font-light">
                        <li>Check our <Link href="/guides/size-guide" className="underline hover:text-accent">Size Guide</Link> and compare with a garment they already own.</li>
                        <li>When in doubt, go one size up — leather conforms to the body over time.</li>
                        <li>For bespoke gifts, discreetly ask for their measurements or send us a well-fitting garment of theirs for reference.</li>
                        <li>We offer free size exchanges within 14 days of delivery for standard (non-bespoke) items.</li>
                    </ul>
                </div>

                {/* Contact */}
                <div className="space-y-3">
                    <h2 className="text-xl uppercase">Need Gift Advice?</h2>
                    <p className="text-sm tracking-wide font-light">
                        Our team loves helping you find the perfect gift. Tell us your budget, the occasion, and the recipient&apos;s style — we&apos;ll handle the rest.
                    </p>
                    <p className="text-sm tracking-wide font-light">
                        📧 <Link href="mailto:support@vellehide.com" className="hover:underline">support@vellehide.com</Link>
                    </p>
                </div>
            </section>
        </>
    )
}
