import Placeholder from "@/icon/img-placeholder";
import { StoreProductImage } from "@medusajs/types";
import Image from "next/image";

export default function ProductThumbnail({ src, alt, className = "", children, ...props }: ProductThumbnailProps) {
    const hasMultipleImages = Array.isArray(src) && src.length > 1;
    const primaryUrl = (Array.isArray(src) ? src[0]?.url : src) || "/svg/placeholder.svg";
    const secondaryUrl = hasMultipleImages ? (src[1]?.url || "/svg/placeholder.svg") : null;
    return (
        <div className={`relative aspect-3/4 w-full bg-same-white overflow-hidden no-scrollbar border border-border ${className}`}>
            {!src ? <Placeholder className="text-foreground-muted w-full h-full" /> :
                <>
                    <img
                        src={primaryUrl}
                        alt={alt}
                        loading="lazy"
                        className={`absolute inset-0 w-full h-full object-contain object-center transition-opacity duration-300 ease-in-out ${hasMultipleImages ? 'group-hover:opacity-0' : ''}`}
                        {...props}
                    />
                    {secondaryUrl && (
                        <img
                            src={secondaryUrl}
                            alt={`${alt} alternate view`}
                            loading="lazy"
                            className="absolute inset-0 w-full h-full object-contain object-center transition-opacity duration-300 ease-in-out opacity-0 group-hover:opacity-100"
                            {...props}
                        />
                    )}
                </>
            }
            {children}
        </div>
    )
}

type ProductThumbnailProps = {
    src?: string | StoreProductImage[] | null
} & Omit<React.ComponentPropsWithoutRef<typeof Image>, 'src'>