import { StoreProductImage } from "@medusajs/types";
import Image from "next/image";
import Placeholder from "@/icon/img-placeholder";

export default function ProductThumbnail({ src, alt, className = "", children, ...props }: ProductThumbnailProps) {
    const hasMultipleImages = Array.isArray(src) && src.length > 1;
    const primaryUrl = (Array.isArray(src) ? src[0]?.url : src) || "/svg/placeholder.svg";
    const secondaryUrl = hasMultipleImages ? (src[1]?.url || "/svg/placeholder.svg") : null;
    return (
        <div className={`relative aspect-3/4 bg-same-white overflow-hidden no-scrollbar border border-border group ${className}`}>
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



// -----------------------------------------------------------------------------------------


type ImageProps = React.ComponentPropsWithoutRef<typeof Image>

type ProductThumbnailPropsN = {
    /** A single URL, or a product's images (the 2nd one is shown on hover/focus of a parent `.group`). */
    src?: string | readonly { url: string }[] | null
    alt: string
    /** Only used to derive the aspect ratio (default 3 / 4). The box is sized by CSS, not by these. */
    width?: number
    height?: number
    children?: React.ReactNode
} & Omit<ImageProps, "src" | "alt" | "fill" | "width" | "height">

const DEFAULT_SIZES = "(min-width: 1280px) 16vw, (min-width: 768px) 30vw, 46vw"

function toUrls(src: ProductThumbnailPropsN["src"]): string[] {
    if (!src) return []
    if (typeof src === "string") return [src]
    return src.map((image) => image.url).filter(Boolean)
}

export function ProductThumbnailN({
    src,
    alt,
    width,
    height,
    className = "",
    children,
    sizes = DEFAULT_SIZES,
    quality = 75,
    preload = false,
    loading,
    ...rest
}: ProductThumbnailPropsN) {
    const [primary, secondary] = toUrls(src)
    const aspectRatio = width && height ? `${width} / ${height}` : "3 / 4"

    return (
        <div
            className={`relative w-full overflow-hidden border border-border bg-white ${className}`}
            style={{ aspectRatio }}
        >
            {primary ? (
                <>
                    <Image
                        {...rest}
                        src={primary}
                        alt={alt}
                        fill
                        sizes={sizes}
                        quality={quality}
                        preload={preload}
                        loading={preload ? undefined : (loading ?? "lazy")}
                        className={`object-contain object-center transition-opacity duration-300 ease-in-out motion-reduce:transition-none ${secondary ? "group-hover:opacity-0 group-focus-within:opacity-0" : ""
                            }`}
                    />
                    {secondary && (
                        // Decorative alternate view: empty alt keeps screen readers from announcing the product twice.
                        <Image
                            src={secondary}
                            alt=""
                            fill
                            sizes={sizes}
                            quality={quality}
                            loading="lazy"
                            className="object-contain object-center opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100 group-focus-within:opacity-100 motion-reduce:transition-none"
                        />
                    )}
                </>
            ) : (
                <Placeholder role="img" aria-label="No image available" className="size-full text-foreground-muted" />
            )}
            {children}
        </div>
    )
}