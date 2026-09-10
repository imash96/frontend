import type { StoreProductImage } from "@medusajs/types";
import Image from "next/image";
import Placeholder from "@/icon/img-placeholder";

export default function ProductThumbnail({
  src,
  alt,
  className = "",
  children,
  ...props
}: ProductThumbnailProps) {
  const hasMultipleImages = Array.isArray(src) && src.length > 1;
  const primaryUrl =
    (Array.isArray(src) ? src[0]?.url : src) || "/svg/placeholder.svg";
  const secondaryUrl = hasMultipleImages
    ? src[1]?.url || "/svg/placeholder.svg"
    : null;
  return (
    <div
      className={`relative aspect-3/4 bg-same-white overflow-hidden no-scrollbar select-none border border-border ${className}`}
    >
      {!src ? (
        <Placeholder className="text-foreground-muted size-full" />
      ) : (
        <>
          <Image
            src={primaryUrl}
            alt={alt}
            loading="lazy"
            width={300}
            height={400}
            className={`absolute inset-0 size-full object-contain object-center transition-opacity duration-300 ease-in-out ${hasMultipleImages ? "group-hover:opacity-0" : ""}`}
            {...props}
          />
          {secondaryUrl && (
            <Image
              src={secondaryUrl}
              alt={`${alt} alternate view`}
              loading="lazy"
              width={300}
              height={400}
              className="absolute inset-0 size-full object-contain object-center transition-opacity duration-300 ease-in-out opacity-0 group-hover:opacity-100"
              {...props}
            />
          )}
        </>
      )}
      {children}
    </div>
  );
}

type ProductThumbnailProps = {
  src?: string | StoreProductImage[] | null;
} & Omit<React.ComponentPropsWithoutRef<typeof Image>, "src">;
