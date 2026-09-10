'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';
import { div as Div } from 'motion/react-client';
import { AnimatePresence, type Transition } from 'motion/react';

export type DrawerDirection = 'left' | 'right';
export type DrawerSize = 'sm' | 'md' | 'lg' | 'full';

interface DrawerProps extends React.PropsWithChildren {
    isOpen: boolean;
    onClose: () => void;
    direction?: DrawerDirection;
    size?: DrawerSize;
    title?: string;
    showCloseButton?: boolean;
    className?: string;
    overlayClassName?: string;
}

const sizeClasses: Record<DrawerSize, string> = {
    sm: 'max-w-xs w-full',
    md: 'max-w-md w-full',
    lg: 'max-w-lg w-full',
    full: 'w-full',
};

const slideVariants = {
    left: {
        hidden: { x: '-100%' },
        visible: { x: 0 },
        exit: { x: '-100%' },
    },
    right: {
        hidden: { x: '100%' },
        visible: { x: 0 },
        exit: { x: '100%' },
    },
};

const springTransition: Transition = {
    type: 'spring',
    stiffness: 300,
    damping: 30,
};

export function Drawer({
    isOpen,
    onClose,
    direction = 'right',
    size = 'md',
    children,
    title,
    showCloseButton = true,
    className = '',
    overlayClassName = '',
}: DrawerProps) {
    // Lock body scroll when drawer is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            return () => {
                document.body.style.overflow = '';
            };
        }
    }, [isOpen]);

    // Close on escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            return () => document.removeEventListener('keydown', handleEscape);
        }
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <AnimatePresence mode="wait">
            <>
                {/* Overlay */}
                <Div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    onClick={onClose}
                    className={`fixed inset-0 z-40 bg-overlay backdrop-blur-sm ${overlayClassName}`}
                    aria-hidden="true"
                />
                {/* Drawer */}
                <Div
                    variants={slideVariants[direction]}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={springTransition}
                    className={`fixed top-0 bottom-0 z-50 flex flex-col bg-surface shadow-2xl ${direction === 'left' ? 'left-0 border-r' : 'right-0 border-l'} border-border ${sizeClasses[size]} ${className}`}
                    role="dialog"
                    aria-modal="true"
                    aria-label={title || 'Drawer'}
                >
                    <div className="flex h-full flex-col">
                        {/* Header */}
                        {(title || showCloseButton) && (
                            <div className="flex items-center justify-between p-4 border-b border-divider shrink-0">
                                {title && (
                                    <h2 className="text-lg font-semibold text-text-primary font-heading">
                                        {title}
                                    </h2>
                                )}
                                {showCloseButton && (
                                    <button
                                        onClick={onClose}
                                        className="ml-auto p-2 rounded-sm text-muted-foreground hover:bg-muted-hover hover:text-foreground transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-focus-ring"
                                        aria-label="Close drawer"
                                    >
                                        <X size={20} strokeWidth={1.5} />
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto">
                            <Div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1, duration: 0.4 }}
                            >
                                {children}
                            </Div>
                        </div>
                    </div>
                </Div>
            </>
        </AnimatePresence>
    );
}