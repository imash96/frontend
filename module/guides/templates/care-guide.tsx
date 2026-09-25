import Link from "next/link"

export default function CareGuide() {
    return (
        <>
            <header className="mb-8">
                <h1 className="text-3xl uppercase tracking-tight">Leather Care Guide</h1>
                <p className="mt-2 text-sm text-foreground-muted">Keep Your Leather Looking Timeless — Expert Care for Every Product</p>
            </header>
            <section className="max-w-none space-y-6">
                <p className="text-sm tracking-wide font-light">
                    Leather is a living material — with proper care, it ages beautifully, developing a rich patina that tells your story. This comprehensive guide covers everything you need to know about maintaining leather jackets, pants, skirts, bags, pillow covers, and accessories.
                </p>

                {/* 1. General Leather Care Principles */}
                <div className="space-y-3">
                    <h2 className="text-xl uppercase">1. General Leather Care Principles</h2>
                    <ul className="list-inside list-disc space-y-2 text-sm tracking-wide font-light">
                        <li><strong>Avoid Direct Sunlight:</strong> Prolonged sun exposure fades and dries leather. Store and display leather goods away from direct sunlight and heat sources.</li>
                        <li><strong>Keep Away from Water:</strong> Leather is naturally porous. Avoid soaking; blot spills immediately with a dry, soft cloth.</li>
                        <li><strong>Never Use Harsh Chemicals:</strong> Avoid bleach, acetone, alcohol-based cleaners, or household detergents. Use leather-specific products only.</li>
                        <li><strong>Condition Regularly:</strong> Leather needs moisture to stay supple. Apply a quality leather conditioner every 3–6 months, or more frequently in dry climates.</li>
                        <li><strong>Test First:</strong> Before applying any product, test on a small, hidden area to check for discoloration or damage.</li>
                        <li><strong>Use a Soft Cloth:</strong> Always use a lint-free microfiber cloth for cleaning and conditioning. Avoid abrasive materials.</li>
                    </ul>
                </div>

                {/* 2. Leather Jacket Care */}
                <div className="space-y-3">
                    <h2 className="text-xl uppercase">2. Leather Jacket Care</h2>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <h3 className="text-base font-medium">Daily Care</h3>
                            <ul className="list-inside list-disc space-y-2 text-sm tracking-wide font-light">
                                <li>Hang your jacket on a wide, padded hanger to maintain its shape. Never use wire hangers.</li>
                                <li>After wearing, wipe down with a soft, dry cloth to remove dust and body oils.</li>
                                <li>Allow the jacket to air-dry naturally if damp. Never use a hairdryer, radiator, or direct heat.</li>
                            </ul>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-base font-medium">Cleaning</h3>
                            <ul className="list-inside list-disc space-y-2 text-sm tracking-wide font-light">
                                <li>Use a damp (not wet) microfiber cloth with a mild leather cleaner to gently wipe the surface.</li>
                                <li>For stubborn stains, use a dedicated leather stain remover. Apply sparingly and blot — never scrub.</li>
                                <li>Clean the lining separately if removable, or spot-clean with a fabric-safe spray.</li>
                                <li>For deep cleaning, consult a professional leather cleaner.</li>
                            </ul>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-base font-medium">Conditioning</h3>
                            <ul className="list-inside list-disc space-y-2 text-sm tracking-wide font-light">
                                <li>Apply a leather conditioner (cream or balm) every 3–6 months. Work in small, circular motions.</li>
                                <li>Let the conditioner absorb for 15–20 minutes, then buff with a clean cloth for a soft sheen.</li>
                                <li>Pay extra attention to creases, elbows, and collar — areas prone to drying out.</li>
                            </ul>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-base font-medium">Storage</h3>
                            <ul className="list-inside list-disc space-y-2 text-sm tracking-wide font-light">
                                <li>Store in a breathable garment bag (cotton or muslin). Never use plastic — it traps moisture and causes mildew.</li>
                                <li>Keep in a cool, dry, well-ventilated closet away from direct sunlight.</li>
                                <li>Stuff sleeves lightly with acid-free tissue paper to maintain shape during long storage.</li>
                                <li>Add cedar blocks or silica gel packets to absorb excess moisture.</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* 3. Leather Pants & Skirts */}
                <div className="space-y-3">
                    <h2 className="text-xl uppercase">3. Leather Pants & Skirt Care</h2>
                    <ul className="list-inside list-disc space-y-2 text-sm tracking-wide font-light">
                        <li><strong>Stretching Prevention:</strong> Leather pants and skirts may stretch with wear. Hang them by the waistband on clip hangers (with cloth padding) to help them retain shape.</li>
                        <li><strong>After Wear:</strong> Turn inside out and air out before storing to remove body moisture and odors.</li>
                        <li><strong>Creases & Wrinkles:</strong> Hang overnight to let gravity smooth out wrinkles. For stubborn creases, use a steamer held 6+ inches away on the lowest setting. Never iron directly on leather.</li>
                        <li><strong>Cleaning:</strong> Spot-clean with a leather-safe cleaner. For full cleaning, take to a professional leather specialist.</li>
                        <li><strong>Conditioning:</strong> Condition the knee, thigh, and waist areas more frequently — these zones endure the most stress.</li>
                        <li><strong>Storage:</strong> Fold pants loosely with tissue paper between folds to prevent crease marks. Hang skirts by the waistband.</li>
                    </ul>
                </div>

                {/* 4. Leather Bags */}
                <div className="space-y-3">
                    <h2 className="text-xl uppercase">4. Leather Bag Care</h2>
                    <ul className="list-inside list-disc space-y-2 text-sm tracking-wide font-light">
                        <li><strong>Daily Use:</strong> Avoid overloading your bag to prevent stretching and hardware strain. Rotate between bags to extend their life.</li>
                        <li><strong>Cleaning:</strong> Wipe the exterior with a damp cloth weekly. Clean interior pockets and linings monthly to remove dust and debris.</li>
                        <li><strong>Rain Protection:</strong> If caught in rain, blot excess water immediately. Stuff the bag with newspaper or tissue to absorb moisture and maintain shape. Let it air-dry naturally.</li>
                        <li><strong>Ink & Pen Stains:</strong> Blot immediately — do not rub. Apply a small amount of non-acetone nail polish remover on a cotton swab and test first. For valuable bags, consult a professional.</li>
                        <li><strong>Hardware Care:</strong> Clean zippers, buckles, and clasps with a soft cloth. For tarnished hardware, use a metal polish specifically formulated for the finish (brass, nickel, etc.).</li>
                        <li><strong>Storage:</strong> Stuff bags with acid-free tissue or a bag pillow to maintain structure. Store in the original dust bag or a breathable cotton bag. Never stack leather bags on top of each other.</li>
                        <li><strong>Handle Darkening:</strong> Handles darken from body oils over time. Wrap handles with twilly scarves for protection, or clean regularly with leather cleaner.</li>
                    </ul>
                </div>

                {/* 5. Leather Pillow Covers */}
                <div className="space-y-3">
                    <h2 className="text-xl uppercase">5. Leather Pillow Cover Care</h2>
                    <ul className="list-inside list-disc space-y-2 text-sm tracking-wide font-light">
                        <li><strong>Regular Dusting:</strong> Dust weekly with a soft, dry cloth or a lint roller to prevent buildup.</li>
                        <li><strong>Spot Cleaning:</strong> Blot spills immediately. Clean with a slightly damp cloth and a mild leather cleaner. Wipe dry immediately after.</li>
                        <li><strong>Conditioning:</strong> Condition every 4–6 months to prevent cracking, especially if exposed to heated rooms or air conditioning.</li>
                        <li><strong>Sun Damage:</strong> Rotate pillow positions regularly to ensure even fading and prevent one side from darkening.</li>
                        <li><strong>Pet Scratches:</strong> Minor scratches can often be buffed out with a leather conditioner. For deeper scratches, use a leather repair kit or consult a professional.</li>
                        <li><strong>Avoid:</strong> Do not machine wash or dry clean leather pillow covers. Keep away from sharp objects and Velcro.</li>
                    </ul>
                </div>

                {/* 6. Stain Removal */}
                <div className="space-y-3">
                    <h2 className="text-xl uppercase">6. Stain Removal Guide</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm border-collapse">
                            <thead>
                                <tr className="border-b border-border">
                                    <th className="text-left py-3 px-4 font-semibold uppercase text-xs tracking-wider">Stain Type</th>
                                    <th className="text-left py-3 px-4 font-semibold uppercase text-xs tracking-wider">Treatment</th>
                                </tr>
                            </thead>
                            <tbody className="font-light tracking-wide">
                                <tr className="border-b border-border/50"><td className="py-3 px-4">Water Spots</td><td className="py-3 px-4">Dampen the entire surface evenly with a wet cloth, let air-dry, then condition</td></tr>
                                <tr className="border-b border-border/50"><td className="py-3 px-4">Grease / Oil</td><td className="py-3 px-4">Blot excess, sprinkle cornstarch or baking soda, leave overnight, brush off gently</td></tr>
                                <tr className="border-b border-border/50"><td className="py-3 px-4">Ink</td><td className="py-3 px-4">Dab with a cotton swab dipped in rubbing alcohol (test first). Blot — never rub</td></tr>
                                <tr className="border-b border-border/50"><td className="py-3 px-4">Mold / Mildew</td><td className="py-3 px-4">Wipe with a 1:1 water-rubbing alcohol solution. Air-dry in a ventilated area</td></tr>
                                <tr className="border-b border-border/50"><td className="py-3 px-4">Salt Stains</td><td className="py-3 px-4">Mix equal parts water and white vinegar. Dab with a cloth, blot dry, condition</td></tr>
                                <tr className="border-b border-border/50"><td className="py-3 px-4">Food / Beverage</td><td className="py-3 px-4">Blot immediately, clean with mild leather soap, condition after drying</td></tr>
                                <tr><td className="py-3 px-4">Dye Transfer</td><td className="py-3 px-4">Difficult to remove at home — take to a professional leather cleaner immediately</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* 7. Waterproofing */}
                <div className="space-y-3">
                    <h2 className="text-xl uppercase">7. Waterproofing & Weather Protection</h2>
                    <ul className="list-inside list-disc space-y-2 text-sm tracking-wide font-light">
                        <li>Apply a leather waterproofing spray or wax before the rainy season. Reapply every 2–3 months for active-use garments.</li>
                        <li>Use silicone-free, leather-safe waterproofing products. Silicone can clog pores and dry out the leather over time.</li>
                        <li>After waterproofing, allow 24 hours for the product to fully absorb and cure before wearing.</li>
                        <li>For suede and nubuck, use a suede-specific waterproofing spray. Standard leather protectants can darken or damage these materials.</li>
                        <li>If leather gets wet, never force-dry with heat. Stuff with newspaper, shape the garment, and let it air-dry in a ventilated room.</li>
                    </ul>
                </div>

                {/* 8. Seasonal Care */}
                <div className="space-y-3">
                    <h2 className="text-xl uppercase">8. Seasonal Care Calendar</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm border-collapse">
                            <thead>
                                <tr className="border-b border-border">
                                    <th className="text-left py-3 px-4 font-semibold uppercase text-xs tracking-wider">Season</th>
                                    <th className="text-left py-3 px-4 font-semibold uppercase text-xs tracking-wider">Care Actions</th>
                                </tr>
                            </thead>
                            <tbody className="font-light tracking-wide">
                                <tr className="border-b border-border/50"><td className="py-3 px-4">Spring</td><td className="py-3 px-4">Deep clean, condition, and inspect for any winter damage. Air out stored items.</td></tr>
                                <tr className="border-b border-border/50"><td className="py-3 px-4">Summer</td><td className="py-3 px-4">Store winter leather properly. Avoid leaving leather in hot cars. Light conditioning for active-use bags.</td></tr>
                                <tr className="border-b border-border/50"><td className="py-3 px-4">Autumn</td><td className="py-3 px-4">Apply waterproofing before the rains. Condition jackets before heavy use. Check hardware for tarnish.</td></tr>
                                <tr><td className="py-3 px-4">Winter</td><td className="py-3 px-4">Wipe salt and moisture after each wear. Condition monthly. Use cedar blocks in storage areas.</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* 9. Suede & Nubuck Special Care */}
                <div className="space-y-3">
                    <h2 className="text-xl uppercase">9. Suede & Nubuck Special Care</h2>
                    <ul className="list-inside list-disc space-y-2 text-sm tracking-wide font-light">
                        <li><strong>Brushing:</strong> Use a suede brush (brass or nylon bristles) regularly to restore the nap and remove surface dirt. Brush in one direction.</li>
                        <li><strong>Eraser:</strong> For dry stains and scuffs, use a suede eraser or a clean pencil eraser. Rub gently in circular motions.</li>
                        <li><strong>Steam:</strong> Hold over steam briefly to refresh the nap, then brush while still slightly damp.</li>
                        <li><strong>Never Condition:</strong> Traditional leather conditioners will darken and damage suede. Use suede-specific protectants only.</li>
                        <li><strong>Water Protection:</strong> Suede is highly absorbent — always apply a suede waterproofing spray before first use.</li>
                    </ul>
                </div>

                {/* 10. Contact */}
                <div className="space-y-3">
                    <h2 className="text-xl uppercase">10. Need Expert Help?</h2>
                    <p className="text-sm tracking-wide font-light">
                        For product-specific care advice, restoration services, or leather repair inquiries, contact our team:
                    </p>
                    <p className="text-sm tracking-wide font-light">
                        📧 <Link href="mailto:support@vellehide.com" className="hover:underline">support@vellehide.com</Link>
                    </p>
                </div>
            </section>
        </>
    )
}
