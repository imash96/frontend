"use client"

import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';
import { StoreProductImage } from '@medusajs/types';
import Placeholder from '@/icon/img-placeholder';
import { useThumbCarousel } from '@/lib/hook/use-thumb-carousel';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

type Props = {
    images: StoreProductImage[] | null;
    title: string;
}

export default function ProductGallery({ images, title }: Props) {
    if (!images || images.length === 0) {
        return (
            <div className="flex aspect-3/4 w-full items-center justify-center rounded-lg border border-border bg-surface-sunken">
                <Placeholder className="w-1/2 text-border-strong" />
            </div>
        )
    }

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
            breakpoints: { "(min-width: 768px)": { axis: "y" } },
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

    return (
        <>
            <div className={`flex flex-col gap-2 md:flex-row h-full md:max-h-[calc(100vh-9rem)]`}>
                {/* ── Thumbnails ──────────────────────────────────── */}
                {images.length > 1 && (
                    <div
                        className={"order-2 md:order-1 overflow-hidden no-scrollbar md:overflow-auto shrink-0"}
                        aria-label="Product image thumbnails"
                        ref={thumbsRef}
                    >
                        <div className="flex gap-2 md:flex-col">
                            {images.map((img, i) => (
                                <button
                                    type="button"
                                    key={img.id}
                                    onClick={() => onThumbClick(i)}
                                    aria-current={i === selectedIndex ? "true" : "false"}
                                    className={`shrink-0 max-w-16 h-20 rounded overflow-hidden border-2 transition-all duration-200 ${selectedIndex === i ? 'border-primary opacity-100 ring-2 ring-primary/20' : 'border-border hover:border-border-strong opacity-50 hover:opacity-80'}`}
                                >
                                    <Image
                                        src={img.url}
                                        alt={`${title} thumbnail ${i + 1}`}
                                        width={80}
                                        height={107}
                                        sizes="80px"
                                        placeholder="empty"
                                        className="object-contain rounded size-full p-0.5 group-hover:opacity-80 transition-opacity"
                                    />
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* ── Main Carousel ───────────────────────────────── */}
                <div className="group relative order-1 md:order-2 flex-1 min-w-0 border border-border bg-white">
                    <div className="overflow-hidden h-full" ref={mainRef}>
                        <div className="flex gap-x-2 h-full touch-pan-y">
                            {images.map((img, i) => (
                                <div key={i} className="flex-[0_0_100%] min-w-0">
                                    <div className="aspect-3/4 md:aspect-auto md:h-full overflow-hidden">
                                        <Image
                                            src={img.url}
                                            alt={`${title} - view ${i + 1}`}
                                            sizes="(max-width: 640px) 100vw, (max-width: 768px) 80vw, (max-width: 1024px) 70vw, 80vw"
                                            width={1200}
                                            height={1600}
                                            className="size-full object-center object-contain transition-transform duration-700 ease-out hover:scale-105"
                                            loading={i === 0 ? 'eager' : 'lazy'}
                                            priority={i === 0}
                                            fetchPriority={i === 0 ? "high" : "auto"}
                                            draggable={false}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Desktop arrows */}
                    {images.length > 1 && (
                        <>
                            <button
                                onClick={scrollPrev}
                                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm text-neutral-800 shadow-md hidden md:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-white hover:scale-110 active:scale-95"
                                aria-label="Previous image"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                                onClick={scrollNext}
                                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm text-neutral-800 shadow-md hidden md:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-white hover:scale-110 active:scale-95"
                                aria-label="Next image"
                            >
                                <ChevronRight className="w-5 h-5" />
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

                    {/* Image counter badge */}
                    <div className="absolute bottom-3 right-3 z-10 rounded-full bg-surface/90 px-2.5 py-1 text-xs font-medium text-text-secondary shadow-sm backdrop-blur-sm sm:hidden">
                        {selectedIndex + 1} / {images.length}
                    </div>
                </div>
            </div>
            {lightboxOpen && createPortal(
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-label={`${title} - full size image`}
                    className="fixed inset-0 z-60 flex items-center justify-center bg-white p-4 backdrop-blur-sm sm:p-10"
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

                    <div
                        className="relative h-full w-full max-w-4xl"
                    >
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
                                onClick={(e) => {
                                    e.stopPropagation()
                                    scrollPrev()
                                }}
                                aria-label="Previous image"
                                className="absolute left-3 top-1/2 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-surface/90 text-text-primary shadow-sm sm:left-6"
                            >
                                <ChevronLeft className="size-5" />
                            </button>

                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    scrollNext()
                                }}
                                aria-label="Next image"
                                className="absolute right-3 top-1/2 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-surface/90 text-text-primary shadow-sm sm:right-6"
                            >
                                <ChevronRight className="size-5" />
                            </button>
                        </>
                    )}
                </div>,
                document.body
            )}
        </>
    );
}