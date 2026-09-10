"use client"

import { useState, useCallback, useEffect } from "react"
import useEmblaCarousel from "embla-carousel-react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import { StoreProductImage } from "@medusajs/types"

type ProductGalleryProps = {
    images: StoreProductImage[] | null
    title: string
}

export default function ProductGallery({ images, title }: ProductGalleryProps) {
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [emblaMainRef, emblaMainApi] = useEmblaCarousel({ loop: true })
    const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
        containScroll: 'keepSnaps',
        dragFree: true,
        axis: "x",
        breakpoints: {
            '(min-width: 768px)': { axis: 'y' },
        }
    })

    const onThumbClick = useCallback((index: number) => {
        if (!emblaMainApi) return
        emblaMainApi.goTo(index)
    }, [emblaMainApi])

    const onSelect = useCallback(() => {
        if (!emblaMainApi || !emblaThumbsApi) return
        const selected = emblaMainApi.selectedSnap()
        setSelectedIndex(selected)
        emblaThumbsApi.goTo(selected)
    }, [emblaMainApi, emblaThumbsApi, setSelectedIndex])

    useEffect(() => {
        if (!emblaMainApi) return
        onSelect()

        emblaMainApi.on('select', onSelect)
        emblaMainApi.on('reinit', onSelect)

        return () => {
            emblaMainApi.off('select', onSelect)
            emblaMainApi.off('reinit', onSelect)
        }
    }, [emblaMainApi, onSelect])

    const scrollPrev = useCallback(() => emblaMainApi?.goToPrev(), [emblaMainApi])
    const scrollNext = useCallback(() => emblaMainApi?.goToNext(), [emblaMainApi])

    if (!images || images.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-64 bg-background-muted rounded-lg">
                <p className="text-foreground-muted">No images available</p>
            </div>
        )
    }

    return (
        <>
            {/* Thumbnails (Mobile = Horizontal | Desktop = Vertical) */}
            <div
                className="relative md:max-h-[calc(100vh-12rem)] overflow-hidden md:overflow-auto no-scrollbar p-1"
                ref={emblaThumbsRef}
                aria-label="Product image thumbnails"
                role="list"
            >
                <div className="flex md:flex-col md:w-full gap-2 min-h-0" role="list">
                    {images.map((image, index) => (
                        <button
                            key={index}
                            className={`relative shrink-0 h-20 aspect-3/4 rounded-sm bg-same-white  transition-transform duration-200 hover:scale-105 group ${index === selectedIndex ? "ring-2 ring-accent border-b-4 border-accent shadow-sm" : "border border-border hover:border-accent"}`}
                            onClick={() => onThumbClick(index)}
                            aria-label={`View image ${index + 1}`}
                            aria-current={index === selectedIndex ? "true" : "false"}
                            role="listitem"
                            type="button"
                        >
                            <Image
                                src={image.url || "/svg/placeholder.svg"}
                                alt={`${title} thumbnail ${index + 1}`}
                                width={80}
                                height={60}
                                placeholder="empty"
                                className="object-contain rounded size-full p-0.5 group-hover:opacity-80 transition-opacity"
                            />
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Image Carousel */}
            <div
                className="relative w-full flex-1 overflow-hidden no-scrollbar border border-border bg-same-white"
                ref={emblaMainRef}
                aria-label="Product image carousel"
                role="region"
            >
                <div className="flex touch-pan-y touch-pinch-zoom gap-x-2">
                    {images.map((image, index) => (
                        <div key={index} className="relative flex-[0_0_100%] min-w-0 select-none aspect-3/4">
                            <Image
                                src={image.url || "/svg/placeholder.svg"}
                                alt={`${title} - Image ${index + 1}`}
                                sizes="(max-width: 640px) 100vw, (max-width: 768px) 80vw, (max-width: 1024px) 70vw, 80vw"
                                fill
                                className="object-contain size-full object-center p-px"
                                priority={index === 0}
                                fetchPriority={index == 0 ? "high" : "auto"}
                            />
                        </div>
                    ))}
                </div>

                {/* Navigation Buttons */}
                <button
                    aria-label="Previous image"
                    type="button"
                    className="hidden md:block absolute left-1 top-1/2 -translate-y-1/2 bg-accent px-2 py-3 shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent"
                    onClick={scrollPrev}
                >
                    <ChevronLeft className="size-5 text-accent-foreground" />
                </button>
                <button
                    aria-label="Next image"
                    type="button"
                    className="hidden md:block absolute right-1 top-1/2 -translate-y-1/2 bg-accent px-2 py-3 shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent"
                    onClick={scrollNext}
                >
                    <ChevronRight className="size-5 text-accent-foreground" />
                </button>
            </div>
        </ >
    )
}