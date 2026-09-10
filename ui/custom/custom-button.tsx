'use client';

import { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";

type Size = "sm" | "md" | "lg" | "xl";
type Variant = "primary" | "secondary" | "accent" | "ghost" | "destructive" | "outline";
type Shape = "rounded" | "square" | "pill";

// Base button props
interface BaseButtonProps extends React.PropsWithChildren {
    variant?: Variant;
    size?: Size;
    shape?: Shape;
    fullWidth?: boolean;
    icon?: React.ReactNode;
    iconPosition?: 'left' | 'right';
    isLoading?: boolean;
    disabled?: boolean;
    className?: string;
    'aria-label'?: string;
}

// Button element props
interface ButtonElementProps extends BaseButtonProps, ButtonHTMLAttributes<HTMLButtonElement> {
    as?: 'button';
    href?: never;
}

// Anchor element props
interface AnchorElementProps extends BaseButtonProps, AnchorHTMLAttributes<HTMLAnchorElement> {
    as: 'a';
    type?: never;
}

export type CustomButtonProps = ButtonElementProps | AnchorElementProps;

// Size classes
const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs sm:text-sm min-h-[36px] sm:min-h-[32px]',
    md: 'px-4 py-2 text-sm sm:text-base min-h-[44px] sm:min-h-[40px]',
    lg: 'px-6 py-3 text-base sm:text-lg min-h-[48px] sm:min-h-[44px]',
    xl: 'px-8 py-4 text-lg sm:text-xl min-h-[52px] sm:min-h-[48px]',
};

// Variant classes using CSS variables
const variantClasses = {
    primary: 'bg-button-primary text-button-primary-foreground hover:bg-button-primary-hover active:bg-button-primary-active disabled:bg-muted disabled:text-text-disabled',
    secondary: 'bg-button-secondary text-button-secondary-foreground hover:bg-button-secondary-hover active:bg-button-secondary-active disabled:bg-muted disabled:text-text-disabled',
    outline: 'bg-transparent text-text-primary border-2 border-border hover:bg-muted hover:border-primary active:bg-muted-hover disabled:border-border-subtle disabled:text-text-disabled',
    ghost: 'bg-transparent text-text-primary hover:bg-button-ghost-hover active:bg-button-ghost-active disabled:text-text-disabled',
    destructive: 'bg-button-destructive text-button-destructive-foreground hover:bg-button-destructive-hover active:bg-button-destructive-active disabled:bg-muted disabled:text-text-disabled',
    accent: 'bg-button-accent text-button-accent-foreground hover:bg-button-accent-hover active:bg-button-accent-active disabled:bg-muted disabled:text-text-disabled',
};

// Loading spinner component
function LoadingSpinner({ size }: { size: Size }) {
    const sizeMap = { sm: 12, md: 16, lg: 20, xl: 24 };
    const s = sizeMap[size];

    return (
        <svg className="animate-spin" width={s} height={s} viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
    );
};

export default function CustomButton({
    as = "button",
    variant = 'primary',
    size = 'md',
    shape = 'rounded',
    fullWidth = false,
    icon,
    iconPosition = 'left',
    isLoading = false,
    disabled = false,
    className = '',
    children,
    ...rest
}: CustomButtonProps) {


    // Icon-only size adjustments
    const iconOnlySizeClasses = {
        sm: 'p-1.5',
        md: 'p-2.5',
        lg: 'p-3',
        xl: 'p-4',
    };

    // Shape classes
    const shapeClasses = {
        rounded: 'rounded-lg',
        square: 'rounded-none',
        pill: 'rounded-full',
    };

    // Check if button has only icon (no text)
    const isIconOnly = icon && !children;

    // Base classes
    const baseClasses = `inline-flex items-center justify-center  font-body font-semibold  transition-all duration-200 focus:outline-none focus:ring-4  disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100 ${!disabled && !isLoading ? 'active:scale-95' : ''} ${fullWidth ? 'w-full' : 'w-auto'}  ${isIconOnly ? iconOnlySizeClasses[size] : sizeClasses[size]}  ${shapeClasses[shape]}  ${variantClasses[variant]}  ${className}`;

    // Render icon with text or icon only
    const content = isLoading ? (
        <>
            <LoadingSpinner size={size} />
            {!isIconOnly && <span className="opacity-70">{children}</span>}
        </>
    ) : isIconOnly ? icon : icon && iconPosition === 'left' ? (
        <>{icon}<span>{children}</span></>
    ) : icon && iconPosition === 'right' ? (
        <><span>{children}</span>{icon}</>
    ) : <span>{children}</span>;

    // Common props for both button and anchor
    const commonProps = {
        className: baseClasses,
        'aria-disabled': isLoading || disabled,
        'aria-busy': isLoading,
    };

    if (as === "a") {
        const anchorProps = rest as Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseButtonProps>;
        return (
            <a {...commonProps} {...anchorProps}>
                {content}
            </a>
        );
    }

    const buttonProps = rest as Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseButtonProps>;
    return (
        <button
            type={buttonProps.type || 'button'}
            disabled={disabled || isLoading}
            {...commonProps}
            {...buttonProps}
        >
            {content}
        </button>
    );
}

// Icon Button - Convenience component for icon-only buttons
export interface IconButtonProps extends Omit<CustomButtonProps, 'children' | 'icon' | 'iconPosition'> {
    icon: React.ReactNode;
    'aria-label': string;
}

export function IconButton({ icon, ...props }: IconButtonProps) {
    return (
        <CustomButton icon={icon} {...(props as CustomButtonProps)}>
            {null}
        </CustomButton>
    );
}