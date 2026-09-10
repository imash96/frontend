"use client"

import { useId } from "react"

export type SelectOption = {
    label: string
    value: string | number
    disabled?: boolean
}

type SelectProps = {
    label: string
    options: SelectOption[] | undefined
    error?: string
    helperText?: string
    variant?: 'default' | 'filled'
    fullWidth?: boolean
} & Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size">

export default function NativeSelect({
    label,
    options,
    helperText,
    variant = 'default',
    fullWidth = false,
    className = '',
    required,
    error,
    disabled,
    id,
    ...props
}: SelectProps) {
    const generatedId = useId()
    const inputId = id ?? generatedId

    return (
        <div className={`${fullWidth ? 'w-full' : 'w-auto'} ${className}`}>
            <div className="relative">
                <select
                    id={inputId}
                    disabled={disabled}
                    required={required}
                    aria-invalid={!!error}
                    aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
                    className={`peer block w-full px-2.5 pb-1 pt-5 text-sm rounded-md border ${variant === 'filled' ? 'bg-input-background' : 'bg-surface'} ${disabled ? 'bg-input-disabled-background text-input-disabled-text border-input-disabled-border cursor-not-allowed' : ''} ${error ? 'border-error focus-visible:ring-error/20 focus-visible:border-error' : ''} ${!error && !disabled ? 'border-input-border hover:border-input-border-hover focus-visible:border-input-border-focus' : ''}`}
                    {...props}
                >
                    <option value="" disabled hidden></option>
                    {options?.map((option) => (
                        <option
                            key={option.value}
                            value={option.value}
                            disabled={option.disabled}
                        >
                            {option.label}
                        </option>
                    ))}
                </select>

                <label
                    htmlFor={inputId}
                    className={`absolute text-sm duration-300 transform -translate-y-3 scale-75 top-3.5 z-9 origin-left inset-s-2.5 transition-all peer-focus:scale-75 peer-focus:-translate-y-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0  ${error && 'text-error'} ${disabled ? 'text-input-disabled-text' : ''} ${!error && !disabled ? 'text-input-placeholder peer-focus:text-primary' : ''}`}
                >
                    {label}
                    {required && <span className="text-destructive ml-1">*</span>}
                </label>

                {/* Custom dropdown arrow */}
                <div className="absolute inset-y-0 right-0 flex items-center pr-2.5 pointer-events-none">
                    <svg
                        className="w-4 h-4 text-foreground-muted"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                        />
                    </svg>
                </div>
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
