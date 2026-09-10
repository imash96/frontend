'use client';

import Image from 'next/image';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'outlined' | 'elevated' | 'ghost';
    padding?: 'none' | 'sm' | 'md' | 'lg';
    hoverable?: boolean;
    children: React.ReactNode;
}

const variantClasses = {
    default: 'bg-card border border-card-border',
    outlined: 'bg-card border-2 border-border',
    elevated: 'bg-card shadow-lg',
    ghost: 'bg-transparent',
};

const paddingClasses = {
    none: '',
    sm: 'p-3 sm:p-4',
    md: 'p-4 sm:p-6',
    lg: 'p-6 sm:p-8',
};

export default function Card({
    variant = 'default',
    padding = 'md',
    hoverable = false,
    children,
    className = '',
    ...props
}: CardProps) {
    return (
        <div
            className={`
                rounded-lg transition-all duration-300
                ${variantClasses[variant]}
                ${paddingClasses[padding]}
                ${hoverable ? 'hover:shadow-xl hover:-translate-y-1 cursor-pointer' : ''}
                ${className}
            `}
            {...props}
        >
            {children}
        </div>
    );
}

// Card Sub-components
export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

export function CardHeader({ children, className = '', ...props }: CardHeaderProps) {
    return (
        <div className={`mb-3 sm:mb-4 ${className}`} {...props}>
            {children}
        </div>
    );
}

export function CardTitle({ children, className = '', ...props }: CardHeaderProps) {
    return (
        <h3 className={`text-lg sm:text-xl font-semibold text-text-primary ${className}`} {...props}>
            {children}
        </h3>
    );
}

export function CardDescription({ children, className = '', ...props }: CardHeaderProps) {
    return (
        <p className={`text-xs sm:text-sm text-text-secondary mt-1 sm:mt-1.5 ${className}`} {...props}>
            {children}
        </p>
    );
}

export function CardContent({ children, className = '', ...props }: CardHeaderProps) {
    return (
        <div className={`${className}`} {...props}>
            {children}
        </div>
    );
}

export function CardFooter({ children, className = '', ...props }: CardHeaderProps) {
    return (
        <div className={`mt-3 sm:mt-4 ${className}`} {...props}>
            {children}
        </div>
    );
}

// Product Card Component
export interface ProductCardProps {
    image: string;
    width: number;
    imageAlt: string;
    title: string;
    price: number;
    originalPrice?: number;
    badge?: string;
    badgeVariant?: 'new' | 'sale' | 'limited';
    rating?: number;
    onCardClick?: () => void;
    onAddToCart?: () => void;
    className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
    image,
    width,
    imageAlt,
    title,
    price,
    originalPrice,
    badge,
    badgeVariant = 'new',
    rating,
    onCardClick,
    onAddToCart,
    className = '',
}) => {
    const badgeColors = {
        new: 'bg-badge-new text-badge-new-foreground',
        sale: 'bg-badge-sale text-badge-sale-foreground',
        limited: 'bg-badge-limited text-badge-limited-foreground',
    };

    const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

    return (
        <Card hoverable padding="none" className={className}>
            {/* Image Container */}
            <div className="relative aspect-3/4 overflow-hidden rounded-t-lg bg-muted group" onClick={onCardClick}>
                <Image
                    src={image}
                    alt={imageAlt}
                    width={width}
                    height={700}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Badge */}
                {badge && (
                    <div className="absolute top-2 left-2 sm:top-3 sm:left-3">
                        <span className={`px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-semibold ${badgeColors[badgeVariant]}`}>
                            {badge}
                        </span>
                    </div>
                )}

                {/* Discount Badge */}
                {discount > 0 && (
                    <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
                        <span className="bg-error text-error-foreground px-2 py-1 rounded text-xs font-bold">
                            -{discount}%
                        </span>
                    </div>
                )}

                {/* Quick Add Button (appears on hover - desktop only) */}
                {onAddToCart && (
                    <div className="hidden sm:block absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onAddToCart();
                            }}
                            className="w-full bg-button-primary text-button-primary-foreground py-2 rounded-lg font-semibold hover:bg-button-primary-hover transition-colors min-h-11"
                        >
                            Add to Cart
                        </button>
                    </div>
                )}
            </div>

            {/* Card Content */}
            <div className="p-3 sm:p-4">
                <h3
                    className="font-display font-semibold text-sm sm:text-base text-text-primary mb-2 line-clamp-2 cursor-pointer hover:text-primary transition-colors"
                    onClick={onCardClick}
                >
                    {title}
                </h3>

                {/* Rating */}
                {rating !== undefined && (
                    <div className="flex items-center gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                            <svg
                                key={i}
                                className={`w-3 h-3 sm:w-4 sm:h-4 ${i < rating ? 'text-rating-filled fill-rating-filled' : 'text-rating-empty'}`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                        ))}
                    </div>
                )}

                {/* Price */}
                <div className="flex items-center gap-2">
                    <span className="text-base sm:text-lg font-bold text-price-current">
                        ${price.toFixed(2)}
                    </span>
                    {originalPrice && (
                        <span className="text-xs sm:text-sm text-price-original line-through">
                            ${originalPrice.toFixed(2)}
                        </span>
                    )}
                </div>

                {/* Mobile Add to Cart Button */}
                {onAddToCart && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onAddToCart();
                        }}
                        className="sm:hidden w-full mt-3 bg-button-primary text-button-primary-foreground py-2 rounded-lg font-semibold active:scale-[0.98] transition-transform min-h-11"
                    >
                        Add to Cart
                    </button>
                )}
            </div>
        </Card>
    );
};