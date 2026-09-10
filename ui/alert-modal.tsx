import CustomModal from "./custom-modal";

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
    isLoading?: boolean;
}

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
    isLoading = false,
}: AlertModalProps) {
    const variantStyles = {
        info: {
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 16v-4m0-4h.01" />
                </svg>
            ),
            color: 'text-info',
            bg: 'bg-info/10',
        },
        warning: {
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            ),
            color: 'text-warning',
            bg: 'bg-warning/10',
        },
        danger: {
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <circle cx="12" cy="12" r="10" />
                    <line x1="15" y1="9" x2="9" y2="15" />
                    <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
            ),
            color: 'text-destructive',
            bg: 'bg-destructive/10',
        },
        success: {
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            color: 'text-success',
            bg: 'bg-success/10',
        },
    };

    const style = variantStyles[variant];

    const handleConfirm = () => {
        if (onConfirm) onConfirm();
        if (onOpenChange) onOpenChange(false);
    };

    const handleCancel = () => {
        if (onCancel) onCancel();
        if (onOpenChange) onOpenChange(false);
    };

    return (
        <CustomModal
            open={open}
            onOpenChange={onOpenChange}
            size="sm"
            closeOnOverlayClick={!isLoading}
        >
            <div className="flex items-start gap-4">
                {/* Icon */}
                <div className={`
                    p-3 rounded-full shrink-0
                    ${style.color} ${style.bg}
                `}>
                    {style.icon}
                </div>

                {/* Content */}
                <div className="flex-1 pt-1">
                    <h3 className="text-lg font-semibold text-foreground font-heading">
                        {title}
                    </h3>
                    <p className="mt-2 text-sm text-foreground-secondary leading-relaxed">
                        {description}
                    </p>
                </div>
            </div>

            {/* Footer Actions */}
            <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 mt-6">
                <ModalButton
                    variant="ghost"
                    onClick={handleCancel}
                    disabled={isLoading}
                    fullWidth
                    className="sm:flex-1"
                >
                    {cancelLabel}
                </ModalButton>
                <ModalButton
                    variant={variant === 'danger' ? 'destructive' : 'primary'}
                    onClick={handleConfirm}
                    isLoading={isLoading}
                    disabled={isLoading}
                    fullWidth
                    className="sm:flex-1"
                >
                    {confirmLabel}
                </ModalButton>
            </div>
        </CustomModal>
    );
}

// ==================== MODAL BUTTON ====================

export interface ModalButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'destructive' | 'ghost' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    fullWidth?: boolean;
}

export function ModalButton({
    variant = 'primary',
    size = 'md',
    isLoading = false,
    fullWidth = false,
    disabled,
    className = '',
    children,
    ...props
}: ModalButtonProps) {
    const sizeClasses = {
        sm: 'px-3 py-1.5 text-xs',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-3 text-base',
    };

    const variantClasses = {
        primary: 'bg-button-primary text-button-primary-foreground hover:bg-button-primary-hover active:bg-button-primary-active',
        secondary: 'bg-button-secondary text-button-secondary-foreground hover:bg-button-secondary-hover active:bg-button-secondary-active',
        destructive: 'bg-button-destructive text-button-destructive-foreground hover:bg-button-destructive-hover active:bg-button-destructive-active',
        ghost: 'bg-button-ghost text-button-ghost-foreground hover:bg-button-ghost-hover active:bg-button-ghost-active',
        outline: 'bg-button-outline text-button-outline-foreground border-2 border-button-outline-border hover:bg-button-outline-hover hover:text-button-outline-hover-foreground',
    };

    return (
        <button
            type="button"
            disabled={disabled || isLoading}
            className={`
                inline-flex items-center justify-center gap-2
                font-medium rounded-md
                transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-focus-ring focus:ring-offset-2
                disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
                hover:scale-[1.02] active:scale-[0.98]
                ${fullWidth ? 'w-full' : ''}
                ${sizeClasses[size]}
                ${variantClasses[variant]}
                ${className}
            `}
            {...props}
        >
            {isLoading && (
                <svg
                    className="animate-spin h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    />
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                </svg>
            )}
            {children}
        </button>
    );
}




