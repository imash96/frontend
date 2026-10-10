"use client"

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
    iconPosition?: "left" | "right";
    isLoading?: boolean;
    disabled?: boolean;
    className?: string;
}

export type ButtonElementProps = BaseButtonProps & React.ComponentPropsWithoutRef<"button"> & { href?: never }

export type AnchorElementProps = BaseButtonProps & Omit<React.ComponentPropsWithoutRef<typeof Link>, "href"> & { href: React.ComponentPropsWithoutRef<typeof Link>["href"] | string }

export type ButtonProps = ButtonElementProps | AnchorElementProps;

const sizeClasses: Record<Size, string> = {
    sm: "min-h-8 gap-1.5 px-3 py-1.5 text-xs",
    md: "min-h-10 gap-2 px-4 py-2.5 text-sm",
    lg: "min-h-12 gap-2.5 px-6 py-3 text-base",
    xl: "min-h-14 gap-3 px-8 py-4 text-lg",
}

const iconOnlySizeClasses: Record<Size, string> = {
    sm: "min-h-8 min-w-8 p-2",
    md: "min-h-10 min-w-10 p-2.5",
    lg: "min-h-12 min-w-12 p-3",
    xl: "min-h-14 min-w-14 p-4",
}

const iconSizeClasses: Record<Size, string> = {
    sm: "size-3.5",
    md: "size-4",
    lg: "size-5",
    xl: "size-6",
}

const shapeClasses: Record<Shape, string> = {
    rounded: "rounded-md",
    square: "rounded-none",
    pill: "rounded-full",
}

const variantClasses: Record<Variant, string> = {
    primary: "bg-button-primary text-button-primary-foreground shadow-sm hover:bg-button-primary-hover hover:shadow-md active:bg-button-primary-active",
    secondary: "bg-button-secondary text-button-secondary-foreground hover:bg-button-secondary-hover active:bg-button-secondary-active",
    accent: "bg-button-accent text-button-accent-foreground shadow-sm hover:bg-button-accent-hover hover:shadow-md active:bg-button-accent-active",
    destructive: "bg-button-destructive text-button-destructive-foreground hover:bg-button-destructive-hover active:bg-button-destructive-active",
    ghost: "bg-button-ghost text-button-ghost-foreground hover:bg-button-ghost-hover active:bg-button-ghost-active",
    outline: "border-2 border-button-outline-border bg-button-outline text-button-outline-foreground hover:border-transparent hover:bg-button-outline-hover hover:text-button-outline-hover-foreground",
}

export default function Button({ variant = "primary", size = "md", shape = "rounded", fullWidth = false, icon, iconPosition = "left", isLoading = false, disabled = false, className = "", children, ...rest }: ButtonProps) {
    const isIconOnly = Boolean(icon) && !children
    const isDisabled = disabled || isLoading

    // Hover/press scaling is skipped for full-width buttons: scaling a button that already spans its
    // container pushes its edges past it (clipped by overflow-hidden parents such as step panels).
    const motionClass = isDisabled || fullWidth ? "" : "hover:scale-[1.02] active:scale-[0.98]"

    const classes = [
        "inline-flex items-center justify-center font-body font-medium transition duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        // pointer-events-none already blocks the cursor, so no separate disabled cursor class.
        "disabled:pointer-events-none disabled:opacity-50",
        fullWidth ? "w-full" : "",
        isIconOnly ? iconOnlySizeClasses[size] : sizeClasses[size],
        shapeClasses[shape],
        variantClasses[variant],
        motionClass,
        className,
    ]
        .filter(Boolean)
        .join(" ")

    const iconNode = icon ? (
        <span className={`inline-flex shrink-0 ${iconSizeClasses[size]}`}>{icon}</span>
    ) : null

    const content = (
        <>
            {isLoading && <Loader2 className={`shrink-0 animate-spin ${iconSizeClasses[size]}`} aria-hidden="true" />}
            {!isLoading && (isIconOnly || iconPosition === "left") && iconNode}
            {!isIconOnly && <span className={isLoading ? "opacity-70" : undefined}>{children}</span>}
            {!isLoading && !isIconOnly && iconPosition === "right" && iconNode}
        </>
    )

    if ("href" in rest && rest.href) {
        if (isDisabled) {
            return (
                <span className={classes} role="link" aria-disabled="true">
                    {content}
                </span>
            )
        }
        return (
            <Link {...(rest as React.ComponentPropsWithoutRef<typeof Link>)} className={classes}>
                {content}
            </Link>
        )
    }

    return (
        <button
            type="button"
            disabled={isDisabled}
            aria-busy={isLoading || undefined}
            className={classes}
            {...(rest as React.ComponentPropsWithoutRef<"button">)}
        >
            {content}
        </button>
    )
}

/** Icon-only button. Always pass `aria-label`: there is no visible text for screen readers. */
export function IconButton({ icon, ...props }: Omit<ButtonProps, "children">) {
    return <Button icon={icon} {...(props as ButtonProps)} />
}