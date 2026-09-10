'use client';

import { Eye, EyeOff } from 'lucide-react';
import { useState, useId } from 'react';

export interface CustomInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
    label: string;
    error?: string;
    helperText?: string;
    variant?: 'default' | 'filled';
    inputSize?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
}

export default function CustomInput({
    label,
    type = 'text',
    helperText,
    variant = 'default',
    inputSize = 'md',
    fullWidth = false,
    className = '',
    error,
    disabled,
    value,
    defaultValue,
    ...props
}: CustomInputProps) {
    const id = useId();
    const inputId = props.id || id;
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [internalValue, setInternalValue] = useState(value || defaultValue || '');

    const isPassword = type === 'password';
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;
    const hasValue = value !== undefined ? String(value).length > 0 : String(internalValue).length > 0;
    const isFloating = isFocused || hasValue;

    const sizeClasses = {
        sm: 'h-11 text-sm',
        md: 'h-12 text-base',
        lg: 'h-14 text-lg',
    };

    const labelSizeClasses = {
        sm: { default: 'text-sm', floating: 'text-xs', top: 'top-3', floatingTop: 'top-1.5' },
        md: { default: 'text-base', floating: 'text-xs', top: 'top-3.5', floatingTop: 'top-2' },
        lg: { default: 'text-lg', floating: 'text-sm', top: 'top-4', floatingTop: 'top-2.5' },
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInternalValue(e.target.value);
        props.onChange?.(e);
    };

    return (
        <div className={`${fullWidth ? 'w-full' : 'w-auto'} ${className}`}>
            <div className="relative">
                <input
                    id={inputId}
                    type={inputType}
                    value={value}
                    defaultValue={defaultValue}
                    disabled={disabled}
                    onChange={handleChange}
                    onFocus={(e) => {
                        setIsFocused(true);
                        props.onFocus?.(e);
                    }}
                    onBlur={(e) => {
                        setIsFocused(false);
                        props.onBlur?.(e);
                    }}
                    className={`${sizeClasses[inputSize]}  ${fullWidth ? 'w-full' : 'w-auto'}  px-4 ${isPassword ? 'pr-12' : 'pr-4'} pt-5 pb-1  rounded-md border font-body transition-all duration-200 outline-none  ${variant === 'filled' ? 'bg-input-background' : 'bg-surface'}  ${error ? 'border-error focus:border-error focus:ring-2 focus:ring-error/20' : disabled ? 'border-input-disabled-border bg-input-disabled-background ursor-not-allowed text-input-disabled-text' : isFocused ? 'border-input-border-focus ring-2 ring-focus-ring/20' : 'border-input-border hover:border-input-border-hover'}  ${disabled ? 'text-input-disabled-text' : 'text-input-text'}`}
                    aria-invalid={error ? 'true' : 'false'}
                    aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
                    {...props}
                />

                {/* Floating Label */}
                <label
                    htmlFor={inputId}
                    className={`absolute left-4 pointer-events-none transition-all duration-200 font-body origin-left ${isFloating ? `${labelSizeClasses[inputSize].floating} ${labelSizeClasses[inputSize].floatingTop} scale-90` : `${labelSizeClasses[inputSize].default} ${labelSizeClasses[inputSize].top} scale-100`} ${error ? 'text-error' : disabled ? 'text-input-disabled-text' : isFloating ? 'text-primary' : 'text-input-placeholder'}`}
                >
                    {label}
                </label>

                {/* Password Toggle Button */}
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={disabled}
                        className={`absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded transition-all duration-200 ${disabled ? 'text-input-disabled-text cursor-not-allowed' : 'text-text-secondary hover:text-text-primary hover:bg-muted'}`}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        tabIndex={-1}
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                )}
            </div>

            {/* Error or Helper Text */}
            {(error || helperText) && (
                <p
                    id={error ? `${inputId}-error` : `${inputId}-helper`}
                    className={`mt-1.5 text-xs font-body transition-colors duration-200 ${error ? 'text-error' : 'text-text-secondary'}`}
                    role={error ? 'alert' : undefined}
                >
                    {error || helperText}
                </p>
            )}
        </div>
    );
}