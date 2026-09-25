"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { memo } from "react"
import { testimonials } from "@/data/testimonials"
import { useCarousel } from "@/lib/hook/use-carousel"
import SectionHeader from "../components/section-header"
import TestimonialCard from "../components/testimonials-card"

export default function Testimonials() {
    const { scrollPrev, emblaRef, scrollNext, selectedIndex } = useCarousel({
        autoplay: true,
        autoplayDelay: 5500,
        options: {
            loop: true,
            align: "center",
            skipSnaps: false,
            slidesToScroll: 1,
            containScroll: "trimSnaps",
            dragFree: false,
            breakpoints: {
                "(min-width: 768px)": { slidesToScroll: 2 },
                "(min-width: 1024px)": { slidesToScroll: 3 },
                "(min-width: 1280px)": { slidesToScroll: 4 },
            },
        },
    })

    // Navigation controls injected into SectionHeader action slot
    const NavControls = (
        <div className="hidden md:flex items-center gap-2">
            <NavBtn onClick={scrollPrev} label="Previous" dir="prev" />
            <NavBtn onClick={scrollNext} label="Next" dir="next" />
        </div>
    )

    return (
        <SectionHeader
            title="What Our Customers Say"
            desc="Real stories from people who wear Velle Hide every day."
            sectionName="testimonials"
            eyebrow="Customer Stories"
            action={NavControls}
        >
            <div className="relative -mx-3">
                {/* Fade edges - desktop */}
                <div className="pointer-events-none absolute inset-y-0 left-0 z-10 hidden w-12 bg-linear-to-r from-background to-transparent lg:block" />
                <div className="pointer-events-none absolute inset-y-0 right-0 z-10 hidden w-12 bg-linear-to-l from-background to-transparent lg:block" />

                {/* Carousel */}
                <div ref={emblaRef} className="overflow-hidden">
                    <div className="flex gap-3 md:gap-4 touch-pan-y will-change-transform">
                        {testimonials.map((t, i) => (
                            <div
                                key={t.id}
                                role="group"
                                aria-roledescription="slide"
                                className="flex-[0_0_85%] sm:flex-[0_0_48%] md:flex-[0_0_40%] lg:flex-[0_0_31%] xl:flex-[0_0_23%] min-w-0 px-1"
                                aria-current={i === selectedIndex ? "true" : undefined}
                            >
                                <TestimonialCard testimonial={t} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Mobile nav arrows */}
            <div className="flex justify-center gap-3 mt-4 md:hidden">
                <NavBtn onClick={scrollPrev} label="Previous" dir="prev" />
                <NavBtn onClick={scrollNext} label="Next" dir="next" />
            </div>
        </SectionHeader>
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