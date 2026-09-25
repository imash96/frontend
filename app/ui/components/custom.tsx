'use client';

import Image from 'next/image';
import { useState } from 'react';
import Alert, { BannerAlert, InlineAlert } from '@/ui/custom/custom-alert';
import { Avatar, AvatarGroup } from '@/ui/custom/custom-avatar';
import Badge, { ColorBadge, NotificationBadge, SizeBadge, StatusBadge } from '@/ui/custom/custom-badge';
import Card, { CardContent, CardDescription, CardFooter, CardHeader, CardTitle, ProductCard } from '@/ui/custom/custom-card';
import { CategoryTag, Chip, FilterChip, TagInput } from '@/ui/custom/custom-chips';
import Divider, { ContentDivider, SectionDivider } from '@/ui/custom/custom-divider';
import { ActiveFilters, FilterPanel } from '@/ui/custom/custom-filter';
import { CircularProgress, ProgressBar, SteppedProgress } from '@/ui/custom/custom-progress';
import { PriceRangeSlider, RangeSlider } from '@/ui/custom/custom-range';
import { ShareButtons } from '@/ui/custom/custom-share';
import { Carousel, ImageGallery } from '@/ui/custom/product-gallery';
import { InstallmentPrice, Price, PriceRange, PriceWithDiscount, SavingsDisplay } from '@/ui/custom/product-price';
import QuantitySelector, { CompactQuantitySelector } from '@/ui/custom/product-quantity';
import { ImageZoom, LensMagnifier, SideBySideZoom } from '@/ui/custom/product-zoom';

export default function CustomTab() {
    // State for interactive components
    const [quantity, setQuantity] = useState(1);
    const [tags, setTags] = useState(['Leather', 'Premium', 'Handmade']);
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
    const [filters, setFilters] = useState<Record<string, any>>({});
    const [currentStep, setCurrentStep] = useState(1);

    // Filter sections for FilterPanel
    const filterSections = [
        {
            id: 'category',
            title: 'Category',
            type: 'checkbox' as const,
            options: [
                { label: 'Jackets', value: 'jackets', count: 24 },
                { label: 'Coats', value: 'coats', count: 18 },
                { label: 'Blazers', value: 'blazers', count: 15 },
                { label: 'Pants', value: 'pants', count: 12 },
            ],
        },
        {
            id: 'size',
            title: 'Size',
            type: 'checkbox' as const,
            options: [
                { label: 'XS', value: 'xs', count: 8 },
                { label: 'S', value: 's', count: 15 },
                { label: 'M', value: 'm', count: 22 },
                { label: 'L', value: 'l', count: 18 },
                { label: 'XL', value: 'xl', count: 12 },
            ],
        },
        {
            id: 'color',
            title: 'Color',
            type: 'color' as const,
            colors: [
                { name: 'Black', hex: '#000000', value: 'black' },
                { name: 'Brown', hex: '#8B4513', value: 'brown' },
                { name: 'Tan', hex: '#D2B48C', value: 'tan' },
                { name: 'Burgundy', hex: '#800020', value: 'burgundy' },
            ],
        },
    ];

    // Checkout steps
    const checkoutSteps = [
        { label: 'Cart', description: 'Review items' },
        { label: 'Shipping', description: 'Address details' },
        { label: 'Payment', description: 'Payment method' },
        { label: 'Confirm', description: 'Place order' },
    ];

    // Sample images for gallery
    const galleryImages = [
        {
            src: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800',
            alt: 'Leather Jacket Front',
        },
        {
            src: 'https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?w=800',
            alt: 'Leather Jacket Side',
        },
        {
            src: 'https://images.unsplash.com/photo-1553591589-2e96ef7eca65?w=800',
            alt: 'Leather Jacket Back',
        },
        {
            src: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800',
            alt: 'Leather Jacket Detail',
        },
    ];

    return (
        <div className="min-h-screen bg-background">
            {/* Banner Alert Demo */}
            <BannerAlert
                variant="info"
                message="🎉 Spring Sale: Get 20% off on all leather jackets!"
                actionLabel="Shop Now"
                onAction={() => console.log('Shop now clicked')}
                onClose={() => console.log('Banner closed')}
            />

            <div className="container mx-auto px-4 py-12">
                {/* Page Header */}
                <div className="mb-12 text-center">
                    <h1 className="text-4xl font-display font-bold text-text-primary mb-4">
                        VelleHide Component Showcase
                    </h1>
                    <p className="text-lg text-text-secondary max-w-2xl mx-auto">
                        Explore our comprehensive library of premium e-commerce components
                        designed for leather clothing websites.
                    </p>
                </div>

                {/* Cards Section */}
                <section className="mb-16">
                    <h2 className="text-3xl font-display font-bold text-text-primary mb-6">
                        Cards & Product Cards
                    </h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <ProductCard
                            image="https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400"
                            width={400}
                            imageAlt="Classic Leather Jacket"
                            title="Classic Leather Jacket"
                            price={299.99}
                            originalPrice={399.99}
                            badge="Sale"
                            badgeVariant="sale"
                            rating={4.5}
                            onCardClick={() => console.log('Card clicked')}
                            onAddToCart={() => console.log('Add to cart')}
                        />

                        <ProductCard
                            image="https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?w=400"
                            width={400}
                            imageAlt="Premium Leather Coat"
                            title="Premium Leather Coat"
                            price={499.99}
                            badge="New"
                            badgeVariant="new"
                            rating={5}
                            onCardClick={() => console.log('Card clicked')}
                            onAddToCart={() => console.log('Add to cart')}
                        />

                        <ProductCard
                            image="https://images.unsplash.com/photo-1553591589-2e96ef7eca65?w=400"
                            width={400}
                            imageAlt="Vintage Leather Blazer"
                            title="Vintage Leather Blazer"
                            price={349.99}
                            badge="Limited"
                            badgeVariant="limited"
                            rating={4}
                            onCardClick={() => console.log('Card clicked')}
                            onAddToCart={() => console.log('Add to cart')}
                        />

                        <Card variant="outlined" padding="md" hoverable>
                            <CardHeader>
                                <CardTitle>Custom Card</CardTitle>
                                <CardDescription>
                                    A flexible card component with multiple variants
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-text-secondary text-sm">
                                    Use cards to display content in a structured way. Supports hoverable,
                                    outlined, elevated, and ghost variants.
                                </p>
                            </CardContent>
                            <CardFooter>
                                <button className="text-sm text-primary font-semibold hover:underline">
                                    Learn More →
                                </button>
                            </CardFooter>
                        </Card>
                    </div>
                </section>

                <SectionDivider gradient />

                {/* Badges Section */}
                <section className="mb-16">
                    <h2 className="text-3xl font-display font-bold text-text-primary mb-6">
                        Badges & Tags
                    </h2>

                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle>Badge Variants</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-3">
                                <Badge variant="default">Default</Badge>
                                <Badge variant="new">New Arrival</Badge>
                                <Badge variant="sale">On Sale</Badge>
                                <Badge variant="limited">Limited Edition</Badge>
                                <Badge variant="success">Success</Badge>
                                <Badge variant="error">Error</Badge>
                                <Badge variant="warning">Warning</Badge>
                                <Badge variant="info">Info</Badge>
                                <Badge variant="outline">Outline</Badge>
                                <Badge variant="success" dot>
                                    With Dot
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Status Badges</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <StatusBadge status="in-stock" />
                                    <StatusBadge status="low-stock" />
                                    <StatusBadge dot status="out-of-stock" />
                                    <StatusBadge status="pending" />
                                    <StatusBadge status="processing" />
                                    <StatusBadge dot status="shipped" />
                                    <StatusBadge status="delivered" />
                                    <StatusBadge status="cancelled" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Size & Color Badges</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-sm text-text-secondary mb-2">Size Selection:</p>
                                        <div className="flex flex-wrap gap-2">
                                            <SizeBadge size="XS" />
                                            <SizeBadge size="S" selected />
                                            <SizeBadge size="M" />
                                            <SizeBadge size="L" />
                                            <SizeBadge size="XL" disabled />
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-sm text-text-secondary mb-2">Color Selection:</p>
                                        <div className="flex flex-wrap gap-2">
                                            <ColorBadge color="#000000" colorName="Black" selected />
                                            <ColorBadge color="#8B4513" colorName="Brown" />
                                            <ColorBadge color="#D2B48C" colorName="Tan" />
                                            <ColorBadge color="#800020" colorName="Burgundy" />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Notification Badge</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex gap-8">
                                <div className="relative">
                                    <button className="p-3 bg-muted rounded-full">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                                        </svg>
                                    </button>
                                    <NotificationBadge count={3} variant="error" />
                                </div>

                                <div className="relative">
                                    <button className="p-3 bg-muted rounded-full">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                                        </svg>
                                    </button>
                                    <NotificationBadge count={12} variant="default" />
                                </div>

                                <div className="relative">
                                    <button className="p-3 bg-muted rounded-full">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                                        </svg>
                                    </button>
                                    <NotificationBadge count={128} variant="error" position="top-right" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </section>

                <Divider label="Chips & Filters" />

                {/* Chips Section */}
                <section className="mb-16">
                    <h2 className="text-3xl font-display font-bold text-text-primary mb-6">
                        Chips & Tags
                    </h2>

                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Chip Variants</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    <Chip label="Default" />
                                    <Chip label="Primary" variant="primary" />
                                    <Chip label="Success" variant="success" />
                                    <Chip label="Error" variant="error" />
                                    <Chip label="Warning" variant="warning" />
                                    <Chip label="Outline" variant="outline" />
                                    <Chip label="Removable" variant="primary" onRemove={() => console.log('Removed')} />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Filter Chips</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    <FilterChip label="All Products" count={124} active />
                                    <FilterChip label="Jackets" count={45} />
                                    <FilterChip label="Coats" count={32} />
                                    <FilterChip label="On Sale" count={18} />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle>Tag Input</CardTitle>
                            <CardDescription>Add and remove tags dynamically</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <TagInput
                                tags={tags}
                                onAdd={(tag) => setTags([...tags, tag])}
                                onRemove={(index) => setTags(tags.filter((_, i) => i !== index))}
                                placeholder="Add product tag..."
                                maxTags={10}
                            />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Category Tags</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-3">
                                <CategoryTag category="Leather Jackets" onClick={() => console.log('Jackets')} />
                                <CategoryTag category="Winter Coats" onClick={() => console.log('Coats')} />
                                <CategoryTag category="Formal Blazers" onClick={() => console.log('Blazers')} />
                                <CategoryTag category="Casual Wear" onClick={() => console.log('Casual')} />
                            </div>
                        </CardContent>
                    </Card>
                </section>

                <ContentDivider />

                {/* Avatars Section */}
                <section className="mb-16">
                    <h2 className="text-3xl font-display font-bold text-text-primary mb-6">
                        Avatars
                    </h2>

                    <div className="grid md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Avatar Sizes</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-end gap-4">
                                    <Avatar name="John Doe" size="xs" />
                                    <Avatar name="Jane Smith" size="sm" />
                                    <Avatar name="Mike Johnson" size="md" />
                                    <Avatar name="Sarah Williams" size="lg" />
                                    <Avatar name="Tom Brown" size="xl" />
                                    <Avatar name="Emily Davis" size="2xl" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Avatar with Status</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex gap-4">
                                    <Avatar name="Online User" status="online" size="lg" />
                                    <Avatar name="Away User" status="away" size="lg" />
                                    <Avatar name="Busy User" status="busy" size="lg" />
                                    <Avatar name="Offline User" status="offline" size="lg" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="md:col-span-2">
                            <CardHeader>
                                <CardTitle>Avatar Group</CardTitle>
                                <CardDescription>Overlapping avatars for team displays</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <AvatarGroup
                                    avatars={[
                                        { name: 'John Doe' },
                                        { name: 'Jane Smith' },
                                        { name: 'Mike Johnson' },
                                        { name: 'Sarah Williams' },
                                        { name: 'Tom Brown' },
                                        { name: 'Emily Davis' },
                                        { name: 'Chris Wilson' },
                                        { name: 'Lisa Anderson' },
                                    ]}
                                    max={5}
                                    size="md"
                                />
                            </CardContent>
                        </Card>
                    </div>
                </section>

                <SectionDivider />

                {/* Pricing Section */}
                <section className="mb-16">
                    <h2 className="text-3xl font-display font-bold text-text-primary mb-6">
                        Product Pricing
                    </h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Standard Price</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Price amount={299.99} size="xl" />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Price Range</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <PriceRange minPrice={199.99} maxPrice={499.99} size="lg" />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Sale Pricing</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <PriceWithDiscount
                                    originalPrice={399.99}
                                    salePrice={299.99}
                                    size="lg"
                                    showPercentage
                                />
                                <div className="mt-3">
                                    <SavingsDisplay
                                        originalPrice={399.99}
                                        salePrice={299.99}
                                        variant="both"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="md:col-span-2 lg:col-span-3">
                            <CardHeader>
                                <CardTitle>Installment Pricing</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Price amount={599.99} size="lg" />
                                <InstallmentPrice totalPrice={599.99} installments={4} />
                            </CardContent>
                        </Card>
                    </div>
                </section>

                <Divider />

                {/* Range Slider Section */}
                <section className="mb-16">
                    <h2 className="text-3xl font-display font-bold text-text-primary mb-6">
                        Range Sliders
                    </h2>

                    <div className="grid md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Price Range Filter</CardTitle>
                                <CardDescription>Dual-handle slider for price filtering</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <PriceRangeSlider
                                    min={0}
                                    max={1000}
                                    value={priceRange}
                                    onChange={setPriceRange}
                                />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Custom Range Slider</CardTitle>
                                <CardDescription>General purpose range selector</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <RangeSlider
                                    min={0}
                                    max={100}
                                    defaultValue={[25, 75]}
                                    formatLabel={(val) => `${val}%`}
                                />
                            </CardContent>
                        </Card>
                    </div>
                </section>

                <ContentDivider />

                {/* Quantity Selector Section */}
                <section className="mb-16">
                    <h2 className="text-3xl font-display font-bold text-text-primary mb-6">
                        Quantity Selectors
                    </h2>

                    <div className="grid md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Standard Quantity Selector</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-sm text-text-secondary mb-2">Small:</p>
                                        <QuantitySelector value={quantity} onChange={setQuantity} size="sm" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-text-secondary mb-2">Medium:</p>
                                        <QuantitySelector value={quantity} onChange={setQuantity} size="md" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-text-secondary mb-2">Large:</p>
                                        <QuantitySelector value={quantity} onChange={setQuantity} size="lg" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Compact Quantity Selector</CardTitle>
                                <CardDescription>Perfect for cart items</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <CompactQuantitySelector
                                    value={quantity}
                                    onChange={setQuantity}
                                    onRemove={() => console.log('Remove item')}
                                />
                            </CardContent>
                        </Card>
                    </div>
                </section>

                <SectionDivider gradient />

                {/* Progress Section */}
                <section className="mb-16">
                    <h2 className="text-3xl font-display font-bold text-text-primary mb-6">
                        Progress Indicators
                    </h2>

                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle>Progress Bars</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                <ProgressBar value={75} showLabel label="Upload Progress" />
                                <ProgressBar value={45} variant="success" showLabel label="Completion" />
                                <ProgressBar value={90} variant="warning" size="lg" showLabel label="Stock Level" />
                                <ProgressBar value={25} variant="error" size="sm" showLabel label="Remaining" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle>Checkout Steps</CardTitle>
                            <CardDescription>Multi-step progress indicator</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <SteppedProgress
                                steps={checkoutSteps}
                                currentStep={currentStep}
                                completed={[0]}
                                variant="numbers"
                            />
                            <div className="flex gap-2 mt-6">
                                <button
                                    onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                                    className="px-4 py-2 bg-button-secondary text-button-secondary-foreground rounded-lg hover:bg-button-secondary-hover"
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => setCurrentStep(Math.min(3, currentStep + 1))}
                                    className="px-4 py-2 bg-button-primary text-button-primary-foreground rounded-lg hover:bg-button-primary-hover"
                                >
                                    Next
                                </button>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid md:grid-cols-3 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Circular Progress</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex justify-center">
                                    <CircularProgress value={75} variant="default" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Success Progress</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex justify-center">
                                    <CircularProgress value={100} variant="success" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Warning Progress</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex justify-center">
                                    <CircularProgress value={45} variant="warning" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                <Divider label="Alerts & Notifications" />

                {/* Alerts Section */}
                <section className="mb-16">
                    <h2 className="text-3xl font-display font-bold text-text-primary mb-6">
                        Alerts
                    </h2>

                    <div className="space-y-4">
                        <Alert variant="info" title="Information" closable>
                            Your order has been received and is being processed.
                        </Alert>

                        <Alert variant="success" title="Success" closable bordered>
                            Your payment was successful! Order #12345 has been confirmed.
                        </Alert>

                        <Alert variant="warning" title="Warning" closable>
                            Only 3 items left in stock. Order soon to avoid missing out!
                        </Alert>

                        <Alert variant="error" title="Error" closable bordered>
                            Payment failed. Please check your card details and try again.
                        </Alert>

                        <InlineAlert variant="info" message="Free shipping on orders over $100" />
                        <InlineAlert variant="success" message="Item added to wishlist" />
                    </div>
                </section>

                <ContentDivider />

                {/* Gallery Section */}
                <section className="mb-16">
                    <h2 className="text-3xl font-display font-bold text-text-primary mb-6">
                        Product Gallery
                    </h2>

                    <div className="grid lg:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Image Gallery</CardTitle>
                                <CardDescription>Click to zoom, use arrow keys to navigate</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ImageGallery images={galleryImages} />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Carousel</CardTitle>
                                <CardDescription>Auto-playing carousel with navigation</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Carousel
                                    items={galleryImages.map((img, i) => (
                                        <div key={i} className="aspect-video bg-muted rounded-lg overflow-hidden">
                                            <Image src={img.src} alt={img.alt} width={400} height={900} className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                    autoPlay
                                    interval={3000}
                                    showDots
                                    showArrows
                                />
                            </CardContent>
                        </Card>
                    </div>
                </section>

                <SectionDivider />

                {/* Image Zoom Section */}
                <section className="mb-16">
                    <h2 className="text-3xl font-display font-bold text-text-primary mb-6">
                        Image Zoom Effects
                    </h2>

                    <div className="grid lg:grid-cols-3 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Hover Zoom</CardTitle>
                                <CardDescription>In-place zoom effect</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ImageZoom
                                    src="https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600"
                                    width={600}
                                    alt="Leather Jacket"
                                    zoomLevel={2}
                                    className="aspect-square"
                                />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Lens Magnifier</CardTitle>
                                <CardDescription>Magnifying lens effect</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <LensMagnifier
                                    src="https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?w=600"
                                    width={600}
                                    alt="Leather Coat"
                                    lensSize={150}
                                    magnification={2.5}
                                    className="aspect-square"
                                />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Side-by-Side</CardTitle>
                                <CardDescription>Zoomed view alongside</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <SideBySideZoom
                                    src="https://images.unsplash.com/photo-1727515546577-f7d82a47b51d?w=600"
                                    alt="Leather Blazer"
                                    magnification={2}
                                />
                            </CardContent>
                        </Card>
                    </div>
                </section>

                <Divider />

                {/* Share Buttons Section */}
                <section className="mb-16">
                    <h2 className="text-3xl font-display font-bold text-text-primary mb-6">
                        Social Sharing
                    </h2>

                    <div className="grid md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Icon Buttons</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ShareButtons
                                    url="https://vellehide.com/products/leather-jacket"
                                    title="Classic Leather Jacket"
                                    variant="icons"
                                    platforms={['facebook', 'twitter', 'pinterest', 'whatsapp', 'copy']}
                                />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Button</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ShareButtons
                                    url="https://vellehide.com/products/leather-jacket"
                                    title="Classic Leather Jacket"
                                    variant="buttons"
                                    platforms={['facebook', 'twitter', 'email', 'copy']}
                                />
                            </CardContent>
                        </Card>
                    </div>
                </section>

                <ContentDivider />

                {/* Filter Panel Section */}
                <section className="mb-16">
                    <h2 className="text-3xl font-display font-bold text-text-primary mb-6">
                        Product Filters
                    </h2>

                    <div className="grid lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-1">
                            <FilterPanel
                                sections={filterSections}
                                values={filters}
                                onChange={(sectionId, value) => {
                                    setFilters({ ...filters, [sectionId]: value });
                                }}
                                onReset={() => setFilters({})}
                            />
                        </div>

                        <div className="lg:col-span-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Active Filters</CardTitle>
                                    <CardDescription>Applied filters appear here</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ActiveFilters
                                        filters={filters}
                                        sections={filterSections}
                                        onRemove={(sectionId, value) => {
                                            const currentValues = filters[sectionId];
                                            if (Array.isArray(currentValues)) {
                                                setFilters({
                                                    ...filters,
                                                    [sectionId]: currentValues.filter((v) => v !== value),
                                                });
                                            } else {
                                                const newFilters = { ...filters };
                                                delete newFilters[sectionId];
                                                setFilters(newFilters);
                                            }
                                        }}
                                        onClearAll={() => setFilters({})}
                                    />

                                    {Object.keys(filters).length === 0 && (
                                        <p className="text-text-secondary text-center py-8">
                                            No filters applied. Select filters from the panel to see them here.
                                        </p>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}