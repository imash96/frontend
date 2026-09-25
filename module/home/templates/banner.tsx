"use client"

import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react"
import { useCarousel } from "@/lib/hook/use-carousel"
import { HeroSlideCardProps } from "@/types/homepage"
import { heroSlides } from "@/data/hero-slide"
import { memo } from "react"
import type { Route } from "next";

export default function HeroCarousel() {
    const { emblaRef, selectedIndex, scrollTo, scrollNext, scrollPrev } = useCarousel({
        autoplay: true,
        autoplayDelay: 3500,
        options: {
            align: "start",
            loop: true,
            slidesToScroll: 1,
        }
    })

    return (
        <section
            className="relative w-full bg-neutral-950 select-none"
            aria-roledescription="carousel"
            aria-label="Hero Banner"
        >
            <div ref={emblaRef} className="overflow-hidden">
                <div className="flex touch-pan-y will-change-transform">
                    {heroSlides.map((slide, index) => (
                        <HeroSlideCard
                            key={slide.id}
                            slide={slide}
                            isActive={selectedIndex === index}
                            index={index}
                        />
                    ))}
                </div>
            </div>

            {/* Bottom controls bar */}
            <div className="absolute bottom-0 inset-x-0 z-30">
                <div className="flex items-center justify-between px-4 py-4 sm:px-6 sm:py-5 md:px-10 lg:px-14">
                    {/* Dot indicators */}
                    <div className="flex items-center gap-0">
                        {heroSlides.map((_, i) => (
                            <button
                                key={i}
                                type="button"
                                onClick={() => scrollTo(i)}
                                aria-label={`Go to slide ${i + 1}`}
                                className="group flex items-center justify-center p-2 focus-visible:outline-none"
                            >
                                <span
                                    className="block h-2 rounded-full transition-all duration-500 ring-offset-neutral-950 group-focus-visible:ring-2 group-focus-visible:ring-white group-focus-visible:ring-offset-2"
                                    style={{
                                        width: selectedIndex === i ? '2rem' : '0.5rem',
                                        backgroundColor: selectedIndex === i ? heroSlides[selectedIndex]?.accentColor ?? '#fff' : 'rgba(255,255,255,0.35)',
                                    }}
                                />
                            </button>
                        ))}
                    </div>

                    {/* Nav buttons */}
                    <div className="flex items-center gap-2.5">
                        <NavBtn onClick={scrollPrev} label="Previous slide" dir="prev" />
                        <NavBtn onClick={scrollNext} label="Next slide" dir="next" />
                    </div>
                </div>
            </div>
        </section>
    )
}

function HeroSlideCard({ slide, isActive, index }: HeroSlideCardProps) {
    return (
        <div
            className="relative flex-[0_0_92%] sm:flex-[0_0_69%] lg:flex-[0_0_59.00%] xl:flex-[0_0_33.333%] aspect-3/4 sm:aspect-4/5 md:aspect-4/6 lg:aspect-4/5 xl:aspect-9/11"
            // relative flex-[0_0_88%] sm:flex-[0_0_65%] md:flex-[0_0_55%] lg:flex-[0_0_45%] xl:flex-[0_0_36%] 2xl:flex-[0_0_33.333%] aspect-[3/4] sm:aspect-[3/4] md:aspect-[2/3] lg:aspect-[3/4]
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${heroSlides.length}`}
        >
            <Image
                src={slide.image}
                alt={slide.imageAlt}
                fill
                priority={index === 0}
                fetchPriority={index === 0 ? 'high' : 'auto'}
                loading={index === 0 ? "eager" : "lazy"}
                sizes="(max-width: 640px) 92vw, (max-width: 1024px) 69vw, (max-width: 1280px) 59vw, 33vw"
                className="object-cover transition-transform duration-[1.6s] ease-out will-change-transform"
                style={{
                    transform: isActive ? 'scale(1.04)' : 'scale(1)',
                }}
            />

            {/* Overlay gradient — heavy at bottom for text, fades to nothing at top */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: slide.overlayGradient }}
            />

            {/* Content */}
            <div className="relative z-10 flex flex-col justify-end h-full px-5 pb-14 sm:px-6 sm:pb-16 md:px-8 md:pb-18 lg:px-10 lg:pb-20">
                {/* Badge */}
                {slide.badge && (
                    <div
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full backdrop-blur-md mb-4 w-fit transition-all duration-700 ${isActive ? 'animate-fade-in' : 'opacity-0 lg:animate-fade-in'}`}
                        style={{
                            background: `${slide.accentColor}15`,
                            border: `1px solid ${slide.accentColor}30`,
                            animationDelay: '0.2s',
                            animationFillMode: 'both',
                        }}
                    >
                        <span style={{ color: slide.accentColor }}>
                            <slide.icon className="size-3.5" />
                        </span>
                        <span
                            className="text-[9px] sm:text-[10px] md:text-xs font-semibold tracking-[0.16em] uppercase"
                            style={{ color: slide.accentColor }}
                        >
                            {slide.badge}
                        </span>
                    </div>
                )}

                {/* Tagline */}
                <p
                    className={`text-[10px] sm:text-xs md:text-sm font-medium tracking-[0.2em] uppercase mb-2.5 transition-all duration-700 ${isActive ? 'animate-slide-up' : 'opacity-0 lg:animate-slide-up'}`}
                    style={{
                        color: `${slide.accentColor}CC`,
                        animationDelay: '0.3s',
                        animationFillMode: 'both',
                    }}
                >
                    {slide.tagline}
                </p>

                {/* Title */}
                <h2
                    className={`font-heading text-2xl sm:text-3xl md:text-4xl lg:text-[2.75rem] font-bold leading-[1.08] tracking-tight mb-3 transition-all duration-700 ${isActive ? 'animate-slide-up' : 'opacity-0 lg:animate-slide-up'}`}
                    style={{
                        color: '#FAFAF5',
                        animationDelay: '0.4s',
                        animationFillMode: 'both',
                    }}
                >
                    {slide.title}
                    {slide.titleAccent && (
                        <>
                            <br />
                            <span
                                className="italic font-semibold"
                                style={{ color: slide.accentColor }}
                            >
                                {slide.titleAccent}
                            </span>
                        </>
                    )}
                </h2>

                {/* Description — hidden on very small mobile for cleaner look */}
                <p
                    className={`hidden sm:block text-sm md:text-[15px] leading-relaxed max-w-[28ch] md:max-w-[36ch] mb-5 transition-all duration-700 ${isActive ? 'animate-slide-up' : 'opacity-0 lg:animate-slide-up'}`}
                    style={{
                        color: 'rgba(250, 245, 235, 0.7)',
                        animationDelay: '0.5s',
                        animationFillMode: 'both',
                    }}
                >
                    {slide.description}
                </p>

                {/* Actions */}
                <div
                    className={`flex flex-wrap items-center gap-2.5 transition-all duration-700 ${isActive ? 'animate-slide-up' : 'opacity-0 lg:animate-slide-up'}`}
                    style={{
                        animationDelay: '0.6s',
                        animationFillMode: 'both',
                    }}
                >
                    {slide.cta?.primary && (
                        <Link
                            href={slide.cta.primary.href as Route}
                            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-white/95 px-5 py-2.5 text-xs sm:text-sm font-medium text-neutral-900 transition-all duration-300 hover:bg-white active:scale-[0.97]"
                        >
                            <span className="relative z-10">{slide.cta.primary.text}</span>
                            <ArrowRight className="relative z-10 size-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                        </Link>
                    )}
                    {slide.cta?.secondary && (
                        <Link
                            href={slide.cta.secondary.href as Route}
                            className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/8 backdrop-blur-sm px-5 py-2.5 text-xs sm:text-sm font-medium text-white/85 transition-all duration-300 hover:bg-white/15 hover:text-white active:scale-[0.97]"
                        >
                            {slide.cta.secondary.text}
                        </Link>
                    )}
                </div>
            </div>

            {/* Decorative accent line */}
            <div
                className="absolute bottom-0 left-0 h-0.75 transition-all duration-1000 ease-out"
                style={{
                    width: isActive ? '100%' : '0%',
                    background: `linear-gradient(90deg, ${slide.accentColor}, ${slide.accentColor}80, transparent)`,
                }}
            />
        </div>
    )
}

export const NavBtn = memo(function NavBtn({ onClick, label, dir }: { onClick: () => void; label: string; dir: "prev" | "next" }) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-label={label}
            className="size-10 flex items-center justify-center rounded-full border border-white/15 bg-white/8 backdrop-blur-sm text-white/80 hover:bg-white/15 hover:text-white hover:border-white/30 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-ring active:scale-95"
        >
            {dir === "prev" ? <ChevronLeft className="size-4" aria-hidden /> : <ChevronRight className="size-4" aria-hidden />}
        </button>
    );
});