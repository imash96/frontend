"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react"
import type { StoreProductImage } from "@medusajs/types"
import Placeholder from "@/icon/img-placeholder"
import { useThumbCarousel } from "@/lib/hook/use-thumb-carousel"

type ProductGalleryProps = {
    images: StoreProductImage[] | null
    title: string
}

export default function ProductGallery({ images, title }: ProductGalleryProps) {
    const [lightboxOpen, setLightboxOpen] = useState(false)

    const { mainRef, selectedIndex, onThumbClick, scrollPrev, scrollNext, thumbsRef } = useThumbCarousel({
        options: {
            loop: true,
            dragFree: false
        },
        thumbOptions: {
            containScroll: "keepSnaps",
            dragFree: true,
            axis: "x",
            breakpoints: { "(min-width: 1024px)": { axis: "y" } },
        }
    })

    useEffect(() => {
        if (!lightboxOpen) return
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setLightboxOpen(false)
            if (e.key === "ArrowLeft") scrollPrev()
            if (e.key === "ArrowRight") scrollNext()
        }
        document.body.style.overflow = "hidden"
        window.addEventListener("keydown", onKey)
        return () => {
            document.body.style.overflow = ""
            window.removeEventListener("keydown", onKey)
        }
    }, [lightboxOpen, scrollPrev, scrollNext])


    if (!images || images.length === 0) {
        return (
            <div className="flex aspect-3/4 w-full items-center justify-center rounded-lg border border-border bg-surface-sunken">
                <Placeholder className="w-1/2 text-border-strong" />
            </div>
        )
    }

    return (
        <>
            <div className="flex flex-col gap-2 lg:flex-row h-full">
                {images.length > 1 && (
                    <div
                        ref={thumbsRef}
                        className="order-2 lg:order-1 overflow-hidden no-scrollbar lg:w-20 lg:overflow-auto xl:w-24 flex gap-2 lg:flex-col"
                        aria-label="Product image thumbnails"
                    >
                        {images.map((image, index) => (
                            <button
                                key={image.id ?? index}
                                type="button"
                                onClick={() => onThumbClick(index)}
                                aria-label={`View image ${index + 1} of ${images.length}`}
                                aria-current={index === selectedIndex ? "true" : "false"}
                                className={`relative aspect-3/4 w-16 shrink-0 overflow-hidden rounded-md border-2 bg-surface transition-colors sm:w-18 lg:w-full ${index === selectedIndex ? "border-primary" : "border-border hover:border-border-strong"}`}
                            >
                                <Image src={image.url} alt={`${title} thumbnail ${index + 1}`} fill sizes="80px" className="object-cover" />
                            </button>
                        ))}
                    </div>
                )}

                <div className="group relative order-1 flex-1 overflow-hidden rounded-lg border border-border bg-surface lg:order-2">
                    <div ref={mainRef} className="overflow-hidden">
                        <div className="flex touch-pan-y">
                            {images.map((image, index) => (
                                <div key={image.id ?? index} className="relative aspect-3/4 min-w-0 shrink-0 grow-0 basis-full">
                                    <Image
                                        src={image.url}
                                        alt={`${title} - view ${index + 1}`}
                                        fill
                                        sizes="(max-width: 1024px) 100vw, 55vw"
                                        className="object-cover"
                                        priority={index === 0}
                                        fetchPriority={index === 0 ? "high" : "auto"}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => setLightboxOpen(true)}
                        aria-label="Open full-size image"
                        className="absolute right-3 top-3 z-10 flex size-10 items-center justify-center rounded-full bg-surface/90 text-text-primary opacity-0 shadow-sm backdrop-blur-sm transition-opacity duration-200 focus-visible:opacity-100 group-hover:opacity-100"
                    >
                        <ZoomIn className="size-4.5" />
                    </button>

                    {images.length > 1 && (
                        <>
                            <button
                                type="button"
                                onClick={scrollPrev}
                                aria-label="Previous image"
                                className="absolute left-2 top-1/2 z-10 hidden size-9 -translate-y-1/2 items-center justify-center rounded-full bg-surface/90 text-text-primary opacity-0 shadow-sm backdrop-blur-sm transition-opacity hover:bg-surface group-hover:opacity-100 sm:flex"
                            >
                                <ChevronLeft className="size-5" />
                            </button>
                            <button
                                type="button"
                                onClick={scrollNext}
                                aria-label="Next image"
                                className="absolute right-2 top-1/2 z-10 hidden size-9 -translate-y-1/2 items-center justify-center rounded-full bg-surface/90 text-text-primary opacity-0 shadow-sm backdrop-blur-sm transition-opacity hover:bg-surface group-hover:opacity-100 sm:flex"
                            >
                                <ChevronRight className="size-5" />
                            </button>
                            <div className="absolute bottom-3 right-3 z-10 rounded-full bg-surface/90 px-2.5 py-1 text-xs font-medium text-text-secondary shadow-sm backdrop-blur-sm sm:hidden">
                                {selectedIndex + 1} / {images.length}
                            </div>
                        </>
                    )}
                </div>
            </div>

            {lightboxOpen && (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-label={`${title} — full size image`}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-overlay-heavy p-4 backdrop-blur-sm sm:p-10"
                    onClick={() => setLightboxOpen(false)}
                >
                    <button
                        type="button"
                        autoFocus
                        onClick={() => setLightboxOpen(false)}
                        aria-label="Close"
                        className="absolute right-4 top-4 z-10 flex size-10 items-center justify-center rounded-full bg-surface/90 text-text-primary shadow-sm"
                    >
                        <X className="size-5" />
                    </button>
                    <div className="relative h-full w-full max-w-3xl" onClick={(e) => e.stopPropagation()}>
                        <Image
                            src={images[selectedIndex].url}
                            alt={`${title} — full size view ${selectedIndex + 1}`}
                            fill
                            sizes="100vw"
                            className="object-contain"
                        />
                    </div>
                    {images.length > 1 && (
                        <>
                            <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); scrollPrev() }}
                                aria-label="Previous image"
                                className="absolute left-3 top-1/2 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-surface/90 text-text-primary shadow-sm sm:left-6"
                            >
                                <ChevronLeft className="size-5" />
                            </button>
                            <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); scrollNext() }}
                                aria-label="Next image"
                                className="absolute right-3 top-1/2 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-surface/90 text-text-primary shadow-sm sm:right-6"
                            >
                                <ChevronRight className="size-5" />
                            </button>
                        </>
                    )}
                </div>
            )}
        </>
    )
}