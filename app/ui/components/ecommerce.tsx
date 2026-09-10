import { useState } from "react";
import { SectionHeader } from "./common";
import { ShoppingCart, Search, User, Grid, List, MapPin, Phone, Mail, Plus, Minus, Trash2, Star, Heart, Eye } from 'lucide-react';


export default function EcommerceTab() {
    return (
        <>
            {/* Product Cards */}
            <section className="space-y-6 sm:space-y-8">
                <SectionHeader title="Product Cards" subtitle="Interactive product displays with hover effects" />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    <ProductCard
                        image="/men2.jpg"
                        badge="New"
                        title="Premium Leather Jacket"
                        price={299.99}
                        originalPrice={449.99}
                        rating={4.5}
                        reviews={128}
                    />
                    <ProductCard
                        image="/men2.jpg"
                        badge="Sale"
                        title="Classic Leather Coat"
                        price={399.99}
                        originalPrice={599.99}
                        rating={5}
                        reviews={256}
                    />
                    <ProductCard
                        image="/men2.jpg"
                        badge="Limited"
                        title="Designer Leather Blazer"
                        price={549.99}
                        rating={4}
                        reviews={89}
                    />
                </div>
            </section>

            {/* Shopping Cart Item */}
            <section className="space-y-6 sm:space-y-8">
                <SectionHeader title="Cart Items" subtitle="Interactive cart components" />

                <div className="space-y-3 sm:space-y-4 max-w-3xl">
                    <CartItem
                        name="Premium Leather Jacket"
                        size="L"
                        color="Black"
                        price={299.99}
                        quantity={1}
                    />
                    <CartItem
                        name="Classic Leather Coat"
                        size="M"
                        color="Brown"
                        price={399.99}
                        quantity={2}
                    />
                </div>
            </section>

            {/* Navigation Menu */}
            <section className="space-y-6 sm:space-y-8">
                <SectionHeader title="Navigation Components" subtitle="Interactive navigation elements" />

                <div className="bg-surface border border-border rounded-lg p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 sm:mb-6">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 w-full sm:w-auto">
                            <h2 className="text-lg sm:text-xl font-bold text-text-primary">Velle Hide</h2>
                            <nav className="hidden md:flex items-center gap-4 lg:gap-6">
                                {['New Arrivals', 'Jackets', 'Coats', 'Blazers', 'Sale'].map((item) => (
                                    <a
                                        key={item}
                                        href="#"
                                        className="text-text-secondary hover:text-text-primary transition-colors font-medium text-sm"
                                    >
                                        {item}
                                    </a>
                                ))}
                            </nav>
                        </div>
                        <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto justify-end">
                            <button className="p-2 text-text-secondary hover:text-text-primary transition-colors">
                                <Search className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                            <button className="p-2 text-text-secondary hover:text-text-primary transition-colors">
                                <User className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                            <button className="p-2 text-text-secondary hover:text-text-primary transition-colors relative">
                                <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                                <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-primary text-primary-foreground text-[10px] sm:text-xs rounded-full flex items-center justify-center font-medium">
                                    3
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Filter Sidebar */}
            <section className="space-y-6 sm:space-y-8">
                <SectionHeader title="Filter Components" subtitle="Product filtering interface" />

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
                    <div className="lg:col-span-1 space-y-4 sm:space-y-6">
                        <div className="bg-surface border border-border rounded-lg p-4 sm:p-6 space-y-4 sm:space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-text-primary text-sm sm:text-base">Filters</h3>
                                <button className="text-xs sm:text-sm text-primary hover:text-primary-hover">Clear All</button>
                            </div>

                            <div className="space-y-3 sm:space-y-4">
                                <h4 className="font-medium text-text-primary text-sm">Category</h4>
                                <div className="space-y-2">
                                    {['All Products', 'Jackets', 'Coats', 'Blazers', 'Pants'].map((cat) => (
                                        <label key={cat} className="flex items-center gap-2 cursor-pointer group">
                                            <input type="checkbox" className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                                            <span className="text-xs sm:text-sm text-text-secondary group-hover:text-text-primary transition-colors">
                                                {cat}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="h-px bg-divider" />

                            <div className="space-y-3 sm:space-y-4">
                                <h4 className="font-medium text-text-primary text-sm">Price Range</h4>
                                <div className="space-y-3">
                                    <input type="range" className="w-full" min="0" max="1000" />
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            placeholder="Min"
                                            className="input w-full text-xs sm:text-sm py-1.5 sm:py-2"
                                        />
                                        <span className="text-text-tertiary text-xs sm:text-sm">-</span>
                                        <input
                                            type="number"
                                            placeholder="Max"
                                            className="input w-full text-xs sm:text-sm py-1.5 sm:py-2"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="h-px bg-divider" />

                            <div className="space-y-3 sm:space-y-4">
                                <h4 className="font-medium text-text-primary text-sm">Size</h4>
                                <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                                    {['XS', 'S', 'M', 'L', 'XL', '2XL'].map((size) => (
                                        <button
                                            key={size}
                                            className="py-1.5 sm:py-2 border border-border text-xs sm:text-sm hover:border-primary hover:text-primary transition-all rounded"
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-3">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
                            <p className="text-text-secondary text-xs sm:text-sm">Showing 1-12 of 48 products</p>
                            <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
                                <button className="p-1.5 sm:p-2 border border-border rounded hover:border-primary transition-colors">
                                    <Grid className="w-4 h-4 sm:w-5 sm:h-5" />
                                </button>
                                <button className="p-1.5 sm:p-2 border border-border rounded hover:border-primary transition-colors">
                                    <List className="w-4 h-4 sm:w-5 sm:h-5" />
                                </button>
                                <select className="input py-1.5 sm:py-2 text-xs sm:text-sm flex-1 sm:flex-initial">
                                    <option>Sort by: Featured</option>
                                    <option>Price: Low to High</option>
                                    <option>Price: High to Low</option>
                                    <option>Newest First</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="skeleton h-80 sm:h-96 rounded-lg" />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Navigation Menu */}
            <section className="space-y-8">
                <SectionHeader title="Navigation Components" subtitle="Interactive navigation elements" />

                <div className="bg-surface border border-border rounded-lg p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-8">
                            <h2 className="text-xl font-bold text-text-primary">Velle Hide</h2>
                            <nav className="hidden md:flex items-center gap-6">
                                {['New Arrivals', 'Jackets', 'Coats', 'Blazers', 'Sale'].map((item) => (
                                    <a
                                        key={item}
                                        href="#"
                                        className="text-text-secondary hover:text-text-primary transition-colors font-medium"
                                    >
                                        {item}
                                    </a>
                                ))}
                            </nav>
                        </div>
                        <div className="flex items-center gap-4">
                            <button className="p-2 text-text-secondary hover:text-text-primary transition-colors">
                                <Search className="w-5 h-5" />
                            </button>
                            <button className="p-2 text-text-secondary hover:text-text-primary transition-colors">
                                <User className="w-5 h-5" />
                            </button>
                            <button className="p-2 text-text-secondary hover:text-text-primary transition-colors relative">
                                <ShoppingCart className="w-5 h-5" />
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                                    3
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </section >

            {/* Filter Sidebar */}
            < section className="space-y-8" >
                <SectionHeader title="Filter Components" subtitle="Product filtering interface" />

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-surface border border-border rounded-lg p-6 space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-text-primary">Filters</h3>
                                <button className="text-sm text-primary hover:text-primary-hover">Clear All</button>
                            </div>

                            <div className="space-y-4">
                                <h4 className="font-medium text-text-primary">Category</h4>
                                <div className="space-y-2">
                                    {['All Products', 'Jackets', 'Coats', 'Blazers', 'Pants'].map((cat) => (
                                        <label key={cat} className="flex items-center gap-2 cursor-pointer group">
                                            <input type="checkbox" className="w-4 h-4 text-primary" />
                                            <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors">
                                                {cat}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="h-px bg-divider" />

                            <div className="space-y-4">
                                <h4 className="font-medium text-text-primary">Price Range</h4>
                                <div className="space-y-3">
                                    <input type="range" className="w-full" min="0" max="1000" />
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            placeholder="Min"
                                            className="input w-full text-sm"
                                        />
                                        <span className="text-text-tertiary">-</span>
                                        <input
                                            type="number"
                                            placeholder="Max"
                                            className="input w-full text-sm"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="h-px bg-divider" />

                            <div className="space-y-4">
                                <h4 className="font-medium text-text-primary">Size</h4>
                                <div className="grid grid-cols-3 gap-2">
                                    {['XS', 'S', 'M', 'L', 'XL', '2XL'].map((size) => (
                                        <button
                                            key={size}
                                            className="py-2 border border-border text-sm hover:border-primary hover:text-primary transition-all rounded"
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-3">
                        <div className="flex items-center justify-between mb-6">
                            <p className="text-text-secondary">Showing 1-12 of 48 products</p>
                            <div className="flex items-center gap-4">
                                <button className="p-2 border border-border rounded hover:border-primary transition-colors">
                                    <Grid className="w-5 h-5" />
                                </button>
                                <button className="p-2 border border-border rounded hover:border-primary transition-colors">
                                    <List className="w-5 h-5" />
                                </button>
                                <select className="input py-2">
                                    <option>Sort by: Featured</option>
                                    <option>Price: Low to High</option>
                                    <option>Price: High to Low</option>
                                    <option>Newest First</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="skeleton h-96 rounded-lg" />
                            ))}
                        </div>
                    </div>
                </div>
            </section >

            {/* Footer */}
            <section className="space-y-6 sm:space-y-8">
                <SectionHeader title="Footer Components" subtitle="Site footer with links and information" />

                <div className="bg-surface border border-border rounded-lg p-6 sm:p-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
                        <div className="space-y-3 sm:space-y-4">
                            <h3 className="font-bold text-text-primary text-base sm:text-lg">Velle Hide</h3>
                            <p className="text-xs sm:text-sm text-text-secondary">
                                Premium leather goods crafted with excellence since 2020.
                            </p>
                            <div className="flex gap-2 sm:gap-3">
                                <a href="#" className="w-9 h-9 sm:w-10 sm:h-10 bg-muted hover:bg-primary hover:text-primary-foreground rounded-full flex items-center justify-center transition-all text-sm sm:text-base">
                                    <span className="sr-only">Facebook</span>
                                    📘
                                </a>
                                <a href="#" className="w-9 h-9 sm:w-10 sm:h-10 bg-muted hover:bg-primary hover:text-primary-foreground rounded-full flex items-center justify-center transition-all text-sm sm:text-base">
                                    <span className="sr-only">Instagram</span>
                                    📷
                                </a>
                                <a href="#" className="w-9 h-9 sm:w-10 sm:h-10 bg-muted hover:bg-primary hover:text-primary-foreground rounded-full flex items-center justify-center transition-all text-sm sm:text-base">
                                    <span className="sr-only">Twitter</span>
                                    🐦
                                </a>
                            </div>
                        </div>

                        <div className="space-y-2 sm:space-y-3">
                            <h4 className="font-semibold text-text-primary text-sm sm:text-base">Shop</h4>
                            <ul className="space-y-1.5 sm:space-y-2">
                                {['New Arrivals', 'Best Sellers', 'Sale', 'Gift Cards'].map((item) => (
                                    <li key={item}>
                                        <a href="#" className="text-xs sm:text-sm text-text-secondary hover:text-text-primary transition-colors">
                                            {item}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="space-y-2 sm:space-y-3">
                            <h4 className="font-semibold text-text-primary text-sm sm:text-base">Support</h4>
                            <ul className="space-y-1.5 sm:space-y-2">
                                {['Contact Us', 'Shipping Info', 'Returns', 'FAQ'].map((item) => (
                                    <li key={item}>
                                        <a href="#" className="text-xs sm:text-sm text-text-secondary hover:text-text-primary transition-colors">
                                            {item}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="space-y-2 sm:space-y-3">
                            <h4 className="font-semibold text-text-primary text-sm sm:text-base">Contact</h4>
                            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-text-secondary">
                                <li className="flex items-center gap-2">
                                    <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                    123 Leather St, NY 10001
                                </li>
                                <li className="flex items-center gap-2">
                                    <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                    +1 (555) 123-4567
                                </li>
                                <li className="flex items-center gap-2">
                                    <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                    hello@vellehide.com
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="h-px bg-divider mb-4 sm:mb-6" />

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
                        <p className="text-xs sm:text-sm text-text-tertiary text-center sm:text-left">
                            © 2026 Velle Hide. All rights reserved.
                        </p>
                        <div className="flex gap-4 sm:gap-6">
                            <a href="#" className="text-xs sm:text-sm text-text-tertiary hover:text-text-primary transition-colors">
                                Privacy Policy
                            </a>
                            <a href="#" className="text-xs sm:text-sm text-text-tertiary hover:text-text-primary transition-colors">
                                Terms of Service
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
function ProductCard({
    badge,
    title,
    price,
    originalPrice,
    rating,
    reviews
}: {
    image: string;
    badge: string;
    title: string;
    price: number;
    originalPrice?: number;
    rating: number;
    reviews: number;
}) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className="card p-0 overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 sm:hover:-translate-y-2"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="relative overflow-hidden bg-muted aspect-3/4">
                <div className="absolute inset-0 bg-linear-to-b from-transparent to-background/20" />
                {badge && (
                    <span className={`absolute top-3 left-3 sm:top-4 sm:left-4 z-10 text-xs ${badge === 'New' ? 'badge-new' : badge === 'Sale' ? 'badge-sale' : 'badge-limited'
                        }`}>
                        {badge}
                    </span>
                )}
                <div className={`absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex gap-1.5 sm:gap-2 transition-all duration-300 ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                    }`}>
                    <button className="p-1.5 sm:p-2 bg-surface/90 backdrop-blur-sm rounded-full hover:bg-primary hover:text-primary-foreground transition-all shadow-lg">
                        <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                    <button className="p-1.5 sm:p-2 bg-surface/90 backdrop-blur-sm rounded-full hover:bg-primary hover:text-primary-foreground transition-all shadow-lg">
                        <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                </div>
            </div>
            <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
                <h3 className="font-semibold text-text-primary line-clamp-1 text-sm sm:text-base">{title}</h3>
                <div className="flex items-center gap-1.5 sm:gap-2">
                    <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                                key={star}
                                className={`w-3 h-3 sm:w-4 sm:h-4 ${star <= rating ? 'fill-rating-filled text-rating-filled' : 'fill-rating-empty text-rating-empty'
                                    }`}
                            />
                        ))}
                    </div>
                    <span className="text-xs sm:text-sm text-text-tertiary">({reviews})</span>
                </div>
                <div className="flex items-baseline gap-1.5 sm:gap-2">
                    <span className="text-xl sm:text-2xl font-bold text-text-primary">${price}</span>
                    {originalPrice && (
                        <span className="text-xs sm:text-sm line-through text-text-tertiary">${originalPrice}</span>
                    )}
                </div>
                <button className="btn-primary w-full flex items-center justify-center gap-1.5 sm:gap-2 text-sm sm:text-base py-2 sm:py-3">
                    <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                    Add to Cart
                </button>
            </div>
        </div>
    );
}

function CartItem({ name, size, color, price, quantity }: {
    name: string;
    size: string;
    color: string;
    price: number;
    quantity: number;
}) {
    const [qty, setQty] = useState(quantity);

    return (
        <div className="card flex gap-3 sm:gap-4 hover:shadow-md transition-shadow">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-muted rounded-lg shrink-0" />
            <div className="flex-1 space-y-1.5 sm:space-y-2 min-w-0">
                <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                        <h4 className="font-semibold text-text-primary text-sm sm:text-base truncate">{name}</h4>
                        <p className="text-xs sm:text-sm text-text-secondary">Size: {size} | Color: {color}</p>
                    </div>
                    <button className="p-1 text-destructive hover:bg-destructive-subtle rounded transition-colors shrink-0">
                        <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                </div>
                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                        <button
                            onClick={() => setQty(Math.max(1, qty - 1))}
                            className="p-1 border border-border rounded hover:border-primary transition-colors"
                        >
                            <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                        <span className="w-6 sm:w-8 text-center font-medium text-sm sm:text-base">{qty}</span>
                        <button
                            onClick={() => setQty(qty + 1)}
                            className="p-1 border border-border rounded hover:border-primary transition-colors"
                        >
                            <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                    </div>
                    <p className="text-base sm:text-lg font-bold text-text-primary">${(price * qty).toFixed(2)}</p>
                </div>
            </div>
        </div>
    );
}