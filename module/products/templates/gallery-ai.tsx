"use client"

import type { StoreProduct } from "@medusajs/types"
import {
    useKeenSlider,
    type KeenSliderPlugin,
    type KeenSliderInstance,
} from "keen-slider/react"
import "keen-slider/keen-slider.min.css"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { getDisplayImages, useProductStore } from "@/lib/store/product-store"
import Image from "next/image"
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react"
import { createPortal } from "react-dom"
import Placeholder from "@/icon/img-placeholder"

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type Props = {
    product: StoreProduct
    title: string
}

/* ------------------------------------------------------------------ */
/*  Thumbnail Plugin                                                   */
/* ------------------------------------------------------------------ */

function ThumbnailPlugin(
    mainRef: React.RefObject<KeenSliderInstance | null>
): KeenSliderPlugin {
    return (slider) => {
        function addActive(idx: number) {
            slider.slides.forEach((s, i) => {
                s.classList.toggle("thumb-active", i === idx)
            })
        }

        function addClickEvents() {
            slider.slides.forEach((slide, idx) => {
                slide.addEventListener("click", () => {
                    mainRef.current?.moveToIdx(idx)
                })
            })
        }

        slider.on("created", () => {
            if (!mainRef.current) return
            addActive(slider.track.details.rel)
            addClickEvents()

            mainRef.current.on("animationStarted", (main) => {
                const next = main.animator.targetIdx ?? 0
                addActive(main.track.absToRel(next))
                slider.moveToIdx(
                    Math.min(slider.track.details.maxIdx, next)
                )
            })
        })
    }
}

/* ------------------------------------------------------------------ */
/*  Gallery Component                                                  */
/* ------------------------------------------------------------------ */

export default function ProductGallery({ product, title }: Props) {
    const [lightboxOpen, setLightboxOpen] = useState(false)
    const [selectedIndex, setSelectedIndex] = useState(0)
    const selectedVariant = useProductStore((s) => s.selectedVariant)
    const prevImagesRef = useRef<ReturnType<typeof getDisplayImages> | null>(null)

    /* ---- Main slider ---- */
    const [mainRef, mainInstanceRef] = useKeenSlider<HTMLDivElement>({
        initial: 0,
        slideChanged(slider) {
            setSelectedIndex(slider.track.details.rel)
        },
    })

    /* ---- Thumbnail slider ---- */
    const [thumbRef, thumbInstanceRef] = useKeenSlider<HTMLDivElement>(
        {
            initial: 0,
            slides: {
                perView: 5,
                spacing: 8,
            },
            breakpoints: {
                "(min-width: 1024px)": {
                    vertical: true,
                    slides: { perView: 5, spacing: 8 },
                },
            },
        },
        [ThumbnailPlugin(mainInstanceRef)]
    )

    const displayImages = useMemo(
        () => getDisplayImages(product, selectedVariant),
        [product, selectedVariant]
    )

    /* ---- Reinitialise sliders when images change (variant switch) ---- */
    useEffect(() => {
        if (prevImagesRef.current && prevImagesRef.current !== displayImages) {
            requestAnimationFrame(() => {
                mainInstanceRef.current?.update()
                thumbInstanceRef.current?.update()
                mainInstanceRef.current?.moveToIdx(0)
                setSelectedIndex(0)
            })
        }
        prevImagesRef.current = displayImages
    }, [displayImages, mainInstanceRef, thumbInstanceRef])

    /* ---- Navigation helpers ---- */
    const scrollPrev = useCallback(
        () => mainInstanceRef.current?.prev(),
        [mainInstanceRef]
    )
    const scrollNext = useCallback(
        () => mainInstanceRef.current?.next(),
        [mainInstanceRef]
    )

    /* ---- Lightbox keyboard handling ---- */
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

    /* ---- Empty state ---- */
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
                {/* ─── Thumbnails ─── */}
                {displayImages.length > 1 && (
                    <div
                        ref={thumbRef}
                        className="keen-slider order-2 shrink-0 lg:order-1 lg:max-h-[calc(100vh-9rem)]"
                        aria-label="Product image thumbnails"
                    >
                        {displayImages.map((img, i) => (
                            <button
                                type="button"
                                key={img.id ?? i}
                                aria-label={`View image ${i + 1} of ${displayImages.length}`}
                                aria-current={
                                    i === selectedIndex ? "true" : "false"
                                }
                                className={`keen-slider__slide cursor-pointer overflow-hidden border-2 bg-surface transition-all duration-200 ${selectedIndex === i
                                        ? "border-primary shadow-sm"
                                        : "border-border opacity-50 hover:border-border-strong hover:opacity-100"
                                    }`}
                            >
                                <Image
                                    src={img.url}
                                    alt={`${title} thumbnail ${i + 1}`}
                                    width={80}
                                    height={107}
                                    sizes="80px"
                                    quality={60}
                                    className="size-full object-contain p-0.5"
                                />
                            </button>
                        ))}
                    </div>
                )}

                {/* ─── Main slider ─── */}
                <div className="group relative order-1 min-w-0 flex-1 overflow-hidden border border-border bg-white lg:order-2">
                    <div ref={mainRef} className="keen-slider">
                        {displayImages.map((img, i) => (
                            <div
                                key={img.id ?? i}
                                className="keen-slider__slide"
                            >
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
                                    fetchPriority={
                                        i === 0 ? "high" : "auto"
                                    }
                                    draggable={false}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Prev / Next arrows */}
                    {displayImages.length > 1 && (
                        <>
                            <button
                                type="button"
                                onClick={scrollPrev}
                                className="absolute left-3 top-1/2 z-10 hidden size-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-surface/90 text-text-primary opacity-0 shadow-sm backdrop-blur-sm transition-opacity duration-200 hover:bg-surface group-hover:opacity-100 focus-visible:opacity-100 md:flex"
                                aria-label="Previous image"
                            >
                                <ChevronLeft className="size-5" />
                            </button>
                            <button
                                type="button"
                                onClick={scrollNext}
                                className="absolute right-3 top-1/2 z-10 hidden size-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-surface/90 text-text-primary opacity-0 shadow-sm backdrop-blur-sm transition-opacity duration-200 hover:bg-surface group-hover:opacity-100 focus-visible:opacity-100 md:flex"
                                aria-label="Next image"
                            >
                                <ChevronRight className="size-5" />
                            </button>
                        </>
                    )}

                    {/* Zoom button */}
                    <button
                        type="button"
                        onClick={() => setLightboxOpen(true)}
                        aria-label="Open full-size image"
                        className="absolute right-3 top-3 z-10 flex size-10 cursor-pointer items-center justify-center rounded-full bg-surface/90 text-text-primary opacity-0 shadow-sm backdrop-blur-sm transition-opacity duration-200 focus-visible:opacity-100 group-hover:opacity-100"
                    >
                        <ZoomIn className="size-4.5" />
                    </button>

                    {/* Mobile slide counter */}
                    {displayImages.length > 1 && (
                        <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-surface/90 px-3 py-1.5 shadow-sm backdrop-blur-sm lg:hidden">
                            {displayImages.map((_, i) => (
                                <span
                                    key={i}
                                    className={`block size-1.5 rounded-full transition-all duration-200 ${
                                        i === selectedIndex
                                            ? "scale-125 bg-text-primary"
                                            : "bg-text-secondary/40"
                                    }`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* ─── Lightbox ─── */}
            {lightboxOpen &&
                createPortal(
                    <Lightbox
                        images={displayImages}
                        initialIndex={selectedIndex}
                        title={title}
                        onClose={() => setLightboxOpen(false)}
                        onIndexChange={(idx) => {
                            setSelectedIndex(idx)
                            mainInstanceRef.current?.moveToIdx(idx)
                        }}
                    />,
                    document.body
                )}
        </>
    )
}

/* ------------------------------------------------------------------ */
/*  Lightbox Component                                                 */
/* ------------------------------------------------------------------ */

type LightboxImage = { id?: string; url: string }

function Lightbox({
    images,
    initialIndex,
    title,
    onClose,
    onIndexChange,
}: {
    images: LightboxImage[]
    initialIndex: number
    title: string
    onClose: () => void
    onIndexChange: (idx: number) => void
}) {
    const [currentIndex, setCurrentIndex] = useState(initialIndex)

    const [sliderRef, sliderInstanceRef] = useKeenSlider<HTMLDivElement>({
        initial: initialIndex,
        slideChanged(slider) {
            const idx = slider.track.details.rel
            setCurrentIndex(idx)
            onIndexChange(idx)
        },
    })

    const goPrev = useCallback(
        () => sliderInstanceRef.current?.prev(),
        [sliderInstanceRef]
    )
    const goNext = useCallback(
        () => sliderInstanceRef.current?.next(),
        [sliderInstanceRef]
    )

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose()
            if (e.key === "ArrowLeft") goPrev()
            if (e.key === "ArrowRight") goNext()
        }
        const prev = document.body.style.overflow
        document.body.style.overflow = "hidden"
        window.addEventListener("keydown", onKey)
        return () => {
            document.body.style.overflow = prev
            window.removeEventListener("keydown", onKey)
        }
    }, [onClose, goPrev, goNext])

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-label={`${title} - full size image`}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-in fade-in duration-200 sm:p-10"
            onClick={onClose}
        >
            {/* Close button — top right */}
            <button
                type="button"
                autoFocus
                onClick={(e) => {
                    e.stopPropagation()
                    onClose()
                }}
                aria-label="Close"
                className="absolute right-4 top-4 z-20 flex size-11 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white shadow-lg transition-colors hover:bg-white/20"
            >
                <X className="size-5" />
            </button>

            {/* Slider */}
            <div
                ref={sliderRef}
                className="keen-slider max-h-[85vh] max-w-5xl"
                onClick={(e) => e.stopPropagation()}
            >
                {images.map((img, i) => (
                    <div key={img.id ?? i} className="keen-slider__slide !flex items-center justify-center">
                        <Image
                            src={img.url}
                            alt={`${title} - full size view ${i + 1}`}
                            width={1200}
                            height={1600}
                            sizes="100vw"
                            quality={90}
                            className="max-h-[85vh] w-auto object-contain"
                            priority
                        />
                    </div>
                ))}
            </div>

            {/* Navigation controls */}
            {images.length > 1 && (
                <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 items-center gap-3">
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation()
                            goPrev()
                        }}
                        aria-label="Previous image"
                        className="flex size-11 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white shadow-lg transition-colors hover:bg-white/20"
                    >
                        <ChevronLeft className="size-5" />
                    </button>

                    <span className="min-w-[3rem] text-center text-sm font-medium text-white/90">
                        {currentIndex + 1} / {images.length}
                    </span>

                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation()
                            goNext()
                        }}
                        aria-label="Next image"
                        className="flex size-11 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white shadow-lg transition-colors hover:bg-white/20"
                    >
                        <ChevronRight className="size-5" />
                    </button>
                </div>
            )}
        </div>
    )
}