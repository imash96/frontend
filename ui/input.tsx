'use client'

import { Eye, EyeOff } from 'lucide-react'
import { useState, useId, useRef } from 'react'

type InputProps = {
    label: string
    error?: string
    helperText?: string
    variant?: 'default' | 'filled'
    fullWidth?: boolean
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>

export default function Input({
    label,
    type = 'text',
    helperText,
    variant = 'default',
    fullWidth = false,
    className = '',
    required,
    error,
    disabled,
    readOnly,
    id,
    ...props
}: InputProps) {
    const generatedId = useId()
    const inputId = id ?? generatedId
    const inputRef = useRef<HTMLInputElement>(null)

    const [showPassword, setShowPassword] = useState(false)
    const isPassword = type === 'password'
    const inputType = isPassword ? showPassword ? 'text' : 'password' : type
    const isInactive = disabled || readOnly

    return (
        <div className={`${fullWidth ? 'w-full' : 'w-auto'} ${className}`}>
            <div className="relative">
                <input
                    id={inputId}
                    ref={inputRef}
                    type={inputType}
                    placeholder=" "
                    disabled={disabled}
                    readOnly={readOnly}
                    required={required}
                    aria-invalid={!!error}
                    aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
                    className={`peer block w-full px-2.5 pb-1 pt-5 text-sm rounded-md border ${variant === 'filled' ? 'bg-input-background' : 'bg-surface'}  ${isPassword ? 'pr-12' : ''} ${isInactive ? 'bg-input-disabled-background text-input-disabled-text border-input-disabled-border cursor-not-allowed' : ''} ${error ? 'border-error focus-visible:ring-error/20 focus-visible:border-error' : ''} ${!error && !isInactive ? 'border-input-border hover:border-input-border-hover focus-visible:border-input-border-focus' : ''}`}
                    {...props}
                />

                {/* Floating Label */}
                <label
                    htmlFor={inputId}
                    onClick={() => inputRef.current?.focus()}
                    className={`absolute text-sm duration-300 transform -translate-y-3 scale-75 top-3.5 z-9 origin-left inset-s-2.5 transition-all peer-focus:scale-75 peer-focus:-translate-y-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0  ${error && 'text-error'} ${isInactive ? 'text-input-disabled-text' : ''} ${!error && !isInactive ? 'text-input-placeholder peer-focus:text-primary' : ''}`}
                >
                    {label}
                    {required && <span className="text-destructive ml-1">*</span>}
                </label>

                {/* Password Toggle */}
                {isPassword && (
                    <button
                        type="button"
                        onClick={() =>
                            setShowPassword((prev) => !prev)
                        }
                        disabled={disabled}
                        className={`absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-focus-ring focus:ring-offset-2 focus:ring-offset-background ${disabled ? 'text-input-disabled-text cursor-not-allowed' : 'text-text-secondary hover:text-text-primary hover:bg-muted'}`}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                        {showPassword ? (
                            <EyeOff className="h-5 w-5" />
                        ) : (
                            <Eye className="h-5 w-5" />
                        )}
                    </button>
                )}
            </div>

            {/* Helper / Error */}
            {(error || helperText) && (
                <p
                    id={error ? `${inputId}-error` : `${inputId}-helper`}
                    className={`mt-1.5 text-xs font-body ${error ? 'text-error' : 'text-text-secondary'}`}
                    role={error ? 'alert' : undefined}
                >
                    {error ?? helperText}
                </p>
            )}
        </div>
    )
}
