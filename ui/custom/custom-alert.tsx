'use client';

import { useState } from 'react';

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'info' | 'success' | 'warning' | 'error';
    title?: string;
    children: React.ReactNode;
    closable?: boolean;
    onClose?: () => void;
    bordered?: boolean;
    icon?: React.ReactNode;
}

const variantConfig = {
    info: {
        bg: 'bg-info-subtle',
        text: 'text-info',
        border: 'border-info',
        icon: (
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" strokeWidth="2" />
                <line x1="12" y1="16" x2="12" y2="12" strokeWidth="2" />
                <circle cx="12" cy="8" r="1" fill="currentColor" />
            </svg>
        ),
    },
    success: {
        bg: 'bg-success-subtle',
        text: 'text-success',
        border: 'border-success',
        icon: (
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" strokeWidth="2" />
                <path strokeWidth="2" d="M9 12l2 2 4-4" />
            </svg>
        ),
    },
    warning: {
        bg: 'bg-warning-subtle',
        text: 'text-warning',
        border: 'border-warning',
        icon: (
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
        ),
    },
    error: {
        bg: 'bg-error-subtle',
        text: 'text-error',
        border: 'border-error',
        icon: (
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" strokeWidth="2" />
                <line x1="15" y1="9" x2="9" y2="15" strokeWidth="2" />
                <line x1="9" y1="9" x2="15" y2="15" strokeWidth="2" />
            </svg>
        ),
    },
};

export default function Alert({
    variant = 'info',
    title,
    children,
    closable = false,
    onClose,
    bordered = false,
    icon,
    className = '',
    ...props
}: AlertProps) {
    const [isVisible, setIsVisible] = useState(true);

    const config = variantConfig[variant];

    const handleClose = () => {
        setIsVisible(false);
        onClose?.();
    };

    if (!isVisible) return null;

    return (
        <div
            role="alert"
            className={`
                p-3 sm:p-4 rounded-lg
                ${config.bg}
                ${bordered ? `border-l-4 ${config.border}` : ''}
                ${className}
            `}
            {...props}
        >
            <div className="flex items-start gap-2 sm:gap-3">
                {/* Icon */}
                <div className={`shrink-0 ${config.text}`}>
                    {icon || config.icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    {title && (
                        <h4 className={`font-semibold mb-1 text-sm sm:text-base ${config.text}`}>
                            {title}
                        </h4>
                    )}
                    <div className="text-xs sm:text-sm text-text-primary">
                        {children}
                    </div>
                </div>

                {/* Close Button */}
                {closable && (
                    <button
                        type="button"
                        onClick={handleClose}
                        className={`
                            shrink-0 p-1 rounded min-w-11 min-h-11 sm:min-w-0 sm:min-h-0
                            ${config.text}
                            hover:bg-black/10 transition-colors
                            flex items-center justify-center
                        `}
                        aria-label="Close"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                )}
            </div>
        </div>
    );
};

// Banner Alert (full width with action)
export interface BannerAlertProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'info' | 'success' | 'warning' | 'error';
    message: string;
    actionLabel?: string;
    onAction?: () => void;
    onClose?: () => void;
}

export const BannerAlert: React.FC<BannerAlertProps> = ({
    variant = 'info',
    message,
    actionLabel,
    onAction,
    onClose,
    className = '',
    ...props
}) => {
    const [isVisible, setIsVisible] = useState(true);

    const variantConfig = {
        info: {
            bg: 'bg-info',
            text: 'text-info-foreground',
        },
        success: {
            bg: 'bg-success',
            text: 'text-success-foreground',
        },
        warning: {
            bg: 'bg-warning',
            text: 'text-warning-foreground',
        },
        error: {
            bg: 'bg-error',
            text: 'text-error-foreground',
        },
    };

    const config = variantConfig[variant];

    const handleClose = () => {
        setIsVisible(false);
        onClose?.();
    };

    if (!isVisible) return null;

    return (
        <div
            role="alert"
            className={`
                ${config.bg}
                ${config.text}
                ${className}
            `}
            {...props}
        >
            <div className="container mx-auto px-3 sm:px-4 py-2 sm:py-3">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                    <p className="text-xs sm:text-sm font-medium flex-1">
                        {message}
                    </p>

                    <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                        {actionLabel && onAction && (
                            <button
                                type="button"
                                onClick={onAction}
                                className="text-xs sm:text-sm font-semibold underline hover:no-underline transition-all min-h-11 px-3 sm:min-h-0 sm:px-0"
                            >
                                {actionLabel}
                            </button>
                        )}

                        {onClose && (
                            <button
                                type="button"
                                onClick={handleClose}
                                className="p-1 rounded hover:bg-black/10 transition-colors min-w-11 min-h-11 flex items-center justify-center sm:min-w-0 sm:min-h-0"
                                aria-label="Close"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Inline Alert (compact)
export interface InlineAlertProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'info' | 'success' | 'warning' | 'error';
    message: string;
}

export const InlineAlert: React.FC<InlineAlertProps> = ({
    variant = 'info',
    message,
    className = '',
    ...props
}) => {
    const variantConfig = {
        info: 'text-info',
        success: 'text-success',
        warning: 'text-warning',
        error: 'text-error',
    };

    return (
        <div
            role="alert"
            className={`
                flex items-center gap-2
                text-xs sm:text-sm
                ${variantConfig[variant]}
                ${className}
            `}
            {...props}
        >
            <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span>{message}</span>
        </div>
    );
};