"use client"

import { Check, CreditCard, Filter, Heart, Info, RefreshCw, Share2, ShoppingBag, Tag, Trash2, X } from "lucide-react";
import { useState } from "react";
import { AlertComponent, SectionHeader } from "../ui/components/common";
import { Button, IconButton } from "./button";
import { AddToCartButton, QuantitySelector, WishlistButton } from "./button-ecom";

import "./button.css"

export default function ButtonTab() {
    return (
        <>
            {/* Core Button */}
            <section className="space-y-6 sm:space-y-8">
                <SectionHeader
                    title="Buttons"
                    subtitle="One multipurpose Button component, styled by variant, size and state - everything below, including the ecommerce actions, is built on top of it."
                />

                <AlertComponent
                    type="info"
                    title="Where it lives"
                    message="Button and IconButton sit in components/atoms. The ecommerce-specific actions further down (Add to Cart, Wishlist, Quantity) are molecules composed from them."
                    icon={<Info className="w-5 h-5" />}
                />

                {/* Variants */}
                <div className="space-y-4">
                    <h3 className="text-lg sm:text-xl font-semibold text-text-primary">Variants</h3>
                    <div className="flex flex-wrap items-center gap-3 sm:gap-4 p-4 sm:p-6 bg-surface border border-border rounded-lg">
                        <Button variant="primary">Primary</Button>
                        <Button variant="secondary">Secondary</Button>
                        <Button variant="accent">Accent</Button>
                        <Button variant="outline">Outline</Button>
                        <Button variant="ghost">Ghost</Button>
                        <Button variant="subtle">Subtle</Button>
                        <Button variant="destructive">Destructive</Button>
                        <Button variant="link">Link</Button>
                    </div>
                </div>

                {/* Sizes */}
                <div className="space-y-4">
                    <h3 className="text-lg sm:text-xl font-semibold text-text-primary">Sizes</h3>
                    <div className="flex flex-wrap items-end gap-3 sm:gap-4 p-4 sm:p-6 bg-surface border border-border rounded-lg">
                        <Button size="sm">Small</Button>
                        <Button size="md">Medium</Button>
                        <Button size="lg">Large</Button>
                    </div>
                </div>

                {/* States */}
                <StatesDemo />

                {/* With icons */}
                <div className="space-y-4">
                    <h3 className="text-lg sm:text-xl font-semibold text-text-primary">With Icons</h3>
                    <div className="flex flex-wrap items-center gap-3 sm:gap-4 p-4 sm:p-6 bg-surface border border-border rounded-lg">
                        <Button variant="primary" leftIcon={<ShoppingBag />}>Shop now</Button>
                        <Button variant="outline" leftIcon={<Tag />}>Apply code</Button>
                        <Button variant="destructive" leftIcon={<Trash2 />}>Remove item</Button>
                        <Button variant="ghost" rightIcon={<RefreshCw />}>Refresh</Button>
                    </div>
                </div>

                {/* Icon buttons */}
                <div className="space-y-4">
                    <h3 className="text-lg sm:text-xl font-semibold text-text-primary">Icon Buttons</h3>
                    <p className="text-sm text-text-secondary">Circular by default for standalone actions; square works better inside toolbars.</p>
                    <div className="flex flex-wrap items-center gap-3 sm:gap-4 p-4 sm:p-6 bg-surface border border-border rounded-lg">
                        <IconButton icon={<Heart />} label="Add to wishlist" variant="outline" />
                        <IconButton icon={<Share2 />} label="Share" variant="ghost" />
                        <IconButton icon={<Filter />} label="Filter results" variant="subtle" shape="square" />
                        <IconButton icon={<X />} label="Dismiss" variant="ghost" size="sm" />
                    </div>
                </div>
            </section>

            {/* Ecommerce Actions */}
            <section className="space-y-6 sm:space-y-8">
                <SectionHeader
                    title="Ecommerce Actions"
                    subtitle="The composed, interactive buttons - try them."
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 sm:p-6 bg-surface border border-border rounded-xl space-y-4">
                        <div>
                            <p className="text-xs font-semibold text-text-tertiary uppercase tracking-wide font-body">Product Card</p>
                            <h4 className="font-heading text-lg font-semibold text-text-primary mt-1">Add to Cart + Wishlist</h4>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                            <AddToCartButton fullWidth onAddToCart={() => new Promise((resolve) => window.setTimeout(resolve, 900))} />
                            <WishlistButton />
                        </div>
                        <p className="text-xs text-text-tertiary">
                            Moves from idle to adding to added, then resets on its own. The heart fills with a quick bounce on toggle - both are plain CSS, no animation library.
                        </p>
                    </div>

                    <div className="p-4 sm:p-6 bg-surface border border-border rounded-xl space-y-4">
                        <div>
                            <p className="text-xs font-semibold text-text-tertiary uppercase tracking-wide font-body">Product Detail</p>
                            <h4 className="font-heading text-lg font-semibold text-text-primary mt-1">Quantity + Add to Cart</h4>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                            <QuantitySelector />
                            <AddToCartButton onAddToCart={() => new Promise((resolve) => window.setTimeout(resolve, 900))} />
                            <IconButton icon={<Heart />} label="Add to wishlist" variant="outline" />
                        </div>
                        <p className="text-xs text-text-tertiary">
                            Quantity clamps between min and max, and reports every change through onChange.
                        </p>
                    </div>
                </div>
            </section>

            {/* Common Patterns */}
            <CommonPatternsDemo />
        </>
    );
}

function StatesDemo() {
    const [isLoading, setIsLoading] = useState(false);

    const triggerLoading = () => {
        setIsLoading(true);
        window.setTimeout(() => setIsLoading(false), 1600);
    };

    return (
        <div className="space-y-4">
            <h3 className="text-lg sm:text-xl font-semibold text-text-primary">States</h3>
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 p-4 sm:p-6 bg-surface border border-border rounded-lg">
                <Button variant="primary" onClick={triggerLoading} loading={isLoading} loadingText="Saving">
                    Save changes
                </Button>
                <Button variant="secondary" disabled>Sold out</Button>
                <Button variant="outline" disabled>Unavailable</Button>
            </div>
            <p className="text-xs text-text-tertiary">
                Trigger Save changes to see the loading state - it disables itself and reverts automatically, the same pattern Add to Cart uses below.
            </p>
        </div>
    );
}

function CommonPatternsDemo() {
    const [loadingMore, setLoadingMore] = useState(false);
    const [promoLoading, setPromoLoading] = useState(false);
    const [promoApplied, setPromoApplied] = useState(false);

    const handleLoadMore = () => {
        setLoadingMore(true);
        window.setTimeout(() => setLoadingMore(false), 1400);
    };

    const handleApplyPromo = () => {
        setPromoLoading(true);
        window.setTimeout(() => {
            setPromoLoading(false);
            setPromoApplied(true);
        }, 1000);
    };

    return (
        <section className="space-y-6 sm:space-y-8">
            <SectionHeader
                title="Common Patterns"
                subtitle="How the same Button component covers the rest of the storefront."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 sm:p-6 bg-surface border border-border rounded-xl space-y-3">
                    <p className="text-xs font-semibold text-text-tertiary uppercase tracking-wide font-body">Cart Summary</p>
                    <Button variant="primary" size="lg" fullWidth leftIcon={<CreditCard />}>
                        Proceed to checkout
                    </Button>
                    <Button variant="ghost" fullWidth>
                        Continue shopping
                    </Button>
                </div>

                <div className="p-4 sm:p-6 bg-surface border border-border rounded-xl space-y-3">
                    <p className="text-xs font-semibold text-text-tertiary uppercase tracking-wide font-body">Promo Code</p>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Enter code"
                            disabled={promoApplied}
                            className="input flex-1"
                        />
                        <Button
                            variant="outline"
                            loading={promoLoading}
                            disabled={promoApplied}
                            onClick={handleApplyPromo}
                        >
                            {promoApplied ? "Applied" : "Apply"}
                        </Button>
                    </div>
                    {promoApplied && (
                        <p className="text-sm text-success flex items-center gap-1">
                            <Check className="w-4 h-4" />
                            10% discount applied
                        </p>
                    )}
                </div>

                <div className="p-4 sm:p-6 bg-surface border border-border rounded-xl space-y-3 md:col-span-2">
                    <p className="text-xs font-semibold text-text-tertiary uppercase tracking-wide font-body">Collection Grid</p>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <p className="text-sm text-text-secondary">Showing 24 of 96 products</p>
                        <Button variant="outline" loading={loadingMore} loadingText="Loading" onClick={handleLoadMore}>
                            Load more
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}