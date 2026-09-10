import { SectionHeader } from "./common";
import { Star, Heart, ShoppingCart, Check, X, ChevronRight, Plus, Minus } from 'lucide-react';

export default function FontTab() {
    return (
        <>
            {/* Typography Hero - Bricolage Introduction */}
            <section className="space-y-6 sm:space-y-8">
                <div className="text-center space-y-4 py-8 sm:py-12">
                    <p className="text-sm font-medium text-accent tracking-wider uppercase font-body">Typography System</p>
                    <h1 className="font-heading text-5xl sm:text-6xl font-extrabold tracking-tighter text-text-primary">
                        Bricolage Grotesque
                    </h1>
                    <p className="font-heading text-2xl sm:text-3xl font-semibold text-text-secondary">
                        & Inter
                    </p>
                    <p className="font-body text-base sm:text-lg leading-relaxed text-text-secondary max-w-2xl mx-auto px-4">
                        A distinctive pairing designed for modern velle brands. Bricolage Grotesque brings characterful personality to headlines with its optical sizing, while Inter ensures crystal-clear readability for all body content.
                    </p>
                    <div className="flex flex-wrap justify-center gap-3 pt-4">
                        <span className="px-4 py-2 bg-accent-subtle text-accent text-sm font-semibold rounded-full font-body">
                            Modern Craft
                        </span>
                        <span className="px-4 py-2 bg-success-subtle text-success text-sm font-semibold rounded-full font-body">
                            Optical Sizing
                        </span>
                        <span className="px-4 py-2 bg-info-subtle text-info text-sm font-semibold rounded-full font-body">
                            Distinctive Character
                        </span>
                    </div>
                </div>
            </section>

            {/* Font Families Showcase */}
            <section className="space-y-6 sm:space-y-8">
                <SectionHeader
                    title="Font Families"
                    subtitle="Distinctive display grotesque meets modern sans-serif"
                />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Bricolage Grotesque */}
                    <div className="card space-y-4 bg-linear-to-br from-accent-subtle to-background">
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="font-heading text-2xl sm:text-3xl font-bold mb-2">Bricolage Grotesque</h3>
                                <p className="text-sm text-text-tertiary font-body">Primary — Headings, Titles, Brand Voice</p>
                            </div>
                            <span className="px-3 py-1 bg-accent text-accent-foreground text-xs font-bold rounded-full font-body">
                                NEW
                            </span>
                        </div>

                        <div className="bg-background/50 backdrop-blur-sm rounded-lg p-4 space-y-1">
                            <p className="text-xs font-semibold text-accent uppercase tracking-wide font-body">Special Feature</p>
                            <p className="text-sm text-text-secondary font-body leading-relaxed">
                                <strong className="text-text-primary">Optical Sizing:</strong> Characters adapt based on size.
                                Large sizes show personality with quirky details; small sizes stay clean and professional.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <div className="space-y-1">
                                <p className="text-xs text-text-tertiary font-body">Regular (400)</p>
                                <p className="font-heading text-xl sm:text-2xl font-normal">The quick brown fox jumps</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs text-text-tertiary font-body">Medium (500)</p>
                                <p className="font-heading text-xl sm:text-2xl font-medium">The quick brown fox jumps</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs text-text-tertiary font-body">SemiBold (600)</p>
                                <p className="font-heading text-xl sm:text-2xl font-semibold">The quick brown fox jumps</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs text-text-tertiary font-body">Bold (700)</p>
                                <p className="font-heading text-xl sm:text-2xl font-bold">The quick brown fox jumps</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs text-text-tertiary font-body">ExtraBold (800)</p>
                                <p className="font-heading text-xl sm:text-2xl font-extrabold">The quick brown fox jumps</p>
                            </div>
                        </div>

                        <div className="pt-3 border-t border-divider">
                            <p className="text-xs text-text-tertiary font-body">
                                <strong className="text-text-primary">Character:</strong> Distinctive, warm, playful at large sizes /
                                Professional, neutral at small sizes
                            </p>
                        </div>
                    </div>

                    {/* Inter */}
                    <div className="card space-y-4">
                        <div>
                            <h3 className="font-body text-2xl sm:text-3xl font-bold mb-2">Inter</h3>
                            <p className="text-sm text-text-tertiary font-body">Secondary — Body Text, UI, Descriptions</p>
                        </div>

                        <div className="bg-muted/50 rounded-lg p-4 space-y-1">
                            <p className="text-xs font-semibold text-primary uppercase tracking-wide font-body">Why Inter?</p>
                            <p className="text-sm text-text-secondary font-body leading-relaxed">
                                {"Optimized for screen reading with excellent legibility. Pairs beautifully with Bricolage's"}
                                distinctive character by providing clean, functional contrast.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <div className="space-y-1">
                                <p className="text-xs text-text-tertiary font-body">Light (300)</p>
                                <p className="font-body text-xl sm:text-2xl font-light">The quick brown fox jumps</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs text-text-tertiary font-body">Regular (400)</p>
                                <p className="font-body text-xl sm:text-2xl font-normal">The quick brown fox jumps</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs text-text-tertiary font-body">Medium (500)</p>
                                <p className="font-body text-xl sm:text-2xl font-medium">The quick brown fox jumps</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs text-text-tertiary font-body">SemiBold (600)</p>
                                <p className="font-body text-xl sm:text-2xl font-semibold">The quick brown fox jumps</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs text-text-tertiary font-body">Bold (700)</p>
                                <p className="font-body text-xl sm:text-2xl font-bold">The quick brown fox jumps</p>
                            </div>
                        </div>

                        <div className="pt-3 border-t border-divider">
                            <p className="text-xs text-text-tertiary font-body">
                                <strong className="text-text-primary">Character:</strong> Clean, modern, highly readable /
                                Professional sans-serif for all body content
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Optical Sizing Demonstration - Bricolage's Superpower */}
            <section className="space-y-6 sm:space-y-8">
                <SectionHeader
                    title="Optical Sizing Magic"
                    subtitle="Bricolage Grotesque adapts its character based on size"
                />

                <div className="card bg-linear-to-br from-primary-subtle via-background to-accent-subtle space-y-8">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-primary bg-primary-subtle px-2 py-1 rounded font-body">
                                LARGE SIZE (72px)
                            </span>
                            <span className="text-xs text-text-tertiary font-body">Quirky, distinctive, personality shows</span>
                        </div>
                        <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tighter leading-none">
                            PREMIUM LEATHER
                        </h1>
                        <p className="text-sm text-text-secondary font-body max-w-2xl">
                            At large sizes, Bricolage Grotesque reveals its playful character: rounded corners,
                            unique letterforms, and distinctive personality. Perfect for headlines that grab attention.
                        </p>
                    </div>

                    <div className="h-px bg-divider"></div>

                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-success bg-success-subtle px-2 py-1 rounded font-body">
                                MEDIUM SIZE (24px)
                            </span>
                            <span className="text-xs text-text-tertiary font-body">Balanced personality + readability</span>
                        </div>
                        <h3 className="font-heading text-2xl sm:text-3xl font-semibold">
                            Premium Leather Jacket Collection
                        </h3>
                        <p className="text-sm text-text-secondary font-body max-w-2xl">
                            At medium sizes, the font maintains character while becoming more readable.
                            Ideal for product titles and section headers.
                        </p>
                    </div>

                    <div className="h-px bg-divider"></div>

                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-info bg-info-subtle px-2 py-1 rounded font-body">
                                SMALL SIZE (16px)
                            </span>
                            <span className="text-xs text-text-tertiary font-body">Clean, professional, functional</span>
                        </div>
                        <p className="font-heading text-base font-medium leading-relaxed max-w-3xl">
                            At smaller sizes, Bricolage Grotesque becomes more neutral and professional,
                            ensuring excellent readability while maintaining subtle character. This adaptive
                            behavior means you get personality in headlines without sacrificing function in UI elements.
                        </p>
                        <p className="text-sm text-text-secondary font-body max-w-2xl">
                            For body text, we use Inter (shown here) which provides optimal readability and pairs
                            {"beautifully with Bricolage's distinctive headlines."}
                        </p>
                    </div>
                </div>
            </section>

            {/* Type Scale with Bricolage */}
            <section className="space-y-6 sm:space-y-8">
                <SectionHeader
                    title="Type Scale (Fluid Typography)"
                    subtitle="How Bricolage Grotesque scales across your site"
                />

                <div className="card space-y-6">
                    <div className="space-y-4">
                        <div className="border-l-4 border-accent pl-4 sm:pl-6">
                            <p className="text-xs text-text-tertiary mb-2 font-body">text-6xl (60-72px) - Hero Headlines</p>
                            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tighter">
                                Winter Collection 2026
                            </h1>
                            <p className="text-sm text-text-secondary mt-2 font-body">
                                Maximum personality, distinctive character
                            </p>
                        </div>

                        <div className="border-l-4 border-primary pl-4 sm:pl-6">
                            <p className="text-xs text-text-tertiary mb-2 font-body">text-5xl (48-60px) - Page Titles</p>
                            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
                                Premium Italian Leather
                            </h2>
                            <p className="text-sm text-text-secondary mt-2 font-body">
                                Strong presence with character
                            </p>
                        </div>

                        <div className="border-l-4 border-secondary pl-4 sm:pl-6">
                            <p className="text-xs text-text-tertiary mb-2 font-body">text-4xl (36-48px) - Section Headers</p>
                            <h3 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
                                Handcrafted Excellence
                            </h3>
                            <p className="text-sm text-text-secondary mt-2 font-body">
                                Balanced personality and professionalism
                            </p>
                        </div>

                        <div className="border-l-4 border-muted pl-4 sm:pl-6">
                            <p className="text-xs text-text-tertiary mb-2 font-body">text-3xl (30-36px) - Product Titles</p>
                            <h4 className="font-heading text-xl sm:text-2xl md:text-3xl font-semibold">
                                Classic Bomber Jacket
                            </h4>
                            <p className="text-sm text-text-secondary mt-2 font-body">
                                Distinctive yet readable
                            </p>
                        </div>

                        <div className="border-l-4 border-border pl-4 sm:pl-6">
                            <p className="text-xs text-text-tertiary mb-2 font-body">text-2xl (24-30px) - Card Headers</p>
                            <h5 className="font-heading text-lg sm:text-xl md:text-2xl font-semibold">
                                Featured Products
                            </h5>
                            <p className="text-sm text-text-secondary mt-2 font-body">
                                Subtle character, high readability
                            </p>
                        </div>

                        <div className="border-l-4 border-border-subtle pl-4 sm:pl-6">
                            <p className="text-xs text-text-tertiary mb-2 font-body">text-xl (20-24px) - Small Headings</p>
                            <h6 className="font-heading text-base sm:text-lg md:text-xl font-semibold">
                                Product Details
                            </h6>
                            <p className="text-sm text-text-secondary mt-2 font-body">
                                Neutral, functional
                            </p>
                        </div>

                        <div className="border-l-4 border-divider pl-4 sm:pl-6">
                            <p className="text-xs text-text-tertiary mb-2 font-body">text-base (16-17px) - Body Text (Inter)</p>
                            <p className="font-body text-sm sm:text-base leading-relaxed text-text-secondary">
                                For body content, we use Inter for optimal readability. Crafted from the finest Italian
                                leather, this premium jacket combines timeless style with modern craftsmanship. Each piece
                                is meticulously hand-finished by master velles.
                            </p>
                            <p className="text-sm text-text-secondary mt-2 font-body">
                                Clean Inter sans-serif for perfect readability
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Real E-Commerce Examples */}
            <section className="space-y-6 sm:space-y-8">
                <SectionHeader
                    title="E-Commerce in Action"
                    subtitle="How Bricolage Grotesque works across your store"
                />

                {/* Product Page Header */}
                <div className="card space-y-6 sm:space-y-8 bg-linear-to-br from-background to-muted/30">
                    <div className="space-y-4">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="badge-new font-body">New Arrival</span>
                            <span className="badge-sale font-body">Sale -40%</span>
                            <span className="px-3 py-1 bg-accent-subtle text-accent text-xs font-semibold rounded-full font-body">
                                Limited Edition
                            </span>
                        </div>

                        <div className="space-y-3">
                            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
                                Premium Italian Leather Jacket
                            </h1>
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star key={star} className="w-4 h-4 sm:w-5 sm:h-5 fill-rating-filled text-rating-filled" />
                                    ))}
                                </div>
                                <span className="text-sm text-text-tertiary font-body">(247 reviews)</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-baseline gap-3 flex-wrap">
                                <span className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-price-current tracking-tight">
                                    $449.99
                                </span>
                                <span className="font-body text-lg sm:text-xl line-through text-price-original">
                                    $749.99
                                </span>
                                <span className="px-3 py-1 bg-success-subtle text-success font-semibold text-sm rounded-full font-body">
                                    Save $300
                                </span>
                            </div>
                            <p className="text-sm text-text-tertiary font-body">
                                Tax included. Free shipping on orders over $150.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <h3 className="font-heading text-xl sm:text-2xl font-semibold">Description</h3>
                            <p className="font-body text-sm sm:text-base leading-relaxed text-text-secondary">
                                Crafted from the finest Italian leather, this premium jacket combines timeless style
                                with modern craftsmanship. Each piece is meticulously hand-finished by master velles
                                in Florence, ensuring unparalleled quality and attention to detail. The supple leather
                                develops a beautiful patina over time, making each jacket uniquely yours.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <h3 className="font-heading text-lg sm:text-xl font-semibold">Key Features</h3>
                            <ul className="space-y-2 font-body text-sm sm:text-base">
                                <li className="flex items-start gap-2">
                                    <Check className="w-5 h-5 text-success mt-0.5 shrink-0" />
                                    <span className="text-text-secondary">100% genuine Italian leather from certified tanneries</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Check className="w-5 h-5 text-success mt-0.5 shrink-0" />
                                    <span className="text-text-secondary">YKK premium metal zippers for durability</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Check className="w-5 h-5 text-success mt-0.5 shrink-0" />
                                    <span className="text-text-secondary">Quilted satin lining for comfort and insulation</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Check className="w-5 h-5 text-success mt-0.5 shrink-0" />
                                    <span className="text-text-secondary">Hand-finished by master velles in Florence</span>
                                </li>
                            </ul>
                        </div>

                        <div className="space-y-3">
                            <label className="font-body text-sm font-medium text-text-primary">
                                Size: <span className="font-semibold">Medium</span>
                            </label>
                            <div className="flex gap-2 flex-wrap">
                                {['XS', 'S', 'M', 'L', 'XL', '2XL'].map((size) => (
                                    <button
                                        key={size}
                                        className={`px-4 py-2 border-2 font-body font-medium text-sm rounded transition-all ${size === 'M'
                                            ? 'border-primary bg-primary text-primary-foreground'
                                            : 'border-border hover:border-primary'
                                            }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-3 flex-wrap">
                            <button className="btn-primary flex-1 min-w-50 flex items-center justify-center gap-2 font-body">
                                <ShoppingCart className="w-5 h-5" />
                                Add to Cart
                            </button>
                            <button className="p-3 border-2 border-border hover:border-primary rounded-md transition-all">
                                <Heart className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-divider">
                        <p className="text-xs text-text-tertiary font-body">
                            <strong className="text-text-primary">Typography Note:</strong> Headlines use Bricolage Grotesque
                            for distinctive character. Body text, labels, and buttons use Inter for optimal readability.
                        </p>
                    </div>
                </div>
            </section>

            {/* Product Card Grid */}
            <section className="space-y-6 sm:space-y-8">
                <SectionHeader
                    title="Product Cards"
                    subtitle="Bricolage Grotesque in card layouts"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {[
                        { name: 'Classic Bomber', price: 449.99, badge: 'New' },
                        { name: 'Heritage Jacket', price: 599.99, badge: 'Sale' },
                        { name: 'Designer Coat', price: 749.99, badge: 'Limited' }
                    ].map((product, idx) => (
                        <div key={idx} className="card p-0 overflow-hidden hover:shadow-lg transition-all duration-300 group">
                            <div className="relative bg-muted aspect-3/4 flex items-center justify-center">
                                <div className="absolute top-4 left-4 z-10">
                                    <span className={`${product.badge === 'New' ? 'badge-new' :
                                        product.badge === 'Sale' ? 'badge-sale' :
                                            'badge-limited'
                                        } font-body`}>
                                        {product.badge}
                                    </span>
                                </div>
                                <p className="text-6xl sm:text-7xl font-bold text-muted-foreground/20 font-heading">
                                    {idx + 1}
                                </p>
                            </div>
                            <div className="p-4 sm:p-5 space-y-3">
                                <h3 className="font-heading text-xl sm:text-2xl font-semibold tracking-tight group-hover:text-primary transition-colors">
                                    {product.name}
                                </h3>
                                <div className="flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star key={star} className="w-4 h-4 fill-rating-filled text-rating-filled" />
                                    ))}
                                    <span className="text-xs sm:text-sm text-text-tertiary ml-2 font-body">(128)</span>
                                </div>
                                <div className="flex items-baseline gap-2">
                                    <span className="font-heading text-2xl sm:text-3xl font-bold tracking-tight">
                                        ${product.price}
                                    </span>
                                </div>
                                <button className="btn-primary w-full text-sm sm:text-base font-body">
                                    Quick Add
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Typography Comparison */}
            <section className="space-y-6 sm:space-y-8">
                <SectionHeader
                    title="Compare with Other Options"
                    subtitle="See how Bricolage Grotesque compares to alternatives"
                />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                    {/* Option 1: Montserrat */}
                    <div className="card space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="font-body text-lg font-bold">Option 1: Montserrat</h3>
                            <span className="px-2 py-1 bg-muted text-text-tertiary text-xs font-semibold rounded font-body">
                                Default
                            </span>
                        </div>
                        <div className="space-y-3">
                            <p style={{ fontFamily: 'Montserrat, sans-serif' }} className="text-2xl sm:text-3xl font-extrabold tracking-tighter">
                                PREMIUM LEATHER
                            </p>
                            <p className="text-xs text-text-secondary font-body">
                                Geometric, modern, professional. Like Apple or Tesla.
                            </p>
                        </div>
                        <div className="pt-3 border-t border-divider space-y-1">
                            <p className="text-xs font-semibold text-text-primary font-body">Best For:</p>
                            <p className="text-xs text-text-tertiary font-body">
                                Broad appeal, tech-forward brands, $100-500
                            </p>
                        </div>
                    </div>

                    {/* Option 3: Playfair Display */}
                    <div className="card space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="font-body text-lg font-bold">Option 3: Playfair Display</h3>
                            <span className="px-2 py-1 bg-secondary-subtle text-secondary text-xs font-semibold rounded font-body">
                                Luxury
                            </span>
                        </div>
                        <div className="space-y-3">
                            <p style={{ fontFamily: 'Playfair Display, serif' }} className="text-2xl sm:text-3xl font-extrabold">
                                Premium Leather
                            </p>
                            <p className="text-xs text-text-secondary font-body">
                                Elegant serif, traditional. Like Hermès or Vogue.
                            </p>
                        </div>
                        <div className="pt-3 border-t border-divider space-y-1">
                            <p className="text-xs font-semibold text-text-primary font-body">Best For:</p>
                            <p className="text-xs text-text-tertiary font-body">
                                Heritage brands, ultra-luxury, $500+
                            </p>
                        </div>
                    </div>

                    {/* Option 4: Bricolage Grotesque (Current) */}
                    <div className="card space-y-4 border-2 border-accent bg-accent-subtle/30">
                        <div className="flex items-center justify-between">
                            <h3 className="font-body text-lg font-bold">Option 4: Bricolage Grotesque</h3>
                            <span className="px-2 py-1 bg-accent text-accent-foreground text-xs font-bold rounded font-body">
                                ACTIVE
                            </span>
                        </div>
                        <div className="space-y-3">
                            <p className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tighter">
                                PREMIUM LEATHER
                            </p>
                            <p className="text-xs text-text-secondary font-body">
                                Distinctive, characterful. Like Ace Hotel or Kinfolk.
                            </p>
                        </div>
                        <div className="pt-3 border-t border-divider space-y-1">
                            <p className="text-xs font-semibold text-text-primary font-body">Best For:</p>
                            <p className="text-xs text-text-tertiary font-body">
                                Modern velle brands, craft focus, $200-600
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Best Practices */}
            <section className="space-y-6 sm:space-y-8">
                <SectionHeader
                    title="Bricolage Grotesque Best Practices"
                    subtitle="Guidelines for using this distinctive typeface effectively"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    {/* DO */}
                    <div className="card bg-success-subtle border-success">
                        <h4 className="font-heading text-lg sm:text-xl font-semibold text-success mb-4 flex items-center gap-2">
                            <Check className="w-5 h-5" />
                            DO ✓
                        </h4>
                        <ul className="space-y-2 font-body text-sm">
                            <li className="flex items-start gap-2">
                                <span className="text-success mt-0.5">✓</span>
                                <span>Use Bricolage for all headings (H1-H6)</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-success mt-0.5">✓</span>
                                <span>Use Inter for all body text and UI elements</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-success mt-0.5">✓</span>
                                <span>Let optical sizing work its magic (font-optical-sizing: auto)</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-success mt-0.5">✓</span>
                                <span>Use tighter tracking (-0.025em to -0.05em) for large headlines</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-success mt-0.5">✓</span>
                                <span>Leverage ExtraBold (800) for maximum impact on heroes</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-success mt-0.5">✓</span>
                                <span>Pair bold Bricolage headlines with clean Inter body</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-success mt-0.5">✓</span>
                                <span>Test on actual devices to see optical sizing in action</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-success mt-0.5">✓</span>
                                <span>{"Embrace the personality - it's what makes it special!"}</span>
                            </li>
                        </ul>
                    </div>

                    {/* DON'T */}
                    <div className="card bg-destructive-subtle border-destructive">
                        <h4 className="font-heading text-lg sm:text-xl font-semibold text-destructive mb-4 flex items-center gap-2">
                            <X className="w-5 h-5" />
                            {"DON'T ✗"}
                        </h4>
                        <ul className="space-y-2 font-body text-sm">
                            <li className="flex items-start gap-2">
                                <span className="text-destructive mt-0.5">✗</span>
                                <span>Use Bricolage for long body text (use Inter instead)</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-destructive mt-0.5">✗</span>
                                <span>Mix with other display fonts (stick to the system)</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-destructive mt-0.5">✗</span>
                                <span>{"Disable optical sizing (you'll lose the magic)"}</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-destructive mt-0.5">✗</span>
                                <span>Use too many different weights (3-4 max)</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-destructive mt-0.5">✗</span>
                                <span>Make small UI text in Bricolage (Inter is better)</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-destructive mt-0.5">✗</span>
                                <span>Pair with other quirky fonts (too much personality)</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-destructive mt-0.5">✗</span>
                                <span>Use ultra-wide letter spacing (defeats the character)</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-destructive mt-0.5">✗</span>
                                <span>Question the personality - embrace it with confidence!</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* Navigation Typography */}
            <section className="space-y-8">
                <SectionHeader
                    title="Navigation Typography"
                    subtitle="Menu, links, and navigation elements"
                />

                <div className="card space-y-6">
                    {/* Main Navigation */}
                    <div className="space-y-4">
                        <h4 className="font-heading text-lg font-semibold">Main Navigation</h4>
                        <nav className="flex flex-wrap gap-6">
                            {['New Arrivals', 'Jackets', 'Coats', 'Blazers', 'Accessories', 'Sale'].map((item) => (
                                <a
                                    key={item}
                                    href="#"
                                    className="font-body text-base font-medium text-text-primary hover:text-accent transition-colors"
                                >
                                    {item}
                                </a>
                            ))}
                        </nav>
                    </div>

                    {/* Breadcrumbs */}
                    <div className="space-y-4">
                        <h4 className="font-heading text-lg font-semibold">Breadcrumbs</h4>
                        <nav className="flex items-center gap-2 text-sm font-body">
                            <a href="#" className="text-text-tertiary hover:text-text-primary">Home</a>
                            <ChevronRight className="w-4 h-4 text-text-tertiary" />
                            <a href="#" className="text-text-tertiary hover:text-text-primary">Jackets</a>
                            <ChevronRight className="w-4 h-4 text-text-tertiary" />
                            <span className="text-text-primary font-medium">Leather Jackets</span>
                        </nav>
                    </div>

                    {/* Footer Links */}
                    <div className="space-y-4">
                        <h4 className="font-heading text-lg font-semibold">Footer Links</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {['About Us', 'Contact', 'Shipping', 'Returns', 'Privacy', 'Terms', 'Careers', 'Press'].map((link) => (
                                <a
                                    key={link}
                                    href="#"
                                    className="font-body text-sm text-text-secondary hover:text-text-primary transition-colors"
                                >
                                    {link}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Cart & Checkout Typography */}
            <section className="space-y-8">
                <SectionHeader
                    title="Cart & Checkout Typography"
                    subtitle="Shopping cart and order summary"
                />

                <div className="card space-y-6">
                    {/* Cart Item */}
                    <div className="flex gap-4 pb-6 border-b border-divider">
                        <div className="w-24 h-24 bg-muted rounded-lg shrink-0" />
                        <div className="flex-1 space-y-2">
                            <h4 className="font-heading text-base font-semibold">Premium Leather Jacket</h4>
                            <p className="font-body text-sm text-text-secondary">Size: L | Color: Black</p>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <button className="p-1 border border-border rounded">
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <span className="font-body text-base font-medium w-8 text-center">1</span>
                                    <button className="p-1 border border-border rounded">
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                                <p className="font-heading text-lg font-bold">$449.99</p>
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="space-y-3">
                        <h3 className="font-heading text-xl font-semibold">Order Summary</h3>
                        <div className="space-y-2 font-body text-base">
                            <div className="flex justify-between">
                                <span className="text-text-secondary">Subtotal</span>
                                <span className="font-medium">$449.99</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-text-secondary">Shipping</span>
                                <span className="font-medium text-success">Free</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-text-secondary">Tax</span>
                                <span className="font-medium">$36.00</span>
                            </div>
                            <div className="h-px bg-divider my-3" />
                            <div className="flex justify-between items-baseline">
                                <span className="font-heading text-lg font-semibold">Total</span>
                                <span className="font-heading text-2xl font-bold text-primary">$485.99</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Responsive Typography */}
            <section className="space-y-8">
                <SectionHeader
                    title="Responsive Typography"
                    subtitle="How typography adapts across devices"
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="card">
                        <h4 className="font-heading text-lg font-semibold mb-4">{"Mobile (< 640px)"}</h4>
                        <ul className="space-y-2 font-body text-sm text-text-secondary">
                            <li>• H1: 60px minimum</li>
                            <li>• Body: 16px (accessibility)</li>
                            <li>• Line-height: 1.625</li>
                            <li>• Comfortable for thumbs</li>
                            <li>• Touch-friendly targets</li>
                        </ul>
                    </div>

                    <div className="card">
                        <h4 className="font-heading text-lg font-semibold mb-4">Tablet (640-1024px)</h4>
                        <ul className="space-y-2 font-body text-sm text-text-secondary">
                            <li>• H1: Scales to 66px</li>
                            <li>• Body: 16-17px</li>
                            <li>• Line-height: 1.5</li>
                            <li>• Balanced layout</li>
                            <li>• Optimal for reading</li>
                        </ul>
                    </div>

                    <div className="card">
                        <h4 className="font-heading text-lg font-semibold mb-4">{"Desktop (> 1024px)"}</h4>
                        <ul className="space-y-2 font-body text-sm text-text-secondary">
                            <li>• H1: 72px maximum</li>
                            <li>• Body: 17px</li>
                            <li>• Line-height: 1.5</li>
                            <li>• Full elegance</li>
                            <li>• Maximum impact</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* Usage Examples */}
            <section className="space-y-6 sm:space-y-8">
                <SectionHeader
                    title="Real-World Usage"
                    subtitle="How different elements use the typography system"
                />

                <div className="space-y-4 sm:space-y-6">
                    {/* Navigation */}
                    <div className="card">
                        <h4 className="font-heading text-lg sm:text-xl font-semibold mb-4">Navigation</h4>
                        <div className="bg-surface border border-border rounded-lg p-4">
                            <div className="flex items-center justify-between flex-wrap gap-4">
                                <h2 className="font-heading text-xl sm:text-2xl font-bold">Velle Hide</h2>
                                <nav className="flex gap-4 sm:gap-6 font-body text-sm sm:text-base font-medium">
                                    <a href="#" className="text-text-primary hover:text-accent transition-colors">New</a>
                                    <a href="#" className="text-text-secondary hover:text-text-primary transition-colors">Jackets</a>
                                    <a href="#" className="text-text-secondary hover:text-text-primary transition-colors">Coats</a>
                                    <a href="#" className="text-text-secondary hover:text-text-primary transition-colors">Sale</a>
                                </nav>
                            </div>
                        </div>
                        <p className="text-xs text-text-tertiary mt-3 font-body">
                            Brand name: Bricolage Grotesque Bold | Menu links: Inter Medium
                        </p>
                    </div>

                    {/* Cart Summary */}
                    <div className="card">
                        <h4 className="font-heading text-lg sm:text-xl font-semibold mb-4">Order Summary</h4>
                        <div className="bg-surface border border-border rounded-lg p-4 sm:p-6 space-y-4">
                            <h3 className="font-heading text-xl sm:text-2xl font-bold">Order Summary</h3>
                            <div className="space-y-2 font-body text-sm sm:text-base">
                                <div className="flex justify-between">
                                    <span className="text-text-secondary">Subtotal</span>
                                    <span className="font-medium">$449.99</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-text-secondary">Shipping</span>
                                    <span className="font-medium text-success">Free</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-text-secondary">Tax</span>
                                    <span className="font-medium">$36.00</span>
                                </div>
                            </div>
                            <div className="h-px bg-divider my-3"></div>
                            <div className="flex justify-between items-baseline">
                                <span className="font-heading text-lg sm:text-xl font-semibold">Total</span>
                                <span className="font-heading text-2xl sm:text-3xl font-bold text-primary">$485.99</span>
                            </div>
                        </div>
                        <p className="text-xs text-text-tertiary mt-3 font-body">
                            Headings: Bricolage Grotesque | Prices & details: Inter
                        </p>
                    </div>

                    {/* Footer */}
                    <div className="card">
                        <h4 className="font-heading text-lg sm:text-xl font-semibold mb-4">Footer</h4>
                        <div className="bg-surface border border-border rounded-lg p-4 sm:p-6 space-y-6">
                            <h3 className="font-heading text-xl sm:text-2xl font-bold">Velle Hide</h3>
                            <p className="font-body text-sm text-text-secondary max-w-md">
                                Premium leather goods crafted with modern techniques and timeless soul.
                                Handmade in Brooklyn since 2020.
                            </p>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
                                <div className="space-y-2">
                                    <h4 className="font-heading text-sm font-semibold">Shop</h4>
                                    <ul className="space-y-1 font-body text-xs sm:text-sm text-text-secondary">
                                        <li><a href="#">New</a></li>
                                        <li><a href="#">Jackets</a></li>
                                        <li><a href="#">Coats</a></li>
                                    </ul>
                                </div>
                                <div className="space-y-2">
                                    <h4 className="font-heading text-sm font-semibold">About</h4>
                                    <ul className="space-y-1 font-body text-xs sm:text-sm text-text-secondary">
                                        <li><a href="#">Our Story</a></li>
                                        <li><a href="#">Craft</a></li>
                                        <li><a href="#">Materials</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <p className="text-xs text-text-tertiary mt-3 font-body">
                            Headings: Bricolage Grotesque | Links & body: Inter
                        </p>
                    </div>
                </div>
            </section>

            {/* Quick Reference */}
            <section className="space-y-6 sm:space-y-8">
                <SectionHeader
                    title="Quick Reference"
                    subtitle="At-a-glance typography usage guide"
                />

                <div className="card bg-linear-to-br from-primary-subtle to-accent-subtle">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                        <div className="space-y-4">
                            <h4 className="font-heading text-lg sm:text-xl font-bold text-primary">
                                Use Bricolage Grotesque For:
                            </h4>
                            <ul className="space-y-2 font-body text-sm">
                                <li className="flex items-start gap-2">
                                    <span className="text-primary mt-0.5">→</span>
                                    <span>All headings (H1 through H6)</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-primary mt-0.5">→</span>
                                    <span>Brand name / logo text</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-primary mt-0.5">→</span>
                                    <span>Product titles and names</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-primary mt-0.5">→</span>
                                    <span>Price displays (large & prominent)</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-primary mt-0.5">→</span>
                                    <span>Hero headlines and taglines</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-primary mt-0.5">→</span>
                                    <span>Section headers and titles</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-primary mt-0.5">→</span>
                                    <span>Callouts and highlights</span>
                                </li>
                            </ul>
                        </div>

                        <div className="space-y-4">
                            <h4 className="font-body text-lg sm:text-xl font-bold text-accent">
                                Use Inter For:
                            </h4>
                            <ul className="space-y-2 font-body text-sm">
                                <li className="flex items-start gap-2">
                                    <span className="text-accent mt-0.5">→</span>
                                    <span>All body text and paragraphs</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-accent mt-0.5">→</span>
                                    <span>Product descriptions</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-accent mt-0.5">→</span>
                                    <span>Navigation menu links</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-accent mt-0.5">→</span>
                                    <span>Button text and CTAs</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-accent mt-0.5">→</span>
                                    <span>Form labels and inputs</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-accent mt-0.5">→</span>
                                    <span>Badges and labels</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-accent mt-0.5">→</span>
                                    <span>Footer links and legal text</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why This Works */}
            <section className="space-y-6 sm:space-y-8">
                <SectionHeader
                    title="Why Bricolage Grotesque + Inter Works"
                    subtitle="The perfect pairing for modern velle brands"
                />

                <div className="card bg-linear-to-br from-accent-subtle via-background to-success-subtle space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-3">
                            <div className="w-12 h-12 bg-accent text-accent-foreground rounded-lg flex items-center justify-center">
                                <span className="text-2xl">✨</span>
                            </div>
                            <h4 className="font-heading text-lg font-bold">Distinctive Identity</h4>
                            <p className="font-body text-sm text-text-secondary leading-relaxed">
                                {"Bricolage Grotesque's unique character makes your brand instantly recognizable."}
                                {"You won't look like every other modern e-commerce site."}
                            </p>
                        </div>

                        <div className="space-y-3">
                            <div className="w-12 h-12 bg-success text-success-foreground rounded-lg flex items-center justify-center">
                                <span className="text-2xl">🎯</span>
                            </div>
                            <h4 className="font-heading text-lg font-bold">Perfect Balance</h4>
                            <p className="font-body text-sm text-text-secondary leading-relaxed">
                                Headlines get personality through Bricolage, while Inter keeps body text
                                supremely readable. The contrast creates perfect hierarchy.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <div className="w-12 h-12 bg-primary text-primary-foreground rounded-lg flex items-center justify-center">
                                <span className="text-2xl">❤️</span>
                            </div>
                            <h4 className="font-heading text-lg font-bold">Human Touch</h4>
                            <p className="font-body text-sm text-text-secondary leading-relaxed">
                                The optical sizing and quirky details communicate craftsmanship and care.
                                Your brand feels made by real people, not a corporation.
                            </p>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-divider">
                        <p className="font-body text-sm text-text-secondary text-center max-w-3xl mx-auto">
                            <strong className="text-text-primary">The Result:</strong> A typography system that positions
                            your brand as modern velle leather goods with soul—not generic minimalism, not stuffy luxury,
                            but contemporary craft with personality. Perfect for brands like yours.
                        </p>
                    </div>
                </div>
            </section>
        </>
    )
}