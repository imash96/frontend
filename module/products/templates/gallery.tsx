"use client"

import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react"
import type { StoreProductImage } from "@medusajs/types"
import Placeholder from "@/icon/img-placeholder"
import { useThumbCarousel } from "@/lib/hook/use-thumb-carousel"
import Image from "next/image"
import { useEffect, useState } from "react"
import { createPortal } from "react-dom"

type Props = {
    images: StoreProductImage[] | null
    title: string
}

export default function ProductGallery({ images, title }: Props) {

    if (!images || images.length === 0) {
        return (
            <div className="flex aspect-3/4 w-full items-center justify-center border border-border bg-surface-sunken">
                <Placeholder className="w-1/2 text-border-strong" />
            </div>
        )
    }
    const [lightboxOpen, setLightboxOpen] = useState(false)
    const { mainRef, selectedIndex, onThumbClick, scrollPrev, scrollNext, thumbsRef } = useThumbCarousel({
        options: { loop: true, dragFree: false },
        thumbOptions: {
            containScroll: "keepSnaps",
            dragFree: true,
            axis: "x",
            breakpoints: { "(min-width: 1024px)": { axis: "y" } },
        },
    })

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

    const active = images[selectedIndex] ?? images[0]

    return (
        <>
            <div className="flex h-full flex-col gap-2 lg:flex-row lg:max-h-[calc(100vh-9rem)]">
                {images.length > 1 && (
                    <div
                        ref={thumbsRef}
                        className="order-2 shrink-0 overflow-hidden no-scrollbar lg:order-1 lg:overflow-auto"
                        aria-label="Product image thumbnails"
                    >
                        <div className="flex gap-2 lg:flex-col">
                            {images.map((img, i) => (
                                <button
                                    type="button"
                                    key={img.id ?? i}
                                    onClick={() => onThumbClick(i)}
                                    aria-label={`View image ${i + 1} of ${images.length}`}
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
                            {images.map((img, i) => (
                                <div key={img.id ?? i} className="relative aspect-3/4 min-w-0 shrink-0 grow-0 basis-full">
                                    <Image
                                        src={img.url}
                                        alt={`${title} - view ${i + 1}`}
                                        width={1200}
                                        height={1600}
                                        sizes="(max-width: 1024px) 100vw, (max-width: 1680px) 58vw, 960px"
                                        quality={i === 0 ? 80 : 70}
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

                    {images.length > 1 && (
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

                    {images.length > 1 && (
                        <div className="absolute bottom-3 right-3 z-10 rounded-full bg-surface/90 px-2.5 py-1 text-xs font-medium text-text-secondary shadow-sm backdrop-blur-sm lg:hidden">
                            {selectedIndex + 1} / {images.length}
                        </div>
                    )}
                </div>
            </div>

            {lightboxOpen &&
                createPortal(
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-label={`${title} - full size image`}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-overlay-heavy p-4 backdrop-blur-sm sm:p-10"
                        onClick={() => setLightboxOpen(false)}
                    >
                        <button
                            type="button"
                            autoFocus
                            onClick={() => setLightboxOpen(false)}
                            aria-label="Close"
                            className="absolute right-4 top-4 z-10 flex size-10 items-center justify-center rounded-full bg-surface text-text-primary shadow-sm"
                        >
                            <X className="size-5" />
                        </button>

                        <div
                            className="relative h-[min(80vh,900px)] w-full max-w-4xl"
                        >
                            <Image
                                src={active.url}
                                alt={`${title} — full size view ${selectedIndex + 1}`}
                                fill
                                sizes="100vw"
                                quality={80}
                                className="object-contain"
                                priority
                            />
                        </div>

                        {images.length > 1 && (
                            <>
                                <button
                                    type="button"
                                    onClick={scrollPrev}
                                    aria-label="Previous image"
                                    className="absolute left-3 top-1/2 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-surface text-text-primary shadow-sm sm:left-6"
                                >
                                    <ChevronLeft className="size-5" />
                                </button>
                                <button
                                    type="button"
                                    onClick={scrollNext}
                                    aria-label="Next image"
                                    className="absolute right-3 top-1/2 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-surface text-text-primary shadow-sm sm:right-6"
                                >
                                    <ChevronRight className="size-5" />
                                </button>
                            </>
                        )}
                    </div>,
                    document.body
                )}
        </>
    )
}
