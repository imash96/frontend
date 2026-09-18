"use client"

import { memo, useState } from 'react';
import { Heart, ShoppingCart, Check, Loader2, Minus, Plus } from 'lucide-react';
import { Button, IconButton, type ButtonSize } from './button';

// ============================================================================
// AddToCartButton - components/molecules/CommerceButtons.tsx
// Goes idle -> adding -> added, then resets itself, matching the
// add-to-cart interaction spec. Wire cart logic through onAddToCart;
// fire a toast from there too if you want one - this component only
// owns the button's own state.
//
// No animation library: the label swap uses .btn-fade-slide-in / the
// success state uses .btn-pop-in, two plain CSS keyframes shipped in
// button-animations.css (import it once - see that file). A grid of
// 24+ of these on a collection page stays cheap to mount and re-render
// since there's no motion runtime attached to any of them.
// ============================================================================

type CartState = 'idle' | 'loading' | 'success';

export interface AddToCartButtonProps {
    onAddToCart?: () => Promise<void> | void;
    disabled?: boolean;
    fullWidth?: boolean;
    size?: ButtonSize;
    idleLabel?: string;
    loadingLabel?: string;
    successLabel?: string;
    /** How long the success state stays up before reverting to idle. */
    resetAfterMs?: number;
    className?: string;
}

export const AddToCartButton = memo(function AddToCartButton({
    onAddToCart,
    disabled = false,
    fullWidth = false,
    size = 'md',
    idleLabel = 'Add to bag',
    loadingLabel = 'Adding',
    successLabel = 'Added',
    resetAfterMs = 1800,
    className = '',
}: AddToCartButtonProps) {
    const [state, setState] = useState<CartState>('idle');

    const handleClick = async () => {
        if (state !== 'idle') return;
        setState('loading');
        try {
            await onAddToCart?.();
        } finally {
            setState('success');
            window.setTimeout(() => setState('idle'), resetAfterMs);
        }
    };

    return (
        <Button
            variant={state === 'success' ? 'success' : 'primary'}
            size={size}
            fullWidth={fullWidth}
            disabled={disabled || state !== 'idle'}
            onClick={handleClick}
            aria-live="polite"
            className={[className, state === 'success' ? 'disabled:opacity-100!' : '']
                .filter(Boolean)
                .join(' ')}
        >
            {state === 'idle' && (
                <span key="idle" className="btn-fade-slide-in inline-flex items-center gap-2">
                    <ShoppingCart aria-hidden="true" />
                    {idleLabel}
                </span>
            )}
            {state === 'loading' && (
                <span key="loading" className="btn-fade-slide-in inline-flex items-center gap-2">
                    <Loader2 className="animate-spin" aria-hidden="true" />
                    {loadingLabel}
                </span>
            )}
            {state === 'success' && (
                <span key="success" className="btn-pop-in inline-flex items-center gap-2">
                    <Check aria-hidden="true" />
                    {successLabel}
                </span>
            )}
        </Button>
    );
});

// ============================================================================
// WishlistButton - heart toggle. Controlled (pass `active` + `onToggle`)
// or uncontrolled (`defaultActive`). The bounce is the same .btn-pop-in
// CSS keyframe as AddToCartButton's success state, re-triggered by
// bumping `pulseKey` - no per-click JS animation work beyond that.
// ============================================================================

export interface WishlistButtonProps {
    active?: boolean;
    defaultActive?: boolean;
    onToggle?: (next: boolean) => void;
    size?: ButtonSize;
    className?: string;
}

const WISHLIST_ICON_PX: Record<ButtonSize, number> = { sm: 16, md: 18, lg: 22 };

export const WishlistButton = memo(function WishlistButton({
    active,
    defaultActive = false,
    onToggle,
    size = 'md',
    className = '',
}: WishlistButtonProps) {
    const [internalActive, setInternalActive] = useState(defaultActive);
    const [pulseKey, setPulseKey] = useState(0);
    const isControlled = active !== undefined;
    const isActive = isControlled ? active : internalActive;

    const handleClick = () => {
        const next = !isActive;
        if (!isControlled) setInternalActive(next);
        onToggle?.(next);
        setPulseKey((k) => k + 1);
    };

    return (
        <IconButton
            icon={
                <Heart
                    key={pulseKey}
                    size={WISHLIST_ICON_PX[size]}
                    className={[
                        'btn-pop-in',
                        isActive ? 'fill-destructive text-destructive' : 'text-text-secondary',
                    ].join(' ')}
                    aria-hidden="true"
                />
            }
            label={isActive ? 'Remove from wishlist' : 'Add to wishlist'}
            variant="outline"
            size={size}
            onClick={handleClick}
            aria-pressed={isActive}
            className={[
                className,
                'focus-visible:ring-destructive!',
                isActive
                    ? 'border-destructive/30! bg-destructive-subtle! hover:bg-destructive-subtle!'
                    : 'hover:border-destructive/30! hover:bg-destructive-subtle!',
            ]
                .filter(Boolean)
                .join(' ')}
        />
    );
});

// ============================================================================
// QuantitySelector - stepper used alongside Add to Cart on product pages.
// ============================================================================

export interface QuantitySelectorProps {
    value?: number;
    defaultValue?: number;
    min?: number;
    max?: number;
    onChange?: (next: number) => void;
    size?: ButtonSize;
    className?: string;
}

const QTY_HEIGHT: Record<ButtonSize, string> = { sm: 'h-9', md: 'h-11', lg: 'h-14' };
const QTY_BUTTON_WIDTH: Record<ButtonSize, string> = { sm: 'w-9', md: 'w-11', lg: 'w-14' };
const QTY_NUMBER_WIDTH: Record<ButtonSize, string> = { sm: 'w-8', md: 'w-10', lg: 'w-12' };

export const QuantitySelector = memo(function QuantitySelector({
    value,
    defaultValue = 1,
    min = 1,
    max = 99,
    onChange,
    size = 'md',
    className = '',
}: QuantitySelectorProps) {
    const [internalValue, setInternalValue] = useState(defaultValue);
    const isControlled = value !== undefined;
    const current = isControlled ? value : internalValue;

    const update = (next: number) => {
        const clamped = Math.min(max, Math.max(min, next));
        if (!isControlled) setInternalValue(clamped);
        onChange?.(clamped);
    };

    return (
        <div
            className={[
                'inline-flex items-center rounded-lg border border-border bg-surface overflow-hidden',
                QTY_HEIGHT[size],
                className,
            ]
                .filter(Boolean)
                .join(' ')}
        >
            <button
                type="button"
                onClick={() => update(current - 1)}
                disabled={current <= min}
                aria-label="Decrease quantity"
                className={`${QTY_BUTTON_WIDTH[size]} h-full inline-flex items-center justify-center text-text-secondary transition-colors hover:bg-muted hover:text-text-primary disabled:pointer-events-none disabled:opacity-40`}
            >
                <Minus size={16} aria-hidden="true" />
            </button>
            <span
                className={`${QTY_NUMBER_WIDTH[size]} text-center text-sm font-body font-semibold tabular-nums text-text-primary`}
                aria-live="polite"
            >
                {current}
            </span>
            <button
                type="button"
                onClick={() => update(current + 1)}
                disabled={current >= max}
                aria-label="Increase quantity"
                className={`${QTY_BUTTON_WIDTH[size]} h-full inline-flex items-center justify-center text-text-secondary transition-colors hover:bg-muted hover:text-text-primary disabled:pointer-events-none disabled:opacity-40`}
            >
                <Plus size={16} aria-hidden="true" />
            </button>
        </div>
    );
});