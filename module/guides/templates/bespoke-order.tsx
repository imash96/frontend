import Link from "next/link"

export default function BespokeOrder() {
    return (
        <>
            <header className="mb-8">
                <h1 className="text-3xl uppercase tracking-tight">Bespoke Order Guide</h1>
                <p className="mt-2 text-sm text-foreground-tertiary">Handcrafted to Your Vision — From Our Workshop to Your Wardrobe</p>
            </header>
            <section className="max-w-none space-y-6">
                <p className="text-sm tracking-wide font-light">
                    At VelleHide, we believe that true luxury is personal. With our own in-house manufacturing workshop, we offer a fully bespoke service where every piece is crafted from scratch — designed by you, built by our master artisans. Whether it&apos;s a custom leather jacket, a hand-tailored coat, or a unique accessory, we bring your vision to life with precision and passion.
                </p>

                {/* 1. How to Place a Bespoke Order */}
                <div className="space-y-3">
                    <h2 className="text-xl uppercase">1. How to Place a Bespoke Order</h2>
                    <p className="text-sm tracking-wide font-light">
                        Placing a bespoke order with VelleHide is a seamless, guided experience:
                    </p>
                    <ul className="list-inside list-disc space-y-2 text-sm tracking-wide font-light">
                        <li><strong>Submit Your Design:</strong> Share your design idea via our contact form, WhatsApp, or email. You can send a sketch, a reference image, a photo of any jacket you like, or simply describe your vision.</li>
                        <li><strong>Consultation:</strong> Our design team will reach out to discuss details — leather type, fit, features, and customization preferences.</li>
                        <li><strong>Measurements:</strong> Provide your body measurements using our <Link href="/guides/size-guide" className="underline hover:text-accent">Size & Measurement Guide</Link>, or send a well-fitting garment for reference.</li>
                        <li><strong>Design Confirmation:</strong> We&apos;ll share a detailed specification sheet with material choices, design sketches, and a final quotation for your approval.</li>
                        <li><strong>Production:</strong> Once approved, your order enters our workshop. Production typically takes 10-18 business days depending on complexity.</li>
                        <li><strong>Quality Check & Shipping:</strong> Each piece undergoes rigorous quality inspection before being carefully packaged and shipped to you.</li>
                    </ul>
                </div>

                {/* 2. What Can Be Custom Made */}
                <div className="space-y-3">
                    <h2 className="text-xl uppercase">2. What Can Be Custom Made</h2>
                    <p className="text-sm tracking-wide font-light">
                        Since we operate our own manufacturing workshop, virtually any leather product can be made from scratch:
                    </p>
                    <ul className="list-inside list-disc space-y-2 text-sm tracking-wide font-light">
                        <li><strong>Custom-Sized Garments:</strong> Jackets, blazers, coats, vests, pants, skirts, and shorts — all made to your exact body measurements.</li>
                        <li><strong>Buyer-Designed Pieces:</strong> Send us your own design, a hand-drawn sketch, or a photograph of any jacket, and we&apos;ll recreate or adapt it in premium leather.</li>
                        <li><strong>Reference-Based Orders:</strong> Love a jacket from a movie, runway, or brand? Share the picture, and our team will craft a bespoke version tailored to your specifications.</li>
                        <li><strong>Accessories:</strong> Bags, wallets, belts, pillow covers, and leather accessories — all handcrafted to order.</li>
                        <li><strong>Bulk & Corporate Orders:</strong> Uniform jackets, branded leather goods, or bulk custom orders for teams, events, and businesses.</li>
                    </ul>
                </div>

                {/* 3. Leather Selection */}
                <div className="space-y-3">
                    <h2 className="text-xl uppercase">3. Leather Selection</h2>
                    <p className="text-sm tracking-wide font-light">
                        Choose from our extensive range of premium leathers. Each type offers a unique look, feel, and character:
                    </p>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm border-collapse">
                            <thead>
                                <tr className="border-b border-border">
                                    <th className="text-left py-3 px-4 font-semibold uppercase text-xs tracking-wider">Leather Type</th>
                                    <th className="text-left py-3 px-4 font-semibold uppercase text-xs tracking-wider">Characteristics</th>
                                    <th className="text-left py-3 px-4 font-semibold uppercase text-xs tracking-wider">Best For</th>
                                </tr>
                            </thead>
                            <tbody className="font-light tracking-wide">
                                <tr className="border-b border-border/50"><td className="py-3 px-4">Full-Grain Cowhide</td><td className="py-3 px-4">Strongest, develops patina over time</td><td className="py-3 px-4">Jackets, bags, belts</td></tr>
                                <tr className="border-b border-border/50"><td className="py-3 px-4">Top-Grain Cowhide</td><td className="py-3 px-4">Smooth, refined finish</td><td className="py-3 px-4">Blazers, formal jackets</td></tr>
                                <tr className="border-b border-border/50"><td className="py-3 px-4">Lambskin / Sheepskin</td><td className="py-3 px-4">Butter-soft, lightweight</td><td className="py-3 px-4">Fashion jackets, gloves</td></tr>
                                <tr className="border-b border-border/50"><td className="py-3 px-4">Goatskin</td><td className="py-3 px-4">Supple with visible grain</td><td className="py-3 px-4">Jackets, wallets</td></tr>
                                <tr className="border-b border-border/50"><td className="py-3 px-4">Buffalo / Bison</td><td className="py-3 px-4">Thick, rugged, textured</td><td className="py-3 px-4">Heavy-duty jackets, motorcycle gear</td></tr>
                                <tr className="border-b border-border/50"><td className="py-3 px-4">Nubuck</td><td className="py-3 px-4">Velvety surface, sanded top-grain</td><td className="py-3 px-4">Premium jackets, accessories</td></tr>
                                <tr className="border-b border-border/50"><td className="py-3 px-4">Suede</td><td className="py-3 px-4">Soft, napped inner split</td><td className="py-3 px-4">Casual jackets, skirts, boots</td></tr>
                                <tr><td className="py-3 px-4">Distressed / Vintage</td><td className="py-3 px-4">Pre-treated for a worn, aged look</td><td className="py-3 px-4">Biker jackets, rustic styles</td></tr>
                            </tbody>
                        </table>
                    </div>
                    <p className="text-sm tracking-wide font-light text-foreground-tertiary italic">
                        Available in various thicknesses (0.6mm - 1.4mm+). See our <Link href="/guides/leather-types" className="underline hover:text-accent">Leather Types Guide</Link> for detailed comparisons.
                    </p>
                </div>

                {/* 4. Lining Options */}
                <div className="space-y-3">
                    <h2 className="text-xl uppercase">4. Lining Options</h2>
                    <p className="text-sm tracking-wide font-light">
                        The lining is the inner fabric of your garment. It affects comfort, breathability, and the overall feel. Choose from:
                    </p>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <h3 className="text-base font-medium">Lining Types</h3>
                            <ul className="list-inside list-disc space-y-2 text-sm tracking-wide font-light">
                                <li><strong>Satin Lining:</strong> Smooth, silky finish with a luxurious sheen. Classic choice for formal and fashion jackets. Available in solid colors.</li>
                                <li><strong>Cotton Lining:</strong> Breathable, soft, and comfortable for everyday wear. Ideal for warmer climates and casual styles.</li>
                                <li><strong>Printed Cotton:</strong> Cotton lining with custom prints — paisley, floral, geometric, checks, or any custom pattern. Adds a unique personal touch to the interior.</li>
                                <li><strong>Viscose Lining:</strong> Lightweight, silky-smooth with excellent drape. A premium alternative to satin with a matte finish.</li>
                                <li><strong>Polyester Lining:</strong> Durable, wrinkle-resistant, and affordable. Great for heavy-duty and motorcycle jackets.</li>
                                <li><strong>Quilted Lining:</strong> Diamond or channel-quilted padding for warmth and structure. Perfect for winter and biker jackets.</li>
                                <li><strong>Sherpa / Faux Fur:</strong> Plush, insulated lining for extreme warmth and a rugged aesthetic. Ideal for aviator and shearling-style jackets.</li>
                            </ul>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-base font-medium">Lining Colors</h3>
                            <p className="text-sm tracking-wide font-light">
                                Available in a wide palette including Black, Crimson Red, Royal Blue, Burgundy, Ivory White, Forest Green, Navy, Charcoal Grey, Gold, Tan, and many more. Custom color matching is also available upon request.
                            </p>
                        </div>
                    </div>
                </div>

                {/* 5. Zipper & Hardware */}
                <div className="space-y-3">
                    <h2 className="text-xl uppercase">5. Zipper & Hardware Options</h2>
                    <p className="text-sm tracking-wide font-light">
                        Hardware defines the character of your piece. Every zipper, snap, and buckle can be customized:
                    </p>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <h3 className="text-base font-medium">Zipper Types</h3>
                            <ul className="list-inside list-disc space-y-2 text-sm tracking-wide font-light">
                                <li><strong>Standard Pull Handle:</strong> Classic teardrop or rectangular pull tab. Clean and versatile.</li>
                                <li><strong>Wire Pull / Ring Pull:</strong> Circular or D-ring pull for a vintage or military-inspired look.</li>
                                <li><strong>Double-Ended Zipper:</strong> Opens from both top and bottom for ventilation and flexibility.</li>
                                <li><strong>Heavy-Duty Metal Zipper (YKK):</strong> Premium-grade, robust zipper for biker and heavy-duty jackets.</li>
                                <li><strong>Invisible / Concealed Zipper:</strong> Hidden zipper for a clean, seamless exterior appearance.</li>
                                <li><strong>Decorative Chain Zipper:</strong> Bold, chunky chain-style zipper for statement pieces.</li>
                            </ul>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-base font-medium">Hardware Finishes</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm border-collapse">
                                    <thead>
                                        <tr className="border-b border-border">
                                            <th className="text-left py-3 px-4 font-semibold uppercase text-xs tracking-wider">Finish</th>
                                            <th className="text-left py-3 px-4 font-semibold uppercase text-xs tracking-wider">Look & Feel</th>
                                        </tr>
                                    </thead>
                                    <tbody className="font-light tracking-wide">
                                        <tr className="border-b border-border/50"><td className="py-3 px-4">Silver / Nickel</td><td className="py-3 px-4">Bright, modern, and polished</td></tr>
                                        <tr className="border-b border-border/50"><td className="py-3 px-4">Gold / Brass</td><td className="py-3 px-4">Warm, luxurious, eye-catching</td></tr>
                                        <tr className="border-b border-border/50"><td className="py-3 px-4">Gunmetal / Matte Black</td><td className="py-3 px-4">Dark, edgy, contemporary</td></tr>
                                        <tr className="border-b border-border/50"><td className="py-3 px-4">Antique Brass</td><td className="py-3 px-4">Vintage, warm, rustic patina</td></tr>
                                        <tr className="border-b border-border/50"><td className="py-3 px-4">Rose Gold</td><td className="py-3 px-4">Soft, elegant, feminine</td></tr>
                                        <tr><td className="py-3 px-4">Matte Silver</td><td className="py-3 px-4">Understated, refined, subtle</td></tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <p className="text-sm tracking-wide font-light text-foreground-tertiary italic">
                            Buttons, snaps, rivets, D-rings, and buckles are all available in the finishes listed above.
                        </p>
                    </div>
                </div>

                {/* 6. Embossing & Personalization */}
                <div className="space-y-3">
                    <h2 className="text-xl uppercase">6. Embossing & Personalization</h2>
                    <p className="text-sm tracking-wide font-light">
                        Make it truly yours. We offer several personalization techniques:
                    </p>
                    <ul className="list-inside list-disc space-y-2 text-sm tracking-wide font-light">
                        <li><strong>Hot Stamp Embossing:</strong> Your name, initials, or custom text pressed into the leather with heat. Available on jacket interiors, collars, pockets, or belts. Clean, elegant finish.</li>
                        <li><strong>Debossing:</strong> Similar to embossing but creates an indented impression. Subtle and sophisticated.</li>
                        <li><strong>Laser Engraving:</strong> Precise, detailed designs — logos, patterns, or intricate artwork etched into the leather surface.</li>
                        <li><strong>Leather Cut Alphabet / Patches:</strong> Individual leather-cut letters or monogram patches stitched onto the garment. Bold, textured, and tactile.</li>
                        <li><strong>Metal Name Plates:</strong> Custom-engraved metal plates (in silver, gold, or gunmetal) riveted onto the garment — perfect for a branded, premium look.</li>
                        <li><strong>Contrast Stitching:</strong> Custom thread colors for visible stitching details. Available in 20+ thread colors.</li>
                        <li><strong>Custom Labels:</strong> Personalized inner labels with your name, a special date, or a message. Woven or printed.</li>
                    </ul>
                </div>

                {/* 7. Padding & Insulation */}
                <div className="space-y-3">
                    <h2 className="text-xl uppercase">7. Padding & Insulation</h2>
                    <p className="text-sm tracking-wide font-light">
                        Control the weight, warmth, and structure of your garment with our insulation options:
                    </p>
                    <ul className="list-inside list-disc space-y-2 text-sm tracking-wide font-light">
                        <li><strong>No Padding (Unlined):</strong> Lightweight, suitable for warm weather and layering. The leather drapes naturally.</li>
                        <li><strong>Light Thermal Padding:</strong> Thin synthetic fill for mild insulation without adding bulk. Three-season comfort.</li>
                        <li><strong>Quilted Padding:</strong> Diamond or channel-quilted polyester fill. Provides moderate warmth and adds a structured silhouette.</li>
                        <li><strong>Thinsulate™ Insulation:</strong> Premium microfiber insulation — lightweight yet extremely warm. Ideal for harsh winters without sacrificing style.</li>
                        <li><strong>Sherpa / Faux Shearling:</strong> Thick, plush insulation for maximum warmth. Perfect for aviator, bomber, and shearling-collar jackets.</li>
                        <li><strong>Body Armor Padding (CE Rated):</strong> Removable protective padding for shoulders, elbows, and back. Essential for motorcycle and racing jackets.</li>
                    </ul>
                </div>

                {/* 8. Pricing & Payment */}
                <div className="space-y-3">
                    <h2 className="text-xl uppercase">8. Pricing & Payment</h2>
                    <p className="text-sm tracking-wide font-light">
                        Bespoke pricing varies based on leather type, design complexity, and customization options. Here&apos;s what to expect:
                    </p>
                    <ul className="list-inside list-disc space-y-2 text-sm tracking-wide font-light">
                        <li>A detailed quotation is provided after design consultation — no hidden charges.</li>
                        <li>A 50% advance payment is required to begin production.</li>
                        <li>The remaining 50% is due before shipping.</li>
                        <li>Payment via all major methods: UPI, Net Banking, Credit/Debit Cards, and international transfers.</li>
                    </ul>
                    <p className="text-sm tracking-wide font-light text-foreground-tertiary italic">
                        Bespoke orders are made-to-order and cannot be returned or exchanged. Please review all specifications carefully before confirming.
                    </p>
                </div>

                {/* 9. Contact */}
                <div className="space-y-3">
                    <h2 className="text-xl uppercase">9. Start Your Bespoke Journey</h2>
                    <p className="text-sm tracking-wide font-light">
                        Ready to create something extraordinary? Get in touch with our design team:
                    </p>
                    <p className="text-sm tracking-wide font-light">
                        📧 <Link href="mailto:support@vellehide.com" className="hover:underline">support@vellehide.com</Link>
                    </p>
                    <p className="text-sm tracking-wide font-light">
                        Or visit our <Link href="/contact-us" className="underline hover:text-accent">Contact Page</Link> to submit your design ideas.
                    </p>
                </div>
            </section>
        </>
    )
}
