import Placeholder from "@/icon/img-placeholder";
import Image from "next/image";

type ThumbnailProps = {
    thumbnail?: string | null
    alt?: string;
    className?: string;
    isShadow?: boolean;
}

export default function Thumbnail({ thumbnail, alt = "Product thumbnail", className = "", ...prop }: ThumbnailProps) {
    return (
        <ImageHolder className={className} {...prop}>
            <ImageOrPlaceholder thumbnail={thumbnail} alt={alt} />
        </ImageHolder >
    )
}

export const ImageHolder = ({ className = "", children, isShadow }: Pick<ThumbnailProps, "className" | "isShadow"> & React.PropsWithChildren) => {
    return (
        <div className={`relative w-full overflow-hidden bg-white rounded-lg aspect-[.75] no-scrollbar border border-border ${isShadow ? "shadow-md shadow-shadow hover:shadow-lg transition-shadow ease-in-out duration-300" : ""} ${className ?? ""}`}>
            {children}
        </div>
    )
}

export const ImageOrPlaceholder = ({ thumbnail, alt }: Pick<ThumbnailProps, "thumbnail"> & { alt: string }) => {
    return (
        <>
            {thumbnail ? (
                <Image
                    src={thumbnail}
                    alt={alt}
                    draggable={false}
                    className="object-contain"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    fill
                />
            ) : (
                <div className="flex items-center justify-center h-full">
                    <Placeholder className="w-1/2 h-1/2 sm:w-1/3 sm:h-1/3 text-border" />
                </div>
            )}
        </>
    )
}