"use client"

import { memo } from 'react';
import type { ButtonHTMLAttributes, ReactNode, Ref } from 'react';
import { Loader2 } from 'lucide-react';

// ============================================================================
// Button - components/atoms/Button.tsx
// The base, multipurpose button used everywhere across the storefront.
// Built directly on the design tokens shown in the colors / fonts tabs:
// bg-{primary,secondary,accent}(-hover/-active/-subtle), semantic
// success/destructive/warning/info, text-text-*, font-heading / font-body.
//
// Perf notes:
// - Plain function component with ref as a regular prop (React 19+).
//   forwardRef is deprecated as of React 19 - react.dev now lists it as
//   "Deprecated" and recommends destructuring `ref` straight out of props
//   instead: https://react.dev/reference/react/forwardRef
// - Wrapped in memo() so a Button sitting in a product grid doesn't
//   re-render just because its parent did. With ref-as-a-prop this no
//   longer needs the old memo(forwardRef(...)) nesting.
// - No animation library import here - the spinner is a single CSS
//   `animate-spin` class, so this file costs nothing extra to parse or
//   run even rendered dozens of times on one page.
// ============================================================================

export type ButtonVariant =
    | 'primary'
    | 'secondary'
    | 'accent'
    | 'outline'
    | 'ghost'
    | 'subtle'
    | 'destructive'
    | 'success'
    | 'link';

export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    loading?: boolean;
    /** Optional text shown next to the spinner while loading. Defaults to children. */
    loadingText?: string;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    fullWidth?: boolean;
    ref?: Ref<HTMLButtonElement>;
}

export const BUTTON_VARIANT_STYLES: Record<ButtonVariant, string> = {
    primary:
        'bg-primary text-primary-foreground shadow-sm hover:bg-primary-hover hover:shadow-md hover:-translate-y-0.5 active:bg-primary-active active:translate-y-0 focus-visible:ring-primary',
    secondary:
        'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary-hover hover:shadow-md hover:-translate-y-0.5 active:bg-secondary-active active:translate-y-0 focus-visible:ring-secondary',
    accent:
        'bg-accent text-accent-foreground shadow-sm hover:bg-accent-hover hover:shadow-md hover:-translate-y-0.5 active:bg-accent-active active:translate-y-0 focus-visible:ring-accent',
    outline:
        'border-2 border-border bg-transparent text-text-primary hover:border-primary hover:text-primary hover:bg-primary-subtle focus-visible:ring-primary',
    ghost:
        'bg-transparent text-text-primary hover:bg-muted focus-visible:ring-border',
    subtle:
        'bg-primary-subtle text-primary hover:bg-primary/15 focus-visible:ring-primary',
    destructive:
        'bg-destructive text-destructive-foreground shadow-sm hover:opacity-90 hover:shadow-md active:opacity-100 focus-visible:ring-destructive',
    success:
        'bg-success text-success-foreground shadow-sm hover:opacity-90 hover:shadow-md active:opacity-100 focus-visible:ring-success',
    link:
        'bg-transparent text-primary underline-offset-4 hover:underline p-0 h-auto shadow-none focus-visible:ring-primary',
};

// sm is 36px tall - fine for dense/secondary UI, but keep primary mobile
// CTAs at md (44px) or lg (56px) to stay at or above the iOS/Android
// minimum recommended touch target.
const SIZE_STYLES: Record<ButtonSize, string> = {
    sm: 'h-9 px-3.5 text-xs gap-1.5 [&_svg]:size-3.5',
    md: 'h-11 px-5 text-sm gap-2 [&_svg]:size-4',
    lg: 'h-14 px-7 text-base gap-2.5 [&_svg]:size-5',
};

// Shared by Button and IconButton so the two always stay visually in sync
// (e.g. a wishlist IconButton sitting next to a md Button lines up exactly).
export const BUTTON_BASE_STYLES =
    'inline-flex shrink-0 items-center justify-center rounded-lg font-body font-semibold whitespace-nowrap ' +
    'transition-all duration-200 ease-in-out active:scale-[0.98] ' +
    'disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none disabled:translate-y-0 ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2';

export const Button = memo(function Button({
    variant = 'primary',
    size = 'md',
    loading = false,
    loadingText,
    leftIcon,
    rightIcon,
    fullWidth = false,
    disabled,
    className = '',
    children,
    type = 'button',
    ref,
    ...props
}: ButtonProps) {
    const isLink = variant === 'link';

    return (
        <button
            ref={ref}
            type={type}
            disabled={disabled || loading}
            aria-busy={loading || undefined}
            className={[
                BUTTON_BASE_STYLES,
                BUTTON_VARIANT_STYLES[variant],
                isLink ? '' : SIZE_STYLES[size],
                fullWidth ? 'w-full' : '',
                className,
            ]
                .filter(Boolean)
                .join(' ')}
            {...props}
        >
            {loading && <Loader2 className="animate-spin" aria-hidden="true" />}
            {!loading && leftIcon}
            {loading ? loadingText ?? children : children}
            {!loading && rightIcon}
        </button>
    );
});

// ============================================================================
// IconButton - icon-only sibling of Button, circular by default.
// Use for compact actions: wishlist, dismiss, filters, quantity steppers.
// `label` is required - it becomes the accessible name since there's no text.
// ============================================================================

export interface IconButtonProps
    extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
    icon: ReactNode;
    label: string;
    variant?: Exclude<ButtonVariant, 'link'>;
    size?: ButtonSize;
    loading?: boolean;
    shape?: 'circle' | 'square';
    ref?: Ref<HTMLButtonElement>;
}

const ICON_SIZE_STYLES: Record<ButtonSize, string> = {
    sm: 'h-9 w-9 [&_svg]:size-4',
    md: 'h-11 w-11 [&_svg]:size-[18px]',
    lg: 'h-14 w-14 [&_svg]:size-5',
};

export const IconButton = memo(function IconButton({
    icon,
    label,
    variant = 'ghost',
    size = 'md',
    loading = false,
    shape = 'circle',
    disabled,
    className = '',
    type = 'button',
    ref,
    ...props
}: IconButtonProps) {
    return (
        <button
            ref={ref}
            type={type}
            disabled={disabled || loading}
            aria-label={label}
            title={label}
            className={[
                BUTTON_BASE_STYLES,
                BUTTON_VARIANT_STYLES[variant],
                ICON_SIZE_STYLES[size],
                shape === 'circle' ? 'rounded-full' : 'rounded-lg',
                'p-0',
                className,
            ]
                .filter(Boolean)
                .join(' ')}
            {...props}
        >
            {loading ? <Loader2 className="animate-spin" aria-hidden="true" /> : icon}
        </button>
    );
});

export default Button;