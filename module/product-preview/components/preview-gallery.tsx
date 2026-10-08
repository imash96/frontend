"use client"

import type { StoreProduct } from "@medusajs/types"
import {
    ChevronLeft,
    ChevronRight,
    Expand,
    Grid2X2,
    Layers,
    Sparkles,
    X,
    ZoomIn,
} from "lucide-react"
import Image from "next/image"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { createPortal } from "react-dom"
import Placeholder from "@/icon/img-placeholder"
import { getDisplayImages, useProductStore } from "@/lib/store/product-store"

type PreviewGalleryProps = {
    product: StoreProduct
    title: string
    discountPercent?: string | number | null
}

export default function PreviewGallery({
    product,
    title,
    discountPercent,
}: PreviewGalleryProps) {
    const selectedVariant = useProductStore((s) => s.selectedVariant)
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [viewLayout, setViewLayout] = useState<"carousel" | "editorial">("carousel")
    const [lightboxOpen, setLightboxOpen] = useState(false)
    const [isHoverZooming, setIsHoverZooming] = useState(false)
    const [zoomCoords, setZoomCoords] = useState({ x: 50, y: 50 })

    // Touch swipe state for mobile/tablet
    const touchStartX = useRef<number | null>(null)
    const touchEndX = useRef<number | null>(null)

    const displayImages = useMemo(
        () => getDisplayImages(product, selectedVariant),
        [product, selectedVariant],
    )

    // Reset index when variant images change
    useEffect(() => {
        setSelectedIndex(0)
    }, [displayImages])

    const imageCount = displayImages.length

    const goPrev = useCallback(() => {
        if (imageCount <= 1) return
        setSelectedIndex((prev) => (prev === 0 ? imageCount - 1 : prev - 1))
    }, [imageCount])

    const goNext = useCallback(() => {
        if (imageCount <= 1) return
        setSelectedIndex((prev) => (prev === imageCount - 1 ? 0 : prev + 1))
    }, [imageCount])

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect()
        const x = ((e.clientX - rect.left) / rect.width) * 100
        const y = ((e.clientY - rect.top) / rect.height) * 100
        setZoomCoords({
            x: Math.max(0, Math.min(100, x)),
            y: Math.max(0, Math.min(100, y)),
        })
    }

    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.targetTouches[0]?.clientX ?? null
        touchEndX.current = null
    }

    const handleTouchMove = (e: React.TouchEvent) => {
        touchEndX.current = e.targetTouches[0]?.clientX ?? null
    }

    const handleTouchEnd = () => {
        if (touchStartX.current === null || touchEndX.current === null) return
        const distance = touchStartX.current - touchEndX.current
        if (Math.abs(distance) > 42) {
            if (distance > 0) goNext()
            else goPrev()
        }
        touchStartX.current = null
        touchEndX.current = null
    }

    // Lightbox keyboard handling
    useEffect(() => {
        if (!lightboxOpen) return
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setLightboxOpen(false)
            if (e.key === "ArrowLeft") goPrev()
            if (e.key === "ArrowRight") goNext()
        }
        const prevOverflow = document.body.style.overflow
        document.body.style.overflow = "hidden"
        window.addEventListener("keydown", onKey)
        return () => {
            document.body.style.overflow = prevOverflow
            window.removeEventListener("keydown", onKey)
        }
    }, [lightboxOpen, goPrev, goNext])

    if (!displayImages || displayImages.length === 0) {
        return (
            <div className="flex aspect-3/4 w-full items-center justify-center rounded-2xl border border-border bg-surface-sunken">
                <Placeholder className="w-1/2 text-border-strong" />
            </div>
        )
    }

    const activeImage = displayImages[selectedIndex] ?? displayImages[0]

    return (
        <div className="space-y-3">
            {/* Desktop View Mode Header */}
            <div className="hidden lg:flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-text-secondary">
                    <Sparkles className="size-3.5 text-accent" />
                    <span>Hover image to inspect leather grain · Click to open full-screen studio</span>
                </div>
                {displayImages.length > 1 && (
                    <div className="inline-flex items-center rounded-lg border border-border bg-surface p-0.5 text-xs">
                        <button
                            type="button"
                            onClick={() => setViewLayout("carousel")}
                            className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 font-medium transition-colors ${
                                viewLayout === "carousel"
                                    ? "bg-primary text-primary-foreground shadow-xs"
                                    : "text-text-secondary hover:text-text-primary"
                            }`}
                        >
                            <Layers className="size-3.5" />
                            <span>Studio View</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setViewLayout("editorial")}
                            className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 font-medium transition-colors ${
                                viewLayout === "editorial"
                                    ? "bg-primary text-primary-foreground shadow-xs"
                                    : "text-text-secondary hover:text-text-primary"
                            }`}
                        >
                            <Grid2X2 className="size-3.5" />
                            <span>Lookbook Grid</span>
                        </button>
                    </div>
                )}
            </div>

            {/* Editorial Grid Mode (Desktop Only) */}
            {viewLayout === "editorial" && displayImages.length > 1 ? (
                <div className="hidden lg:grid grid-cols-2 gap-3">
                    {displayImages.map((img, idx) => (
                        <button
                            key={img.id ?? idx}
                            type="button"
                            onClick={() => {
                                setSelectedIndex(idx)
                                setLightboxOpen(true)
                            }}
                            className={`group relative overflow-hidden rounded-2xl border border-border bg-white text-left transition-all hover:border-primary/40 hover:shadow-md ${
                                idx === 0 ? "col-span-2 aspect-16/11" : "aspect-3/4"
                            }`}
                        >
                            <Image
                                src={img.url}
                                alt={`${title} — angle ${idx + 1}`}
                                fill
                                sizes="(max-width: 1280px) 50vw, 600px"
                                quality={85}
                                className="object-contain object-center p-2 transition-transform duration-500 group-hover:scale-105"
                            />
                            <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-surface/90 px-3 py-1 text-xs font-medium text-text-primary opacity-0 shadow-sm backdrop-blur-md transition-opacity group-hover:opacity-100">
                                <Expand className="size-3.5" />
                                Inspect {idx + 1}/{displayImages.length}
                            </span>
                        </button>
                    ))}
                </div>
            ) : null}

            {/* Studio Carousel View (Always on mobile/tablet, default on desktop) */}
            <div
                className={`flex flex-col gap-3 lg:flex-row ${
                    viewLayout === "editorial" ? "lg:hidden" : ""
                }`}
            >
                {/* Thumbnails Rail */}
                {displayImages.length > 1 && (
                    <div
                        className="order-2 flex gap-2 overflow-x-auto pb-1 no-scrollbar lg:order-1 lg:max-h-[640px] lg:w-20 lg:flex-col lg:overflow-y-auto lg:pb-0"
                        role="tablist"
                        aria-label="Product image thumbnails"
                    >
                        {displayImages.map((img, idx) => {
                            const isSelected = idx === selectedIndex
                            return (
                                <button
                                    key={img.id ?? idx}
                                    type="button"
                                    role="tab"
                                    aria-selected={isSelected}
                                    aria-label={`View product image ${idx + 1} of ${displayImages.length}`}
                                    onClick={() => setSelectedIndex(idx)}
                                    className={`relative aspect-3/4 w-16 shrink-0 overflow-hidden rounded-xl border-2 bg-white transition-all duration-200 sm:w-18 lg:w-full ${
                                        isSelected
                                            ? "border-primary ring-2 ring-primary/20 shadow-xs"
                                            : "border-border opacity-65 hover:border-border-strong hover:opacity-100"
                                    }`}
                                >
                                    <Image
                                        src={img.url}
                                        alt={`${title} thumbnail ${idx + 1}`}
                                        width={96}
                                        height={128}
                                        sizes="96px"
                                        quality={60}
                                        className="size-full object-contain p-1"
                                    />
                                </button>
                            )
                        })}
                    </div>
                )}

                {/* Main Image Stage */}
                <div
                    className="group relative order-1 flex-1 overflow-hidden rounded-2xl border border-border bg-white shadow-xs lg:order-2"
                    onMouseEnter={() => setIsHoverZooming(true)}
                    onMouseLeave={() => setIsHoverZooming(false)}
                    onMouseMove={handleMouseMove}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    {/* Top Left Badges */}
                    <div className="pointer-events-none absolute left-3 top-3 z-10 flex flex-wrap items-center gap-1.5 sm:left-4 sm:top-4">
                        <span className="inline-flex items-center gap-1 rounded-full bg-primary/95 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary-foreground shadow-xs backdrop-blur-xs sm:text-xs">
                            100% Full-Grain
                        </span>
                        {discountPercent ? (
                            <span className="inline-flex items-center rounded-full bg-badge-sale px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-badge-sale-foreground shadow-xs sm:text-xs">
                                -{discountPercent}% Sale
                            </span>
                        ) : null}
                    </div>

                    {/* Fullscreen Lightbox Trigger */}
                    <button
                        type="button"
                        onClick={() => setLightboxOpen(true)}
                        aria-label="Open full-screen image viewer"
                        className="absolute right-3 top-3 z-10 flex size-10 items-center justify-center rounded-full border border-border/70 bg-surface/90 text-text-primary shadow-sm backdrop-blur-md transition-all hover:scale-105 hover:bg-surface sm:right-4 sm:top-4"
                    >
                        <ZoomIn className="size-4.5" />
                    </button>

                    {/* Active Image with Desktop Hover Magnifier */}
                    <div
                        onClick={() => setLightboxOpen(true)}
                        className="relative aspect-3/4 w-full cursor-zoom-in select-none overflow-hidden"
                    >
                        <Image
                            key={activeImage.url}
                            src={activeImage.url}
                            alt={`${title} — view ${selectedIndex + 1}`}
                            fill
                            sizes="(max-width: 1024px) 100vw, (max-width: 1536px) 55vw, 840px"
                            quality={90}
                            priority={selectedIndex === 0}
                            draggable={false}
                            className="object-contain object-center p-2 transition-transform duration-300 ease-out sm:p-4"
                            style={
                                isHoverZooming
                                    ? {
                                          transform: "scale(1.85)",
                                          transformOrigin: `${zoomCoords.x}% ${zoomCoords.y}%`,
                                      }
                                    : undefined
                            }
                        />
                    </div>

                    {/* Prev / Next Navigation Buttons */}
                    {displayImages.length > 1 && (
                        <>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    goPrev()
                                }}
                                aria-label="Previous image"
                                className="absolute left-3 top-1/2 z-10 flex size-9 -translate-y-1/2 items-center justify-center rounded-full border border-border/70 bg-surface/90 text-text-primary shadow-sm backdrop-blur-md transition-all hover:bg-surface sm:size-10 md:opacity-0 md:group-hover:opacity-100 focus-visible:opacity-100"
                            >
                                <ChevronLeft className="size-5" />
                            </button>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    goNext()
                                }}
                                aria-label="Next image"
                                className="absolute right-3 top-1/2 z-10 flex size-9 -translate-y-1/2 items-center justify-center rounded-full border border-border/70 bg-surface/90 text-text-primary shadow-sm backdrop-blur-md transition-all hover:bg-surface sm:size-10 md:opacity-0 md:group-hover:opacity-100 focus-visible:opacity-100"
                            >
                                <ChevronRight className="size-5" />
                            </button>
                        </>
                    )}

                    {/* Bottom Counter Pill & Progress Dots */}
                    {displayImages.length > 1 && (
                        <div className="pointer-events-none absolute inset-x-0 bottom-3 z-10 flex items-center justify-between px-3 sm:px-4">
                            <div className="pointer-events-auto flex items-center gap-1.5 rounded-full bg-surface/90 px-2.5 py-1.5 shadow-sm backdrop-blur-md">
                                {displayImages.map((img, i) => (
                                    <button
                                        key={img.id ?? i}
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            setSelectedIndex(i)
                                        }}
                                        aria-label={`Go to image ${i + 1}`}
                                        className={`h-1.5 rounded-full transition-all duration-200 ${
                                            i === selectedIndex
                                                ? "w-5 bg-primary"
                                                : "w-1.5 bg-text-tertiary/40 hover:bg-text-secondary"
                                        }`}
                                    />
                                ))}
                            </div>
                            <span className="rounded-full bg-surface/90 px-2.5 py-1 font-mono text-[11px] font-medium text-text-primary shadow-sm backdrop-blur-md">
                                {selectedIndex + 1} / {displayImages.length}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Fullscreen Lightbox Portal */}
            {lightboxOpen &&
                typeof document !== "undefined" &&
                createPortal(
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-label={`${title} — full-screen gallery`}
                        className="fixed inset-0 z-100 flex flex-col bg-black/92 backdrop-blur-md"
                        onClick={() => setLightboxOpen(false)}
                    >
                        {/* Top Bar */}
                        <div
                            className="flex items-center justify-between px-4 py-3 text-white sm:px-6"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="min-w-0">
                                <p className="truncate font-heading text-sm font-semibold sm:text-base">
                                    {title}
                                </p>
                                <p className="text-xs text-white/70">
                                    Image {selectedIndex + 1} of {displayImages.length} · Use arrow keys to navigate
                                </p>
                            </div>
                            <button
                                type="button"
                                autoFocus
                                onClick={() => setLightboxOpen(false)}
                                aria-label="Close full-screen gallery"
                                className="flex size-10 items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/25"
                            >
                                <X className="size-5" />
                            </button>
                        </div>

                        {/* Center Stage */}
                        <div
                            className="relative flex flex-1 items-center justify-center overflow-hidden p-4 sm:p-8"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="relative size-full max-h-[78vh] max-w-5xl">
                                <Image
                                    src={activeImage.url}
                                    alt={`${title} — full size ${selectedIndex + 1}`}
                                    fill
                                    sizes="100vw"
                                    quality={90}
                                    className="object-contain"
                                    priority
                                />
                            </div>

                            {displayImages.length > 1 && (
                                <>
                                    <button
                                        type="button"
                                        onClick={goPrev}
                                        aria-label="Previous image"
                                        className="absolute left-3 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/30 sm:left-6"
                                    >
                                        <ChevronLeft className="size-6" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={goNext}
                                        aria-label="Next image"
                                        className="absolute right-3 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/30 sm:right-6"
                                    >
                                        <ChevronRight className="size-6" />
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Bottom Thumbnails */}
                        {displayImages.length > 1 && (
                            <div
                                className="flex items-center justify-center gap-2 overflow-x-auto px-4 py-3"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {displayImages.map((img, i) => (
                                    <button
                                        key={img.id ?? i}
                                        type="button"
                                        onClick={() => setSelectedIndex(i)}
                                        className={`relative size-14 shrink-0 overflow-hidden rounded-lg border-2 bg-white transition-all sm:size-16 ${
                                            i === selectedIndex
                                                ? "border-accent scale-105"
                                                : "border-transparent opacity-50 hover:opacity-90"
                                        }`}
                                    >
                                        <Image
                                            src={img.url}
                                            alt={`${title} thumb ${i + 1}`}
                                            width={64}
                                            height={64}
                                            sizes="64px"
                                            className="size-full object-contain p-0.5"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>,
                    document.body,
                )}
        </div>
    )
}
