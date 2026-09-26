"use client"

import type { StoreProduct } from "@medusajs/types"
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react"
import Image from "next/image"
import { useEffect, useMemo, useRef, useState } from "react"
import { createPortal } from "react-dom"
import Placeholder from "@/icon/img-placeholder"
import { useThumbCarousel } from "@/lib/hook/use-thumb-carousel"
import { getDisplayImages, useProductStore } from "@/lib/store/product-store"

type Props = {
    product: StoreProduct
    title: string
}

export default function ProductGallery({ product, title }: Props) {
    const [lightboxOpen, setLightboxOpen] = useState(false)
    const selectedVariant = useProductStore((s) => s.selectedVariant)
    const prevImagesRef = useRef<typeof displayImages | null>(null)

    const displayImages = useMemo(
        () => getDisplayImages(product, selectedVariant),
        [product, selectedVariant]
    )

    const { mainRef, mainApi, selectedIndex, onThumbClick, scrollPrev, scrollNext, thumbsRef, scrollTo } =
        useThumbCarousel({
            options: { loop: true, dragFree: false },
            thumbOptions: {
                containScroll: "keepSnaps",
                dragFree: true,
                axis: "x",
                breakpoints: { "(min-width: 1024px)": { axis: "y" } },
            },
        })

    // Reset carousel when variant images change
    useEffect(() => {
        if (prevImagesRef.current && prevImagesRef.current !== displayImages) {
            // Wait a tick for the DOM to update with new children, then reInit embla
            requestAnimationFrame(() => {
                mainApi?.reInit()
                scrollTo(0)
            })
        }
        prevImagesRef.current = displayImages
    }, [displayImages, mainApi, scrollTo])

    useEffect(() => {
        if (!lightboxOpen) return
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setLightboxOpen(false)
            if (e.key === "ArrowLeft") scrollPrev()
            if (e.key === "ArrowRight") scrollNext()
        }
        const prev = document.body.style.overflow
        document.body.style.overflow = "hidden"
        window.addEventListener("keydown", onKey)
        return () => {
            document.body.style.overflow = prev
            window.removeEventListener("keydown", onKey)
        }
    }, [lightboxOpen, scrollPrev, scrollNext])

    if (!displayImages || displayImages.length === 0) {
        return (
            <div className="flex aspect-3/4 w-full items-center justify-center border border-border bg-surface-sunken">
                <Placeholder className="w-1/2 text-border-strong" />
            </div>
        )
    }

    const active = displayImages[selectedIndex] ?? displayImages[0]

    return (
        <>
            <div className="flex h-full flex-col gap-2 lg:flex-row">
                {displayImages.length > 1 && (
                    <div
                        ref={thumbsRef}
                        className="order-2 shrink-0 overflow-hidden no-scrollbar lg:order-1 lg:overflow-auto"
                        aria-label="Product image thumbnails"
                    >
                        <div className="flex gap-2 lg:flex-col lg:max-h-[calc(100vh-9rem)]">
                            {displayImages.map((img, i) => (
                                <button
                                    type="button"
                                    key={img.id ?? i}
                                    onClick={() => onThumbClick(i)}
                                    aria-label={`View image ${i + 1} of ${displayImages.length}`}
                                    aria-current={i === selectedIndex ? "true" : "false"}
                                    className={`relative aspect-3/4 max-w-16 shrink-0 overflow-hidden border-2 bg-surface transition-colors ${selectedIndex === i ? "border-primary" : "border-border opacity-60 hover:border-border-strong hover:opacity-100"}`}
                                >
                                    <Image
                                        src={img.url}
                                        alt={`${title} thumbnail ${i + 1}`}
                                        width={80}
                                        height={107}
                                        sizes="80px"
                                        quality={60}
                                        className="object-contain size-full p-0.5"
                                    />
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <div className="group relative order-1 min-w-0 flex-1 overflow-hidden border border-border bg-white lg:order-2">
                    <div className="overflow-hidden" ref={mainRef}>
                        <div className="flex gap-x-1 touch-pan-y">
                            {displayImages.map((img, i) => (
                                <div key={img.id ?? i} className="relative aspect-3/4 min-w-0 shrink-0 grow-0 basis-full">
                                    <Image
                                        src={img.url}
                                        alt={`${title} - view ${i + 1}`}
                                        width={1200}
                                        height={1600}
                                        sizes="(max-width: 1024px) 100vw, (max-width: 1680px) 58vw, 960px"
                                        quality={i === 0 ? 90 : 75}
                                        className="size-full object-contain object-center"
                                        loading={i === 0 ? "eager" : "lazy"}
                                        priority={i === 0}
                                        fetchPriority={i === 0 ? "high" : "auto"}
                                        draggable={false}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {displayImages.length > 1 && (
                        <>
                            <button
                                type="button"
                                onClick={scrollPrev}
                                className="absolute left-3 top-1/2 z-10 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full bg-surface/90 text-text-primary opacity-0 shadow-sm backdrop-blur-sm transition-opacity duration-200 hover:bg-surface group-hover:opacity-100 focus-visible:opacity-100 md:flex"
                                aria-label="Previous image"
                            >
                                <ChevronLeft className="size-5" />
                            </button>
                            <button
                                type="button"
                                onClick={scrollNext}
                                className="absolute right-3 top-1/2 z-10 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full bg-surface/90 text-text-primary opacity-0 shadow-sm backdrop-blur-sm transition-opacity duration-200 hover:bg-surface group-hover:opacity-100 focus-visible:opacity-100 md:flex"
                                aria-label="Next image"
                            >
                                <ChevronRight className="size-5" />
                            </button>
                        </>
                    )}

                    <button
                        type="button"
                        onClick={() => setLightboxOpen(true)}
                        aria-label="Open full-size image"
                        className="absolute right-3 top-3 z-10 flex size-10 items-center justify-center rounded-full bg-surface/90 text-text-primary opacity-0 shadow-sm backdrop-blur-sm transition-opacity duration-200 focus-visible:opacity-100 group-hover:opacity-100"
                    >
                        <ZoomIn className="size-4.5" />
                    </button>

                    {displayImages.length > 1 && (
                        <div className="absolute bottom-3 right-3 z-10 rounded-full bg-surface/90 px-2.5 py-1 text-xs font-medium text-text-secondary shadow-sm backdrop-blur-sm lg:hidden">
                            {selectedIndex + 1} / {displayImages.length}
                        </div>
                    )}
                </div>
            </div>

            {lightboxOpen && createPortal(
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-label={`${title} - full size image`}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-overlay-heavy p-4 backdrop-blur-sm sm:p-10"
                    onClick={() => setLightboxOpen(false)}
                >
                    <div
                        className="relative size-full max-w-5xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Image
                            src={active.url}
                            alt={`${title} - full size view ${selectedIndex + 1}`}
                            width={1200}
                            height={1600}
                            sizes="100vw"
                            quality={80}
                            className="object-contain"
                            priority
                        />
                    </div>

                    <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2">
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation()
                                scrollPrev()
                            }}
                            aria-label="Previous image"
                            className="flex size-11 items-center justify-center rounded-full bg-surface text-text-primary shadow-sm transition-opacity hover:opacity-90"
                        >
                            <ChevronLeft className="size-5" />
                        </button>
                        <button
                            type="button"
                            autoFocus
                            onClick={(e) => {
                                e.stopPropagation()
                                setLightboxOpen(false)
                            }}
                            aria-label="Close"
                            className="flex size-11 items-center justify-center rounded-full bg-surface text-text-primary shadow-sm transition-opacity hover:opacity-90"
                        >
                            <X className="size-5" />
                        </button>
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation()
                                scrollNext()
                            }}
                            aria-label="Next image"
                            className="flex size-11 items-center justify-center rounded-full bg-surface text-text-primary shadow-sm transition-opacity hover:opacity-90"
                        >
                            <ChevronRight className="size-5" />
                        </button>
                    </div>
                </div>,
                document.body
            )
            }
        </>
    )
}
