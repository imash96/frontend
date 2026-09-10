'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';

export interface ImageGalleryProps {
    images: Array<{
        src: string;
        alt: string;
        thumbnail?: string;
    }>;
    className?: string;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({
    images,
    className = '',
}) => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isZoomed, setIsZoomed] = useState(false);

    const handlePrevious = () => {
        setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'ArrowLeft') handlePrevious();
        if (e.key === 'ArrowRight') handleNext();
        if (e.key === 'Escape') setIsZoomed(false);
    };

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    });

    if (!images || images.length === 0) return null;

    return (
        <div className={`space-y-4 ${className}`}>
            {/* Main Image */}
            <div className="relative aspect-3/4 bg-muted rounded-lg overflow-hidden group">
                <Image
                    src={images[selectedIndex].src}
                    alt={images[selectedIndex].alt}
                    width={800}
                    height={1200}
                    className={`w-full h-full object-cover transition-transform duration-300 ${isZoomed ? 'scale-150 cursor-zoom-out' : 'cursor-zoom-in'}`}
                    onClick={() => setIsZoomed(!isZoomed)}
                />

                {/* Navigation Arrows */}
                {images.length > 1 && (
                    <>
                        <button
                            onClick={handlePrevious}
                            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-surface/80 backdrop-blur-sm border border-border rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-surface"
                            aria-label="Previous image"
                        >
                            <svg className="w-5 h-5 text-text-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <polyline points="15 18 9 12 15 6" />
                            </svg>
                        </button>
                        <button
                            onClick={handleNext}
                            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-surface/80 backdrop-blur-sm border border-border rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-surface"
                            aria-label="Next image"
                        >
                            <svg className="w-5 h-5 text-text-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <polyline points="9 18 15 12 9 6" />
                            </svg>
                        </button>
                    </>
                )}

                {/* Image Counter */}
                {images.length > 1 && (
                    <div className="absolute bottom-4 right-4 px-3 py-1 bg-surface/80 backdrop-blur-sm border border-border rounded-full text-sm text-text-primary">
                        {selectedIndex + 1} / {images.length}
                    </div>
                )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
                <div className="grid grid-cols-4 md:grid-cols-5 gap-3">
                    {images.map((image, index) => (
                        <button
                            key={index}
                            onClick={() => setSelectedIndex(index)}
                            className={`
                                relative aspect-3/4 rounded-lg overflow-hidden
                                border-2 transition-all
                                ${selectedIndex === index
                                    ? 'border-primary ring-2 ring-primary/20'
                                    : 'border-border hover:border-primary'
                                }
                            `}
                        >
                            <Image
                                src={image.thumbnail || image.src}
                                alt={image.alt}
                                width={800}
                                height={1200}
                                className="w-full h-full object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

// Simple Carousel
export interface CarouselProps {
    items: React.ReactNode[];
    autoPlay?: boolean;
    interval?: number;
    showDots?: boolean;
    showArrows?: boolean;
    className?: string;
}

export const Carousel: React.FC<CarouselProps> = ({
    items,
    autoPlay = false,
    interval = 5000,
    showDots = true,
    showArrows = true,
    className = '',
}) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (!autoPlay) return;

        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
        }, interval);

        return () => clearInterval(timer);
    }, [autoPlay, interval, items.length]);

    const handlePrevious = () => {
        setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
    };

    return (
        <div className={`relative ${className}`}>
            {/* Slides */}
            <div className="relative overflow-hidden rounded-lg">
                <div
                    className="flex transition-transform duration-500 ease-out"
                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                    {items.map((item, index) => (
                        <div key={index} className="min-w-full">
                            {item}
                        </div>
                    ))}
                </div>
            </div>

            {/* Navigation Arrows */}
            {showArrows && items.length > 1 && (
                <>
                    <button
                        onClick={handlePrevious}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-surface/80 backdrop-blur-sm border border-border rounded-full hover:bg-surface transition-all"
                        aria-label="Previous slide"
                    >
                        <svg className="w-5 h-5 text-text-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <polyline points="15 18 9 12 15 6" />
                        </svg>
                    </button>
                    <button
                        onClick={handleNext}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-surface/80 backdrop-blur-sm border border-border rounded-full hover:bg-surface transition-all"
                        aria-label="Next slide"
                    >
                        <svg className="w-5 h-5 text-text-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <polyline points="9 18 15 12 9 6" />
                        </svg>
                    </button>
                </>
            )}

            {/* Dots */}
            {showDots && items.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {items.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`
                                w-2 h-2 rounded-full transition-all
                                ${currentIndex === index
                                    ? 'bg-primary w-6'
                                    : 'bg-muted hover:bg-muted-hover'
                                }
                            `}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};