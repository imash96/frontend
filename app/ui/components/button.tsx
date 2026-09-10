import { useState } from 'react';
import CustomButton, { IconButton } from '@/ui/custom/custom-button';

export default function ButtonTab() {
    const [isLoading, setIsLoading] = useState(false);

    // Common icons
    const icons = {
        heart: (
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
        ),
        cart: (
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
        ),
        user: (
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
            </svg>
        ),
        download: (
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
        ),
        arrow: (
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
            </svg>
        ),
        trash: (
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
        ),
        edit: (
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
        ),
        settings: (
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="3" />
                <path d="M12 1v6m0 6v6m9-9h-6m-6 0H3" />
            </svg>
        ),
        external: (
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
        ),
    };

    const simulateLoading = () => {
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 2000);
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="bg-primary text-primary-foreground py-12 px-6">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-display font-bold mb-3">
                        Custom Button Component
                    </h1>
                    <p className="text-lg text-primary-foreground/80 font-body">
                        Versatile button system with variants, icons, and polymorphic rendering
                    </p>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-6 py-12 space-y-16">

                {/* Button Variants */}
                <section className="bg-surface rounded-xl shadow-md p-8">
                    <h2 className="text-2xl font-display font-bold text-text-primary mb-6">
                        Button Variants
                    </h2>

                    <div className="space-y-8">
                        <div>
                            <h3 className="text-lg font-semibold text-text-primary mb-4">All Variants</h3>
                            <div className="flex flex-wrap gap-4">
                                <CustomButton variant="primary">Primary Button</CustomButton>
                                <CustomButton variant="secondary">Secondary Button</CustomButton>
                                <CustomButton variant="accent">Accent Button</CustomButton>
                                <CustomButton variant="ghost">Ghost Button</CustomButton>
                                <CustomButton variant="destructive">Destructive Button</CustomButton>
                                <CustomButton variant="outline">Outline Button</CustomButton>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-text-primary mb-4">Disabled State</h3>
                            <div className="flex flex-wrap gap-4">
                                <CustomButton variant="primary" disabled>Primary Disabled</CustomButton>
                                <CustomButton variant="secondary" disabled>Secondary Disabled</CustomButton>
                                <CustomButton variant="outline" disabled>Outline Disabled</CustomButton>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Button Sizes */}
                <section className="bg-surface rounded-xl shadow-md p-8">
                    <h2 className="text-2xl font-display font-bold text-text-primary mb-6">
                        Button Sizes
                    </h2>

                    <div className="space-y-6">
                        <div>
                            <h3 className="text-base font-semibold text-text-primary mb-4">Primary Variant</h3>
                            <div className="flex flex-wrap items-center gap-4">
                                <CustomButton variant="primary" size="sm">Small</CustomButton>
                                <CustomButton variant="primary" size="md">Medium</CustomButton>
                                <CustomButton variant="primary" size="lg">Large</CustomButton>
                                <CustomButton variant="primary" size="xl">Extra Large</CustomButton>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-base font-semibold text-text-primary mb-4">Outline Variant</h3>
                            <div className="flex flex-wrap items-center gap-4">
                                <CustomButton variant="outline" size="sm">Small</CustomButton>
                                <CustomButton variant="outline" size="md">Medium</CustomButton>
                                <CustomButton variant="outline" size="lg">Large</CustomButton>
                                <CustomButton variant="outline" size="xl">Extra Large</CustomButton>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Button Shapes */}
                <section className="bg-surface rounded-xl shadow-md p-8">
                    <h2 className="text-2xl font-display font-bold text-text-primary mb-6">
                        Button Shapes
                    </h2>

                    <div className="flex flex-wrap gap-4">
                        <CustomButton variant="primary" shape="rounded">Rounded (Default)</CustomButton>
                        <CustomButton variant="primary" shape="square">Rectangle</CustomButton>
                        <CustomButton variant="primary" shape="pill">Pill</CustomButton>
                    </div>
                </section>

                {/* Buttons with Icons */}
                <section className="bg-surface rounded-xl shadow-md p-8">
                    <h2 className="text-2xl font-display font-bold text-text-primary mb-6">
                        Buttons with Icons
                    </h2>

                    <div className="space-y-8">
                        <div>
                            <h3 className="text-lg font-semibold text-text-primary mb-4">Icon Left</h3>
                            <div className="flex flex-wrap gap-4">
                                <CustomButton variant="primary" icon={icons.cart} iconPosition="left">
                                    Add to Cart
                                </CustomButton>
                                <CustomButton variant="secondary" icon={icons.download} iconPosition="left">
                                    Download
                                </CustomButton>
                                <CustomButton variant="outline" icon={icons.user} iconPosition="left">
                                    Profile
                                </CustomButton>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-text-primary mb-4">Icon Right</h3>
                            <div className="flex flex-wrap gap-4">
                                <CustomButton variant="primary" icon={icons.arrow} iconPosition="right">
                                    Continue
                                </CustomButton>
                                <CustomButton variant="secondary" icon={icons.arrow} iconPosition="right">
                                    Next Step
                                </CustomButton>
                                <CustomButton variant="outline" icon={icons.external} iconPosition="right">
                                    Open Link
                                </CustomButton>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-text-primary mb-4">Icon Only Buttons</h3>
                            <div className="flex flex-wrap items-center gap-4">
                                <IconButton
                                    variant="primary"
                                    icon={icons.heart}
                                    aria-label="Add to favorites"
                                    size="sm"
                                />
                                <IconButton
                                    variant="primary"
                                    icon={icons.heart}
                                    aria-label="Add to favorites"
                                    size="md"
                                />
                                <IconButton
                                    variant="primary"
                                    icon={icons.heart}
                                    aria-label="Add to favorites"
                                    size="lg"
                                />
                                <IconButton
                                    variant="outline"
                                    icon={icons.settings}
                                    aria-label="Settings"
                                    size="md"
                                />
                                <IconButton
                                    variant="ghost"
                                    icon={icons.edit}
                                    aria-label="Edit"
                                    size="md"
                                />
                                <IconButton
                                    variant="destructive"
                                    icon={icons.trash}
                                    aria-label="Delete"
                                    size="md"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Loading State */}
                <section className="bg-surface rounded-xl shadow-md p-8">
                    <h2 className="text-2xl font-display font-bold text-text-primary mb-6">
                        Loading State
                    </h2>

                    <div className="space-y-6">
                        <div className="flex flex-wrap gap-4">
                            <CustomButton
                                variant="primary"
                                isLoading={isLoading}
                                onClick={simulateLoading}
                            >
                                {isLoading ? 'Processing...' : 'Submit Order'}
                            </CustomButton>

                            <CustomButton
                                variant="secondary"
                                isLoading={isLoading}
                                icon={icons.download}
                                iconPosition="left"
                            >
                                {isLoading ? 'Downloading...' : 'Download File'}
                            </CustomButton>

                            <IconButton
                                variant="outline"
                                icon={icons.heart}
                                isLoading={isLoading}
                                aria-label="Add to favorites"
                            />
                        </div>

                        <p className="text-sm text-text-secondary">
                            Click any button above to see the loading state animation
                        </p>
                    </div>
                </section>

                {/* Full Width Buttons */}
                <section className="bg-surface rounded-xl shadow-md p-8">
                    <h2 className="text-2xl font-display font-bold text-text-primary mb-6">
                        Full Width Buttons
                    </h2>

                    <div className="space-y-4 max-w-md">
                        <CustomButton variant="primary" fullWidth icon={icons.cart} iconPosition="left">
                            Add to Cart
                        </CustomButton>
                        <CustomButton variant="outline" fullWidth>
                            View Details
                        </CustomButton>
                        <CustomButton variant="ghost" fullWidth>
                            Cancel
                        </CustomButton>
                    </div>
                </section>

                {/* Link Buttons (Anchor Elements) */}
                <section className="bg-surface rounded-xl shadow-md p-8">
                    <h2 className="text-2xl font-display font-bold text-text-primary mb-6">
                        Link Buttons (Anchor Elements)
                    </h2>

                    <div className="space-y-6">
                        <div>
                            <h3 className="text-base font-semibold text-text-primary mb-4">Internal Links</h3>
                            <div className="flex flex-wrap gap-4">
                                <CustomButton
                                    as='a'
                                    variant="primary"
                                    href="/shop"
                                    icon={icons.arrow}
                                    iconPosition="right"
                                >
                                    Shop Now
                                </CustomButton>
                                <CustomButton as='a' variant="outline" href="/about">
                                    Learn More
                                </CustomButton>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-base font-semibold text-text-primary mb-4">External Links</h3>
                            <div className="flex flex-wrap gap-4">
                                <CustomButton
                                    as='a'
                                    variant="secondary"
                                    href="https://example.com"
                                    target="_blank"
                                    icon={icons.external}
                                    iconPosition="right"
                                >
                                    Visit Website
                                </CustomButton>
                                <CustomButton
                                    as='a'
                                    variant="outline"
                                    href="https://github.com"
                                    target="_blank"
                                    icon={icons.external}
                                    iconPosition="right"
                                >
                                    View on GitHub
                                </CustomButton>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Real-World Examples */}
                <section className="bg-surface rounded-xl shadow-md p-8">
                    <h2 className="text-2xl font-display font-bold text-text-primary mb-6">
                        Real-World Examples
                    </h2>

                    <div className="space-y-8">
                        {/* Product Card */}
                        <div className="border border-border rounded-lg p-6 max-w-sm">
                            <div className="aspect-square bg-muted rounded-lg mb-4" />
                            <h3 className="text-xl font-display font-bold text-text-primary mb-2">
                                Premium Leather Jacket
                            </h3>
                            <p className="text-text-secondary mb-4">$599.00</p>
                            <div className="space-y-2">
                                <CustomButton
                                    variant="primary"
                                    fullWidth
                                    icon={icons.cart}
                                    iconPosition="left"
                                >
                                    Add to Cart
                                </CustomButton>
                                <CustomButton variant="outline" fullWidth>
                                    View Details
                                </CustomButton>
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="border border-border rounded-lg p-6 max-w-md">
                            <h3 className="text-xl font-display font-bold text-text-primary mb-4">
                                Contact Form
                            </h3>
                            <div className="space-y-4 mb-6">
                                <div className="h-10 bg-muted rounded" />
                                <div className="h-10 bg-muted rounded" />
                                <div className="h-24 bg-muted rounded" />
                            </div>
                            <div className="flex gap-3">
                                <CustomButton variant="ghost" className="flex-1">
                                    Cancel
                                </CustomButton>
                                <CustomButton variant="primary" className="flex-1">
                                    Send Message
                                </CustomButton>
                            </div>
                        </div>

                        {/* Toolbar */}
                        <div className="border border-border rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <IconButton
                                    variant="destructive"
                                    icon={icons.trash}
                                    aria-label="Delete"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Custom Styling */}
                <section className="bg-surface rounded-xl shadow-md p-8">
                    <h2 className="text-2xl font-display font-bold text-text-primary mb-6">
                        Custom Styling
                    </h2>

                    <div className="flex flex-wrap gap-4">
                        <CustomButton
                            variant="primary"
                            className="shadow-lg hover:shadow-xl"
                        >
                            With Shadow
                        </CustomButton>
                        <CustomButton
                            variant="outline"
                            className="uppercase tracking-wider"
                        >
                            Uppercase Text
                        </CustomButton>
                        <CustomButton
                            variant="secondary"
                            className="italic"
                        >
                            Italic Style
                        </CustomButton>
                    </div>
                </section>
            </main>
        </div>
    );
}