'use client';

import Image from 'next/image';
import { useState, useRef } from 'react';

export interface ImageZoomProps {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    zoomLevel?: number;
    className?: string;
}

export const ImageZoom: React.FC<ImageZoomProps> = ({
    src,
    alt,
    width = 800,
    height = 800,
    zoomLevel = 2,
    className = '',
}) => {
    const [isZoomed, setIsZoomed] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!containerRef.current || !isZoomed) return;

        const rect = containerRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        setMousePosition({ x, y });
    };

    return (
        <div
            ref={containerRef}
            className={`relative overflow-hidden cursor-zoom-in rounded-lg ${className}`}
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
            onMouseMove={handleMouseMove}
        >
            <Image
                src={src}
                alt={alt}
                width={width}
                height={height}
                className="w-full h-full object-cover transition-transform duration-200"
                style={{
                    transform: isZoomed ? `scale(${zoomLevel})` : 'scale(1)',
                    transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
                }}
            />

            {isZoomed && (
                <div className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-surface/80 backdrop-blur-sm px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg text-xs sm:text-sm text-text-primary">
                    {zoomLevel}x Zoom
                </div>
            )}
        </div>
    );
};

// Side-by-Side Zoom (shows zoomed image next to original)
export interface LensMagnifierProps {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    lensSize?: number;
    magnification?: number;
    className?: string;
}

export function LensMagnifier({
    src,
    alt,
    width = 800,
    height = 800,
    lensSize = 150,
    magnification = 2.5,
    className = '',
}: LensMagnifierProps) {
    const [showLens, setShowLens] = useState(false);
    const [lensPosition, setLensPosition] = useState({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left - lensSize / 2;
        const y = e.clientY - rect.top - lensSize / 2;

        // Constrain lens within bounds
        const constrainedX = Math.max(0, Math.min(x, rect.width - lensSize));
        const constrainedY = Math.max(0, Math.min(y, rect.height - lensSize));

        setLensPosition({ x: constrainedX, y: constrainedY });
    };

    return (
        <div
            ref={containerRef}
            className={`relative overflow-hidden cursor-crosshair rounded-lg ${className}`}
            onMouseEnter={() => setShowLens(true)}
            onMouseLeave={() => setShowLens(false)}
            onMouseMove={handleMouseMove}
        >
            <Image
                src={src}
                alt={alt}
                width={width}
                height={height}
                className="w-full h-full object-cover"
            />

            {showLens && (
                <div
                    className="absolute border-2 border-primary rounded-full pointer-events-none overflow-hidden shadow-lg ring-2 ring-primary/20"
                    style={{
                        width: `${lensSize}px`,
                        height: `${lensSize}px`,
                        left: `${lensPosition.x}px`,
                        top: `${lensPosition.y}px`,
                    }}
                >
                    <div
                        className="absolute inset-0"
                        style={{
                            backgroundImage: `url(${src})`,
                            backgroundSize: `${width * magnification}px ${height * magnification}px`,
                            backgroundPosition: `-${lensPosition.x * magnification}px -${lensPosition.y * magnification}px`,
                        }}
                    />
                </div>
            )}
        </div>
    );
}

export interface SideBySideZoomProps {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    magnification?: number;
    className?: string;
}

export function SideBySideZoom({
    src,
    alt,
    width = 600,
    height = 600,
    magnification = 2,
    className = '',
}: SideBySideZoomProps) {
    const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
    const [isHovering, setIsHovering] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        setMousePosition({ x, y });
    };

    return (
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-4 ${className}`}>
            {/* Original Image */}
            <div
                ref={containerRef}
                className="relative aspect-square overflow-hidden rounded-lg cursor-crosshair"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                onMouseMove={handleMouseMove}
            >
                <Image
                    src={src}
                    alt={alt}
                    width={width}
                    height={height}
                    className="w-full h-full object-cover"
                />

                {isHovering && (
                    <div
                        className="absolute w-24 h-24 sm:w-32 sm:h-32 border-2 border-primary pointer-events-none"
                        style={{
                            left: `${mousePosition.x}%`,
                            top: `${mousePosition.y}%`,
                            transform: 'translate(-50%, -50%)',
                        }}
                    />
                )}
            </div>

            {/* Zoomed View */}
            <div className="relative aspect-square overflow-hidden rounded-lg bg-muted hidden lg:block">
                {isHovering ? (
                    <div
                        className="absolute inset-0"
                        style={{
                            backgroundImage: `url(${src})`,
                            backgroundSize: `${width * magnification}px ${height * magnification}px`,
                            backgroundPosition: `-${(mousePosition.x / 100) * width * magnification - width / 2}px -${(mousePosition.y / 100) * height * magnification - height / 2}px`,
                        }}
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-text-secondary text-sm sm:text-base">
                        Hover over the image to zoom
                    </div>
                )}
            </div>
        </div>
    );
};