'use client';

import { Dialog, DialogClose as DialogClosePri, DialogContent as DialogContentPri, DialogDescription as DialogDescriptionPri, DialogOverlay as DialogOverlayPri, DialogPortal, DialogTitle as DialogTitlePri, DialogTrigger } from "@radix-ui/react-dialog"
import { X } from "lucide-react";
import { ModalSize } from "@/types/index";

const sizeClasses: Record<ModalSize, string> = {
    xs: 'max-w-xs',
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-full mx-4',
};

function DialogOverlay(props: React.ComponentPropsWithoutRef<typeof DialogOverlayPri>) {
    return (
        <DialogOverlayPri
            className="fixed inset-0 z-50 bg-overlay-heavy backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 duration-200"
            {...props}
        />
    )
}

function DialogContent({ className = "", children, size = 'md', rounded = true, ...props }: React.ComponentPropsWithoutRef<typeof DialogContentPri> & { size?: ModalSize, rounded?: boolean }) {
    return (
        <DialogPortal>
            <DialogOverlay />
            <DialogContentPri
                onCloseAutoFocus={(e) => e.preventDefault()}
                aria-modal="true"
                className={`fixed left-[50%] top-[50%] max-w- z-50 translate-x-[-50%] translate-y-[-50%] w-full ${sizeClasses[size]} max-h-[90vh] sm:max-h-[85vh] bg-surface border border-border ${rounded ? 'rounded-xl' : 'rounded-none'} shadow-xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] duration-300 flex flex-col ${className}`}
                {...props}
            >
                {children}
            </DialogContentPri>
        </DialogPortal>
    )
}

function DialogHeader({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return <div className={`flex items-start justify-between gap-4 p-4 sm:p-6 border-b border-divider ${className}`} {...props} />
}

function DialogTitle({ className = "", ...props }: React.ComponentPropsWithoutRef<typeof DialogTitlePri>) {
    return <DialogTitlePri className={`text-lg sm:text-xl font-semibold text-foreground font-heading tracking-tight ${className}`} {...props} />
}

function DialogDescription({ className = "", ...props }: React.ComponentPropsWithoutRef<typeof DialogDescriptionPri>) {
    return <DialogDescriptionPri className={`mt-1 sm:mt-2 text-sm text-foreground-secondary leading-relaxed ${className}`} {...props} />
}

function DialogClose({ className = "", children, ...props }: React.ComponentPropsWithoutRef<typeof DialogClosePri>) {
    return <DialogClosePri aria-label="Close dialog" className={`shrink-0 rounded-md p-2 text-foreground-secondary hover:bg-muted hover:text-foreground transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-focus-ring focus:ring-offset-2 hover:scale-110 active:scale-95 min-w-11 min-h-11 flex items-center justify-center sm:min-w-0 sm:min-h-0 ${className}`} {...props} >
        {children ? children : <X className="size-5" strokeWidth={2} />}
    </DialogClosePri>
}

export {
    Dialog,
    DialogTrigger,
    DialogClose,
    DialogPortal,
    DialogOverlay,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
}

