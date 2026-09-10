'use client';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: 'default' | 'new' | 'sale' | 'limited' | 'success' | 'error' | 'warning' | 'info' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    dot?: boolean;
}

const variantClasses = {
    default: 'bg-muted text-text-primary',
    new: 'bg-badge-new text-badge-new-foreground',
    sale: 'bg-badge-sale text-badge-sale-foreground',
    limited: 'bg-badge-limited text-badge-limited-foreground',
    success: 'bg-success text-success-foreground',
    error: 'bg-error text-error-foreground',
    warning: 'bg-warning text-warning-foreground',
    info: 'bg-info text-info-foreground',
    outline: 'bg-transparent border-2 border-border text-text-primary',
};

const sizeClasses = {
    sm: 'px-1.5 py-0.5 text-xs',
    md: 'px-2 py-1 text-xs sm:text-sm',
    lg: 'px-3 py-1.5 text-sm sm:text-base',
};

export default function Badge({ variant = 'default', size = 'md', dot = false, className = '', children, ...props }: BadgeProps) {

    return (
        <span className={` inline-flex items-center gap-1.5 font-medium rounded-full ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
            {...props}
        >
            {dot && (
                <span className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${variant === 'outline' ? 'bg-text-primary' : 'bg-current'}`} />
            )}
            {children}
        </span>
    );
};

// Notification Badge (for cart count, etc.)
export interface NotificationBadgeProps {
    count: number;
    max?: number;
    showZero?: boolean;
    size?: 'sm' | 'md';
    variant?: 'default' | 'error' | 'success';
    position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
    className?: string;
}

export const NotificationBadge: React.FC<NotificationBadgeProps> = ({
    count,
    max = 99,
    showZero = false,
    variant = 'error',
    position = 'top-right',
    size = 'md',
    className = ''
}) => {
    if (count === 0 && !showZero) return null;

    const displayCount = count > max ? `${max}+` : count;

    const variantClasses = {
        default: 'bg-primary text-primary-foreground',
        error: 'bg-error text-error-foreground',
        success: 'bg-success text-success-foreground',
    };

    const positionClasses = {
        'top-right': 'top-0 right-0 translate-x-1/2 -translate-y-1/2',
        'top-left': 'top-0 left-0 -translate-x-1/2 -translate-y-1/2',
        'bottom-right': 'bottom-0 right-0 translate-x-1/2 translate-y-1/2',
        'bottom-left': 'bottom-0 left-0 -translate-x-1/2 translate-y-1/2',
    };

    return (
        <span
            className={`absolute inline-flex items-center justify-center min-w-4.5 min-h-4.5 sm:min-w-5 sm:min-h-5 ${size === 'sm' ? 'text-2xs' : 'text-xs'} px-1 font-bold rounded-full ${variantClasses[variant]} ${positionClasses[position]} ${className}`}
        >
            {displayCount}
        </span>
    );
};

// Status Badge (for order status, stock status, etc.)
export interface StatusBadgeProps {
    status: 'in-stock' | 'low-stock' | 'out-of-stock' | 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    dot?: boolean;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

const statusConfig = {
    'in-stock': { label: 'In Stock', variant: 'success' as const },
    'low-stock': { label: 'Low Stock', variant: 'warning' as const },
    'out-of-stock': { label: 'Out of Stock', variant: 'error' as const },
    pending: { label: 'Pending', variant: 'warning' as const },
    processing: { label: 'Processing', variant: 'info' as const },
    shipped: { label: 'Shipped', variant: 'info' as const },
    delivered: { label: 'Delivered', variant: 'success' as const },
    cancelled: { label: 'Cancelled', variant: 'error' as const },
};

export const StatusBadge = ({
    status,
    dot = false,
    size = 'md',
    className = '',
}: StatusBadgeProps) => {
    const config = statusConfig[status];

    return (
        <Badge variant={config.variant} size={size} dot={dot} className={className}>
            {config.label}
        </Badge>
    );
};

// Size Badge (for clothing sizes)
export interface SizeBadgeProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    size: string;
    selected?: boolean;
    disabled?: boolean;
}

export const SizeBadge: React.FC<SizeBadgeProps> = ({
    size: sizeLabel,
    selected = false,
    disabled = false,
    className = '',
    ...props
}) => {
    return (
        <button
            type="button"
            disabled={disabled}
            className={`
                min-w-10 min-h-10 sm:min-w-9 sm:min-h-9 px-2 sm:px-3
                border-2 rounded-lg
                font-semibold text-xs sm:text-sm
                transition-all duration-200
                ${selected
                    ? 'border-primary bg-primary text-primary-foreground'
                    : disabled
                        ? 'border-border-subtle bg-input-disabled-background text-text-disabled cursor-not-allowed'
                        : 'border-border bg-transparent text-text-primary hover:border-primary hover:bg-primary-subtle'
                }
                ${!disabled && 'active:scale-95'}
                ${className}
            `}
            {...props}
        >
            {sizeLabel}
        </button>
    );
};

// Color Badge (for color selection)
export interface ColorBadgeProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    color: string;
    colorName?: string;
    selected?: boolean;
    disabled?: boolean;
}

export const ColorBadge: React.FC<ColorBadgeProps> = ({
    color,
    colorName,
    selected = false,
    disabled = false,
    className = '',
    ...props
}) => {
    return (
        <button
            type="button"
            disabled={disabled}
            className={`
                relative w-10 h-10 sm:w-11 sm:h-11 rounded-full
                border-2 transition-all duration-200
                ${selected
                    ? 'border-primary ring-4 ring-primary/20'
                    : disabled
                        ? 'border-border-subtle opacity-40 cursor-not-allowed'
                        : 'border-border hover:border-primary'
                }
                ${!disabled && 'active:scale-95'}
                ${className}
            `}
            title={colorName}
            aria-label={colorName}
            {...props}
        >
            <span
                className="absolute inset-1 rounded-full"
                style={{ backgroundColor: color }}
            />
            {selected && (
                <svg
                    className="absolute inset-0 m-auto w-4 h-4 sm:w-5 sm:h-5 text-white drop-shadow-lg"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    viewBox="0 0 24 24"
                >
                    <polyline points="20 6 9 17 4 12" />
                </svg>
            )}
        </button>
    );
};