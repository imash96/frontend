"use client"

import { ChevronLeft, ChevronRight } from "lucide-react";
import Container from '@/ui/container';
import type { AnnouncementItem } from '@/types/homepage';
import Link from "next/link";
import { useCarousel } from "@/lib/hook/use-carousel";

export default function AnnouncementBar({ items }: { items: AnnouncementItem[] }) {

    const { scrollPrev, emblaRef, scrollNext } = useCarousel({
        autoplay: true,
        autoplayDelay: 4000,
        options: { loop: true },
    })

    if (!items?.length) return null;

    return (
        <div
            role="region"
            aria-label="Store announcements"
            aria-roledescription="carousel"
            aria-live="polite"
            className="bg-primary text-primary-foreground select-none"
        >
            <Container size="2xl" className="flex items-center justify-between h-9 gap-2">
                <AnnouncementButton
                    onClick={scrollPrev}
                    direction="prev"
                    label="Previous announcement"
                />
                <div className="overflow-hidden flex-1" ref={emblaRef}>
                    <div className="flex">
                        {items.map((item, idx) => {
                            const baseClass =
                                "flex-[0_0_100%] flex items-center justify-center text-center text-xs text-primary-foreground font-body tracking-wide uppercase"

                            return item.link ? (
                                <Link
                                    key={idx}
                                    href={item.link}
                                    className={`${baseClass} hover:opacity-80 transition-opacity underline-offset-2 hover:underline`}
                                >
                                    {item.message}
                                </Link>
                            ) : (
                                <span key={idx} className={baseClass}>
                                    {item.message}
                                </span>
                            );
                        })}
                    </div>
                </div>
                <AnnouncementButton
                    onClick={scrollNext}
                    direction="next"
                    label="Next announcement"
                />
            </Container >
        </div >
    )
}

const AnnouncementButton = ({ onClick, direction, label }: AnnouncementButtonProps) => {
    return (
        <button
            onClick={onClick}
            aria-label={label}
            className="p-1.5 hidden sm:block rounded-sm opacity-70 hover:opacity-100 hover:bg-primary-foreground/10 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
        >
            {direction === 'prev' ? (
                <ChevronLeft className="size-4 shrink-0" />
            ) : (
                <ChevronRight className="size-4 shrink-0" />
            )}
        </button>
    )
};

type AnnouncementButtonProps = {
    onClick: () => void;
    direction: 'prev' | 'next';
    label: string;
}