"use client"

import Link from "next/link"
import { useState } from "react"

const colorFamilies = [
    {
        name: "Classic Blacks & Greys",
        colors: [
            { name: "Jet Black", hex: "#0A0A0A", desc: "Deep, true black" },
            { name: "Midnight Black", hex: "#1C1C1C", desc: "Rich, warm black" },
            { name: "Charcoal", hex: "#36454F", desc: "Deep grey with blue undertones" },
            { name: "Gunmetal Grey", hex: "#53565A", desc: "Dark metallic grey" },
            { name: "Slate Grey", hex: "#708090", desc: "Medium cool grey" },
            { name: "Ash Grey", hex: "#B2BEB5", desc: "Light silvery grey" },
            { name: "Stone Grey", hex: "#928E85", desc: "Warm neutral grey" },
        ],
    },
    {
        name: "Browns & Tans",
        colors: [
            { name: "Dark Brown", hex: "#3B2218", desc: "Rich, deep brown" },
            { name: "Chocolate", hex: "#5C3317", desc: "Warm cocoa brown" },
            { name: "Coffee", hex: "#6F4E37", desc: "Medium roasted brown" },
            { name: "Cognac", hex: "#9A463D", desc: "Warm reddish-brown" },
            { name: "Saddle Tan", hex: "#8B6914", desc: "Classic tan leather" },
            { name: "Camel", hex: "#C19A6B", desc: "Warm golden tan" },
            { name: "Whiskey", hex: "#D49A6A", desc: "Light amber tan" },
            { name: "Honey", hex: "#EB9605", desc: "Golden honey tone" },
            { name: "Beige", hex: "#D2B48C", desc: "Soft neutral beige" },
            { name: "Cream", hex: "#FFFDD0", desc: "Warm off-white" },
        ],
    },
    {
        name: "Reds & Burgundies",
        colors: [
            { name: "Oxblood", hex: "#4A0000", desc: "Deep, dark red-brown" },
            { name: "Burgundy", hex: "#800020", desc: "Rich wine red" },
            { name: "Maroon", hex: "#800000", desc: "Dark brownish red" },
            { name: "Cherry Red", hex: "#DE3163", desc: "Vibrant red" },
            { name: "Crimson", hex: "#DC143C", desc: "Bold, bright red" },
            { name: "Rust", hex: "#B7410E", desc: "Warm orange-red" },
            { name: "Coral", hex: "#FF6F61", desc: "Soft pinkish-red" },
        ],
    },
    {
        name: "Blues & Navy",
        colors: [
            { name: "Navy Blue", hex: "#000080", desc: "Classic deep blue" },
            { name: "Midnight Blue", hex: "#191970", desc: "Dark navy blue" },
            { name: "Royal Blue", hex: "#002366", desc: "Rich, regal blue" },
            { name: "Cobalt", hex: "#0047AB", desc: "Vivid medium blue" },
            { name: "Teal", hex: "#008080", desc: "Blue-green tone" },
            { name: "Powder Blue", hex: "#B0E0E6", desc: "Soft, light blue" },
        ],
    },
    {
        name: "Greens",
        colors: [
            { name: "Forest Green", hex: "#228B22", desc: "Deep, rich green" },
            { name: "Hunter Green", hex: "#355E3B", desc: "Dark olive green" },
            { name: "Olive", hex: "#808000", desc: "Warm earthy green" },
            { name: "Military Green", hex: "#4B5320", desc: "Army-style khaki green" },
            { name: "Emerald", hex: "#50C878", desc: "Vivid jewel green" },
            { name: "Sage", hex: "#BCB88A", desc: "Soft muted green" },
        ],
    },
    {
        name: "Whites & Off-Whites",
        colors: [
            { name: "Pure White", hex: "#FFFFFF", desc: "Bright, clean white" },
            { name: "Off-White", hex: "#FAF9F6", desc: "Warm ivory white" },
            { name: "Ivory", hex: "#FFFFF0", desc: "Soft yellowish white" },
            { name: "Pearl", hex: "#FDEEF4", desc: "Soft pinkish white" },
            { name: "Eggshell", hex: "#F0EAD6", desc: "Warm neutral white" },
        ],
    },
    {
        name: "Statement Colors",
        colors: [
            { name: "Hot Pink", hex: "#FF69B4", desc: "Bold, vibrant pink" },
            { name: "Purple", hex: "#6A0DAD", desc: "Rich, regal purple" },
            { name: "Lavender", hex: "#B57EDC", desc: "Soft pastel purple" },
            { name: "Mustard", hex: "#FFDB58", desc: "Warm yellow tone" },
            { name: "Orange", hex: "#FF8C00", desc: "Vibrant citrus orange" },
            { name: "Gold Metallic", hex: "#FFD700", desc: "Metallic gold shimmer" },
            { name: "Silver Metallic", hex: "#C0C0C0", desc: "Metallic silver shine" },
        ],
    },
]

const finishTypes = [
    { name: "Matte / Natural", desc: "Non-reflective, organic feel. Shows the natural grain of the leather." },
    { name: "Semi-Gloss", desc: "Subtle sheen that enhances color depth. Versatile for everyday wear." },
    { name: "High-Gloss / Patent", desc: "Mirror-like, reflective finish. Bold and dramatic — perfect for statement pieces." },
    { name: "Distressed / Vintage", desc: "Pre-treated for a worn-in, aged appearance. Each piece is unique." },
    { name: "Waxed / Pull-Up", desc: "Wax-infused leather that changes shade when stretched or flexed. Develops rich patina." },
    { name: "Suede Finish", desc: "Soft, velvety napped surface. Elegant and tactile." },
    { name: "Nubuck Finish", desc: "Top-grain leather sanded for a velvety feel. More durable than suede with a premium look." },
    { name: "Two-Tone / Ombré", desc: "Gradient or dual-color effect for a unique, artistic look. Custom-dyed in our workshop." },
]

export default function ColorGuide() {
    const [activeFamily, setActiveFamily] = useState(0)

    return (
        <>
            <header className="mb-8">
                <h1 className="text-3xl uppercase tracking-tight">Color Guide</h1>
                <p className="mt-2 text-sm text-foreground-muted">Your Jacket, Your Color — Crafted From Scratch in Our Workshop</p>
            </header>
            <section className="max-w-none space-y-6">
                <p className="text-sm tracking-wide font-light">
                    As a manufacturer with our own in-house workshop, we don&apos;t rely on pre-made stock. Every leather product at VelleHide can be crafted in the color of your choice — from timeless blacks and cognacs to bold custom shades. Browse our complete color palette below and choose the perfect hue for your bespoke order.
                </p>

                {/* Color Families - Tab Navigation */}
                <div className="space-y-4">
                    <h2 className="text-xl uppercase">Available Leather Colors</h2>
                    <div className="flex flex-wrap gap-2">
                        {colorFamilies.map((family, idx) => (
                            <button
                                key={family.name}
                                onClick={() => setActiveFamily(idx)}
                                className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all duration-200 ${activeFamily === idx
                                    ? "bg-accent text-accent-foreground border-accent"
                                    : "border-border hover:border-accent/50 hover:bg-accent/10"
                                    }`}
                            >
                                {family.name}
                            </button>
                        ))}
                    </div>

                    {/* Color Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {colorFamilies[activeFamily].colors.map((color) => {
                            const isLight = isLightColor(color.hex)
                            return (
                                <div key={color.name} className="group rounded-xl overflow-hidden border border-border/50 hover:border-accent/50 transition-all duration-200 hover:shadow-md">
                                    <div
                                        className="h-20 sm:h-24 w-full flex items-end p-2 transition-transform duration-300 group-hover:scale-[1.02]"
                                        style={{ backgroundColor: color.hex }}
                                    >
                                        <span
                                            className="text-[10px] font-mono opacity-70"
                                            style={{ color: isLight ? "#333" : "#fff" }}
                                        >
                                            {color.hex}
                                        </span>
                                    </div>
                                    <div className="p-2.5 bg-surface space-y-0.5">
                                        <p className="text-xs font-semibold truncate">{color.name}</p>
                                        <p className="text-[10px] text-foreground-muted leading-tight">{color.desc}</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* How to Select Your Color */}
                <div className="space-y-3">
                    <h2 className="text-xl uppercase">How to Select Your Color</h2>
                    <ul className="list-inside list-disc space-y-2 text-sm tracking-wide font-light">
                        <li><strong>Browse the Palette:</strong> Explore the color families above. Each color is available across all our leather types — cowhide, lambskin, goatskin, and more.</li>
                        <li><strong>Reference Any Color:</strong> Have a specific shade in mind? Send us a Pantone code, a photo of the exact color, or even a physical swatch — we&apos;ll match it in our dyeing workshop.</li>
                        <li><strong>Custom Color Matching:</strong> Need a color not in our standard palette? We offer custom dyeing services for bespoke orders. Our artisans can achieve virtually any shade, including two-tone and ombré effects.</li>
                        <li><strong>Screen Disclaimer:</strong> Colors displayed on screens may vary slightly from the actual leather. For critical color matching, we recommend requesting a leather swatch sample before placing your order.</li>
                        <li><strong>Leather Swatch Samples:</strong> We can ship small leather swatches in your preferred colors (nominal fee applies). Contact us to order samples.</li>
                    </ul>
                </div>

                {/* Any Jacket in Any Color */}
                <div className="space-y-3">
                    <h2 className="text-xl uppercase">Any Product, Any Color</h2>
                    <p className="text-sm tracking-wide font-light">
                        Since we manufacture everything from scratch in our own workshop, every single product on our website — jackets, coats, blazers, pants, skirts, bags, wallets, belts, pillow covers, and accessories — can be made in any of the colors listed above. Here&apos;s what that means for you:
                    </p>
                    <ul className="list-inside list-disc space-y-2 text-sm tracking-wide font-light">
                        <li>See a jacket in black but want it in cognac? We&apos;ll make it.</li>
                        <li>Love a bag design but need it in forest green? Done.</li>
                        <li>Want a matching set — jacket in oxblood and bag in the same shade? We&apos;ll color-match perfectly.</li>
                        <li>Custom gradient (ombré) or two-tone color combinations? Absolutely possible.</li>
                        <li>No extra charge for standard palette colors. Custom color matching may carry a small additional fee depending on complexity.</li>
                    </ul>
                </div>

                {/* Finish Types */}
                <div className="space-y-3">
                    <h2 className="text-xl uppercase">Leather Finish Types</h2>
                    <p className="text-sm tracking-wide font-light">
                        The finish of your leather changes how the color appears and feels. Each finish is available across all colors:
                    </p>
                    <div className="space-y-3">
                        {finishTypes.map((finish) => (
                            <div key={finish.name} className="flex gap-3 py-2 border-b border-border/30 last:border-0">
                                <span className="text-sm font-medium min-w-35 sm:min-w-45 shrink-0">{finish.name}</span>
                                <span className="text-sm font-light tracking-wide text-foreground-secondary">{finish.desc}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Color Care Tips */}
                <div className="space-y-3">
                    <h2 className="text-xl uppercase">Color Care Tips</h2>
                    <ul className="list-inside list-disc space-y-2 text-sm tracking-wide font-light">
                        <li><strong>Light Colors:</strong> White, cream, beige, and pastel leathers require more careful handling. Avoid contact with denim and dark fabrics that can transfer dye.</li>
                        <li><strong>Dark Colors:</strong> May release minor dye transfer initially (especially in warm, humid weather). We recommend wearing a light layer beneath new dark leather garments for the first few uses.</li>
                        <li><strong>Vibrant Colors:</strong> Bold reds, blues, and greens benefit from UV-protective leather sprays to maintain vibrancy over time.</li>
                        <li><strong>Metallics:</strong> Gold and silver metallic leathers should be cleaned with a dry cloth only. Avoid conditioners that may dull the metallic coating.</li>
                    </ul>
                    <p className="text-sm tracking-wide font-light text-foreground-muted italic">
                        For detailed maintenance instructions, see our <Link href="/guides/care-guide" className="underline hover:text-accent">Leather Care Guide</Link>.
                    </p>
                </div>

                {/* Contact */}
                <div className="space-y-3">
                    <h2 className="text-xl uppercase">Need Help Choosing?</h2>
                    <p className="text-sm tracking-wide font-light">
                        Our design team is happy to help you select the perfect color. Reach out for personalized recommendations or swatch samples:
                    </p>
                    <p className="text-sm tracking-wide font-light">
                        📧 <Link href="mailto:support@vellehide.com" className="hover:underline">support@vellehide.com</Link>
                    </p>
                </div>
            </section>
        </>
    )
}

/** Helper to determine if a hex color is "light" (for text contrast) */
function isLightColor(hex: string): boolean {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    // Using relative luminance formula
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
    return luminance > 0.6
}
