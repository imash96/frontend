import { useState } from "react";
import { AlertComponent, SectionHeader } from "./common";
import { AlertCircle, Check, CreditCard, Info, Package, Search, Truck, X } from "lucide-react";

export default function ColorTab() {

    const neutralBg: Record<number, string> = {
        50: "bg-neutral-50",
        100: "bg-neutral-100",
        200: "bg-neutral-200",
        300: "bg-neutral-300",
        400: "bg-neutral-400",
        500: "bg-neutral-500",
        600: "bg-neutral-600",
        700: "bg-neutral-700",
        800: "bg-neutral-800",
        900: "bg-neutral-900",
        950: "bg-neutral-950",
    };

    return (

        <>
            {/* Interactive Color Swatches */}
            <section className="space-y-6 sm:space-y-8">
                <SectionHeader
                    title="Interactive Color Palette"
                    subtitle="Hover over swatches to see color information. Click to copy hex value."
                />

                {/* Primary Colors */}
                <ColorSection title="Primary Colors" colors={[
                    { name: 'Primary', bg: 'bg-primary', text: 'text-primary-foreground' },
                    { name: 'Primary Hover', bg: 'bg-primary-hover', text: 'text-primary-foreground' },
                    { name: 'Primary Active', bg: 'bg-primary-active', text: 'text-primary-foreground' },
                    { name: 'Primary Subtle', bg: 'bg-primary-subtle', text: 'text-primary' },
                ]} />

                {/* Secondary Colors */}
                <ColorSection title="Secondary Colors" colors={[
                    { name: 'Secondary', bg: 'bg-secondary', text: 'text-secondary-foreground' },
                    { name: 'Secondary Hover', bg: 'bg-secondary-hover', text: 'text-secondary-foreground' },
                    { name: 'Secondary Active', bg: 'bg-secondary-active', text: 'text-secondary-foreground' },
                    { name: 'Secondary Subtle', bg: 'bg-secondary-subtle', text: 'text-secondary' },
                ]} />

                {/* Accent Colors */}
                <ColorSection title="Accent Colors" colors={[
                    { name: 'Accent', bg: 'bg-accent', text: 'text-accent-foreground' },
                    { name: 'Accent Hover', bg: 'bg-accent-hover', text: 'text-accent-foreground' },
                    { name: 'Accent Active', bg: 'bg-accent-active', text: 'text-accent-foreground' },
                    { name: 'Accent Subtle', bg: 'bg-accent-subtle', text: 'text-accent' },
                ]} />

                {/* Semantic Colors */}
                <ColorSection title="Semantic Colors" colors={[
                    { name: 'Success', bg: 'bg-success', text: 'text-success-foreground' },
                    { name: 'Destructive', bg: 'bg-destructive', text: 'text-destructive-foreground' },
                    { name: 'Warning', bg: 'bg-warning', text: 'text-warning-foreground' },
                    { name: 'Info', bg: 'bg-info', text: 'text-info-foreground' },
                ]} />

                {/* Neutral Scale */}
                <div className="space-y-4">
                    <h3 className="text-lg sm:text-xl font-semibold text-text-primary">Neutral Scale (50-950)</h3>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-11 gap-2 sm:gap-3">
                        {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map((shade) => (
                            <InteractiveColorSwatch
                                key={shade}
                                name={`${shade}`}
                                bg={neutralBg[shade]}
                                text={shade >= 500 ? "text-neutral-50" : "text-neutral-950"}
                            />
                        ))}
                    </div>
                </div>

                {/* Text Hierarchy with Interactive Examples */}
                <div className="space-y-4">
                    <h3 className="text-lg sm:text-xl font-semibold text-text-primary">Text Hierarchy</h3>
                    <div className="bg-surface border border-border rounded-lg p-4 sm:p-6 space-y-4">
                        <div className="space-y-2">
                            <p className="text-text-primary text-base sm:text-lg font-semibold">Primary Text</p>
                            <p className="text-text-primary text-sm sm:text-base">Main content and headings. Use for primary information that users need to see first.</p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-text-secondary text-base sm:text-lg font-semibold">Secondary Text</p>
                            <p className="text-text-secondary text-sm sm:text-base">Supporting information and descriptions. Use for additional context.</p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-text-tertiary text-base sm:text-lg font-semibold">Tertiary Text</p>
                            <p className="text-text-tertiary text-sm sm:text-base">Less important details like timestamps, metadata, and helper text.</p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-text-disabled text-base sm:text-lg font-semibold">Disabled Text</p>
                            <p className="text-text-disabled text-sm sm:text-base">Inactive or unavailable elements that cannot be interacted with.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Form Elements */}
            <section className="space-y-8">
                <SectionHeader title="Form Elements" subtitle="Interactive input fields with all states" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Default Input */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-text-primary">Email Address</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="input w-full"
                        />
                        <p className="text-xs text-text-tertiary">We&apos;ll never share your email.</p>
                    </div>

                    {/* Input with Icon */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-text-primary">Search Products</label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="input w-full pl-10"
                            />
                        </div>
                    </div>

                    {/* Success State */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-text-primary">Valid Input</label>
                        <input
                            type="text"
                            defaultValue="john@example.com"
                            className="input w-full border-success focus:border-success focus:ring-success/20"
                            readOnly
                        />
                        <p className="text-sm text-success flex items-center gap-1">
                            <Check className="w-4 h-4" />
                            Email verified successfully
                        </p>
                    </div>

                    {/* Error State */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-text-primary">Invalid Input</label>
                        <input
                            type="email"
                            defaultValue="invalid-email"
                            className="input w-full border-destructive focus:border-destructive focus:ring-destructive/20"
                        />
                        <p className="text-sm text-destructive flex items-center gap-1">
                            <X className="w-4 h-4" />
                            Please enter a valid email address
                        </p>
                    </div>

                    {/* Disabled Input */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-text-disabled">Disabled Field</label>
                        <input
                            type="text"
                            placeholder="Cannot edit"
                            disabled
                            className="bg-input-disabled-background text-input-disabled-text border border-input-disabled-border px-4 py-2.5 rounded-md w-full cursor-not-allowed"
                        />
                    </div>

                    {/* Select */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-text-primary">Category</label>
                        <select className="input w-full">
                            <option>All Categories</option>
                            <option>Leather Jackets</option>
                            <option>Coats</option>
                            <option>Blazers</option>
                            <option>Pants</option>
                        </select>
                    </div>

                    {/* Textarea */}
                    <div className="space-y-2 md:col-span-2">
                        <label className="block text-sm font-medium text-text-primary">Product Review</label>
                        <textarea
                            placeholder="Share your thoughts..."
                            rows={4}
                            className="input w-full resize-none"
                        />
                    </div>

                    {/* Checkbox */}
                    <div className="flex items-start gap-3">
                        <input
                            type="checkbox"
                            id="terms"
                            className="mt-1 w-4 h-4 rounded border-border text-primary focus:ring-primary focus:ring-offset-2"
                        />
                        <label htmlFor="terms" className="text-sm text-text-secondary">
                            I agree to the terms and conditions and privacy policy
                        </label>
                    </div>

                    {/* Radio Buttons */}
                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-text-primary">Shipping Method</label>
                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <input
                                    type="radio"
                                    name="shipping"
                                    id="standard"
                                    className="w-4 h-4 text-primary focus:ring-primary"
                                    defaultChecked
                                />
                                <label htmlFor="standard" className="text-sm text-text-secondary">
                                    Standard Shipping (3-5 days)
                                </label>
                            </div>
                            <div className="flex items-center gap-3">
                                <input
                                    type="radio"
                                    name="shipping"
                                    id="express"
                                    className="w-4 h-4 text-primary focus:ring-primary"
                                />
                                <label htmlFor="express" className="text-sm text-text-secondary">
                                    Express Shipping (1-2 days)
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* Cards */}
            <section className="space-y-8">
                <SectionHeader title="Cards & Surfaces" subtitle="Hover to see interactive states" />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="card hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                        <div className="w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center mb-4">
                            <Truck className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Free Shipping</h3>
                        <p className="text-text-secondary text-sm">On orders over $150</p>
                    </div>

                    <div className="card hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                        <div className="w-12 h-12 bg-success/10 text-success rounded-lg flex items-center justify-center mb-4">
                            <Package className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Easy Returns</h3>
                        <p className="text-text-secondary text-sm">30-day return policy</p>
                    </div>

                    <div className="card hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                        <div className="w-12 h-12 bg-accent/10 text-accent rounded-lg flex items-center justify-center mb-4">
                            <CreditCard className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Secure Payment</h3>
                        <p className="text-text-secondary text-sm">SSL encrypted checkout</p>
                    </div>
                </div>
            </section>
            {/* Alerts */}
            <section className="space-y-8">
                <SectionHeader title="Alerts & Notifications" subtitle="Semantic messaging components" />

                <div className="space-y-4">
                    <AlertComponent
                        type="success"
                        title="Order Confirmed"
                        message="Your order #12345 has been confirmed and will ship within 24 hours."
                        icon={<Check className="w-5 h-5" />}
                    />
                    <AlertComponent
                        type="error"
                        title="Payment Failed"
                        message="There was an error processing your payment. Please try again or use a different payment method."
                        icon={<X className="w-5 h-5" />}
                    />
                    <AlertComponent
                        type="warning"
                        title="Low Stock Alert"
                        message="Only 3 items remaining in stock. Order soon to avoid missing out!"
                        icon={<AlertCircle className="w-5 h-5" />}
                    />
                    <AlertComponent
                        type="info"
                        title="New Collection"
                        message="Explore our latest winter collection with exclusive leather designs."
                        icon={<Info className="w-5 h-5" />}
                    />
                </div>
            </section>

            {/* Badges */}
            <section className="space-y-8">
                <SectionHeader title="Badges & Labels" subtitle="Status indicators and tags" />

                <div className="space-y-6">
                    <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-text-primary">Product Badges</h3>
                        <div className="flex flex-wrap gap-3">
                            <span className="badge-new">New Arrival</span>
                            <span className="badge-sale">Sale -40%</span>
                            <span className="badge-limited">Limited Edition</span>
                            <span className="px-3 py-1 bg-info text-info-foreground rounded-full text-xs font-semibold uppercase">
                                Best Seller
                            </span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-text-primary">Status Badges</h3>
                        <div className="flex flex-wrap gap-3">
                            <span className="text-xs font-medium text-success px-3 py-1.5 bg-success-subtle border border-success rounded-md">
                                In Stock
                            </span>
                            <span className="text-xs font-medium text-destructive px-3 py-1.5 bg-destructive-subtle border border-destructive rounded-md">
                                Out of Stock
                            </span>
                            <span className="text-xs font-medium text-warning px-3 py-1.5 bg-warning-subtle border border-warning rounded-md">
                                Low Stock
                            </span>
                            <span className="text-xs font-medium text-info px-3 py-1.5 bg-info-subtle border border-info rounded-md">
                                Pre-Order
                            </span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-text-primary">Size Badges (Interactive)</h3>
                        <div className="flex flex-wrap gap-2">
                            {['XS', 'S', 'M', 'L', 'XL', '2XL'].map((size) => (
                                <button
                                    key={size}
                                    className="px-4 py-2 border-2 border-border text-text-primary rounded-md hover:border-primary hover:text-primary transition-all font-medium"
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Loading States */}
            <section className="space-y-6 sm:space-y-8">
                <SectionHeader title="Loading States" subtitle="Skeleton screens and animations" />

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="card space-y-3 sm:space-y-4">
                            <div className="skeleton w-full h-40 sm:h-48 rounded-lg" />
                            <div className="skeleton h-5 sm:h-6 w-3/4 rounded" />
                            <div className="skeleton h-3 sm:h-4 w-full rounded" />
                            <div className="skeleton h-3 sm:h-4 w-5/6 rounded" />
                            <div className="flex gap-2">
                                <div className="skeleton h-8 sm:h-10 w-20 sm:w-24 rounded-md" />
                                <div className="skeleton h-8 sm:h-10 flex-1 rounded-md" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pulse Animation */}
                <div className="space-y-4">
                    <h3 className="text-base sm:text-lg font-semibold text-text-primary">Pulse Animation</h3>
                    <div className="flex gap-3 sm:gap-4">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary rounded-lg pulse" />
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-accent rounded-lg pulse" />
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-success rounded-lg pulse" />
                    </div>
                </div>
            </section>

            {/* Gradients */}
            <section className="space-y-6 sm:space-y-8">
                <SectionHeader title="Gradients" subtitle="Background gradients for premium aesthetics" />
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                    <div className="h-32 sm:h-40 rounded-lg p-4 sm:p-6 flex items-end" style={{ background: 'var(--linear-primary)' }}>
                        <p className="text-primary-foreground font-semibold text-sm sm:text-base">Primary Gradient</p>
                    </div>
                    <div className="h-32 sm:h-40 rounded-lg p-4 sm:p-6 flex items-end" style={{ background: 'var(--linear-accent)' }}>
                        <p className="text-accent-foreground font-semibold text-sm sm:text-base">Accent Gradient</p>
                    </div>
                    <div className="h-32 sm:h-40 rounded-lg p-4 sm:p-6 flex items-end sm:col-span-2 md:col-span-1" style={{ background: 'var(--linear-warm)' }}>
                        <p className="text-text-primary font-semibold text-sm sm:text-base">Warm Gradient</p>
                    </div>
                </div>
            </section>

            {/* Shadows */}
            <section className="space-y-6 sm:space-y-8">
                <SectionHeader title="Shadow Elevation" subtitle="Hover to see shadow depth in action" />
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4 md:gap-6">
                    {['sm', '', 'md', 'lg', 'xl', '2xl', 'inner'].map((size) => (
                        <div
                            key={size}
                            className={`bg-surface p-4 sm:p-6 rounded-lg shadow-${size} hover:scale-105 transition-all duration-300 cursor-pointer`}
                        >
                            <p className="font-semibold text-text-primary text-xs sm:text-sm">
                                {size === '' ? 'Default' : size.toUpperCase()}
                            </p>
                        </div>
                    ))}
                </div>
            </section>
        </>
    )
}

function ColorSection({ title, colors }: {
    title: string;
    colors: Array<{ name: string; bg: string; text: string }>
}) {
    return (
        <div className="space-y-4">
            <h3 className="text-lg sm:text-xl font-semibold text-text-primary">{title}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                {colors.map((color) => (
                    <InteractiveColorSwatch key={color.name} {...color} />
                ))}
            </div>
        </div>
    );
}


function InteractiveColorSwatch({ name, bg, text }: { name: string; bg: string; text: string }) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className="space-y-2 cursor-pointer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div
                className={`${bg} ${text} h-20 sm:h-24 rounded-lg flex items-center justify-center font-medium shadow-sm transition-all duration-300 text-xs sm:text-sm ${isHovered ? 'scale-105 shadow-lg' : ''
                    }`}
            >
                {name}
            </div>
            <p className="text-[10px] sm:text-xs text-text-tertiary text-center transition-colors">
                {bg}
            </p>
        </div>
    );
}