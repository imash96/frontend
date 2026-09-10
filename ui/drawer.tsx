import { useCallback, useEffect } from 'react';
import { AnimatePresence, motion, type Transition } from 'motion/react';
import { X } from 'lucide-react';

export type DrawerDirection = 'left' | 'right' | 'bottom';
export type DrawerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
interface DrawerProps extends React.PropsWithChildren {
    isOpen: boolean;
    onClose: () => void;
    direction?: DrawerDirection;
    size?: DrawerSize;
    title?: string;
    showCloseButton?: boolean;
    className?: string;
    overlayClassName?: string;
    headerSlot?: React.ReactNode;
    footerSlot?: React.ReactNode;
}
const sizeClasses: Record<DrawerSize, Record<DrawerDirection, string>> = {
    xs: { left: 'w-[95vw] max-w-[360px]', right: 'w-[95vw] max-w-[360px]', bottom: 'w-full' },
    sm: { left: 'w-full max-w-xs sm:max-w-sm', right: 'w-full max-w-xs sm:max-w-sm', bottom: 'w-full' },
    md: { left: 'w-full max-w-md', right: 'w-full max-w-md', bottom: 'w-full' },
    lg: { left: 'w-full max-w-lg', right: 'w-full max-w-lg', bottom: 'w-full' },
    xl: { left: 'w-full max-w-xl', right: 'w-full max-w-xl', bottom: 'w-full' },
    full: { left: 'w-full', right: 'w-full', bottom: 'w-full' },
};
const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
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
    bottom: {
        hidden: { y: '100%' },
        visible: { y: 0 },
        exit: { y: '100%' }
    },
};
const springTransition: Transition = {
    type: 'spring',
    stiffness: 420,
    damping: 40,
    mass: 0.9,
};
const overlayTransition: Transition = {
    duration: 0.2,
    ease: [0.4, 0, 0.2, 1],
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
    headerSlot,
    footerSlot,
}: DrawerProps) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            return () => {
                document.body.style.overflow = '';
            };
        }
    }, [isOpen]);
    const handleEscape = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Escape' && isOpen) onClose();
    }, [isOpen, onClose]);
    useEffect(() => {
        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            return () => document.removeEventListener('keydown', handleEscape);
        }
    }, [isOpen, handleEscape]);
    const positionClasses = direction === 'bottom' ? 'bottom-0 left-0 right-0' : direction === 'left' ? 'top-0 bottom-0 left-0' : 'top-0 bottom-0 right-0';
    const borderClasses = direction === 'bottom' ? 'border-t' : direction === 'left' ? 'border-r' : 'border-l';
    return (
        <AnimatePresence mode="wait">
            {isOpen && (
                <>
                    <motion.div
                        key="drawer-overlay"
                        variants={overlayVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={overlayTransition}
                        onClick={onClose}
                        className={`fixed inset-0 z-50 bg-overlay backdrop-blur-sm ${overlayClassName}`}
                        aria-hidden
                    />
                    <motion.div
                        key="drawer-panel"
                        variants={slideVariants[direction]}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={springTransition}
                        className={`fixed z-50 flex flex-col bg-background shadow-2xl ${positionClasses} ${borderClasses} border-border ${sizeClasses[size][direction]} ${className}`}
                        role="dialog"
                        aria-modal="true"
                        aria-label={title || 'Drawer'}
                    >
                        {headerSlot ? headerSlot : (title || showCloseButton) ? (
                            <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-divider shrink-0 bg-surface">
                                {title && (
                                    <h2 className="text-lg font-semibold text-foreground font-heading tracking-tight">
                                        {title}
                                    </h2>
                                )}
                                {showCloseButton && (
                                    <button
                                        onClick={onClose}
                                        className="ml-auto p-2 rounded-md text-foreground-secondary hover:bg-muted hover:text-foreground transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-focus-ring hover:scale-110 active:scale-95"
                                        aria-label="Close drawer"
                                    >
                                        <X size={20} strokeWidth={2} />
                                    </button>
                                )}
                            </div>
                        ) : null}
                        {children}
                        {footerSlot && footerSlot}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}