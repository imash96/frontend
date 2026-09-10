'use client';

export interface PriceProps {
    amount: number;
    currency?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
}

const sizeClasses = {
    sm: 'text-sm sm:text-base',
    md: 'text-base sm:text-lg',
    lg: 'text-lg sm:text-xl',
    xl: 'text-xl sm:text-2xl',
};

export function Price({
    amount,
    currency = '$',
    size = 'md',
    className = '',
}: PriceProps) {
    return (
        <span className={`font-bold text-price-current ${sizeClasses[size]} ${className}`}>
            {currency}{amount.toFixed(2)}
        </span>
    );
}

export interface PriceRangeProps {
    minPrice: number;
    maxPrice: number;
    currency?: string;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export function PriceRange({
    minPrice,
    maxPrice,
    currency = '$',
    size = 'md',
    className = '',
}: PriceRangeProps) {
    return (
        <div className={`flex items-center gap-1 ${className}`}>
            <span className={`font-bold text-price-current ${sizeClasses[size]}`}>
                {currency}{minPrice.toFixed(2)}
            </span>
            <span className={`text-text-secondary ${sizeClasses[size]}`}>-</span>
            <span className={`font-bold text-price-current ${sizeClasses[size]}`}>
                {currency}{maxPrice.toFixed(2)}
            </span>
        </div>
    );
}

export interface PriceWithDiscountProps {
    originalPrice: number;
    salePrice: number;
    currency?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    showPercentage?: boolean;
    layout?: 'horizontal' | 'vertical';
    className?: string;
}

export function PriceWithDiscount({
    originalPrice,
    salePrice,
    currency = '$',
    size = 'md',
    showPercentage = true,
    layout = 'horizontal',
    className = '',
}: PriceWithDiscountProps) {
    const discount = Math.round(((originalPrice - salePrice) / originalPrice) * 100);

    return (
        <div
            className={`
                flex items-center
                ${layout === 'vertical' ? 'flex-col items-start gap-1' : 'gap-2 sm:gap-3'}
                ${className}
            `}
        >
            <span className={`font-bold text-price-sale ${sizeClasses[size]}`}>
                {currency}{salePrice.toFixed(2)}
            </span>
            <span className={`text-price-original line-through ${size === 'sm' ? 'text-xs sm:text-sm' : size === 'lg' ? 'text-base sm:text-lg' : size === 'xl' ? 'text-lg sm:text-xl' : 'text-sm sm:text-base'}`}>
                {currency}{originalPrice.toFixed(2)}
            </span>
            {showPercentage && (
                <span className="inline-flex items-center px-1.5 py-0.5 sm:px-2 sm:py-1 bg-price-save text-error-foreground rounded text-xs font-bold">
                    -{discount}%
                </span>
            )}
        </div>
    );
}

export interface InstallmentPriceProps {
    totalPrice: number;
    installments: number;
    currency?: string;
    size?: 'sm' | 'md';
    className?: string;
}

export function InstallmentPrice({
    totalPrice,
    installments,
    currency = '$',
    size = 'md',
    className = '',
}: InstallmentPriceProps) {
    const monthlyPrice = totalPrice / installments;

    return (
        <div className={`${className}`}>
            <div className={`flex items-baseline gap-1 ${size === 'sm' ? 'text-xs sm:text-sm' : 'text-sm sm:text-base'}`}>
                <span className="text-text-secondary">or</span>
                <span className="font-bold text-text-primary">{installments}x</span>
                <span className="font-bold text-price-current">
                    {currency}{monthlyPrice.toFixed(2)}
                </span>
            </div>
            <p className={`text-text-tertiary ${size === 'sm' ? 'text-[10px] sm:text-xs' : 'text-xs'}`}>
                Interest-free monthly payments
            </p>
        </div>
    );
}

export interface SavingsDisplayProps {
    originalPrice: number;
    salePrice: number;
    currency?: string;
    variant?: 'amount' | 'percentage' | 'both';
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export function SavingsDisplay({
    originalPrice,
    salePrice,
    currency = '$',
    variant = 'both',
    size = 'md',
    className = '',
}: SavingsDisplayProps) {
    const savings = originalPrice - salePrice;
    const percentage = Math.round((savings / originalPrice) * 100);

    return (
        <div
            className={`
                inline-flex items-center gap-1.5 px-2 py-1 sm:px-3 sm:py-1.5
                bg-success-subtle text-success rounded-lg
                ${size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-base' : 'text-xs sm:text-sm'}
                font-semibold
                ${className}
            `}
        >
            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>
                {variant === 'amount' && `Save ${currency}${savings.toFixed(2)}`}
                {variant === 'percentage' && `Save ${percentage}%`}
                {variant === 'both' && `Save ${currency}${savings.toFixed(2)} (${percentage}%)`}
            </span>
        </div>
    );
}

export default Price;