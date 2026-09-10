'use client';

import { useState } from 'react';
import { Drawer, DrawerDirection, DrawerSize } from '@/ui/custom/custom-drawer';
import { Menu, ShoppingBag, Settings, User, Heart, ChevronRight } from 'lucide-react';

export default function DrawerTab() {
    const [activeDrawer, setActiveDrawer] = useState<string | null>(null);
    const [demoDirection, setDemoDirection] = useState<DrawerDirection>('right');
    const [demoSize, setDemoSize] = useState<DrawerSize>('md');

    const closeDrawer = () => setActiveDrawer(null);

    return (
        <div className="min-h-screen bg-background text-text-primary font-body">
            {/* Main Content */}
            <main className="mx-auto max-w-7xl px-6 pb-16">
                {/* Introduction */}
                <section className="mb-20">
                    <h2 className="font-heading text-4xl font-light mb-6 text-primary">
                        Multipurpose Drawer System
                    </h2>
                    <p className="text-lg text-text-secondary max-w-3xl leading-relaxed font-light">
                        A sophisticated, reusable drawer component designed for premium eCommerce experiences.
                        Features smooth animations, flexible positioning, and elegant styling that reflects
                        the craftsmanship of fine leather goods.
                    </p>
                </section>

                {/* Use Cases */}
                <section className="mb-20">
                    <h3 className="font-heading text-2xl font-light mb-8 text-text-primary border-b border-divider pb-4">
                        Real-World Use Cases
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Mobile Menu */}
                        <button
                            onClick={() => setActiveDrawer('mobile-menu')}
                            className="group relative overflow-hidden bg-card border border-border p-8 rounded-sm hover:border-primary transition-all duration-300"
                        >
                            <div className="relative z-10">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="p-3 bg-muted rounded-sm">
                                        <Menu size={24} className="text-primary" strokeWidth={1.5} />
                                    </div>
                                    <h4 className="font-heading text-xl font-light text-left">Mobile Navigation</h4>
                                </div>
                                <p className="text-text-secondary text-left font-light leading-relaxed">
                                    Full-screen navigation menu with category browsing and quick links. Opens from the left.
                                </p>
                            </div>
                            <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </button>

                        {/* Shopping Cart */}
                        <button
                            onClick={() => setActiveDrawer('cart')}
                            className="group relative overflow-hidden bg-card border border-border p-8 rounded-sm hover:border-primary transition-all duration-300"
                        >
                            <div className="relative z-10">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="p-3 bg-muted rounded-sm">
                                        <ShoppingBag size={24} className="text-primary" strokeWidth={1.5} />
                                    </div>
                                    <h4 className="font-heading text-xl font-light text-left">Shopping Cart</h4>
                                </div>
                                <p className="text-text-secondary text-left font-light leading-relaxed">
                                    Cart overview with product list, quantities, and checkout CTA. Slides from the right.
                                </p>
                            </div>
                            <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </button>

                        {/* User Account */}
                        <button
                            onClick={() => setActiveDrawer('account')}
                            className="group relative overflow-hidden bg-card border border-border p-8 rounded-sm hover:border-primary transition-all duration-300"
                        >
                            <div className="relative z-10">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="p-3 bg-muted rounded-sm">
                                        <User size={24} className="text-primary" strokeWidth={1.5} />
                                    </div>
                                    <h4 className="font-heading text-xl font-light text-left">Account Panel</h4>
                                </div>
                                <p className="text-text-secondary text-left font-light leading-relaxed">
                                    User profile, orders, wishlist, and settings. Compact drawer with quick access.
                                </p>
                            </div>
                            <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </button>

                        {/* Filters */}
                        <button
                            onClick={() => setActiveDrawer('filters')}
                            className="group relative overflow-hidden bg-card border border-border p-8 rounded-sm hover:border-primary transition-all duration-300"
                        >
                            <div className="relative z-10">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="p-3 bg-muted rounded-sm">
                                        <Settings size={24} className="text-primary" strokeWidth={1.5} />
                                    </div>
                                    <h4 className="font-heading text-xl font-light text-left">Product Filters</h4>
                                </div>
                                <p className="text-text-secondary text-left font-light leading-relaxed">
                                    Advanced filtering options for collections: size, color, leather type, price range.
                                </p>
                            </div>
                            <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </button>
                    </div>
                </section>

                {/* Configuration Demo */}
                <section className="mb-20">
                    <h3 className="font-heading text-2xl font-light mb-8 text-text-primary border-b border-border pb-4">
                        Configuration Options
                    </h3>
                    <div className="bg-card border border-border p-8 rounded-sm">
                        <div className="grid md:grid-cols-2 gap-12">
                            {/* Direction Selection */}
                            <div>
                                <h4 className="text-sm font-medium uppercase tracking-widest text-text-secondary mb-6">Direction</h4>
                                <div className="flex flex-wrap gap-3">
                                    {(['left', 'right'] as DrawerDirection[]).map((dir) => (
                                        <button
                                            key={dir}
                                            onClick={() => setDemoDirection(dir)}
                                            className={`
                                                px-6 py-2 rounded-sm border transition-all duration-200 text-sm tracking-wide
                                                ${demoDirection === dir
                                                    ? 'bg-primary border-primary text-primary-foreground'
                                                    : 'border-border text-text-secondary hover:border-primary/50'}
                                            `}
                                        >
                                            {dir.toUpperCase()}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Size Selection */}
                            <div>
                                <h4 className="text-sm font-medium uppercase tracking-widest text-text-secondary mb-6">Size</h4>
                                <div className="flex flex-wrap gap-3">
                                    {(['sm', 'md', 'lg', 'full'] as DrawerSize[]).map((sz) => (
                                        <button
                                            key={sz}
                                            onClick={() => setDemoSize(sz)}
                                            className={`
                                                px-6 py-2 rounded-sm border transition-all duration-200 text-sm tracking-wide
                                                ${demoSize === sz
                                                    ? 'bg-primary border-primary text-primary-foreground'
                                                    : 'border-border text-text-secondary hover:border-primary/50'}
                                            `}
                                        >
                                            {sz.toUpperCase()}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 pt-8 border-t border-divider">
                            <button
                                onClick={() => setActiveDrawer('demo')}
                                className="w-full md:w-auto px-10 py-4 bg-button-primary text-button-primary-foreground hover:bg-button-primary-hover transition-colors duration-300 font-light tracking-widest uppercase text-sm"
                            >
                                Launch Live Preview
                            </button>
                        </div>
                    </div>
                </section>
            </main>

            {/* --- DRAWER INSTANCES --- */}

            {/* Mobile Menu Drawer */}
            <Drawer
                isOpen={activeDrawer === 'mobile-menu'}
                onClose={closeDrawer}
                direction="left"
                size="sm"
                title="Navigation"
            >
                <div className="space-y-1">
                    {['New Arrivals', 'Leather Bags', 'Wallets & Accessories', 'The Heritage Collection', 'Bespoke Service'].map((item) => (
                        <button key={item} className="w-full flex items-center justify-between p-4 hover:bg-muted transition-colors text-left group">
                            <span className="font-light tracking-wide">{item}</span>
                            <ChevronRight size={16} className="text-text-tertiary group-hover:text-primary transition-colors" />
                        </button>
                    ))}
                </div>
                <div className="mt-8 pt-8 border-t border-divider px-4">
                    <p className="text-xs uppercase tracking-widest text-text-tertiary mb-4">Support</p>
                    <div className="space-y-4">
                        <button className="block text-sm font-light hover:text-primary transition-colors">Shipping & Returns</button>
                        <button className="block text-sm font-light hover:text-primary transition-colors">Care Guide</button>
                    </div>
                </div>
            </Drawer>

            {/* Shopping Cart Drawer */}
            <Drawer
                isOpen={activeDrawer === 'cart'}
                onClose={closeDrawer}
                direction="right"
                size="md"
                title="Shopping Bag (2)"
            >
                <div className="p-4 space-y-6">
                    {[
                        { name: 'Heritage Briefcase', price: '$850.00', color: 'Cognac', img: '💼' },
                        { name: 'Slim Fold Wallet', price: '$120.00', color: 'Espresso', img: '👛' }
                    ].map((item) => (
                        <div key={item.name} className="flex gap-4 p-4 bg-card-hover border border-border rounded-sm">
                            <div className="w-20 h-24 bg-muted flex items-center justify-center text-3xl rounded-sm">{item.img}</div>
                            <div className="flex-1">
                                <h4 className="font-heading text-base font-medium">{item.name}</h4>
                                <p className="text-sm text-text-secondary font-light mb-2">{item.color}</p>
                                <p className="text-primary font-medium">{item.price}</p>
                            </div>
                        </div>
                    ))}

                    <div className="pt-6 border-t border-divider">
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-text-secondary uppercase tracking-widest text-sm">Subtotal</span>
                            <span className="text-xl font-heading text-text-primary">$970.00</span>
                        </div>
                        <button className="w-full py-4 bg-button-primary text-button-primary-foreground hover:bg-button-primary-hover transition-colors font-light tracking-widest uppercase text-sm">
                            Checkout Now
                        </button>
                    </div>
                </div>
            </Drawer>

            {/* Account Drawer */}
            <Drawer
                isOpen={activeDrawer === 'account'}
                onClose={closeDrawer}
                direction="right"
                size="sm"
                title="Your Account"
            >
                <div className="p-6">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-heading">JM</div>
                        <div>
                            <p className="font-medium">Julian Mason</p>
                            <p className="text-xs text-text-secondary">Premium Member</p>
                        </div>
                    </div>
                    <div className="space-y-2">
                        {[
                            { icon: <ShoppingBag size={18} />, label: 'Order History' },
                            { icon: <Heart size={18} />, label: 'Wishlist' },
                            { icon: <Settings size={18} />, label: 'Preferences' }
                        ].map((item) => (
                            <button key={item.label} className="w-full flex items-center gap-3 p-3 hover:bg-muted transition-colors rounded-sm text-text-secondary hover:text-text-primary">
                                {item.icon}
                                <span className="text-sm font-light">{item.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </Drawer>

            {/* Filters Drawer */}
            <Drawer
                isOpen={activeDrawer === 'filters'}
                onClose={closeDrawer}
                direction="right"
                size="sm"
                title="Filter By"
            >
                <div className="p-6 space-y-8">
                    <div>
                        <h4 className="text-xs uppercase tracking-widest text-text-secondary mb-4">Leather Type</h4>
                        <div className="space-y-3">
                            {['Full Grain', 'Top Grain', 'Suede', 'Nubuck'].map(type => (
                                <label key={type} className="flex items-center gap-3 group cursor-pointer">
                                    <div className="w-4 h-4 border border-border group-hover:border-primary transition-colors" />
                                    <span className="text-sm font-light text-text-secondary group-hover:text-text-primary transition-colors">{type}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="text-xs uppercase tracking-widest text-text-secondary mb-4">Price Range</h4>
                        <div className="flex gap-4">
                            <div className="flex-1 p-2 border border-border text-xs font-light text-text-tertiary">$ Min</div>
                            <div className="flex-1 p-2 border border-border text-xs font-light text-text-tertiary">$ Max</div>
                        </div>
                    </div>

                    <button className="w-full py-3 bg-primary text-primary-foreground hover:bg-primary-hover transition-colors duration-200 font-light tracking-wide">
                        Apply Filters
                    </button>
                </div>
            </Drawer>

            {/* Demo Drawer */}
            <Drawer
                isOpen={activeDrawer === 'demo'}
                onClose={closeDrawer}
                direction={demoDirection}
                size={demoSize}
                title="Demo Preview"
            >
                <div className="p-6">
                    <p className="text-text-secondary leading-relaxed font-light">
                        This drawer demonstrates the selected configuration: <strong className="text-text-primary">{demoDirection}</strong> direction
                        with <strong className="text-text-primary">{demoSize}</strong> size. The smooth spring animation and elegant styling create
                        a premium user experience that matches the quality of fine leather craftsmanship.
                    </p>
                    <div className="mt-6 p-4 bg-background-secondary border border-border rounded-sm">
                        <p className="text-sm text-text-secondary font-light leading-relaxed">
                            Features include: smooth spring animations, automatic body scroll locking,
                            ESC key support, backdrop blur overlay, and fully responsive design.
                        </p>
                    </div>
                </div>
            </Drawer>
        </div>
    );
}