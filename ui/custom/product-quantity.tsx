'use client';

export interface QuantitySelectorProps {
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    className?: string;
}

const sizeClasses = {
    sm: 'h-9 sm:h-10',
    md: 'h-11 sm:h-12',
    lg: 'h-12 sm:h-14',
};

const buttonSizeClasses = {
    sm: 'w-9 sm:w-10 min-w-[44px] sm:min-w-0',
    md: 'w-11 sm:w-12 min-w-[44px] sm:min-w-0',
    lg: 'w-12 sm:w-14 min-w-[44px] sm:min-w-0',
};

const textSizeClasses = {
    sm: 'text-sm sm:text-base',
    md: 'text-base sm:text-lg',
    lg: 'text-lg sm:text-xl',
};

export default function QuantitySelector({
    value,
    onChange,
    min = 1,
    max = 99,
    size = 'md',
    disabled = false,
    className = '',
}: QuantitySelectorProps) {
    const handleDecrement = () => {
        if (value > min) {
            onChange(value - 1);
        }
    };

    const handleIncrement = () => {
        if (value < max) {
            onChange(value + 1);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = parseInt(e.target.value) || min;
        onChange(Math.min(Math.max(newValue, min), max));
    };

    return (
        <div
            className={`
                inline-flex items-center
                border-2 border-border rounded-lg
                bg-input-background
                ${sizeClasses[size]}
                ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                ${className}
            `}
        >
            <button
                type="button"
                onClick={handleDecrement}
                disabled={disabled || value <= min}
                className={`
                    ${buttonSizeClasses[size]} ${sizeClasses[size]}
                    flex items-center justify-center
                    text-text-primary
                    hover:bg-muted
                    disabled:opacity-50 disabled:cursor-not-allowed
                    transition-colors
                    rounded-l-md
                `}
                aria-label="Decrease quantity"
            >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
            </button>

            <input
                type="number"
                value={value}
                onChange={handleInputChange}
                disabled={disabled}
                min={min}
                max={max}
                className={`
                    w-12 sm:w-16 text-center
                    ${textSizeClasses[size]}
                    font-semibold
                    bg-transparent
                    text-text-primary
                    border-0 focus:outline-none
                    [appearance:textfield]
                    [&::-webkit-outer-spin-button]:appearance-none
                    [&::-webkit-inner-spin-button]:appearance-none
                `}
            />

            <button
                type="button"
                onClick={handleIncrement}
                disabled={disabled || value >= max}
                className={`
                    ${buttonSizeClasses[size]} ${sizeClasses[size]}
                    flex items-center justify-center
                    text-text-primary
                    hover:bg-muted
                    disabled:opacity-50 disabled:cursor-not-allowed
                    transition-colors
                    rounded-r-md
                `}
                aria-label="Increase quantity"
            >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
            </button>
        </div>
    );
}

export interface CompactQuantitySelectorProps extends QuantitySelectorProps {
    onRemove?: () => void;
}

export function CompactQuantitySelector({
    value,
    onChange,
    min = 1,
    max = 99,
    disabled = false,
    className = '',
}: CompactQuantitySelectorProps) {
    const handleDecrement = () => {
        if (value > min) {
            onChange(value - 1);
        }
    };

    const handleIncrement = () => {
        if (value < max) {
            onChange(value + 1);
        }
    };

    return (
        <div
            className={`
                inline-flex items-center gap-2 sm:gap-3
                ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                ${className}
            `}
        >
            <button
                type="button"
                onClick={handleDecrement}
                disabled={disabled || value <= min}
                className="
                    w-7 h-7 sm:w-8 sm:h-8
                    flex items-center justify-center
                    rounded-full
                    border-2 border-border
                    text-text-primary
                    hover:bg-muted
                    disabled:opacity-50 disabled:cursor-not-allowed
                    transition-all
                    active:scale-95
                "
                aria-label="Decrease quantity"
            >
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
            </button>

            <span className="text-sm sm:text-base font-semibold text-text-primary min-w-6 text-center">
                {value}
            </span>

            <button
                type="button"
                onClick={handleIncrement}
                disabled={disabled || value >= max}
                className="
                    w-7 h-7 sm:w-8 sm:h-8
                    flex items-center justify-center
                    rounded-full
                    border-2 border-border
                    text-text-primary
                    hover:bg-muted
                    disabled:opacity-50 disabled:cursor-not-allowed
                    transition-all
                    active:scale-95
                "
                aria-label="Increase quantity"
            >
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
            </button>
        </div>
    );
};