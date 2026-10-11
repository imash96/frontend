"use client"

import Link from "next/link"
import { useState } from "react"

type TabCategory = "outerwear" | "bottoms" | "tops"

const categoryTabs: { key: TabCategory; label: string; desc: string }[] = [
    { key: "outerwear", label: "Outerwear", desc: "Jackets, Blazers & Coats" },
    { key: "bottoms", label: "Bottoms", desc: "Pants, Skirts, Trousers & Shorts" },
    { key: "tops", label: "Tops", desc: "Shirts & T-Shirts" },
]

export default function SizeGuide() {
    const [activeTab, setActiveTab] = useState<TabCategory>("outerwear")

    return (
        <>
            <header className="mb-8">
                <h1 className="text-3xl uppercase tracking-tight">Size & Measurement Guide</h1>
                <p className="mt-2 text-sm text-foreground-tertiary">Find Your Perfect Fit — Detailed Sizing for Every Garment</p>
            </header>
            <section className="max-w-none space-y-6">
                <p className="text-sm tracking-wide font-light">
                    Finding the right fit is essential — especially with leather, which conforms to your body over time. Use our comprehensive size charts and measurement guides below to select the perfect size. For bespoke orders, provide your exact measurements and we&apos;ll craft a garment tailored precisely to you.
                </p>

                {/* How to Measure */}
                <div className="space-y-3">
                    <h2 className="text-xl uppercase">How to Take Your Measurements</h2>
                    <p className="text-sm tracking-wide font-light">
                        Use a soft measuring tape. Stand straight with arms at your sides. Measurements should be snug but not tight — you should be able to slide one finger under the tape.
                    </p>
                    <ul className="list-inside list-disc space-y-2 text-sm tracking-wide font-light">
                        <li><strong>Chest / Bust:</strong> Measure around the fullest part of your chest, under your arms and across your shoulder blades.</li>
                        <li><strong>Waist:</strong> Measure at your natural waistline (the narrowest point), typically just above the navel.</li>
                        <li><strong>Hips:</strong> Measure around the widest part of your hips, approximately 8 inches below your natural waist.</li>
                        <li><strong>Shoulder Width:</strong> Measure from the edge of one shoulder to the other across the back.</li>
                        <li><strong>Sleeve Length:</strong> From the shoulder seam to the wrist bone with arm slightly bent.</li>
                        <li><strong>Body Length / Back Length:</strong> From the base of the neck (C7 vertebra) to the desired hemline.</li>
                        <li><strong>Inseam:</strong> From the crotch seam to the bottom of the ankle bone (for pants).</li>
                        <li><strong>Thigh:</strong> Measure around the widest part of your upper thigh.</li>
                    </ul>
                    <p className="text-sm tracking-wide font-light text-foreground-tertiary italic">
                        Pro tip: For the most accurate results, have someone else take your measurements. Wear lightweight clothing only.
                    </p>
                </div>

                {/* Tab Navigation */}
                <div className="space-y-4">
                    <div className="flex border-b border-border">
                        {categoryTabs.map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`flex-1 sm:flex-none px-4 sm:px-6 py-3 text-sm font-medium border-b-2 transition-all duration-200 ${activeTab === tab.key
                                    ? "border-accent text-accent"
                                    : "border-transparent text-foreground-tertiary hover:text-foreground hover:border-border"
                                    }`}
                            >
                                <span className="block">{tab.label}</span>
                                <span className="hidden sm:block text-xs font-normal text-foreground-tertiary mt-0.5">{tab.desc}</span>
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <div className="space-y-8">
                        {activeTab === "outerwear" && <OuterwearGuide />}
                        {activeTab === "bottoms" && <BottomsGuide />}
                        {activeTab === "tops" && <TopsGuide />}
                    </div>
                </div>

                {/* Fit Types */}
                <div className="space-y-3">
                    <h2 className="text-xl uppercase">Understanding Fit Types</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm border-collapse">
                            <thead>
                                <tr className="border-b border-border">
                                    <th className="text-left py-3 px-4 font-semibold uppercase text-xs tracking-wider">Fit</th>
                                    <th className="text-left py-3 px-4 font-semibold uppercase text-xs tracking-wider">Description</th>
                                    <th className="text-left py-3 px-4 font-semibold uppercase text-xs tracking-wider">Best For</th>
                                </tr>
                            </thead>
                            <tbody className="font-light tracking-wide">
                                <tr className="border-b border-border/50"><td className="py-3 px-4">Slim Fit</td><td className="py-3 px-4">Tailored close to the body with minimal room</td><td className="py-3 px-4">Fashion-forward, lean builds</td></tr>
                                <tr className="border-b border-border/50"><td className="py-3 px-4">Regular Fit</td><td className="py-3 px-4">Standard fit with balanced room through body</td><td className="py-3 px-4">Everyday wear, layering</td></tr>
                                <tr className="border-b border-border/50"><td className="py-3 px-4">Relaxed Fit</td><td className="py-3 px-4">Generous room through chest, waist, and hips</td><td className="py-3 px-4">Comfort, larger builds</td></tr>
                                <tr><td className="py-3 px-4">Biker / Racing Fit</td><td className="py-3 px-4">Pre-curved sleeves, snug through torso for armor</td><td className="py-3 px-4">Motorcycle use, sport riding</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Custom Sizing */}
                <div className="space-y-3">
                    <h2 className="text-xl uppercase">Custom Sizing Available</h2>
                    <p className="text-sm tracking-wide font-light">
                        Don&apos;t fit into standard sizes? No problem. With our <Link href="/guides/bespoke-order" className="underline hover:text-accent">Bespoke Order</Link> service, every garment is made to your exact measurements. Whether you need extra-long sleeves, a broader shoulder, or a unique size not listed in our charts, our workshop can accommodate any body type.
                    </p>
                    <p className="text-sm tracking-wide font-light">
                        📧 <Link href="mailto:support@vellehide.com" className="hover:underline">support@vellehide.com</Link>
                    </p>
                </div>
            </section>
        </>
    )
}

/* ─── Outerwear Section ──────────────────────────────────────────────────── */
function OuterwearGuide() {
    return (
        <div className="space-y-6">
            {/* Jacket / Blazer */}
            <div className="space-y-3">
                <h3 className="text-lg font-semibold">Jacket & Blazer Size Chart</h3>
                <p className="text-xs text-foreground-tertiary">All measurements in inches. For centimeters, multiply by 2.54.</p>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm border-collapse min-w-150">
                        <thead>
                            <tr className="border-b border-border bg-surface/50">
                                <th className="text-left py-2.5 px-3 font-semibold uppercase text-xs tracking-wider">Size</th>
                                <th className="text-left py-2.5 px-3 font-semibold uppercase text-xs tracking-wider">Chest</th>
                                <th className="text-left py-2.5 px-3 font-semibold uppercase text-xs tracking-wider">Waist</th>
                                <th className="text-left py-2.5 px-3 font-semibold uppercase text-xs tracking-wider">Shoulder</th>
                                <th className="text-left py-2.5 px-3 font-semibold uppercase text-xs tracking-wider">Sleeve</th>
                                <th className="text-left py-2.5 px-3 font-semibold uppercase text-xs tracking-wider">Length</th>
                            </tr>
                        </thead>
                        <tbody className="font-light tracking-wide">
                            <tr className="border-b border-border/30"><td className="py-2.5 px-3 font-medium">XS</td><td className="py-2.5 px-3">34-36</td><td className="py-2.5 px-3">28-30</td><td className="py-2.5 px-3">16</td><td className="py-2.5 px-3">24</td><td className="py-2.5 px-3">25</td></tr>
                            <tr className="border-b border-border/30"><td className="py-2.5 px-3 font-medium">S</td><td className="py-2.5 px-3">36-38</td><td className="py-2.5 px-3">30-32</td><td className="py-2.5 px-3">17</td><td className="py-2.5 px-3">24.5</td><td className="py-2.5 px-3">26</td></tr>
                            <tr className="border-b border-border/30"><td className="py-2.5 px-3 font-medium">M</td><td className="py-2.5 px-3">38-40</td><td className="py-2.5 px-3">32-34</td><td className="py-2.5 px-3">18</td><td className="py-2.5 px-3">25</td><td className="py-2.5 px-3">27</td></tr>
                            <tr className="border-b border-border/30"><td className="py-2.5 px-3 font-medium">L</td><td className="py-2.5 px-3">40-42</td><td className="py-2.5 px-3">34-36</td><td className="py-2.5 px-3">19</td><td className="py-2.5 px-3">25.5</td><td className="py-2.5 px-3">28</td></tr>
                            <tr className="border-b border-border/30"><td className="py-2.5 px-3 font-medium">XL</td><td className="py-2.5 px-3">42-44</td><td className="py-2.5 px-3">36-38</td><td className="py-2.5 px-3">20</td><td className="py-2.5 px-3">26</td><td className="py-2.5 px-3">29</td></tr>
                            <tr className="border-b border-border/30"><td className="py-2.5 px-3 font-medium">2XL</td><td className="py-2.5 px-3">44-46</td><td className="py-2.5 px-3">38-40</td><td className="py-2.5 px-3">21</td><td className="py-2.5 px-3">26.5</td><td className="py-2.5 px-3">30</td></tr>
                            <tr className="border-b border-border/30"><td className="py-2.5 px-3 font-medium">3XL</td><td className="py-2.5 px-3">46-48</td><td className="py-2.5 px-3">40-42</td><td className="py-2.5 px-3">22</td><td className="py-2.5 px-3">27</td><td className="py-2.5 px-3">31</td></tr>
                            <tr><td className="py-2.5 px-3 font-medium">4XL</td><td className="py-2.5 px-3">48-50</td><td className="py-2.5 px-3">42-44</td><td className="py-2.5 px-3">23</td><td className="py-2.5 px-3">27.5</td><td className="py-2.5 px-3">32</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Coat / Overcoat */}
            <div className="space-y-3">
                <h3 className="text-lg font-semibold">Coat & Overcoat Size Chart</h3>
                <p className="text-xs text-foreground-tertiary">Coats are typically 1-2 inches larger than jacket sizes for layering.</p>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm border-collapse min-w-150">
                        <thead>
                            <tr className="border-b border-border bg-surface/50">
                                <th className="text-left py-2.5 px-3 font-semibold uppercase text-xs tracking-wider">Size</th>
                                <th className="text-left py-2.5 px-3 font-semibold uppercase text-xs tracking-wider">Chest</th>
                                <th className="text-left py-2.5 px-3 font-semibold uppercase text-xs tracking-wider">Waist</th>
                                <th className="text-left py-2.5 px-3 font-semibold uppercase text-xs tracking-wider">Shoulder</th>
                                <th className="text-left py-2.5 px-3 font-semibold uppercase text-xs tracking-wider">Sleeve</th>
                                <th className="text-left py-2.5 px-3 font-semibold uppercase text-xs tracking-wider">Length</th>
                            </tr>
                        </thead>
                        <tbody className="font-light tracking-wide">
                            <tr className="border-b border-border/30"><td className="py-2.5 px-3 font-medium">S</td><td className="py-2.5 px-3">38-40</td><td className="py-2.5 px-3">32-34</td><td className="py-2.5 px-3">17.5</td><td className="py-2.5 px-3">25</td><td className="py-2.5 px-3">34</td></tr>
                            <tr className="border-b border-border/30"><td className="py-2.5 px-3 font-medium">M</td><td className="py-2.5 px-3">40-42</td><td className="py-2.5 px-3">34-36</td><td className="py-2.5 px-3">18.5</td><td className="py-2.5 px-3">25.5</td><td className="py-2.5 px-3">35</td></tr>
                            <tr className="border-b border-border/30"><td className="py-2.5 px-3 font-medium">L</td><td className="py-2.5 px-3">42-44</td><td className="py-2.5 px-3">36-38</td><td className="py-2.5 px-3">19.5</td><td className="py-2.5 px-3">26</td><td className="py-2.5 px-3">36</td></tr>
                            <tr className="border-b border-border/30"><td className="py-2.5 px-3 font-medium">XL</td><td className="py-2.5 px-3">44-46</td><td className="py-2.5 px-3">38-40</td><td className="py-2.5 px-3">20.5</td><td className="py-2.5 px-3">26.5</td><td className="py-2.5 px-3">37</td></tr>
                            <tr><td className="py-2.5 px-3 font-medium">2XL</td><td className="py-2.5 px-3">46-48</td><td className="py-2.5 px-3">40-42</td><td className="py-2.5 px-3">21.5</td><td className="py-2.5 px-3">27</td><td className="py-2.5 px-3">38</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Measurement Points */}
            <div className="space-y-3">
                <h3 className="text-lg font-semibold">Outerwear Measurement Points</h3>
                <ul className="list-inside list-disc space-y-2 text-sm tracking-wide font-light">
                    <li><strong>Chest:</strong> Measured flat across, armpit to armpit, multiplied by 2.</li>
                    <li><strong>Shoulder:</strong> Seam to seam across the back.</li>
                    <li><strong>Sleeve:</strong> From the shoulder seam to the cuff edge.</li>
                    <li><strong>Length (Back):</strong> From the base of the collar to the bottom hem at center back.</li>
                    <li><strong>Waist:</strong> Measured flat at the natural waist point of the garment.</li>
                </ul>
            </div>
        </div>
    )
}

/* ─── Bottoms Section ────────────────────────────────────────────────────── */
function BottomsGuide() {
    return (
        <div className="space-y-6">
            {/* Pants & Trousers */}
            <div className="space-y-3">
                <h3 className="text-lg font-semibold">Pants & Trousers Size Chart</h3>
                <p className="text-xs text-foreground-tertiary">All measurements in inches.</p>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm border-collapse min-w-150">
                        <thead>
                            <tr className="border-b border-border bg-surface/50">
                                <th className="text-left py-2.5 px-3 font-semibold uppercase text-xs tracking-wider">Size</th>
                                <th className="text-left py-2.5 px-3 font-semibold uppercase text-xs tracking-wider">Waist</th>
                                <th className="text-left py-2.5 px-3 font-semibold uppercase text-xs tracking-wider">Hips</th>
                                <th className="text-left py-2.5 px-3 font-semibold uppercase text-xs tracking-wider">Thigh</th>
                                <th className="text-left py-2.5 px-3 font-semibold uppercase text-xs tracking-wider">Inseam</th>
                                <th className="text-left py-2.5 px-3 font-semibold uppercase text-xs tracking-wider">Length</th>
                            </tr>
                        </thead>
                        <tbody className="font-light tracking-wide">
                            <tr className="border-b border-border/30"><td className="py-2.5 px-3 font-medium">28</td><td className="py-2.5 px-3">28</td><td className="py-2.5 px-3">36</td><td className="py-2.5 px-3">21</td><td className="py-2.5 px-3">30</td><td className="py-2.5 px-3">40</td></tr>
                            <tr className="border-b border-border/30"><td className="py-2.5 px-3 font-medium">30</td><td className="py-2.5 px-3">30</td><td className="py-2.5 px-3">38</td><td className="py-2.5 px-3">22</td><td className="py-2.5 px-3">31</td><td className="py-2.5 px-3">41</td></tr>
                            <tr className="border-b border-border/30"><td className="py-2.5 px-3 font-medium">32</td><td className="py-2.5 px-3">32</td><td className="py-2.5 px-3">40</td><td className="py-2.5 px-3">23</td><td className="py-2.5 px-3">31</td><td className="py-2.5 px-3">42</td></tr>
                            <tr className="border-b border-border/30"><td className="py-2.5 px-3 font-medium">34</td><td className="py-2.5 px-3">34</td><td className="py-2.5 px-3">42</td><td className="py-2.5 px-3">24</td><td className="py-2.5 px-3">32</td><td className="py-2.5 px-3">43</td></tr>
                            <tr className="border-b border-border/30"><td className="py-2.5 px-3 font-medium">36</td><td className="py-2.5 px-3">36</td><td className="py-2.5 px-3">44</td><td className="py-2.5 px-3">25</td><td className="py-2.5 px-3">32</td><td className="py-2.5 px-3">43</td></tr>
                            <tr className="border-b border-border/30"><td className="py-2.5 px-3 font-medium">38</td><td className="py-2.5 px-3">38</td><td className="py-2.5 px-3">46</td><td className="py-2.5 px-3">26</td><td className="py-2.5 px-3">32</td><td className="py-2.5 px-3">44</td></tr>
                            <tr><td className="py-2.5 px-3 font-medium">40</td><td className="py-2.5 px-3">40</td><td className="py-2.5 px-3">48</td><td className="py-2.5 px-3">27</td><td className="py-2.5 px-3">33</td><td className="py-2.5 px-3">44</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Skinny Pants */}
            <div className="space-y-3">
                <h3 className="text-lg font-semibold">Skinny Pants & Leggings Size Chart</h3>
                <p className="text-xs text-foreground-tertiary">Skinny fit is tighter through thigh and leg. If between sizes, size up.</p>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm border-collapse min-w-125">
                        <thead>
                            <tr className="border-b border-border bg-surface/50">
                                <th className="text-left py-2.5 px-3 font-semibold uppercase text-xs tracking-wider">Size</th>
                                <th className="text-left py-2.5 px-3 font-semibold uppercase text-xs tracking-wider">Waist</th>
                                <th className="text-left py-2.5 px-3 font-semibold uppercase text-xs tracking-wider">Hips</th>
                                <th className="text-left py-2.5 px-3 font-semibold uppercase text-xs tracking-wider">Thigh</th>
                                <th className="text-left py-2.5 px-3 font-semibold uppercase text-xs tracking-wider">Inseam</th>
                            </tr>
                        </thead>
                        <tbody className="font-light tracking-wide">
                            <tr className="border-b border-border/30"><td className="py-2.5 px-3 font-medium">XS</td><td className="py-2.5 px-3">24-26</td><td className="py-2.5 px-3">34-36</td><td className="py-2.5 px-3">19</td><td className="py-2.5 px-3">29</td></tr>
                            <tr className="border-b border-border/30"><td className="py-2.5 px-3 font-medium">S</td><td className="py-2.5 px-3">26-28</td><td className="py-2.5 px-3">36-38</td><td className="py-2.5 px-3">20</td><td className="py-2.5 px-3">30</td></tr>
                            <tr className="border-b border-border/30"><td className="py-2.5 px-3 font-medium">M</td><td className="py-2.5 px-3">28-30</td><td className="py-2.5 px-3">38-40</td><td className="py-2.5 px-3">21.5</td><td className="py-2.5 px-3">30</td></tr>
                            <tr className="border-b border-border/30"><td className="py-2.5 px-3 font-medium">L</td><td className="py-2.5 px-3">30-32</td><td className="py-2.5 px-3">40-42</td><td className="py-2.5 px-3">23</td><td className="py-2.5 px-3">31</td></tr>
                            <tr><td className="py-2.5 px-3 font-medium">XL</td><td className="py-2.5 px-3">32-34</td><td className="py-2.5 px-3">42-44</td><td className="py-2.5 px-3">24.5</td><td className="py-2.5 px-3">31</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Skirts */}
            <div className="space-y-3">
                <h3 className="text-lg font-semibold">Skirt Size Chart</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm border-collapse min-w-125">
                        <thead>
                            <tr className="border-b border-border bg-surface/50">
                                <th className="text-left py-2.5 px-3 font-semibold uppercase text-xs tracking-wider">Size</th>
                                <th className="text-left py-2.5 px-3 font-semibold uppercase text-xs tracking-wider">Waist</th>
                                <th className="text-left py-2.5 px-3 font-semibold uppercase text-xs tracking-wider">Hips</th>
                                <th className="text-left py-2.5 px-3 font-semibold uppercase text-xs tracking-wider">Mini Length</th>
                                <th className="text-left py-2.5 px-3 font-semibold uppercase text-xs tracking-wider">Midi Length</th>
                            </tr>
                        </thead>
                        <tbody className="font-light tracking-wide">
                            <tr className="border-b border-border/30"><td className="py-2.5 px-3 font-medium">XS</td><td className="py-2.5 px-3">24-26</td><td className="py-2.5 px-3">34-36</td><td className="py-2.5 px-3">15</td><td className="py-2.5 px-3">26</td></tr>
                            <tr className="border-b border-border/30"><td className="py-2.5 px-3 font-medium">S</td><td className="py-2.5 px-3">26-28</td><td className="py-2.5 px-3">36-38</td><td className="py-2.5 px-3">16</td><td className="py-2.5 px-3">27</td></tr>
                            <tr className="border-b border-border/30"><td className="py-2.5 px-3 font-medium">M</td><td className="py-2.5 px-3">28-30</td><td className="py-2.5 px-3">38-40</td><td className="py-2.5 px-3">17</td><td className="py-2.5 px-3">28</td></tr>
                            <tr className="border-b border-border/30"><td className="py-2.5 px-3 font-medium">L</td><td className="py-2.5 px-3">30-32</td><td className="py-2.5 px-3">40-42</td><td className="py-2.5 px-3">17.5</td><td className="py-2.5 px-3">29</td></tr>
                            <tr><td className="py-2.5 px-3 font-medium">XL</td><td className="py-2.5 px-3">32-34</td><td className="py-2.5 px-3">42-44</td><td className="py-2.5 px-3">18</td><td className="py-2.5 px-3">30</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Shorts */}
            <div className="space-y-3">
                <h3 className="text-lg font-semibold">Shorts Size Chart</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm border-collapse min-w-100">
                        <thead>
                            <tr className="border-b border-border bg-surface/50">
                                <th className="text-left py-2.5 px-3 font-semibold uppercase text-xs tracking-wider">Size</th>
                                <th className="text-left py-2.5 px-3 font-semibold uppercase text-xs tracking-wider">Waist</th>
                                <th className="text-left py-2.5 px-3 font-semibold uppercase text-xs tracking-wider">Hips</th>
                                <th className="text-left py-2.5 px-3 font-semibold uppercase text-xs tracking-wider">Outseam</th>
                            </tr>
                        </thead>
                        <tbody className="font-light tracking-wide">
                            <tr className="border-b border-border/30"><td className="py-2.5 px-3 font-medium">S</td><td className="py-2.5 px-3">28-30</td><td className="py-2.5 px-3">36-38</td><td className="py-2.5 px-3">17</td></tr>
                            <tr className="border-b border-border/30"><td className="py-2.5 px-3 font-medium">M</td><td className="py-2.5 px-3">30-32</td><td className="py-2.5 px-3">38-40</td><td className="py-2.5 px-3">18</td></tr>
                            <tr className="border-b border-border/30"><td className="py-2.5 px-3 font-medium">L</td><td className="py-2.5 px-3">32-34</td><td className="py-2.5 px-3">40-42</td><td className="py-2.5 px-3">19</td></tr>
                            <tr><td className="py-2.5 px-3 font-medium">XL</td><td className="py-2.5 px-3">34-36</td><td className="py-2.5 px-3">42-44</td><td className="py-2.5 px-3">20</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

/* ─── Tops Section ───────────────────────────────────────────────────────── */
function TopsGuide() {
    return (
        <div className="space-y-6">
            {/* Shirts */}
            <div className="space-y-3">
                <h3 className="text-lg font-semibold">Shirt Size Chart</h3>
                <p className="text-xs text-foreground-tertiary">Includes leather shirts and dress shirts. All measurements in inches.</p>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm border-collapse min-w-150">
                        <thead>
                            <tr className="border-b border-border bg-surface/50">
                                <th className="text-left py-2.5 px-3 font-semibold uppercase text-xs tracking-wider">Size</th>
                                <th className="text-left py-2.5 px-3 font-semibold uppercase text-xs tracking-wider">Neck</th>
                                <th className="text-left py-2.5 px-3 font-semibold uppercase text-xs tracking-wider">Chest</th>
                                <th className="text-left py-2.5 px-3 font-semibold uppercase text-xs tracking-wider">Waist</th>
                                <th className="text-left py-2.5 px-3 font-semibold uppercase text-xs tracking-wider">Sleeve</th>
                                <th className="text-left py-2.5 px-3 font-semibold uppercase text-xs tracking-wider">Length</th>
                            </tr>
                        </thead>
                        <tbody className="font-light tracking-wide">
                            <tr className="border-b border-border/30"><td className="py-2.5 px-3 font-medium">S</td><td className="py-2.5 px-3">14-14.5</td><td className="py-2.5 px-3">36-38</td><td className="py-2.5 px-3">30-32</td><td className="py-2.5 px-3">32-33</td><td className="py-2.5 px-3">28</td></tr>
                            <tr className="border-b border-border/30"><td className="py-2.5 px-3 font-medium">M</td><td className="py-2.5 px-3">15-15.5</td><td className="py-2.5 px-3">38-40</td><td className="py-2.5 px-3">32-34</td><td className="py-2.5 px-3">33-34</td><td className="py-2.5 px-3">29</td></tr>
                            <tr className="border-b border-border/30"><td className="py-2.5 px-3 font-medium">L</td><td className="py-2.5 px-3">16-16.5</td><td className="py-2.5 px-3">40-42</td><td className="py-2.5 px-3">34-36</td><td className="py-2.5 px-3">34-35</td><td className="py-2.5 px-3">30</td></tr>
                            <tr className="border-b border-border/30"><td className="py-2.5 px-3 font-medium">XL</td><td className="py-2.5 px-3">17-17.5</td><td className="py-2.5 px-3">42-44</td><td className="py-2.5 px-3">36-38</td><td className="py-2.5 px-3">35-36</td><td className="py-2.5 px-3">31</td></tr>
                            <tr><td className="py-2.5 px-3 font-medium">2XL</td><td className="py-2.5 px-3">18-18.5</td><td className="py-2.5 px-3">44-46</td><td className="py-2.5 px-3">38-40</td><td className="py-2.5 px-3">36-37</td><td className="py-2.5 px-3">32</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* T-Shirts */}
            <div className="space-y-3">
                <h3 className="text-lg font-semibold">T-Shirt Size Chart</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm border-collapse min-w-125">
                        <thead>
                            <tr className="border-b border-border bg-surface/50">
                                <th className="text-left py-2.5 px-3 font-semibold uppercase text-xs tracking-wider">Size</th>
                                <th className="text-left py-2.5 px-3 font-semibold uppercase text-xs tracking-wider">Chest</th>
                                <th className="text-left py-2.5 px-3 font-semibold uppercase text-xs tracking-wider">Waist</th>
                                <th className="text-left py-2.5 px-3 font-semibold uppercase text-xs tracking-wider">Shoulder</th>
                                <th className="text-left py-2.5 px-3 font-semibold uppercase text-xs tracking-wider">Length</th>
                            </tr>
                        </thead>
                        <tbody className="font-light tracking-wide">
                            <tr className="border-b border-border/30"><td className="py-2.5 px-3 font-medium">S</td><td className="py-2.5 px-3">36-38</td><td className="py-2.5 px-3">30-32</td><td className="py-2.5 px-3">17</td><td className="py-2.5 px-3">27</td></tr>
                            <tr className="border-b border-border/30"><td className="py-2.5 px-3 font-medium">M</td><td className="py-2.5 px-3">38-40</td><td className="py-2.5 px-3">32-34</td><td className="py-2.5 px-3">18</td><td className="py-2.5 px-3">28</td></tr>
                            <tr className="border-b border-border/30"><td className="py-2.5 px-3 font-medium">L</td><td className="py-2.5 px-3">40-42</td><td className="py-2.5 px-3">34-36</td><td className="py-2.5 px-3">19</td><td className="py-2.5 px-3">29</td></tr>
                            <tr className="border-b border-border/30"><td className="py-2.5 px-3 font-medium">XL</td><td className="py-2.5 px-3">42-44</td><td className="py-2.5 px-3">36-38</td><td className="py-2.5 px-3">20</td><td className="py-2.5 px-3">30</td></tr>
                            <tr><td className="py-2.5 px-3 font-medium">2XL</td><td className="py-2.5 px-3">44-46</td><td className="py-2.5 px-3">38-40</td><td className="py-2.5 px-3">21</td><td className="py-2.5 px-3">31</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
