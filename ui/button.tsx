'use client'

import { Loader2 } from "lucide-react";
import Link from "next/link";

type Size = "sm" | "md" | "lg" | "xl";
type Variant = "primary" | "secondary" | "accent" | "ghost" | "destructive" | "outline";
type Shape = "rounded" | "square" | "pill";

type BaseButtonProps = {
    variant?: Variant;
    size?: Size;
    shape?: Shape;
    fullWidth?: boolean;
    icon?: React.ReactNode;
    iconPosition?: 'left' | 'right';
    isLoading?: boolean;
    disabled?: boolean;
    className?: string;
}

type ButtonElementProps = BaseButtonProps & React.ComponentPropsWithoutRef<"button"> & { href?: never }

type AnchorElementProps = BaseButtonProps & React.ComponentPropsWithoutRef<typeof Link> & { href: string }

export type ButtonProps = ButtonElementProps | AnchorElementProps;

// -------------------- OPTIMIZED SIZE SYSTEM --------------------

const sizeClasses: Record<Size, string> = {
    sm: "px-3 py-1.5 text-xs min-h-[32px] gap-1.5",
    md: "px-4 py-2.5 text-sm min-h-[40px] gap-2",
    lg: "px-6 py-3 text-base min-h-[48px] gap-2.5",
    xl: "px-8 py-4 text-lg min-h-[56px] gap-3",
}

const iconOnlySizeClasses: Record<Size, string> = {
    sm: "p-2 min-h-[32px] min-w-[32px]",
    md: "p-2.5 min-h-[40px] min-w-[40px]",
    lg: "p-3 min-h-[48px] min-w-[48px]",
    xl: "p-4 min-h-[56px] min-w-[56px]",
}

const iconSizeMap: Record<Size, string> = {
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
    lg: "w-5 h-5",
    xl: "w-6 h-6",
}

// -------------------- SHAPE SYSTEM --------------------

const shapeClasses: Record<Shape, string> = {
    rounded: "rounded-md",
    square: "rounded-none",
    pill: "rounded-full",
}

// -------------------- VARIANTS (TOKEN BASED) --------------------

const variantClasses: Record<Variant, string> = {
    primary: "bg-button-primary text-button-primary-foreground hover:bg-button-primary-hover active:bg-button-primary-active shadow-sm hover:shadow-md",
    secondary: "bg-button-secondary text-button-secondary-foreground hover:bg-button-secondary-hover active:bg-button-secondary-active",
    accent: "bg-button-accent text-button-accent-foreground hover:bg-button-accent-hover active:bg-button-accent-active shadow-sm hover:shadow-md",
    destructive: "bg-button-destructive text-button-destructive-foreground hover:bg-button-destructive-hover active:bg-button-destructive-active",
    ghost: "bg-button-ghost text-button-ghost-foreground hover:bg-button-ghost-hover active:bg-button-ghost-active",
    outline: "bg-button-outline text-button-outline-foreground border-2 border-button-outline-border hover:bg-button-outline-hover hover:text-button-outline-hover-foreground hover:border-transparent",
}

// -------------------- LOADING SPINNER --------------------

function LoadingSpinner({ size }: { size: Size }) {
    return (
        <Loader2 className={`animate-spin shrink-0 ${iconSizeMap[size]}`} strokeWidth={2} />
    )
}

export default function Button({
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
}: ButtonProps) {
    const isIconOnly = icon && !children
    const isDisabled = disabled || isLoading

    // Base classes
    const baseClasses = `inline-flex items-center justify-center font-body font-medium transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none ${!isDisabled && "hover:scale-[1.02] active:scale-[0.98]"} ${fullWidth ? "w-full" : "w-auto"} ${isIconOnly ? iconOnlySizeClasses[size] : sizeClasses[size]} ${shapeClasses[shape]} ${variantClasses[variant]} ${className}`

    // Render icon with proper spacing
    const renderIcon = () => {
        if (!icon) return null
        return (
            <span className={`inline-flex shrink-0 ${iconSizeMap[size]}`}>
                {icon}
            </span>
        )
    }

    // Content with loading state
    const content = (
        <>
            {isLoading && <LoadingSpinner size={size} />}

            {!isLoading && iconPosition === "left" && !isIconOnly && renderIcon()}

            {!isIconOnly && (
                <span className={`inline-block ${isLoading ? "opacity-70" : ""}`}>
                    {children}
                </span>
            )}

            {!isLoading && iconPosition === "right" && !isIconOnly && renderIcon()}

            {isIconOnly && !isLoading && renderIcon()}
        </>
    )

    // -------------------- LINK VARIANT --------------------

    if ("href" in rest && rest.href) {
        if (isDisabled) {
            return (
                <span className={baseClasses} aria-disabled="true">
                    {content}
                </span>
            )
        }

        return (
            <Link
                {...(rest as React.ComponentPropsWithoutRef<typeof Link>)}
                className={baseClasses}
            >
                {content}
            </Link>
        )
    }

    // -------------------- BUTTON VARIANT --------------------

    return (
        <button
            type="button"
            disabled={isDisabled}
            className={baseClasses}
            {...(rest as React.ComponentPropsWithoutRef<"button">)}
        >
            {content}
        </button>
    )
}

// Icon Button - Convenience component for icon-only buttons
export function IconButton({ icon, ...props }: Omit<ButtonProps, "children">) {
    return <Button icon={icon} {...props as ButtonProps} />
}