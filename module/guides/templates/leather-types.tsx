import Link from "next/link"

const leatherTypes = [
    {
        name: "Full-Grain Leather",
        grade: "Premium",
        source: "Cowhide (outermost layer)",
        characteristics: [
            "The highest quality leather available — uses the entire grain surface without sanding or buffing.",
            "Retains natural markings, pores, and texture — each hide is unique.",
            "Extremely durable and develops a beautiful patina over years of use.",
            "Resistant to moisture and wear — gets better with age.",
        ],
        bestFor: "Heritage jackets, biker jackets, premium bags, belts, and items meant to last a lifetime.",
        care: "Condition every 3-6 months. Minimal cleaning needed — the natural oils keep it supple.",
    },
    {
        name: "Top-Grain Leather",
        grade: "High",
        source: "Cowhide (sanded outer layer)",
        characteristics: [
            "The second-highest quality — the grain surface is lightly sanded and refinished for a uniform look.",
            "Smoother and more consistent than full-grain, with fewer visible imperfections.",
            "Thinner and more pliable, making it excellent for tailored garments.",
            "Still very durable, though it develops patina more slowly than full-grain.",
        ],
        bestFor: "Blazers, formal jackets, dress shoes, handbags, and refined leather goods.",
        care: "Condition every 4-6 months. Clean with a damp cloth and leather-safe cleaner.",
    },
    {
        name: "Lambskin / Sheepskin",
        grade: "Premium",
        source: "Lamb or sheep",
        characteristics: [
            "Incredibly soft, lightweight, and butter-smooth to the touch.",
            "Fine grain with a luxurious, silky feel that drapes beautifully.",
            "More delicate than cowhide — not ideal for heavy-duty use.",
            "Available in a wide range of colors due to its excellent dye absorption.",
        ],
        bestFor: "Fashion jackets, lightweight coats, gloves, and premium accessories.",
        care: "Handle with care. Avoid rain and abrasive contact. Condition every 3 months with a lightweight conditioner.",
    },
    {
        name: "Goatskin Leather",
        grade: "High",
        source: "Goat",
        characteristics: [
            "Supple yet strong, with a distinctive pebbled grain texture.",
            "Naturally water-resistant and more durable than lambskin.",
            "Lightweight with excellent flexibility — conforms to body shape quickly.",
            "Resistant to scratches and scuffs.",
        ],
        bestFor: "Everyday jackets, wallets, gloves, book covers, and accessories.",
        care: "Low maintenance. Condition every 6 months. Wipe clean with a damp cloth.",
    },
    {
        name: "Buffalo / Bison Leather",
        grade: "Heavy-Duty",
        source: "Buffalo or bison",
        characteristics: [
            "Thick, rugged, and incredibly strong — one of the toughest leathers available.",
            "Prominent, deep grain with a wild, textured appearance.",
            "Naturally resistant to water, scratches, and abrasion.",
            "Heavier than cowhide — ideal for protective and durable applications.",
        ],
        bestFor: "Motorcycle jackets, heavy-duty bags, work boots, and outdoor gear.",
        care: "Condition every 6-12 months. Very low maintenance due to natural toughness.",
    },
    {
        name: "Suede",
        grade: "Mid-Range",
        source: "Inner split of cowhide, lambskin, or goatskin",
        characteristics: [
            "Soft, velvety napped finish created from the underside (flesh side) of the hide.",
            "Lightweight and flexible with a warm, tactile feel.",
            "More prone to staining and water damage than smooth leather.",
            "Available in a wide array of colors — absorbs dyes beautifully.",
        ],
        bestFor: "Casual jackets, skirts, boots, bags, and fashion accessories.",
        care: "Brush regularly with a suede brush. Use suede-specific protectant spray. Never use regular leather conditioner.",
    },
    {
        name: "Nubuck Leather",
        grade: "Premium",
        source: "Top-grain cowhide (sanded outer surface)",
        characteristics: [
            "Similar look to suede but made from the outer grain — making it significantly more durable.",
            "Velvety, soft texture with a slight sheen.",
            "Thicker and more resistant to wear and tear than suede.",
            "Develops a rich patina over time.",
        ],
        bestFor: "Premium jackets, bags, shoes, and furniture upholstery.",
        care: "Similar to suede — use a nubuck brush and nubuck-specific protectant. Avoid water and oil-based products.",
    },
    {
        name: "Distressed / Vintage Leather",
        grade: "Specialty",
        source: "Cowhide (treated and aged)",
        characteristics: [
            "Pre-treated to achieve a worn, aged, lived-in appearance right from the start.",
            "Each piece is unique — variations in color and texture are intentional.",
            "Rugged and character-rich, with a broken-in feel that many leathers take years to develop.",
            "Available in various distressing levels — from light weathering to heavy vintage.",
        ],
        bestFor: "Biker jackets, bomber jackets, rustic bags, and statement pieces.",
        care: "Very low maintenance. Light conditioning once a year. The more you wear it, the better it looks.",
    },
]

export default function LeatherTypes() {
    return (
        <>
            <header className="mb-8">
                <h1 className="text-3xl uppercase tracking-tight">Leather Types Guide</h1>
                <p className="mt-2 text-sm text-foreground-muted">Understanding the Leather Behind Every VelleHide Creation</p>
            </header>
            <section className="max-w-none space-y-6">
                <p className="text-sm tracking-wide font-light">
                    Not all leather is created equal. Understanding the different types of leather helps you make the right choice for your lifestyle, style preferences, and intended use. At VelleHide, we source only the finest hides and work with each type in our own manufacturing workshop to ensure exceptional quality.
                </p>

                {/* Leather Types */}
                {leatherTypes.map((leather, idx) => (
                    <div key={leather.name} className="space-y-3">
                        <div className="flex flex-wrap items-baseline gap-3">
                            <h2 className="text-xl uppercase">{idx + 1}. {leather.name}</h2>
                            <span className="text-xs font-medium px-2 py-0.5 rounded-full border border-accent/40 text-accent">{leather.grade}</span>
                        </div>
                        <p className="text-sm tracking-wide font-light text-foreground-muted">
                            <strong>Source:</strong> {leather.source}
                        </p>
                        <ul className="list-inside list-disc space-y-2 text-sm tracking-wide font-light">
                            {leather.characteristics.map((char) => (
                                <li key={char}>{char}</li>
                            ))}
                        </ul>
                        <p className="text-sm tracking-wide font-light">
                            <strong>Best For:</strong> {leather.bestFor}
                        </p>
                        <p className="text-sm tracking-wide font-light text-foreground-muted italic">
                            <strong>Care:</strong> {leather.care}
                        </p>
                    </div>
                ))}

                {/* Leather Grade Comparison */}
                <div className="space-y-3">
                    <h2 className="text-xl uppercase">Leather Grade Comparison</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm border-collapse min-w-125">
                            <thead>
                                <tr className="border-b border-border">
                                    <th className="text-left py-3 px-4 font-semibold uppercase text-xs tracking-wider">Property</th>
                                    <th className="text-left py-3 px-4 font-semibold uppercase text-xs tracking-wider">Full-Grain</th>
                                    <th className="text-left py-3 px-4 font-semibold uppercase text-xs tracking-wider">Top-Grain</th>
                                    <th className="text-left py-3 px-4 font-semibold uppercase text-xs tracking-wider">Lambskin</th>
                                    <th className="text-left py-3 px-4 font-semibold uppercase text-xs tracking-wider">Suede</th>
                                </tr>
                            </thead>
                            <tbody className="font-light tracking-wide">
                                <tr className="border-b border-border/30"><td className="py-3 px-4 font-medium">Durability</td><td className="py-3 px-4">★★★★★</td><td className="py-3 px-4">★★★★☆</td><td className="py-3 px-4">★★★☆☆</td><td className="py-3 px-4">★★☆☆☆</td></tr>
                                <tr className="border-b border-border/30"><td className="py-3 px-4 font-medium">Softness</td><td className="py-3 px-4">★★★☆☆</td><td className="py-3 px-4">★★★★☆</td><td className="py-3 px-4">★★★★★</td><td className="py-3 px-4">★★★★★</td></tr>
                                <tr className="border-b border-border/30"><td className="py-3 px-4 font-medium">Water Resistance</td><td className="py-3 px-4">★★★★☆</td><td className="py-3 px-4">★★★☆☆</td><td className="py-3 px-4">★★☆☆☆</td><td className="py-3 px-4">★☆☆☆☆</td></tr>
                                <tr className="border-b border-border/30"><td className="py-3 px-4 font-medium">Patina Development</td><td className="py-3 px-4">★★★★★</td><td className="py-3 px-4">★★★☆☆</td><td className="py-3 px-4">★★☆☆☆</td><td className="py-3 px-4">★☆☆☆☆</td></tr>
                                <tr><td className="py-3 px-4 font-medium">Maintenance</td><td className="py-3 px-4">Low</td><td className="py-3 px-4">Low</td><td className="py-3 px-4">Medium</td><td className="py-3 px-4">High</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Contact */}
                <div className="space-y-3">
                    <h2 className="text-xl uppercase">Need Help Choosing?</h2>
                    <p className="text-sm tracking-wide font-light">
                        Not sure which leather is right for your project? Our team can guide you based on your design, budget, and intended use. We also offer leather swatch samples.
                    </p>
                    <p className="text-sm tracking-wide font-light">
                        📧 <Link href="mailto:support@vellehide.com" className="hover:underline">support@vellehide.com</Link>
                    </p>
                </div>
            </section>
        </>
    )
}
