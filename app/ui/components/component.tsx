import { AlertComponent, SectionHeader } from "./common";
import { AlertCircle, Check, ChevronRight, CreditCard, Eye, Heart, Info, Package, Search, ShoppingCart, Star, Trash2, Truck, User, X } from "lucide-react";

export default function ComponentTab() {

    return (
        <>
            {/* Interactive Buttons */}
            <section className="space-y-6 sm:space-y-8">
                <SectionHeader title="Interactive Buttons" subtitle="Hover and click to see all states" />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    <ButtonShowcase
                        title="Primary Button"
                        description="Main call-to-action buttons"
                        variant="primary"
                    />
                    <ButtonShowcase
                        title="Secondary Button"
                        description="Secondary actions"
                        variant="secondary"
                    />
                    <ButtonShowcase
                        title="Accent Button"
                        description="Highlighted actions"
                        variant="accent"
                    />
                    <ButtonShowcase
                        title="Outline Button"
                        description="Subtle actions"
                        variant="outline"
                    />
                    <ButtonShowcase
                        title="Ghost Button"
                        description="Minimal actions"
                        variant="ghost"
                    />
                    <ButtonShowcase
                        title="Destructive Button"
                        description="Dangerous actions"
                        variant="destructive"
                    />
                </div>

                {/* Button Sizes */}
                <div className="space-y-4">
                    <h3 className="text-lg sm:text-xl font-semibold text-text-primary">Button Sizes</h3>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                        <button className="btn-primary text-xs px-3 py-1.5">Small</button>
                        <button className="btn-primary text-sm px-4 py-2">Default</button>
                        <button className="btn-primary px-6 py-3">Large</button>
                        <button className="btn-primary text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4">Extra Large</button>

                    </div>
                </div>

                {/* Icon Buttons */}
                <div className="space-y-4">
                    <h3 className="text-lg sm:text-xl font-semibold text-text-primary">Buttons with Icons</h3>
                    <div className="flex flex-wrap gap-3 sm:gap-4">
                        <button className="btn-primary flex items-center gap-2 text-sm sm:text-base">
                            <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                            <span className="hidden xs:inline">Add to Cart</span>
                            <span className="xs:hidden">Cart</span>
                        </button>
                        <button className="btn-accent flex items-center gap-2 text-sm sm:text-base">
                            <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
                            <span className="hidden xs:inline">Add to Wishlist</span>
                            <span className="xs:hidden">Wishlist</span>
                        </button>
                        <button className="btn-outline flex items-center gap-2 text-sm sm:text-base">
                            <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                            Quick View
                        </button>
                        <button className="btn-ghost flex items-center gap-2 text-sm sm:text-base">
                            <span className="hidden sm:inline">Continue Shopping</span>
                            <span className="sm:hidden">Continue</span>
                            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                    </div>
                </div>

                {/* Icon-only Buttons */}
                <div className="space-y-4">
                    <h3 className="text-lg sm:text-xl font-semibold text-text-primary">Icon-Only Buttons</h3>
                    <div className="flex flex-wrap gap-2 sm:gap-3">
                        <button className="p-2.5 sm:p-3 bg-primary text-primary-foreground rounded-md hover:bg-primary-hover transition-colors">
                            <Search className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                        <button className="p-2.5 sm:p-3 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary-hover transition-colors">
                            <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                        <button className="p-2.5 sm:p-3 bg-accent text-accent-foreground rounded-md hover:bg-accent-hover transition-colors">
                            <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                        <button className="p-2.5 sm:p-3 border border-border text-text-primary rounded-md hover:bg-muted transition-colors">
                            <User className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                        <button className="p-2.5 sm:p-3 text-destructive hover:bg-destructive-subtle rounded-md transition-colors">
                            <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                    </div>
                </div>
            </section>

            {/* Form Elements */}
            <section className="space-y-6 sm:space-y-8">
                <SectionHeader title="Form Elements" subtitle="Interactive input fields with all states" />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    {/* Default Input */}
                    <div className="space-y-2">
                        <label className="block text-xs sm:text-sm font-medium text-text-primary">Email Address</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="input w-full text-sm sm:text-base"
                        />
                        <p className="text-xs text-text-tertiary">We&apos;ll never share your email.</p>
                    </div>

                    {/* Input with Icon */}
                    <div className="space-y-2">
                        <label className="block text-xs sm:text-sm font-medium text-text-primary">Search Products</label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-text-tertiary" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="input w-full pl-9 sm:pl-10 text-sm sm:text-base"
                            />
                        </div>
                    </div>

                    {/* Success State */}
                    <div className="space-y-2">
                        <label className="block text-xs sm:text-sm font-medium text-text-primary">Valid Input</label>
                        <input
                            type="text"
                            defaultValue="john@example.com"
                            className="input w-full border-success focus:border-success focus:ring-success/20 text-sm sm:text-base"
                            readOnly
                        />
                        <p className="text-xs sm:text-sm text-success flex items-center gap-1">
                            <Check className="w-3 h-3 sm:w-4 sm:h-4" />
                            Email verified successfully
                        </p>
                    </div>

                    {/* Error State */}
                    <div className="space-y-2">
                        <label className="block text-xs sm:text-sm font-medium text-text-primary">Invalid Input</label>
                        <input
                            type="email"
                            defaultValue="invalid-email"
                            className="input w-full border-destructive focus:border-destructive focus:ring-destructive/20 text-sm sm:text-base"
                        />
                        <p className="text-xs sm:text-sm text-destructive flex items-center gap-1">
                            <X className="w-3 h-3 sm:w-4 sm:h-4" />
                            Please enter a valid email address
                        </p>
                    </div>

                    {/* Disabled Input */}
                    <div className="space-y-2">
                        <label className="block text-xs sm:text-sm font-medium text-text-disabled">Disabled Field</label>
                        <input
                            type="text"
                            placeholder="Cannot edit"
                            disabled
                            className="bg-input-disabled-background text-input-disabled-text border border-input-disabled-border px-4 py-2.5 rounded-md w-full cursor-not-allowed text-sm sm:text-base"
                        />
                    </div>

                    {/* Select */}
                    <div className="space-y-2">
                        <label className="block text-xs sm:text-sm font-medium text-text-primary">Category</label>
                        <select className="input w-full text-sm sm:text-base">
                            <option>All Categories</option>
                            <option>Leather Jackets</option>
                            <option>Coats</option>
                            <option>Blazers</option>
                            <option>Pants</option>
                        </select>
                    </div>

                    {/* Textarea */}
                    <div className="space-y-2 sm:col-span-2">
                        <label className="block text-xs sm:text-sm font-medium text-text-primary">Product Review</label>
                        <textarea
                            placeholder="Share your thoughts..."
                            rows={4}
                            className="input w-full resize-none text-sm sm:text-base"
                        />
                    </div>

                    {/* Checkbox */}
                    <div className="flex items-start gap-3 sm:col-span-2">
                        <input
                            type="checkbox"
                            id="terms"
                            className="mt-1 w-4 h-4 rounded border-border text-primary focus:ring-primary focus:ring-offset-2"
                        />
                        <label htmlFor="terms" className="text-xs sm:text-sm text-text-secondary">
                            I agree to the terms and conditions and privacy policy
                        </label>
                    </div>

                    {/* Radio Buttons */}
                    <div className="space-y-3 sm:col-span-2">
                        <label className="block text-xs sm:text-sm font-medium text-text-primary">Shipping Method</label>
                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <input
                                    type="radio"
                                    name="shipping"
                                    id="standard"
                                    className="w-4 h-4 text-primary focus:ring-primary"
                                    defaultChecked
                                />
                                <label htmlFor="standard" className="text-xs sm:text-sm text-text-secondary">
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
                                <label htmlFor="express" className="text-xs sm:text-sm text-text-secondary">
                                    Express Shipping (1-2 days)
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Cards */}
            <section className="space-y-6 sm:space-y-8">
                <SectionHeader title="Cards & Surfaces" subtitle="Hover to see interactive states" />

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                    <div className="card hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                            <Truck className="w-5 h-5 sm:w-6 sm:h-6" />
                        </div>
                        <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2">Free Shipping</h3>
                        <p className="text-text-secondary text-xs sm:text-sm">On orders over $150</p>
                    </div>

                    <div className="card hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-success/10 text-success rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                            <Package className="w-5 h-5 sm:w-6 sm:h-6" />
                        </div>
                        <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2">Easy Returns</h3>
                        <p className="text-text-secondary text-xs sm:text-sm">30-day return policy</p>
                    </div>

                    <div className="card hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer sm:col-span-2 md:col-span-1">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-accent/10 text-accent rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                            <CreditCard className="w-5 h-5 sm:w-6 sm:h-6" />
                        </div>
                        <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2">Secure Payment</h3>
                        <p className="text-text-secondary text-xs sm:text-sm">SSL encrypted checkout</p>
                    </div>
                </div>
            </section>

            {/* Alerts */}
            <section className="space-y-6 sm:space-y-8">
                <SectionHeader title="Alerts & Notifications" subtitle="Semantic messaging components" />

                <div className="space-y-3 sm:space-y-4">
                    <AlertComponent
                        type="success"
                        title="Order Confirmed"
                        message="Your order #12345 has been confirmed and will ship within 24 hours."
                        icon={<Check className="w-4 h-4 sm:w-5 sm:h-5" />}
                    />
                    <AlertComponent
                        type="error"
                        title="Payment Failed"
                        message="There was an error processing your payment. Please try again or use a different payment method."
                        icon={<X className="w-4 h-4 sm:w-5 sm:h-5" />}
                    />
                    <AlertComponent
                        type="warning"
                        title="Low Stock Alert"
                        message="Only 3 items remaining in stock. Order soon to avoid missing out!"
                        icon={<AlertCircle className="w-4 h-4 sm:w-5 sm:h-5" />}
                    />
                    <AlertComponent
                        type="info"
                        title="New Collection"
                        message="Explore our latest winter collection with exclusive leather designs."
                        icon={<Info className="w-4 h-4 sm:w-5 sm:h-5" />}
                    />
                </div>
            </section>

            {/* Badges */}
            <section className="space-y-6 sm:space-y-8">
                <SectionHeader title="Badges & Labels" subtitle="Status indicators and tags" />

                <div className="space-y-4 sm:space-y-6">
                    <div className="space-y-3">
                        <h3 className="text-base sm:text-lg font-semibold text-text-primary">Product Badges</h3>
                        <div className="flex flex-wrap gap-2 sm:gap-3">
                            <span className="badge-new text-xs">New Arrival</span>
                            <span className="badge-sale text-xs">Sale -40%</span>
                            <span className="badge-limited text-xs">Limited Edition</span>
                            <span className="px-2.5 sm:px-3 py-1 bg-info text-info-foreground rounded-full text-xs font-semibold uppercase">
                                Best Seller
                            </span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h3 className="text-base sm:text-lg font-semibold text-text-primary">Status Badges</h3>
                        <div className="flex flex-wrap gap-2 sm:gap-3">
                            <span className="text-xs font-medium text-success px-2.5 sm:px-3 py-1.5 bg-success-subtle border border-success rounded-md">
                                In Stock
                            </span>
                            <span className="text-xs font-medium text-destructive px-2.5 sm:px-3 py-1.5 bg-destructive-subtle border border-destructive rounded-md">
                                Out of Stock
                            </span>
                            <span className="text-xs font-medium text-warning px-2.5 sm:px-3 py-1.5 bg-warning-subtle border border-warning rounded-md">
                                Low Stock
                            </span>
                            <span className="text-xs font-medium text-info px-2.5 sm:px-3 py-1.5 bg-info-subtle border border-info rounded-md">
                                Pre-Order
                            </span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h3 className="text-base sm:text-lg font-semibold text-text-primary">Size Badges (Interactive)</h3>
                        <div className="flex flex-wrap gap-2">
                            {['XS', 'S', 'M', 'L', 'XL', '2XL'].map((size) => (
                                <button
                                    key={size}
                                    className="px-3 sm:px-4 py-1.5 sm:py-2 border-2 border-border text-text-primary rounded-md hover:border-primary hover:text-primary transition-all font-medium text-sm"
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Rating Stars */}
            <section className="space-y-6 sm:space-y-8">
                <SectionHeader title="Rating Display" subtitle="Customer review ratings" />

                <div className="space-y-3 sm:space-y-4">
                    {[5, 4, 3, 2, 1].map((rating) => (
                        <div key={rating} className="flex items-center gap-3 sm:gap-4">
                            <div className="flex items-center gap-0.5">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                        key={star}
                                        className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors ${star <= Math.floor(rating)
                                            ? 'fill-rating-filled text-rating-filled'
                                            : star - 0.5 === rating
                                                ? 'fill-rating-filled text-rating-filled opacity-50'
                                                : 'fill-rating-empty text-rating-empty'
                                            }`}
                                    />
                                ))}
                            </div>
                            <span className="text-xs sm:text-sm text-text-secondary min-w-16 sm:min-w-24">{rating} stars</span>
                            <div className="flex-1 bg-muted rounded-full h-1.5 sm:h-2 max-w-xs">
                                <div
                                    className="bg-rating-filled h-1.5 sm:h-2 rounded-full transition-all"
                                    style={{ width: `${(rating / 5) * 100}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </>
    )
}

function ButtonShowcase({ title, description, variant }: {
    title: string;
    description: string;
    variant: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost' | 'destructive'
}) {
    const getButtonClass = () => {
        switch (variant) {
            case 'primary': return 'btn-primary';
            case 'secondary': return 'btn-secondary';
            case 'accent': return 'btn-accent';
            case 'outline': return 'btn-outline';
            case 'ghost': return 'btn-ghost';
            case 'destructive': return 'bg-destructive text-destructive-foreground hover:bg-destructive-hover active:bg-destructive-active px-4 sm:px-6 py-2 sm:py-3 rounded-md font-medium transition-all text-sm sm:text-base';
        }
    };

    return (
        <div className="card space-y-3 sm:space-y-4">
            <div>
                <h4 className="font-semibold text-text-primary mb-1 text-sm sm:text-base">{title}</h4>
                <p className="text-xs sm:text-sm text-text-secondary">{description}</p>
            </div>
            <div className="space-y-2 sm:space-y-3">
                <button className={`${getButtonClass()} w-full text-sm sm:text-base`}>Normal</button>
                <button className={`${getButtonClass()} w-full text-sm sm:text-base`} disabled>Disabled</button>
            </div>
            <p className="text-[10px] sm:text-xs text-text-tertiary">Hover and click to see states</p>
        </div>
    );
}