'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { useCallback } from 'react';

export interface CustomModalProps {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    trigger?: React.ReactNode;
    title?: string;
    description?: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
    showClose?: boolean;
    closeOnOverlayClick?: boolean;
    className?: string;
}

const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-full mx-4',
};

export default function CustomModal({
    open,
    onOpenChange,
    trigger,
    title,
    description,
    children,
    footer,
    size = 'md',
    showClose = true,
    closeOnOverlayClick = true,
    className = '',
}: CustomModalProps) {
    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            {trigger && <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>}

            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-overlay-heavy backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 z-50" />

                <Dialog.Content
                    onPointerDownOutside={(e) => {
                        if (!closeOnOverlayClick) {
                            e.preventDefault();
                        }
                    }}
                    className={`
                        fixed left-[50%] top-[50%] z-50
                        translate-x-[-50%] translate-y-[-50%]
                        w-full ${sizeClasses[size]}
                        max-h-[90vh] sm:max-h-[85vh]
                        bg-surface border border-border rounded-lg shadow-xl
                        data-[state=open]:animate-in data-[state=closed]:animate-out
                        data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0
                        data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95
                        data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]
                        data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]
                        flex flex-col
                        ${className}
                    `}
                >
                    {/* Header */}
                    {(title || description || showClose) && (
                        <div className="flex items-start justify-between p-4 sm:p-6 border-b border-border">
                            <div className="flex-1 pr-8">
                                {title && (
                                    <Dialog.Title className="text-lg sm:text-xl font-semibold text-text-primary">
                                        {title}
                                    </Dialog.Title>
                                )}
                                {description && (
                                    <Dialog.Description className="mt-1 sm:mt-2 text-sm text-text-secondary">
                                        {description}
                                    </Dialog.Description>
                                )}
                            </div>

                            {showClose && (
                                <Dialog.Close className="shrink-0 rounded-lg p-2 hover:bg-muted transition-colors min-w-11 min-h-11 flex items-center justify-center sm:min-w-0 sm:min-h-0">
                                    <svg className="w-5 h-5 text-text-secondary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <line x1="18" y1="6" x2="6" y2="18" />
                                        <line x1="6" y1="6" x2="18" y2="18" />
                                    </svg>
                                </Dialog.Close>
                            )}
                        </div>
                    )}

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                        {children}
                    </div>

                    {/* Footer */}
                    {footer && (
                        <div className="p-4 sm:p-6 border-t border-border">
                            {footer}
                        </div>
                    )}
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}

export interface ModalButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    children: React.ReactNode;
}

const variantClasses = {
    primary: 'bg-button-primary text-button-primary-foreground hover:bg-button-primary-hover',
    secondary: 'bg-button-secondary text-button-secondary-foreground hover:bg-button-secondary-hover',
    outline: 'bg-transparent text-text-primary border-2 border-border hover:bg-muted',
    ghost: 'bg-transparent text-text-primary hover:bg-muted',
    danger: 'bg-button-destructive text-button-destructive-foreground hover:bg-button-destructive-hover',
};

export function ModalButton({ variant = 'primary', children, className = '', ...props }: ModalButtonProps) {
    return (
        <button
            type="button"
            className={`px-4 py-2 rounded-lg font-semibold transition-all min-h-11 sm:min-h-10 text-sm sm:text-base ${variantClasses[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}

export interface AlertModalProps {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    title: string;
    description: string;
    confirmLabel?: string;
    cancelLabel?: string;
    onConfirm?: () => void;
    onCancel?: () => void;
    variant?: 'info' | 'warning' | 'danger' | 'success';
}

const variantIcons = {
    info: (
        <svg className="w-10 h-10 sm:w-12 sm:h-12 text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" strokeWidth="2" />
            <line x1="12" y1="16" x2="12" y2="12" strokeWidth="2" />
            <circle cx="12" cy="8" r="1" fill="currentColor" />
        </svg>
    ),
    warning: (
        <svg className="w-10 h-10 sm:w-12 sm:h-12 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
    ),
    danger: (
        <svg className="w-10 h-10 sm:w-12 sm:h-12 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" strokeWidth="2" />
            <line x1="15" y1="9" x2="9" y2="15" strokeWidth="2" />
            <line x1="9" y1="9" x2="15" y2="15" strokeWidth="2" />
        </svg>
    ),
    success: (
        <svg className="w-10 h-10 sm:w-12 sm:h-12 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" strokeWidth="2" />
            <path strokeWidth="2" d="M9 12l2 2 4-4" />
        </svg>
    ),
};

export function AlertModal({
    open,
    onOpenChange,
    title,
    description,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    onConfirm,
    onCancel,
    variant = 'info',
}: AlertModalProps) {
    const handleConfirm = useCallback(() => {
        onConfirm?.();
        onOpenChange?.(false);
    }, [onConfirm, onOpenChange]);

    const handleCancel = useCallback(() => {
        onCancel?.();
        onOpenChange?.(false);
    }, [onCancel, onOpenChange]);

    return (
        <CustomModal
            open={open}
            onOpenChange={onOpenChange}
            size="sm"
            showClose={false}
        >
            <div className="text-center">
                <div className="flex justify-center mb-4">
                    {variantIcons[variant]}
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-text-primary mb-2">
                    {title}
                </h3>
                <p className="text-sm sm:text-base text-text-secondary mb-6">
                    {description}
                </p>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <ModalButton variant="outline" onClick={handleCancel} className="flex-1">
                        {cancelLabel}
                    </ModalButton>
                    <ModalButton
                        variant={variant === 'danger' ? 'danger' : 'primary'}
                        onClick={handleConfirm}
                        className="flex-1"
                    >
                        {confirmLabel}
                    </ModalButton>
                </div>
            </div>
        </CustomModal>
    );
}