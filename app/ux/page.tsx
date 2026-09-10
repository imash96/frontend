"use client"

import { useState } from 'react';
import { Eye, MousePointer, Layers, Zap, LayoutGrid, Menu, Grid, ChevronDown, Shield } from 'lucide-react';

// Optimized types
interface Section {
    id: string;
    label: string;
    icon: React.ElementType;
}

interface PrincipleCardProps {
    title: string;
    description: string;
    color: 'primary' | 'secondary' | 'accent' | 'neutral';
}

interface FeatureItemProps {
    label: string;
    description: string;
}

// Memoized components
function PrincipleCard({ title, description, color }: PrincipleCardProps) {
    const colorClasses = {
        primary: 'bg-primary/5 border-primary/20 hover:border-primary/40',
        secondary: 'bg-secondary/5 border-secondary/20 hover:border-secondary/40',
        accent: 'bg-accent/5 border-accent/20 hover:border-accent/40',
        neutral: 'bg-muted border-border hover:border-border-strong'
    };

    return (
        <div className={`${colorClasses[color]} border-2 p-6 rounded-xl transition-all duration-300 hover:shadow-lg`}>
            <h3 className="text-lg font-semibold text-text-primary mb-3 font-heading">{title}</h3>
            <p className="text-sm text-text-secondary leading-relaxed">{description}</p>
        </div>
    );
};

function FeatureItem({ label, description }: FeatureItemProps) {
    return (
        <div className="flex gap-3 items-start group">
            <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0 group-hover:scale-125 transition-transform" />
            <div className="flex-1">
                <div className="text-text-primary font-medium font-body">{label}</div>
                <div className="text-sm text-text-secondary mt-1 leading-relaxed">{description}</div>
            </div>
        </div>
    )
}

export default function UXArchitecture() {
    const [activeSection, setActiveSection] = useState<string>('overview');

    const sections: Section[] = [
        { id: 'overview', label: 'Overview', icon: Eye },
        { id: 'layout', label: 'Layout System', icon: LayoutGrid },
        { id: 'components', label: 'Component Hierarchy', icon: Layers },
        { id: 'navigation', label: 'Navigation Patterns', icon: Menu },
        { id: 'interactions', label: 'Interaction Patterns', icon: MousePointer },
        { id: 'templates', label: 'Page Templates', icon: Grid },
        { id: 'metrics', label: 'UX Metrics', icon: Zap }
    ];

    return (
        <div className="min-h-screen bg-background text-text-primary">
            {/* Header */}
            <header className="border-b border-border sticky top-0 bg-surface/95 backdrop-blur-md z-50 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-light tracking-tight font-heading">UX Architecture</h1>
                            <p className="text-sm text-text-secondary mt-1">Premium Leather Clothing Brand</p>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                            <span className="px-3 py-1 bg-accent/10 text-accent text-xs rounded-full border border-accent/20">
                                Next.js 16.3+
                            </span>
                            <span className="px-3 py-1 bg-info/10 text-info text-xs rounded-full border border-info/20">
                                Tailwind 4.3+
                            </span>
                            <span className="px-3 py-1 bg-secondary/10 text-secondary text-xs rounded-full border border-secondary/20">
                                Medusa v2.20+
                            </span>
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex">
                {/* Sidebar Navigation */}
                <aside className="w-64 border-r border-border min-h-screen sticky top-18.25 self-start hidden lg:block bg-surface">
                    <nav className="p-4">
                        {sections.map((section) => (
                            <button
                                key={section.id}
                                onClick={() => setActiveSection(section.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all mb-1 ${activeSection === section.id
                                    ? 'bg-primary/10 text-primary shadow-sm'
                                    : 'text-text-secondary hover:bg-muted hover:text-text-primary'
                                    }`}
                            >
                                <section.icon className="w-4 h-4 shrink-0" />
                                <span className="text-sm font-medium">{section.label}</span>
                            </button>
                        ))}
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-8 max-w-5xl mx-auto">
                    {activeSection === 'overview' && <OverviewSection />}
                    {activeSection === 'layout' && <LayoutSection />}
                    {activeSection === 'components' && <ComponentsSection />}
                    {activeSection === 'navigation' && <NavigationSection />}
                    {activeSection === 'interactions' && <InteractionsSection />}
                    {activeSection === 'templates' && <TemplatesSection />}
                    {activeSection === 'metrics' && <MetricsSection />}
                </main>
            </div>
        </div>
    );
}

// Section Components
function OverviewSection() {
    return (
        <div className="space-y-12">
            <div>
                <h2 className="text-4xl font-light tracking-tight mb-6 font-heading">UX Architecture Overview</h2>
                <p className="text-text-secondary text-lg leading-relaxed mb-8">
                    A sophisticated, editorial-inspired architecture designed for premium leather fashion.
                    Emphasis on visual storytelling, craftsmanship, and luxurious user experience.
                </p>
            </div>

            {/* Core Principles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <PrincipleCard
                    title="Editorial First"
                    description="Magazine-quality layouts with generous whitespace, large imagery, and refined typography creating an immersive browsing experience."
                    color="accent"
                />
                <PrincipleCard
                    title="Tactile Interactions"
                    description="Subtle, sophisticated micro-interactions that evoke the feel of premium leather—smooth, responsive, and satisfying."
                    color="neutral"
                />
                <PrincipleCard
                    title="Content Hierarchy"
                    description="Clear visual hierarchy guiding users from discovery to purchase with intentional information architecture."
                    color="primary"
                />
                <PrincipleCard
                    title="Performance & Speed"
                    description="Optimized Next.js App Router with streaming, parallel routes, and server components for instant navigation."
                    color="secondary"
                />
            </div>

            {/* Key Features */}
            <div className="mt-12">
                <h3 className="text-2xl font-light mb-6 font-heading">Key Features</h3>
                <div className="space-y-4">
                    <FeatureItem
                        label="Progressive Enhancement"
                        description="Core functionality works without JS, enhanced experiences with client-side interactions"
                    />
                    <FeatureItem
                        label="Immersive Product Stories"
                        description="Full-screen product experiences with cinematic imagery and detailed craftsmanship narratives"
                    />
                    <FeatureItem
                        label="Intelligent Search & Filtering"
                        description="Faceted search with real-time updates, saved filters, and AI-powered recommendations"
                    />
                    <FeatureItem
                        label="Seamless Cart Experience"
                        description="Slide-out cart with live updates, persistent state, and one-click checkout integration"
                    />
                    <FeatureItem
                        label="Accessibility First"
                        description="WCAG 2.1 AA compliant with keyboard navigation, screen reader support, and semantic HTML"
                    />
                </div>
            </div>

            {/* Tech Stack Integration */}
            <div className="mt-12 p-8 bg-surface border border-border rounded-2xl shadow-sm">
                <h3 className="text-2xl font-light mb-6 font-heading">Tech Stack Integration</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 bg-background rounded-xl border border-border hover:border-primary/40 transition-colors">
                        <h4 className="text-lg font-medium mb-4 text-primary font-heading">Next.js App Router</h4>
                        <ul className="space-y-2 text-sm text-text-secondary">
                            <li className="flex items-start gap-2">
                                <span className="text-accent">→</span>
                                <span>Parallel Routes for modal experiences</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-accent">→</span>
                                <span>Server Components for fast initial loads</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-accent">→</span>
                                <span>Streaming for progressive rendering</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-accent">→</span>
                                <span>Route Groups for layout organization</span>
                            </li>
                        </ul>
                    </div>

                    <div className="p-6 bg-background rounded-xl border border-border hover:border-accent/40 transition-colors">
                        <h4 className="text-lg font-medium mb-4 text-accent font-heading">Tailwind CSS 4+</h4>
                        <ul className="space-y-2 text-sm text-text-secondary">
                            <li className="flex items-start gap-2">
                                <span className="text-accent">→</span>
                                <span>Custom design tokens</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-accent">→</span>
                                <span>Container queries for responsive components</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-accent">→</span>
                                <span>Dynamic variants for state management</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-accent">→</span>
                                <span>Custom plugins for brand patterns</span>
                            </li>
                        </ul>
                    </div>

                    <div className="p-6 bg-background rounded-xl border border-border hover:border-secondary/40 transition-colors">
                        <h4 className="text-lg font-medium mb-4 text-secondary font-heading">Medusa.js Backend</h4>
                        <ul className="space-y-2 text-sm text-text-secondary">
                            <li className="flex items-start gap-2">
                                <span className="text-accent">→</span>
                                <span>Product catalog with variants</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-accent">→</span>
                                <span>Cart & checkout workflows</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-accent">→</span>
                                <span>Customer accounts & orders</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-accent">→</span>
                                <span>Admin dashboard integration</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

// Placeholder sections for other tabs
function LayoutSection() {
    const [activeLayout, setActiveLayout] = useState<string>('default');

    const layouts = [
        { id: 'default', name: 'Default Grid', cols: 12 },
        { id: 'editorial', name: 'Editorial', cols: 6 },
        { id: 'asymmetric', name: 'Asymmetric', cols: 8 }
    ];

    const spacingScale: SpacingScale[] = [
        { size: 'xs', value: '4px', usage: 'Tight spacing, inline elements' },
        { size: 'sm', value: '8px', usage: 'Small gaps, compact layouts' },
        { size: 'md', value: '16px', usage: 'Default spacing, cards' },
        { size: 'lg', value: '24px', usage: 'Section spacing, content blocks' },
        { size: 'xl', value: '32px', usage: 'Large sections, page segments' },
        { size: '2xl', value: '48px', usage: 'Major sections, hero spacing' },
        { size: '3xl', value: '64px', usage: 'Editorial spacing, page breaks' }
    ];
    return (
        <div className="space-y-12">
            <div className="space-y-8">
                <h2 className="text-4xl font-light tracking-tight mb-6 font-heading">Layout System</h2>
                <p className="text-text-secondary text-lg">Flexible grid system with editorial focus, supporting asymmetric layouts and generous spacing.</p>
            </div>
            {/* Layout Selector */}
            <div className="flex gap-4 mb-8">
                {layouts.map((layout) => (
                    <button
                        key={layout.id}
                        onClick={() => setActiveLayout(layout.id)}
                        className={`px-6 py-3 rounded-lg transition-all border ${activeLayout === layout.id
                            ? 'bg-surface-elevated-high text-on-surface border-emphasis'
                            : 'bg-surface-elevated text-on-surface-secondary hover-surface border-subtle'
                            }`}
                    >
                        <div className="text-sm font-light">{layout.name}</div>
                        <div className="text-xs text-on-surface-tertiary mt-1">{layout.cols} columns</div>
                    </button>
                ))}
            </div>

            {/* Layout Visualization */}
            <div className="bg-surface-elevated p-8 rounded-2xl border border-border">
                <h3 className="text-xl font-light mb-6">Layout Structure</h3>

                {activeLayout === 'default' && (
                    <div className="space-y-8">
                        <div className="grid grid-cols-12 gap-4">
                            {[...Array(12)].map((_, i) => (
                                <div key={i} className="aspect-square bg-surface-elevated-high rounded border border-subtle flex items-center justify-center text-xs text-on-surface-tertiary">
                                    {i + 1}
                                </div>
                            ))}
                        </div>
                        <div className="space-y-3 text-sm text-on-surface-secondary">
                            <p><strong className="text-on-surface">Container:</strong> max-w-7xl (1280px)</p>
                            <p><strong className="text-on-surface">Gutters:</strong> 24px (px-6)</p>
                            <p><strong className="text-on-surface">Gap:</strong> 16px default, 24px for content sections</p>
                            <p><strong className="text-on-surface">Breakpoints:</strong> sm: 640px, md: 768px, lg: 1024px, xl: 1280px, 2xl: 1536px</p>
                        </div>
                    </div>
                )}

                {activeLayout === 'editorial' && (
                    <div className="space-y-8">
                        <div className="grid grid-cols-6 gap-6">
                            <div className="col-span-4 aspect-4/3 bg-surface-elevated-high rounded border border-subtle flex items-center justify-center text-on-surface-tertiary">
                                Hero Image
                            </div>
                            <div className="col-span-2 space-y-4">
                                <div className="h-24 bg-surface-elevated-high rounded border border-subtle flex items-center justify-center text-xs text-on-surface-tertiary">
                                    Content
                                </div>
                                <div className="h-32 bg-surface-elevated-high rounded border border-subtle flex items-center justify-center text-xs text-on-surface-tertiary">
                                    Metadata
                                </div>
                            </div>
                        </div>
                        <div className="space-y-3 text-sm text-on-surface-secondary">
                            <p><strong className="text-on-surface">Purpose:</strong> Product detail pages, editorial content</p>
                            <p><strong className="text-on-surface">Emphasis:</strong> Large imagery (4 cols) with supporting content (2 cols)</p>
                            <p><strong className="text-on-surface">Spacing:</strong> Generous gaps (gap-6 to gap-8)</p>
                        </div>
                    </div>
                )}

                {activeLayout === 'asymmetric' && (
                    <div className="space-y-8">
                        <div className="grid grid-cols-8 gap-4">
                            <div className="col-span-5 aspect-3/2 bg-surface-elevated-high rounded border border-subtle flex items-center justify-center text-on-surface-tertiary">
                                Primary Content
                            </div>
                            <div className="col-span-3 space-y-4">
                                <div className="h-32 bg-surface-elevated-high rounded border border-subtle flex items-center justify-center text-xs text-on-surface-tertiary">
                                    Sidebar
                                </div>
                                <div className="h-20 bg-surface-elevated-high rounded border border-subtle flex items-center justify-center text-xs text-on-surface-tertiary">
                                    Actions
                                </div>
                            </div>
                        </div>
                        <div className="space-y-3 text-sm text-on-surface-secondary">
                            <p><strong className="text-on-surface">Purpose:</strong> Collection pages, search results</p>
                            <p><strong className="text-on-surface">Ratio:</strong> 5:3 split for dynamic tension</p>
                            <p><strong className="text-on-surface">Flexibility:</strong> Adapts to content without feeling rigid</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Spacing Scale */}
            <div className="bg-surface-elevated p-8 rounded-2xl border border-border">
                <h3 className="text-xl font-light mb-6">Spacing Scale</h3>
                <div className="space-y-4">
                    {spacingScale.map((spacing) => (
                        <div key={spacing.size} className="flex items-center gap-6">
                            <div className="w-16 text-sm text-on-surface-secondary">{spacing.size}</div>
                            <div className="w-20 text-sm text-on-surface-tertiary">{spacing.value}</div>
                            <div
                                className="bg-accent h-8 rounded opacity-30"
                                style={{ width: spacing.value }}
                            />
                            <div className="flex-1 text-sm text-on-surface-secondary">{spacing.usage}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

function ComponentsSection() {
    return (
        <div className="space-y-12">
            <div className="space-y-8">
                <h2 className="text-4xl font-light tracking-tight mb-6 font-heading">Component Hierarchy</h2>
                <p className="text-text-secondary text-lg">Modular component architecture organized by complexity and reusability.</p>
            </div>
            {/* Component Tree */}
            <div className="bg-surface-elevated p-8 rounded-2xl border border-border">
                <h3 className="text-xl font-light mb-6">Component Structure</h3>
                <div className="space-y-8">
                    {/* Atoms */}
                    <ComponentLayer
                        title="Atoms"
                        description="Base building blocks with no dependencies"
                        components={[
                            { name: 'Button', props: 'variant, size, loading' },
                            { name: 'Input', props: 'type, validation, error' },
                            { name: 'Badge', props: 'variant, size' },
                            { name: 'Icon', props: 'name, size, color' },
                            { name: 'Image', props: 'src, alt, priority, fill' },
                            { name: 'Price', props: 'amount, currency, discount' },
                            { name: 'Link', props: 'href, variant, external' },
                            { name: 'Checkbox', props: 'checked, onChange, label' },
                            { name: 'Radio', props: 'checked, onChange, label' },
                            { name: 'Select', props: 'options, value, onChange' },
                            { name: 'Textarea', props: 'value, onChange, rows' },
                            { name: 'Spinner', props: 'size, color' }
                        ]}
                        color="primary"
                    />

                    {/* Molecules */}
                    <ComponentLayer
                        title="Molecules"
                        description="Simple combinations of atoms"
                        components={[
                            { name: 'ProductCard', props: 'product, variant, onQuickView' },
                            { name: 'SearchBar', props: 'onSearch, suggestions' },
                            { name: 'CartItem', props: 'item, onUpdate, onRemove' },
                            { name: 'FilterChip', props: 'label, active, onToggle' },
                            { name: 'Breadcrumb', props: 'items, separator' },
                            { name: 'Rating', props: 'value, count, size' },
                            { name: 'Pagination', props: 'current, total, onChange' },
                            { name: 'ColorSwatches', props: 'colors, selected' },
                            { name: 'SizeSelector', props: 'sizes, selected' },
                            { name: 'QuantitySelector', props: 'value, onChange' },
                            { name: 'PriceRange', props: 'min, max, onChange' },
                            { name: 'SocialShare', props: 'url, title' }
                        ]}
                        color="secondary"
                    />

                    {/* Organisms */}
                    <ComponentLayer
                        title="Organisms"
                        description="Complex sections with business logic"
                        components={[
                            { name: 'Header', props: 'cart, user, navigation' },
                            { name: 'ProductGrid', props: 'products, loading, pagination' },
                            { name: 'FilterSidebar', props: 'filters, onApply' },
                            { name: 'CartDrawer', props: 'isOpen, onClose' },
                            { name: 'ProductGallery', props: 'images, thumbnails' },
                            { name: 'CheckoutForm', props: 'onSubmit, cart' },
                            { name: 'ReviewsList', props: 'reviews, pagination' },
                            { name: 'WishlistGrid', props: 'items, onRemove' },
                            { name: 'AccountSidebar', props: 'user, activeSection' },
                            { name: 'MegaMenu', props: 'categories, featured' },
                            { name: 'Footer', props: 'links, newsletter' },
                            { name: 'ProductRecommendations', props: 'products' }
                        ]}
                        color="accent"
                    />

                    {/* Templates */}
                    <ComponentLayer
                        title="Templates"
                        description="Page-level layouts and compositions"
                        components={[
                            { name: 'CollectionTemplate', props: 'collection, products' },
                            { name: 'ProductTemplate', props: 'product, recommendations' },
                            { name: 'AccountTemplate', props: 'user, orders' },
                            { name: 'CheckoutTemplate', props: 'cart, checkout' },
                            { name: 'HomeTemplate', props: 'hero, featured, collections' },
                            { name: 'SearchTemplate', props: 'query, results' },
                            { name: 'WishlistTemplate', props: 'items' },
                            { name: 'OrderHistoryTemplate', props: 'orders' }
                        ]}
                        color="success"
                    />
                </div>
            </div>

            {/* Component Patterns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <PatternCard
                    title="Server Components"
                    items={[
                        'Product catalog fetching',
                        'Collection listings',
                        'Static content pages',
                        'SEO metadata generation',
                        'Order history display',
                        'Content management'
                    ]}
                    badge="Default"
                    badgeColor="primary"
                />
                <PatternCard
                    title="Client Components"
                    items={[
                        'Interactive filters',
                        'Shopping cart state',
                        'Form validation',
                        'Modals and drawers',
                        'Real-time search',
                        'Wishlist management'
                    ]}
                    badge="use client"
                    badgeColor="secondary"
                />
            </div>

            {/* File Organization */}
            <div className="bg-surface-elevated p-8 rounded-2xl border border-border">
                <h3 className="text-xl font-light mb-6">File Organization</h3>
                <pre className="text-sm text-on-surface-secondary font-mono leading-relaxed">
                    {`src/
                        ├── app/                      # Next.js App Router
                        │   ├── (shop)/              # Shop route group
                        │   │   ├── layout.tsx
                        │   │   ├── page.tsx
                        │   │   ├── collections/
                        │   │   │   ├── [handle]/
                        │   │   │   └── page.tsx
                        │   │   └── products/
                        │   │       ├── [handle]/
                        │   │       └── page.tsx
                        │   ├── (account)/           # Account route group
                        │   │   ├── layout.tsx
                        │   │   ├── profile/
                        │   │   ├── orders/
                        │   │   └── wishlist/
                        │   ├── (checkout)/          # Checkout route group
                        │   │   ├── cart/
                        │   │   └── checkout/
                        │   └── @modal/              # Parallel route for modals
                        │       └── (.)products/
                        ├── components/
                        │   ├── atoms/               # Base components
                        │   │   ├── Button.tsx
                        │   │   ├── Input.tsx
                        │   │   ├── Badge.tsx
                        │   │   └── index.ts
                        │   ├── molecules/           # Composed components
                        │   │   ├── ProductCard.tsx
                        │   │   ├── SearchBar.tsx
                        │   │   └── index.ts
                        │   ├── organisms/           # Complex sections
                        │   │   ├── Header.tsx
                        │   │   ├── ProductGrid.tsx
                        │   │   └── index.ts
                        │   └── templates/           # Page layouts
                        │       ├── CollectionTemplate.tsx
                        │       └── index.ts
                        ├── lib/
                        │   ├── medusa/              # Medusa client & utils
                        │   │   ├── client.ts
                        │   │   ├── products.ts
                        │   │   ├── cart.ts
                        │   │   └── checkout.ts
                        │   ├── utils/               # Helper functions
                        │   │   ├── format.ts
                        │   │   ├── validation.ts
                        │   │   └── analytics.ts
                        │   ├── hooks/               # Custom React hooks
                        │   │   ├── useCart.ts
                        │   │   ├── useWishlist.ts
                        │   │   └── useProduct.ts
                        │   └── types/               # TypeScript types
                        │       ├── product.ts
                        │       ├── cart.ts
                        │       └── user.ts
                        ├── styles/
                        │   ├── globals.css          # Tailwind directives
                        │   └── tokens.css           # Design tokens
                        └── public/
                            ├── images/
                            └── fonts/`}
                </pre>
            </div>
        </div>
    )
}

function NavigationSection() {
    const [activeNav, setActiveNav] = useState<string>('mega');
    return (
        <div className="space-y-12">
            <div className="space-y-8">
                <h2 className="text-4xl font-light tracking-tight mb-6 font-heading">Navigation Patterns</h2>
                <p className="text-text-secondary text-lg">Multi-level navigation system optimized for product discovery and conversion.</p>
            </div>
            {/* Navigation Types */}
            <div className="flex gap-4">
                {['mega', 'mobile', 'footer', 'breadcrumb'].map((nav) => (
                    <button
                        key={nav}
                        onClick={() => setActiveNav(nav)}
                        className={`px-6 py-3 rounded-lg capitalize transition-all ${activeNav === nav
                            ? 'bg-surface-elevated-high text-on-surface'
                            : 'bg-surface-elevated text-on-surface-secondary hover-surface'
                            }`}
                    >
                        {nav} Menu
                    </button>
                ))}
            </div>

            {/* Mega Menu */}
            {activeNav === 'mega' && (
                <div className="bg-surface-elevated p-8 rounded-2xl border border-border">
                    <h3 className="text-xl font-light mb-6">Mega Menu Structure</h3>
                    <div className="space-y-6">
                        <div className="grid grid-cols-4 gap-6">
                            <div className="space-y-3">
                                <div className="text-sm font-light text-on-surface-secondary uppercase tracking-wider">Women</div>
                                <div className="space-y-2 text-sm text-on-surface-tertiary">
                                    <div className="hover:text-primary cursor-pointer transition-colors">Leather Jackets</div>
                                    <div className="hover:text-primary cursor-pointer transition-colors">Blazers</div>
                                    <div className="hover:text-primary cursor-pointer transition-colors">Coats</div>
                                    <div className="hover:text-primary cursor-pointer transition-colors">Skirts</div>
                                    <div className="hover:text-primary cursor-pointer transition-colors">Pants</div>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="text-sm font-light text-on-surface-secondary uppercase tracking-wider">Men</div>
                                <div className="space-y-2 text-sm text-on-surface-tertiary">
                                    <div className="hover:text-primary cursor-pointer transition-colors">Leather Jackets</div>
                                    <div className="hover:text-primary cursor-pointer transition-colors">Blazers</div>
                                    <div className="hover:text-primary cursor-pointer transition-colors">Coats</div>
                                    <div className="hover:text-primary cursor-pointer transition-colors">Pants</div>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="text-sm font-light text-on-surface-secondary uppercase tracking-wider">Collections</div>
                                <div className="space-y-2 text-sm text-on-surface-tertiary">
                                    <div className="hover:text-primary cursor-pointer transition-colors">New Arrivals</div>
                                    <div className="hover:text-primary cursor-pointer transition-colors">Bestsellers</div>
                                    <div className="hover:text-primary cursor-pointer transition-colors">Heritage</div>
                                    <div className="hover:text-primary cursor-pointer transition-colors">Limited Edition</div>
                                </div>
                            </div>
                            <div className="aspect-square bg-surface-elevated-high rounded flex items-center justify-center text-on-surface-tertiary text-xs border border-subtle">
                                Featured Image
                            </div>
                        </div>
                        <div className="pt-4 border-t border-border text-sm text-on-surface-secondary">
                            <strong className="text-on-surface">Behavior:</strong> Appears on hover with 200ms delay, disappears on mouse leave with 150ms delay
                        </div>
                    </div>
                </div>
            )}

            {/* Mobile Menu */}
            {activeNav === 'mobile' && (
                <div className="bg-surface-elevated p-8 rounded-2xl border border-border">
                    <h3 className="text-xl font-light mb-6">Mobile Menu Pattern</h3>
                    <div className="space-y-4">
                        <div className="border border-border rounded-lg overflow-hidden">
                            <button className="w-full flex items-center justify-between p-4 hover-surface transition-colors">
                                <span className="text-sm">Women</span>
                                <ChevronDown className="w-4 h-4 text-on-surface-tertiary" />
                            </button>
                            <div className="bg-surface-elevated-high p-4 space-y-2 text-sm text-on-surface-secondary">
                                <div className="hover:text-primary cursor-pointer transition-colors">Leather Jackets</div>
                                <div className="hover:text-primary cursor-pointer transition-colors">Blazers</div>
                                <div className="hover:text-primary cursor-pointer transition-colors">Coats</div>
                            </div>
                        </div>
                        <div className="text-sm text-on-surface-secondary space-y-2">
                            <p><strong className="text-on-surface">Pattern:</strong> Accordion with smooth height transitions</p>
                            <p><strong className="text-on-surface">Animation:</strong> Slide + fade with stagger for items</p>
                            <p><strong className="text-on-surface">Gesture:</strong> Swipe from left edge to open, swipe right to close</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Footer Navigation */}
            {activeNav === 'footer' && (
                <div className="bg-surface-elevated p-8 rounded-2xl border border-border">
                    <h3 className="text-xl font-light mb-6">Footer Navigation</h3>
                    <div className="grid grid-cols-4 gap-8">
                        {['Shop', 'About', 'Support', 'Legal'].map((section) => (
                            <div key={section} className="space-y-3">
                                <div className="text-sm font-light uppercase tracking-wider text-on-surface-secondary">{section}</div>
                                <div className="space-y-2 text-sm text-on-surface-tertiary">
                                    <div className="hover:text-primary cursor-pointer transition-colors">Link Item</div>
                                    <div className="hover:text-primary cursor-pointer transition-colors">Link Item</div>
                                    <div className="hover:text-primary cursor-pointer transition-colors">Link Item</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Breadcrumb Pattern */}
            {activeNav === 'breadcrumb' && (
                <div className="bg-surface-elevated p-8 rounded-2xl border border-border">
                    <h3 className="text-xl font-light mb-6">Breadcrumb Navigation</h3>
                    <div className="flex items-center gap-2 text-sm mb-4">
                        <span className="text-on-surface-tertiary hover:text-primary cursor-pointer transition-colors">Home</span>
                        <span className="text-on-surface-disabled">/</span>
                        <span className="text-on-surface-tertiary hover:text-primary cursor-pointer transition-colors">Collections</span>
                        <span className="text-on-surface-disabled">/</span>
                        <span className="text-on-surface-tertiary hover:text-primary cursor-pointer transition-colors">Women</span>
                        <span className="text-on-surface-disabled">/</span>
                        <span className="text-on-surface">Leather Jackets</span>
                    </div>
                    <div className="text-sm text-on-surface-secondary">
                        <strong className="text-on-surface">Purpose:</strong> Helps users understand their location in the site hierarchy and navigate back easily
                    </div>
                </div>
            )}
        </div>
    )
}

function InteractionsSection() {
    const [activeInteraction, setActiveInteraction] = useState<string>('hover');
    return (
        <div className="space-y-12">
            <div className="space-y-8">
                <h2 className="text-4xl font-light tracking-tight mb-6 font-heading">Interaction Patterns</h2>
                <p className="text-text-secondary text-lg">Sophisticated micro-interactions that enhance the premium experience.</p>
            </div>
            {/* Interaction Types */}
            <div className="flex flex-wrap gap-4">
                {['hover', 'click', 'scroll', 'cart', 'quickview', 'gestures'].map((type) => (
                    <button
                        key={type}
                        onClick={() => setActiveInteraction(type)}
                        className={`px-6 py-3 rounded-lg capitalize transition-all ${activeInteraction === type
                            ? 'bg-surface-elevated-high text-on-surface'
                            : 'bg-surface-elevated text-on-surface-secondary hover-surface'
                            }`}
                    >
                        {type}
                    </button>
                ))}
            </div>

            {/* Interaction Details */}
            <div className="bg-surface-elevated p-8 rounded-2xl border border-border">
                {activeInteraction === 'hover' && (
                    <div className="space-y-6">
                        <h3 className="text-xl font-light">Hover States</h3>
                        <div className="space-y-4">
                            <InteractionDetail
                                title="Product Card Hover"
                                behavior="Scale image to 105%, fade in secondary image, show quick actions"
                                timing="duration-300 ease-out"
                            />
                            <InteractionDetail
                                title="Button Hover"
                                behavior="Lift with subtle shadow, shift background color"
                                timing="duration-200 ease-in-out"
                            />
                            <InteractionDetail
                                title="Link Hover"
                                behavior="Underline animation from left to right"
                                timing="duration-200 ease-out"
                            />
                            <InteractionDetail
                                title="Navigation Item Hover"
                                behavior="Text color transitions to primary, background overlay appears"
                                timing="duration-150 ease-out"
                            />
                        </div>
                    </div>
                )}

                {activeInteraction === 'click' && (
                    <div className="space-y-6">
                        <h3 className="text-xl font-light">Click/Tap Interactions</h3>
                        <div className="space-y-4">
                            <InteractionDetail
                                title="Add to Cart"
                                behavior="Button morphs to success state, cart icon animates, toast notification"
                                timing="Multi-stage: 150ms press, 300ms morph, 200ms bounce"
                            />
                            <InteractionDetail
                                title="Favorite/Wishlist"
                                behavior="Heart fill animation with scale bounce"
                                timing="duration-300 with spring physics"
                            />
                            <InteractionDetail
                                title="Filter Selection"
                                behavior="Checkbox check with path animation, filter count badge updates"
                                timing="duration-200 ease-out"
                            />
                            <InteractionDetail
                                title="Image Zoom"
                                behavior="Click to activate zoom lens, click again to deactivate"
                                timing="duration-250 ease-in-out"
                            />
                        </div>
                    </div>
                )}

                {activeInteraction === 'scroll' && (
                    <div className="space-y-6">
                        <h3 className="text-xl font-light">Scroll Behaviors</h3>
                        <div className="space-y-4">
                            <InteractionDetail
                                title="Sticky Header"
                                behavior="Header shrinks and adds backdrop blur on scroll down, expands on scroll up"
                                timing="duration-300 ease-in-out"
                            />
                            <InteractionDetail
                                title="Parallax Hero"
                                behavior="Background image moves at 0.5x scroll speed, foreground content at 1x"
                                timing="transform: translateY(scrollY * 0.5)"
                            />
                            <InteractionDetail
                                title="Reveal Animations"
                                behavior="Elements fade in and slide up when entering viewport"
                                timing="Intersection Observer with stagger delay"
                            />
                            <InteractionDetail
                                title="Progress Indicator"
                                behavior="Reading progress bar fills as user scrolls product description"
                                timing="Real-time tracking with smooth updates"
                            />
                        </div>
                    </div>
                )}

                {activeInteraction === 'cart' && (
                    <div className="space-y-6">
                        <h3 className="text-xl font-light">Cart Interactions</h3>
                        <div className="space-y-4">
                            <InteractionDetail
                                title="Cart Drawer Open"
                                behavior="Slide in from right with backdrop fade, items animate in with stagger"
                                timing="Drawer: 300ms ease-out, Items: 150ms stagger"
                            />
                            <InteractionDetail
                                title="Quantity Update"
                                behavior="Number morphs with scale animation, subtotal updates with color pulse"
                                timing="duration-200 ease-in-out"
                            />
                            <InteractionDetail
                                title="Item Remove"
                                behavior="Slide out left with fade, other items animate up to fill space"
                                timing="duration-300 ease-in"
                            />
                            <InteractionDetail
                                title="Promo Code Apply"
                                behavior="Input expands, code validates, discount appears with celebration micro-animation"
                                timing="Multi-stage: 200ms expand, 400ms validate, 300ms celebrate"
                            />
                        </div>
                    </div>
                )}

                {activeInteraction === 'quickview' && (
                    <div className="space-y-6">
                        <h3 className="text-xl font-light">Quick View Modal</h3>
                        <div className="space-y-4">
                            <InteractionDetail
                                title="Modal Open"
                                behavior="Backdrop fade in, modal scale from 0.95 to 1, content slides up"
                                timing="duration-300 ease-out with spring"
                            />
                            <InteractionDetail
                                title="Gallery Navigation"
                                behavior="Image crossfade with thumbnail highlight, smooth slide transitions"
                                timing="duration-400 ease-in-out"
                            />
                            <InteractionDetail
                                title="Variant Selection"
                                behavior="Color/size selector with ring animation, product image updates"
                                timing="duration-200 ease-out"
                            />
                            <InteractionDetail
                                title="Modal Close"
                                behavior="Scale down to 0.95, fade out backdrop, remove from DOM"
                                timing="duration-250 ease-in"
                            />
                        </div>
                    </div>
                )}

                {activeInteraction === 'gestures' && (
                    <div className="space-y-6">
                        <h3 className="text-xl font-light">Touch Gestures (Mobile)</h3>
                        <div className="space-y-4">
                            <InteractionDetail
                                title="Swipe to Navigate"
                                behavior="Left/right swipe on product images to view gallery"
                                timing="Follow finger with momentum, snap to closest image"
                            />
                            <InteractionDetail
                                title="Pull to Refresh"
                                behavior="Pull down on collection pages to refresh product list"
                                timing="Elastic resistance, spinner appears at threshold"
                            />
                            <InteractionDetail
                                title="Pinch to Zoom"
                                behavior="Pinch gesture on product images for detailed view"
                                timing="Real-time scaling with inertia on release"
                            />
                            <InteractionDetail
                                title="Long Press"
                                behavior="Long press on product card for quick actions menu"
                                timing="300ms activation with haptic feedback"
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Animation Principles */}
            <div className="bg-surface-elevated p-8 rounded-2xl border border-border">
                <h3 className="text-xl font-light mb-6">Animation Principles</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <AnimationPrinciple
                        title="Purposeful Motion"
                        description="Every animation should have a clear purpose—guide attention, provide feedback, or create delight."
                    />
                    <AnimationPrinciple
                        title="Natural Physics"
                        description="Use easing curves that mimic real-world motion: ease-out for entrances, ease-in for exits."
                    />
                    <AnimationPrinciple
                        title="Performance First"
                        description="Prefer CSS transforms and opacity. Use GPU-accelerated properties for smooth 60fps."
                    />
                    <AnimationPrinciple
                        title="Respect Preferences"
                        description="Honor prefers-reduced-motion for accessibility. Disable decorative animations."
                    />
                </div>
            </div>
        </div>
    )
}

function TemplatesSection() {
    const [activeTemplate, setActiveTemplate] = useState<string>('home');

    const templates = [
        { id: 'home', name: 'Homepage' },
        { id: 'collection', name: 'Collection' },
        { id: 'product', name: 'Product Detail' },
        { id: 'cart', name: 'Cart & Checkout' },
        { id: 'account', name: 'Account' },
        { id: 'search', name: 'Search Results' }
    ];

    return (
        <div className="space-y-12">
            <div className="space-y-8">
                <h2 className="text-4xl font-light tracking-tight mb-6 font-heading">Page Templates</h2>
                <p className="text-text-secondary text-lg">Comprehensive page structures optimized for conversion and user experience.</p>
            </div>
            {/* Template Selector */}
            <div className="flex flex-wrap gap-4">
                {templates.map((template) => (
                    <button
                        key={template.id}
                        onClick={() => setActiveTemplate(template.id)}
                        className={`px-6 py-3 rounded-lg transition-all ${activeTemplate === template.id
                            ? 'bg-surface-elevated-high text-on-surface'
                            : 'bg-surface-elevated text-on-surface-secondary hover-surface'
                            }`}
                    >
                        {template.name}
                    </button>
                ))}
            </div>

            {/* Template Details */}
            <div className="bg-surface-elevated p-8 rounded-2xl border border-border">
                {activeTemplate === 'home' && (
                    <TemplateStructure
                        title="Homepage Template"
                        sections={[
                            { name: 'Hero Section', description: 'Full-screen cinematic hero with seasonal campaign, auto-playing video background' },
                            { name: 'Featured Categories', description: '3-column grid showcasing main product categories with hover reveals' },
                            { name: 'New Arrivals', description: 'Horizontal scrolling product carousel with 4 items visible' },
                            { name: 'Brand Story', description: 'Split layout with craftsmanship imagery and heritage narrative' },
                            { name: 'Bestsellers', description: '4-column grid of top products with social proof' },
                            { name: 'Editorial Content', description: 'Magazine-style section with styling guides and lookbooks' },
                            { name: 'Instagram Feed', description: 'Social proof with user-generated content grid' },
                            { name: 'Newsletter Signup', description: 'Minimal form with incentive (10% off first order)' },
                            { name: 'Trust Badges', description: 'Security, shipping, and return policy indicators' }
                        ]}
                    />
                )}

                {activeTemplate === 'collection' && (
                    <TemplateStructure
                        title="Collection Template"
                        sections={[
                            { name: 'Collection Header', description: 'Hero banner with collection name, description, and product count' },
                            { name: 'Filter Sidebar', description: 'Persistent left sidebar with faceted filters (category, size, color, price, material)' },
                            { name: 'Sort & View Controls', description: 'Dropdown for sorting, toggle for grid/list view' },
                            { name: 'Product Grid', description: 'Responsive grid (4 cols desktop, 2 cols tablet, 1 col mobile)' },
                            { name: 'Active Filters', description: 'Chip display of active filters with clear all option' },
                            { name: 'Pagination', description: 'Load more button with infinite scroll option' },
                            { name: 'Empty State', description: 'Helpful message and suggested collections when no results' },
                            { name: 'Quick Actions Bar', description: 'Sticky bar with compare products and bulk wishlist actions' }
                        ]}
                    />
                )}

                {activeTemplate === 'product' && (
                    <TemplateStructure
                        title="Product Detail Template"
                        sections={[
                            { name: 'Product Gallery', description: '60% width, vertical thumbnails, zoom on hover, 360° view option' },
                            { name: 'Product Info', description: '40% width, sticky on scroll, title, price, rating, short description' },
                            { name: 'Variant Selector', description: 'Color swatches, size selector with size guide modal' },
                            { name: 'Add to Cart', description: 'Prominent CTA with quantity selector and wishlist toggle' },
                            { name: 'Product Details', description: 'Accordion tabs for description, materials, care, sizing' },
                            { name: 'Craftsmanship Story', description: 'Rich media section showing manufacturing process' },
                            { name: 'Reviews & Ratings', description: 'Verified purchases, photo reviews, helpful votes' },
                            { name: 'Recommendations', description: 'You may also like carousel based on AI recommendations' },
                            { name: 'Recently Viewed', description: 'User\'s browsing history for quick navigation' },
                            { name: 'Size & Fit Guide', description: 'Interactive sizing tool with measurements' }
                        ]}
                    />
                )}

                {activeTemplate === 'cart' && (
                    <TemplateStructure
                        title="Cart & Checkout Template"
                        sections={[
                            { name: 'Cart Items', description: 'List of products with thumbnails, variant info, quantity, price, remove' },
                            { name: 'Cart Summary', description: 'Sticky sidebar with subtotal, shipping estimate, tax, total' },
                            { name: 'Promo Code', description: 'Input field with apply button, shows active discounts' },
                            { name: 'Shipping Calculator', description: 'Zip code input for shipping cost estimation' },
                            { name: 'Continue Shopping', description: 'Link back to collections with recently viewed' },
                            { name: 'Checkout CTA', description: 'Prominent button to proceed to checkout' },
                            { name: 'Trust Signals', description: 'Security badges, return policy, customer service info' },
                            { name: 'Saved for Later', description: 'Section for items moved from cart for future consideration' },
                            { name: 'Gift Options', description: 'Gift wrap, message card, and special packaging selection' }
                        ]}
                    />
                )}

                {activeTemplate === 'account' && (
                    <TemplateStructure
                        title="Account Template"
                        sections={[
                            { name: 'Account Sidebar', description: 'Navigation for profile, orders, addresses, wishlist, settings' },
                            { name: 'Order History', description: 'Sortable table with order number, date, total, status, actions' },
                            { name: 'Order Details', description: 'Modal with complete order info, tracking, invoice download' },
                            { name: 'Address Book', description: 'Saved addresses with add/edit/delete, set default' },
                            { name: 'Profile Settings', description: 'Name, email, password change, communication preferences' },
                            { name: 'Wishlist', description: 'Grid of saved products with quick add to cart' },
                            { name: 'Loyalty Program', description: 'Points balance, tier status, rewards catalog' },
                            { name: 'Preferences', description: 'Size preferences, style quiz results, notification settings' }
                        ]}
                    />
                )}

                {activeTemplate === 'search' && (
                    <TemplateStructure
                        title="Search Results Template"
                        sections={[
                            { name: 'Search Header', description: 'Search query display with result count and filters toggle' },
                            { name: 'Search Suggestions', description: 'Did you mean, related searches, trending queries' },
                            { name: 'Faceted Filters', description: 'Category, price, color, size filters with counts' },
                            { name: 'Results Grid', description: 'Product grid with relevance-based sorting' },
                            { name: 'No Results State', description: 'Helpful suggestions, popular products, search tips' },
                            { name: 'Content Results', description: 'Blog posts, guides, and editorial content matching query' },
                            { name: 'Recently Searched', description: 'User\'s search history for quick re-searching' }
                        ]}
                    />
                )}
            </div>

            {/* Responsive Strategy */}
            <div className="bg-surface-elevated p-8 rounded-2xl border border-border">
                <h3 className="text-xl font-light mb-6">Responsive Strategy</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <ResponsiveBreakpoint
                        device="Mobile"
                        breakpoint="< 768px"
                        changes={[
                            'Single column layouts',
                            'Hamburger menu',
                            'Simplified filters (drawer)',
                            'Bottom navigation bar',
                            'Sticky add to cart',
                            'Swipe gestures enabled',
                            'Larger touch targets (44x44px)'
                        ]}
                    />
                    <ResponsiveBreakpoint
                        device="Tablet"
                        breakpoint="768px - 1024px"
                        changes={[
                            'Two column layouts',
                            'Simplified mega menu',
                            'Filter sidebar (collapsible)',
                            'Standard navigation',
                            'Optimized touch targets',
                            'Hybrid hover/tap interactions'
                        ]}
                    />
                    <ResponsiveBreakpoint
                        device="Desktop"
                        breakpoint="> 1024px"
                        changes={[
                            'Full grid layouts',
                            'Mega menu with images',
                            'Persistent filter sidebar',
                            'Hover interactions',
                            'Larger product imagery',
                            'Quick view modals',
                            'Enhanced animations'
                        ]}
                    />
                </div>
            </div>
        </div>
    )
}

function MetricsSection() {
    const uxMetrics: UXMetric[] = [
        {
            label: 'Time to Interactive (TTI)',
            value: '< 2.5s',
            description: 'Time until page is fully interactive and responsive to user input'
        },
        {
            label: 'First Contentful Paint (FCP)',
            value: '< 1.0s',
            description: 'Time until first text or image is painted on screen'
        },
        {
            label: 'Cumulative Layout Shift (CLS)',
            value: '< 0.1',
            description: 'Measure of visual stability (lower is better)'
        },
        {
            label: 'Largest Contentful Paint (LCP)',
            value: '< 2.5s',
            description: 'Time until largest content element is rendered'
        },
        {
            label: 'Interaction to Next Paint (INP)',
            value: '< 200ms',
            description: 'Responsiveness of all user interactions throughout page life'
        },
        {
            label: 'Cart Abandonment Target',
            value: '< 35%',
            description: 'Percentage of users who add to cart but don\'t complete purchase'
        },
        {
            label: 'Product Discovery Time',
            value: '< 3 clicks',
            description: 'Maximum clicks from homepage to any product'
        },
        {
            label: 'Mobile Conversion Rate',
            value: '> 2.5%',
            description: 'Target conversion rate for mobile users'
        }
    ];
    return (
        <div className="space-y-12">
            <div className="space-y-8">
                <h2 className="text-4xl font-light tracking-tight mb-6 font-heading">UX Metrics & Goals</h2>
                <p className="text-text-secondary text-lg">Key performance indicators and targets for measuring user experience quality.</p>
            </div>
            {/* Core Web Vitals */}
            <div className="bg-surface-elevated p-8 rounded-2xl border border-border">
                <h3 className="text-xl font-light mb-6">Performance Metrics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {uxMetrics.map((metric, index) => (
                        <div key={index} className="p-6 bg-surface-elevated-high rounded-xl border border-subtle">
                            <div className="flex items-center justify-between mb-3">
                                <h4 className="text-sm font-light text-on-surface-secondary uppercase tracking-wider">
                                    {metric.label}
                                </h4>
                                <span className="text-2xl font-light text-accent">{metric.value}</span>
                            </div>
                            <p className="text-sm text-on-surface-tertiary">{metric.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* User Journey Metrics */}
            <div className="bg-surface-elevated p-8 rounded-2xl border border-border">
                <h3 className="text-xl font-light mb-6">User Journey Metrics</h3>
                <div className="space-y-6">
                    <JourneyMetric
                        step="Discovery"
                        metrics={[
                            { label: 'Homepage Bounce Rate', target: '< 40%' },
                            { label: 'Average Session Duration', target: '> 3 minutes' },
                            { label: 'Pages per Session', target: '> 4 pages' }
                        ]}
                    />
                    <JourneyMetric
                        step="Consideration"
                        metrics={[
                            { label: 'Product Page Exit Rate', target: '< 50%' },
                            { label: 'Add to Wishlist Rate', target: '> 15%' },
                            { label: 'Quick View Usage', target: '> 25%' }
                        ]}
                    />
                    <JourneyMetric
                        step="Purchase"
                        metrics={[
                            { label: 'Add to Cart Rate', target: '> 8%' },
                            { label: 'Checkout Completion', target: '> 65%' },
                            { label: 'Guest Checkout Usage', target: '> 40%' }
                        ]}
                    />
                    <JourneyMetric
                        step="Retention"
                        metrics={[
                            { label: 'Return Visit Rate (30 days)', target: '> 35%' },
                            { label: 'Account Creation Rate', target: '> 25%' },
                            { label: 'Repeat Purchase Rate', target: '> 20%' }
                        ]}
                    />
                </div>
            </div>

            {/* Accessibility Compliance */}
            <div className="bg-surface-elevated p-8 rounded-2xl border border-border">
                <h3 className="text-xl font-light mb-6">Accessibility Standards</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <AccessibilityItem
                        title="WCAG 2.1 Level AA"
                        items={[
                            'Color contrast ratio ≥ 4.5:1 for normal text',
                            'Color contrast ratio ≥ 3:1 for large text',
                            'All interactive elements keyboard accessible',
                            'Focus indicators visible and clear',
                            'ARIA labels for screen readers'
                        ]}
                    />
                    <AccessibilityItem
                        title="Additional Standards"
                        items={[
                            'Semantic HTML structure',
                            'Alt text for all images',
                            'Skip navigation links',
                            'Error identification and suggestions',
                            'Respects prefers-reduced-motion',
                            'Touch targets minimum 44x44px'
                        ]}
                    />
                </div>
            </div>

            {/* Testing Strategy */}
            <div className="bg-surface-elevated p-8 rounded-2xl border border-border">
                <h3 className="text-xl font-light mb-6">Testing & Validation</h3>
                <div className="space-y-4">
                    <TestingItem
                        category="Performance Testing"
                        tools="Lighthouse, WebPageTest, Core Web Vitals"
                        frequency="Every deployment"
                    />
                    <TestingItem
                        category="A/B Testing"
                        tools="Optimizely, Google Optimize"
                        frequency="Continuous for key flows"
                    />
                    <TestingItem
                        category="Usability Testing"
                        tools="UserTesting.com, Hotjar"
                        frequency="Quarterly"
                    />
                    <TestingItem
                        category="Accessibility Audit"
                        tools="axe DevTools, WAVE, Screen readers"
                        frequency="Monthly"
                    />
                    <TestingItem
                        category="Cross-browser Testing"
                        tools="BrowserStack, LambdaTest"
                        frequency="Every major release"
                    />
                </div>
            </div>
        </div>
    )
};

function PatternCard({ title, items, badge, badgeColor }: PatternCardProps) {
    const colorClasses = {
        primary: 'bg-primary text-primary-foreground',
        secondary: 'bg-secondary text-secondary-foreground'
    };

    return (
        <div className="p-6 bg-surface-elevated rounded-xl border border-border">
            <div className="flex items-center gap-3 mb-4">
                <h4 className="text-lg font-light">{title}</h4>
                <span className={`px-2 py-1 text-xs rounded border font-mono ${colorClasses[badgeColor]}`}>
                    {badge}
                </span>
            </div>
            <ul className="space-y-2">
                {items.map((item, i) => (
                    <li key={i} className="text-sm text-on-surface-secondary flex items-start gap-2">
                        <span className="text-accent mt-0.5">•</span>
                        {item}
                    </li>
                ))}
            </ul>
        </div>
    );
}

function ComponentLayer({ title, description, components, color }: ComponentLayerProps) {
    const colorClasses = {
        primary: 'bg-primary text-primary-foreground',
        secondary: 'bg-secondary text-secondary-foreground',
        accent: 'bg-accent text-accent-foreground',
        success: 'bg-success text-success-foreground'
    };

    return (
        <div>
            <div className="flex items-center gap-4 mb-4">
                <h4 className="text-lg font-light">{title}</h4>
                <span className={`px-3 py-1 text-xs rounded-full border ${colorClasses[color]}`}>
                    {components.length} components
                </span>
            </div>
            <p className="text-sm text-on-surface-tertiary mb-4">{description}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {components.map((comp, i) => (
                    <div key={i} className="p-3 bg-surface-elevated-high rounded border border-subtle text-sm">
                        <div className="text-on-surface font-mono">{comp.name}</div>
                        <div className="text-on-surface-disabled text-xs mt-1 font-mono">{comp.props}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function AnimationPrinciple({ title, description }: AnimationPrincipleProps) {
    return (
        <div>
            <h4 className="text-sm font-light text-on-surface mb-2">{title}</h4>
            <p className="text-sm text-on-surface-secondary">{description}</p>
        </div>
    );
}

function InteractionDetail({ title, behavior, timing }: InteractionDetailProps) {
    return (
        <div className="p-4 bg-surface-elevated-high rounded-lg border border-subtle">
            <h4 className="text-sm font-light text-on-surface mb-2">{title}</h4>
            <p className="text-sm text-on-surface-secondary mb-2">{behavior}</p>
            <code className="text-xs text-accent font-mono">{timing}</code>
        </div>
    );
}

function ResponsiveBreakpoint({ device, breakpoint, changes }: ResponsiveBreakpointProps) {
    return (
        <div className="p-6 bg-surface-elevated-high rounded-xl border border-subtle">
            <h4 className="text-lg font-light mb-2">{device}</h4>
            <div className="text-xs text-on-surface-tertiary mb-4 font-mono">{breakpoint}</div>
            <ul className="space-y-2">
                {changes.map((change, i) => (
                    <li key={i} className="text-sm text-on-surface-secondary flex items-start gap-2">
                        <span className="text-accent mt-0.5">•</span>
                        {change}
                    </li>
                ))}
            </ul>
        </div>
    );
}

function TemplateStructure({ title, sections }: TemplateStructureProps) {
    return (
        <div className="space-y-6">
            <h3 className="text-xl font-light">{title}</h3>
            <div className="space-y-3">
                {sections.map((section, i) => (
                    <div key={i} className="flex gap-4">
                        <div className="w-6 h-6 rounded-full bg-surface-elevated-high flex items-center justify-center text-xs text-on-surface-tertiary shrink-0 border border-subtle">
                            {i + 1}
                        </div>
                        <div className="flex-1">
                            <div className="text-sm font-light text-on-surface">{section.name}</div>
                            <div className="text-sm text-on-surface-tertiary mt-1">{section.description}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function TestingItem({ category, tools, frequency }: { category: string; tools: string; frequency: string }) {
    return (
        <div className="flex items-start gap-4 p-4 bg-surface-elevated-high rounded-lg border border-subtle">
            <div className="flex-1">
                <h4 className="text-sm font-light text-on-surface mb-1">{category}</h4>
                <p className="text-sm text-on-surface-tertiary mb-2">{tools}</p>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-success" />
                    <span className="text-xs text-on-surface-disabled">{frequency}</span>
                </div>
            </div>
        </div>
    );
}

function JourneyMetric({ step, metrics }: { step: string; metrics: Array<{ label: string; target: string }> }) {
    return (
        <div className="p-6 bg-surface-elevated-high rounded-xl border border-subtle">
            <h4 className="text-lg font-light mb-4 text-primary">{step}</h4>
            <div className="space-y-3">
                {metrics.map((metric, i) => (
                    <div key={i} className="flex items-center justify-between">
                        <span className="text-sm text-on-surface-secondary">{metric.label}</span>
                        <span className="text-sm font-mono text-accent">{metric.target}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function AccessibilityItem({ title, items }: { title: string; items: string[] }) {
    return (
        <div>
            <h4 className="text-lg font-light mb-4">{title}</h4>
            <ul className="space-y-2">
                {items.map((item, i) => (
                    <li key={i} className="text-sm text-on-surface-secondary flex items-start gap-2">
                        <Shield className="w-4 h-4 text-success mt-0.5 shrink-0" />
                        {item}
                    </li>
                ))}
            </ul>
        </div>
    );
}

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface ComponentLayerProps {
    title: string;
    description: string;
    components: Array<{ name: string; props: string }>;
    color: 'primary' | 'secondary' | 'accent' | 'success';
}

interface PatternCardProps {
    title: string;
    items: string[];
    badge: string;
    badgeColor: 'primary' | 'secondary';
}

interface InteractionDetailProps {
    title: string;
    behavior: string;
    timing: string;
}

interface AnimationPrincipleProps {
    title: string;
    description: string;
}

interface TemplateStructureProps {
    title: string;
    sections: Array<{ name: string; description: string }>;
}

interface ResponsiveBreakpointProps {
    device: string;
    breakpoint: string;
    changes: string[];
}

interface SpacingScale {
    size: string;
    value: string;
    usage: string;
}

interface UXMetric {
    label: string;
    value: string;
    description: string;
}