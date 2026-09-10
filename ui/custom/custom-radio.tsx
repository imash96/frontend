'use client';

import React, { useId, useState } from 'react';

export interface CustomRadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
    label: string;
    description?: string;
    error?: boolean;
    radioSize?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
    sm: {
        radio: 'w-4 h-4',
        dot: 'w-1.5 h-1.5',
        label: 'text-sm',
        description: 'text-xs',
    },
    md: {
        radio: 'w-5 h-5',
        dot: 'w-2 h-2',
        label: 'text-base',
        description: 'text-sm',
    },
    lg: {
        radio: 'w-6 h-6',
        dot: 'w-2.5 h-2.5',
        label: 'text-lg',
        description: 'text-base',
    },
};

const RadioDot = ({ size, checked, disabled }: { size: string; checked?: boolean; disabled?: boolean }) => (
    <span
        className={`${size} rounded-full bg-primary transition-all ${checked ? 'scale-100 opacity-100' : 'scale-0 opacity-0'} ${disabled && 'bg-text-disabled'}`}
    />
);

export default function CustomRadio({
    label,
    description,
    error,
    radioSize = 'md',
    className = '',
    disabled,
    checked,
    ...props
}: CustomRadioProps) {
    const id = useId();
    const radioId = props.id || id;

    return (
        <div className={`flex items-start ${className}`}>
            <div className="flex items-center h-6">
                {/* Hidden native radio input */}
                <input
                    type="radio"
                    id={radioId}
                    disabled={disabled}
                    checked={checked}
                    className="sr-only peer"
                    {...props}
                />

                {/* Custom Radio Button */}
                <label
                    htmlFor={radioId}
                    className={`${sizeClasses[radioSize].radio} relative flex items-center justify-center rounded-full border-2 transition-all cursor-pointer ${disabled ? 'border-border-subtle bg-input-disabled-background cursor-not-allowed' : error ? 'border-error' : 'border-border'} peer-checked:border-primary peer-checked:bg-primary-subtle peer-focus-visible:ring-4 peer-focus-visible:ring-focus-ring/20 peer-disabled:border-border-subtle peer-disabled:bg-input-disabled-background peer-disabled:cursor-not-allowed ${!disabled && !error && 'hover:border-primary hover:bg-primary-subtle/50'}`}
                >
                    {/* Inner dot */}
                    <RadioDot size={sizeClasses[radioSize].dot} checked={checked} disabled={disabled} />
                </label>
            </div>

            {/* Label and Description */}
            <div className="ml-3 flex-1">
                <label
                    htmlFor={radioId}
                    className={`${sizeClasses[radioSize].label} font-body font-medium block cursor-pointer transition-colors ${disabled ? 'text-text-disabled cursor-not-allowed' : error ? 'text-error' : 'text-text-primary'} ${!disabled && 'hover:text-primary'}`}
                >
                    {label}
                </label>

                {description && (
                    <p className={`${sizeClasses[radioSize].description} mt-0.5 font-body transition-colors ${disabled ? 'text-text-disabled' : 'text-text-secondary'}`}>
                        {description}
                    </p>
                )}
            </div>
        </div>
    );
}

// RadioGroup Component with proper TypeScript typing
export interface RadioGroupProps {
    name: string;
    value?: string;
    onChange?: (value: string) => void;
    children: React.ReactNode;
    layout?: 'vertical' | 'horizontal';
    label?: string;
    error?: string;
    className?: string;
}

const layoutClasses = {
    vertical: 'flex flex-col gap-3',
    horizontal: 'flex flex-row flex-wrap gap-4',
};

export const RadioGroup: React.FC<RadioGroupProps> = ({
    name,
    value,
    onChange,
    children,
    layout = 'vertical',
    label,
    error,
    className = '',
}) => {
    const [internalValue, setInternalValue] = useState(value);

    const handleChange = (newValue: string) => {
        setInternalValue(newValue);
        onChange?.(newValue);
    };

    // Clone children and inject name, checked, and onChange props with proper typing
    const radioButtons = React.Children.map(children, (child) => {
        // Type guard to check if child is a valid React element
        if (React.isValidElement(child)) {
            // Extract props safely with proper typing
            const childProps = child.props as { value?: string };
            const radioValue = childProps.value;

            if (radioValue !== undefined) {
                // Clone element with injected props
                return React.cloneElement(
                    child as React.ReactElement<CustomRadioProps>,
                    {
                        name,
                        checked: (value !== undefined ? value : internalValue) === radioValue,
                        onChange: () => handleChange(radioValue),
                        error: !!error,
                    }
                );
            }
        }
        return child;
    });

    return (
        <div className={className}>
            {label && (
                <label className="block text-sm font-medium text-text-primary mb-2">
                    {label}
                </label>
            )}
            <div className={layoutClasses[layout]} role="radiogroup">
                {radioButtons}
            </div>
            {error && (
                <p className="mt-1.5 text-xs text-error" role="alert">
                    {error}
                </p>
            )}
        </div>
    );
};