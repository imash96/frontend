'use client';

import { useState } from 'react';

export interface ChipProps {
    label: string;
    variant?: 'default' | 'primary' | 'success' | 'error' | 'warning' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    onRemove?: () => void;
    icon?: React.ReactNode;
    avatar?: React.ReactNode;
    className?: string;
    clickable?: boolean
    onClick?: () => void;
}

const variantClasses = {
    default: 'bg-muted text-text-primary hover:bg-muted-hover',
    primary: 'bg-primary-subtle text-primary hover:bg-primary-subtle',
    success: 'bg-success-subtle text-success',
    error: 'bg-error-subtle text-error',
    warning: 'bg-warning-subtle text-warning',
    outline: 'bg-transparent border-2 border-border text-text-primary hover:bg-muted',
};

const sizeClasses = {
    sm: 'h-6 sm:h-7 px-2 sm:px-2.5 text-xs gap-1',
    md: 'h-8 sm:h-9 px-2.5 sm:px-3 text-xs sm:text-sm gap-1.5',
    lg: 'h-10 sm:h-11 px-3 sm:px-4 text-sm sm:text-base gap-2',
};

export const Chip = ({
    label,
    onRemove,
    variant = 'default',
    size = 'md',
    icon,
    avatar,
    clickable,
    onClick,
    className = '',
    ...props
}: ChipProps) => {

    return (
        <div
            className={`
                    inline-flex items-center
                    rounded-full border
                    font-medium
                    transition-all
                    ${variantClasses[variant]}
                    ${sizeClasses[size]}
                    ${clickable || onClick ? 'cursor-pointer hover:opacity-80' : ''}
                    ${className}
                `}
            onClick={onClick}
            {...props}
        >
            {/* Avatar */}
            {avatar && <span className="shrink-0">{avatar}</span>}

            {/* Icon */}
            {icon && <span className="shrink-0">{icon}</span>}

            {/* Label */}
            <span className="truncate">{label}</span>

            {/* Remove Button */}
            {onRemove && (
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        onRemove();
                    }}
                    className={`
                            rounded-full
                            hover:bg-black/10 transition-colors
                            ${size === 'sm' ? 'w-3 h-3 -mr-1' : size === 'md' ? 'w-4 h-4 -mr-1' : 'w-5 h-5 -mr-1.5'}
                        `}
                    aria-label="Remove"
                >
                    <svg className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>
            )}
        </div>
    );
};

// Filter Chip (for product filtering)
export interface FilterChipProps extends React.HTMLAttributes<HTMLButtonElement> {
    label: string;
    onRemove?: () => void;
    size?: 'sm' | 'md' | 'lg';
    icon?: React.ReactNode;
    avatar?: string;
    clickable?: boolean;
    active?: boolean;
    count?: number;
}

export function FilterChip({
    label,
    active = false,
    count,
    onClick,
    className = '',
    ...props
}: FilterChipProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`
                inline-flex items-center gap-1.5 sm:gap-2
                h-10 px-4 rounded-full font-medium
                transition-all duration-200
                active:scale-95
                ${active ? 'bg-primary text-primary-foreground hover:bg-primary-hover' : 'border-border border-2 bg-transparent text-text-primary hover:bg-muted'}
                ${className}
            `}
            {...props}
        >
            <span className="truncate">{label}</span>
            {count !== undefined && (
                <span className={`
                    text-xs px-1.5 py-0.5 rounded-full
                    ${active ? 'bg-primary-foreground/20' : 'bg-muted'}
                `}>
                    {count}
                </span>
            )}
        </button>
    );
};

// Tag Input (for adding multiple tags)
export interface TagInputProps {
    tags: string[];
    onAdd?: (tag: string) => void;
    onRemove?: (index: number) => void;
    placeholder?: string;
    maxTags?: number;
    className?: string;
    size?: 'sm' | 'md' | 'lg';
}

export const TagInput: React.FC<TagInputProps> = ({
    tags,
    onAdd,
    onRemove,
    placeholder = 'Add tag...',
    maxTags,
    size = 'sm',
    className = '',
}) => {
    const [inputValue, setInputValue] = useState('');

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && inputValue.trim()) {
            e.preventDefault();
            if (!maxTags || tags.length < maxTags) {
                onAdd?.(inputValue.trim());
                setInputValue('');
            }
        } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
            onRemove?.(tags.length - 1);
        }
    };

    return (
        <div
            className={`
                flex flex-wrap items-center gap-1.5 sm:gap-2
                p-2 sm:p-2.5 rounded-lg
                border-2 border-input-border
                bg-input-background
                focus-within:border-input-border-focus
                focus-within:ring-4 focus-within:ring-input-focus/20
                transition-all
                ${className}
            `}
        >
            {tags.map((tag, index) => (
                <Chip
                    key={index}
                    label={tag}
                    size={size}
                    onRemove={() => onRemove?.(index)}
                    variant="primary"
                />
            ))}

            {(!maxTags || tags.length < maxTags) && (
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={tags.length === 0 ? placeholder : ''}
                    disabled={maxTags ? tags.length >= maxTags : false}
                    className={`
                    flex-1 min-w-30 outline-none bg-transparent
                    text-input-text placeholder:text-input-placeholder
                    disabled:cursor-not-allowed disabled:opacity-50
                    ${size === 'sm' ? 'text-xs sm:text-sm min-h-8' : size === 'lg' ? 'text-base min-h-10' : 'text-sm sm:text-base min-h-9'}
                `}
                />
            )}
        </div>
    );
};

// Category Tag (for product categories)
export interface CategoryTagProps {
    category: string;
    onClick?: () => void;
    icon?: React.ReactNode;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export function CategoryTag({
    category,
    onClick,
    icon,
    size = 'md',
    className = '',
}: CategoryTagProps) {
    const Component = onClick ? 'button' : 'span';

    return (
        <Component
            type={onClick ? 'button' : undefined}
            onClick={onClick}
            className={`
                inline-flex items-center gap-1.5
                font-medium rounded-lg
                ${variantClasses.outline}
                ${sizeClasses[size]}
                ${onClick ? 'cursor-pointer active:scale-95' : ''}
                ${className}
            `}
        >
            {icon && <span className="shrink-0">{icon}</span>}
            <span className="truncate">{category}</span>
        </Component>
    );
}