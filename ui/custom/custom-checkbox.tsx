'use client';

import { useEffect, useId, useRef } from 'react';

export interface CustomCheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
    label: string;
    description?: string;
    error?: boolean;
    checkboxSize?: 'sm' | 'md' | 'lg';
    indeterminate?: boolean;
}

const sizeClasses = {
    sm: {
        checkbox: 'w-4 h-4',
        label: 'text-xs sm:text-sm',
        description: 'text-xs',
        icon: 'w-3 h-3',
    },
    md: {
        checkbox: 'w-5 h-5',
        label: 'text-sm sm:text-base',
        description: 'text-xs sm:text-sm',
        icon: 'w-3.5 h-3.5',
    },
    lg: {
        checkbox: 'w-6 h-6',
        label: 'text-base sm:text-lg',
        description: 'text-sm sm:text-base',
        icon: 'w-4 h-4',
    },
};

const CheckIcon = ({ size, checked, disabled }: { size: string; checked?: boolean; disabled?: boolean }) => (
    <svg
        className={`${size} text-primary-foreground transition-all absolute ${checked ? 'scale-100 opacity-100' : 'scale-0 opacity-0'} ${disabled && 'text-text-disabled'}`}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
    >
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

const IndeterminateIcon = ({ size, indeterminate, disabled }: { size: string; indeterminate?: boolean; disabled?: boolean }) => (
    <svg
        className={`${size} text-primary-foreground transition-all absolute ${indeterminate ? 'scale-100 opacity-100' : 'scale-0 opacity-0'} ${disabled && 'text-text-disabled'}`}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
    >
        <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);

export default function CustomCheckbox({
    label,
    description,
    error,
    checkboxSize = 'md',
    indeterminate = false,
    className = '',
    disabled,
    checked,
    ...props
}: CustomCheckboxProps) {
    const id = useId();
    const checkboxId = props.id || id;
    const inputRef = useRef<HTMLInputElement>(null);

    // Set indeterminate state
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.indeterminate = indeterminate;
        }
    }, [indeterminate]);

    return (
        <div className={`flex items-start ${className}`}>
            <div className="flex items-center min-h-11 sm:min-h-6">
                {/* Hidden native checkbox input */}
                <input
                    ref={inputRef}
                    type="checkbox"
                    id={checkboxId}
                    disabled={disabled}
                    checked={checked}
                    className="sr-only peer"
                    {...props}
                />

                {/* Custom Checkbox */}
                <label
                    htmlFor={checkboxId}
                    className={`${sizeClasses[checkboxSize].checkbox} relative flex items-center justify-center rounded border-2 transition-all cursor-pointer ${disabled ? 'border-border-subtle bg-input-disabled-background cursor-not-allowed' : error ? 'border-error' : 'border-border'} peer-checked:border-primary peer-checked:bg-primary peer-focus-visible:ring-4 peer-focus-visible:ring-focus-ring/20 peer-disabled:border-border-subtle peer-disabled:bg-input-disabled-background peer-disabled:cursor-not-allowed ${!disabled && !error && 'hover:border-primary hover:bg-primary-subtle'}`}
                >
                    <CheckIcon size={sizeClasses[checkboxSize].icon} checked={checked && !indeterminate} disabled={disabled} />
                    <IndeterminateIcon size={sizeClasses[checkboxSize].icon} indeterminate={indeterminate} disabled={disabled} />
                </label>
            </div>

            {/* Label and Description */}
            <div className="ml-2 sm:ml-3 flex-1">
                <label
                    htmlFor={checkboxId}
                    className={`${sizeClasses[checkboxSize].label} font-body font-medium block cursor-pointer transition-colors ${disabled ? 'text-text-disabled cursor-not-allowed' : error ? 'text-error' : 'text-text-primary'}`}
                >
                    {label}
                </label>
                {description && (
                    <p className={`${sizeClasses[checkboxSize].description} text-text-secondary mt-0.5 sm:mt-1`}>
                        {description}
                    </p>
                )}
            </div>
        </div>
    );
}

// CheckboxGroup Component
export interface CheckboxGroupProps {
    value?: string[];
    onChange?: (value: string[]) => void;
    layout?: 'vertical' | 'horizontal';
    children: React.ReactNode;
    className?: string;
}

export function CheckboxGroup({
    value = [],
    onChange,
    layout = 'vertical',
    children,
    className = '',
}: CheckboxGroupProps) {
    const handleChange = (checkboxValue: string, checked: boolean) => {
        if (!onChange) return;

        const newValue = checked
            ? [...value, checkboxValue]
            : value.filter((v) => v !== checkboxValue);

        onChange(newValue);
    };

    return (
        <div
            className={`
                ${layout === 'horizontal' ? 'flex flex-wrap gap-3 sm:gap-4' : 'space-y-3 sm:space-y-4'}
                ${className}
            `}
        >
            {Array.isArray(children) ? (
                children.map((child: any) => {
                    if (!child?.props?.value) return child;

                    return {
                        ...child,
                        props: {
                            ...child.props,
                            checked: value.includes(child.props.value),
                            onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                                handleChange(child.props.value, e.target.checked);
                                child.props.onChange?.(e);
                            },
                        },
                    };
                })
            ) : (
                children
            )}
        </div>
    );
}