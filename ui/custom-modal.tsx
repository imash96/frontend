import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "./modal";
import { ModalSize } from "@/types/common";
import { div as Div } from "motion/react-client"

export interface CustomModalProps {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    trigger?: React.ReactNode;
    title?: string;
    description?: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
    size?: ModalSize;
    showClose?: boolean;
    closeOnOverlayClick?: boolean;
    className?: string;
}

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
}: CustomModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}


            <DialogContent
                size={size}
                onPointerDownOutside={(e) => {
                    if (!closeOnOverlayClick) {
                        e.preventDefault();
                    }
                }}
            >
                {/* Header */}
                {(title || description || showClose) && (
                    <div className="flex items-start justify-between p-4 sm:p-6 border-b border-divider">
                        <div className="flex-1 pr-4">
                            {title && (
                                <DialogTitle className="text-lg sm:text-xl font-semibold text-foreground font-heading">
                                    {title}
                                </DialogTitle>
                            )}
                            {description && (
                                <DialogDescription className="mt-1 sm:mt-2 text-sm text-foreground-secondary">
                                    {description}
                                </DialogDescription>
                            )}
                        </div>

                        {showClose && <DialogClose />}
                    </div>
                )}

                {/* Content with animation */}
                <Div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.2 }}
                    className="flex-1 overflow-y-auto p-4 sm:p-6"
                >
                    {children}
                </Div>

                {/* Footer */}
                {footer && (
                    <div className="p-4 sm:p-6 border-t border-divider">
                        {footer}
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}