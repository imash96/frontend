'use client'

import { useId, type TextareaHTMLAttributes } from 'react'

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label: string
    error?: string
    helperText?: string
    variant?: 'default' | 'filled'
    fullWidth?: boolean
    resize?: 'none' | 'vertical' | 'horizontal' | 'both'
}

const resizeClasses = {
    none: 'resize-none',
    vertical: 'resize-y',
    horizontal: 'resize-x',
    both: 'resize',
} as const

export default function Textarea({
    label,
    helperText,
    error,
    variant = 'default',
    fullWidth = false,
    resize = 'vertical',
    className = '',
    rows = 4,
    placeholder,
    required,
    disabled,
    readOnly,
    id,
    ...props
}: TextareaProps) {
    const generatedId = useId()
    const textareaId = id ?? generatedId
    const isInactive = disabled || readOnly

    // Exactly one background / border / label colour per state, so utility classes never fight each other
    const surface = isInactive ? 'bg-input-disabled-background' : variant === 'filled' ? 'bg-input-background' : 'bg-surface'
    const fieldState = isInactive ? 'text-input-disabled-text border-input-disabled-border cursor-not-allowed' : error ? 'border-error focus-visible:ring-error/20 focus-visible:border-error' : 'border-input-border hover:border-input-border-hover focus-visible:border-input-border-focus'
    const labelColor = isInactive ? 'text-input-disabled-text' : error ? 'text-error' : 'text-input-placeholder peer-focus:text-primary'

    return (
        <div className={`${fullWidth ? 'w-full' : 'w-auto'} ${className}`}>
            <div className="relative">
                <textarea
                    id={textareaId}
                    rows={rows}
                    placeholder={placeholder ?? ' '}
                    disabled={disabled}
                    readOnly={readOnly}
                    required={required}
                    aria-invalid={!!error}
                    aria-describedby={error ? `${textareaId}-error` : helperText ? `${textareaId}-helper` : undefined}
                    className={`peer block w-full max-w-full px-2.5 pb-2 pt-5 text-sm rounded-md border placeholder:text-transparent focus:placeholder:text-input-placeholder ${resizeClasses[resize]} ${surface} ${fieldState}`}
                    {...props}
                />

                {/* Floating Label */}
                <label
                    htmlFor={textareaId}
                    className={`pointer-events-none absolute top-3.5 z-9 origin-left inset-s-2.5 -translate-y-3 scale-75 text-sm transition-all duration-300 motion-reduce:transition-none peer-focus:-translate-y-3 peer-focus:scale-75 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 ${surface} ${labelColor}`}
                >
                    {label}
                    {required && (
                        <span aria-hidden="true" className="text-destructive ml-1">*</span>
                    )}
                </label>
            </div>

            {/* Helper / Error */}
            {(error || helperText) && (
                <p
                    id={error ? `${textareaId}-error` : `${textareaId}-helper`}
                    className={`mt-1.5 text-xs font-body ${error ? 'text-error' : 'text-text-secondary'}`}
                    role={error ? 'alert' : undefined}
                >
                    {error || helperText}
                </p>
            )}
        </div>
    )
}