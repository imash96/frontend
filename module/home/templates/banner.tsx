"use client"

import Image from "next/image"
import { ChevronLeft, ChevronRight, DollarSign, Scissors, Shield, ShoppingBag, Sparkles } from "lucide-react"
import { useCarousel } from "@/lib/hook/use-carousel"
import { HeroSlide, HeroSlideCardProps } from "@/types/homepage"
import { heroSlides } from "@/data/hero-slide"
import { memo } from "react"

export default function HeroCarousel() {
    const { emblaRef, selectedIndex, scrollNext, scrollPrev } = useCarousel({
        autoplay: true,
        autoplayDelay: 4500,
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

            <div className="flex justify-center gap-3 mt-4 absolute bottom-6 right-6 z-20">
                <NavBtn onClick={scrollPrev} label="Previous" dir="prev" />
                <NavBtn onClick={scrollNext} label="Next" dir="next" />
            </div>
        </section>
    )
}

function HeroSlideCard({ slide, isActive, index }: HeroSlideCardProps) {

    return (
        <div
            className="relative flex-[0_0_92%] sm:flex-[0_0_69%] lg:flex-[0_0_59.00%] xl:flex-[0_0_33.333%] aspect-3/4 sm:aspect-4/5 md:aspect-4/6 lg:aspect-4/5 xl:aspect-9/11"
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${heroSlides.length}`}
        >

            <Image
                src={slide.image}
                alt={slide.imageAlt}
                fill
                preload={index === 0}
                loading={index === 0 ? "eager" : "lazy"}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, (max-width: 1536px) 86vw, 72vw"
                className="object-cover transition-transform duration-1600 ease-out group-hover:scale-105"
            />

            <div
                className="absolute inset-0"
                style={{ background: slide.overlayGradient }}
            />

            <div className="relative z-10 flex flex-col justify-end h-full px-6 pb-6 md:px-10 md:pb-8 lg:px-14 lg:pb-10">
                {/* Badge */}
                {slide.badge && (
                    <div
                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-md mb-5 w-fit transition-all duration-700 ${isActive ? 'animate-fade-in' : 'opacity-0  lg:animate-fade-in'}`}
                        style={{
                            background: `${slide.accentColor}18`,
                            border: `1px solid ${slide.accentColor}30`,
                            animationDelay: '0.2s',
                            animationFillMode: 'both',
                        }}
                    >
                        <span style={{ color: slide.accentColor }}>
                            <slide.icon className="w-4 h-4" />
                        </span>
                        <span
                            className="text-[10px] md:text-xs font-medium tracking-[0.14em] uppercase"
                            style={{ color: slide.accentColor }}
                        >
                            {slide.badge}
                        </span>
                    </div>
                )}
                {/* Tagline */}
                <p
                    className={`text-xs lg:text-sm font-medium tracking-[0.2em] uppercase mb-3 transition-all duration-700 ${isActive ? 'animate-slide-up' : 'opacity-0 lg:animate-slide-up'}`}
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
                    className={`font-heading text-[clamp(1.75rem,5vw,3.25rem)] lg:text-[clamp(2.25rem,3.5vw,3.5rem)] font-bold leading-[1.08] tracking-tight mb-4 max-w-130 transition-all duration-700 ${isActive ? 'animate-slide-up' : 'opacity-0 lg:animate-slide-up'}`}
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
                {/* Description */}
                <p
                    className={`text-sm md:text-[15px] leading-relaxed max-w-110 mb-6 transition-all duration-700 ${isActive ? 'animate-slide-up' : 'opacity-0 lg:animate-slide-up'}`}
                    style={{
                        color: 'rgba(250, 245, 235, 0.72)',
                        animationDelay: '0.5s',
                        animationFillMode: 'both',
                    }}
                >
                    {slide.description}
                </p>
            </div>
            {/* Decorative accent line */}
            <div
                className="absolute bottom-0 left-0 h-0.75 transition-all duration-1000"
                style={{
                    width: isActive ? '100%' : '0%',
                    background: `linear-gradient(90deg, transparent, ${slide.accentColor}, transparent)`,
                }}
            />

        </div>
    )
}

export const NavBtn = memo(function NavBtn({ onClick, label, dir, }: { onClick: () => void; label: string; dir: "prev" | "next"; }) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-label={label}
            className="size-9 flex items-center justify-center rounded-full border border-border bg-card text-foreground hover:bg-accent hover:text-accent-foreground hover:border-accent transition-all duration-200 focus-visible:outline-2 focus-visible:outline-ring active:scale-95"
        >
            {dir === "prev" ? <ChevronLeft className="size-4" aria-hidden /> : <ChevronRight className="size-4" aria-hidden />}
        </button>
    );
});