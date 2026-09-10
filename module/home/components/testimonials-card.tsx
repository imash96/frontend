import { Testimonial } from "@/data/testimonials";
import { BadgeCheck, Quote } from "lucide-react";
import Rating from "./testimonals-rating";
import Image from "next/image";
import { memo } from "react";

// ─── Testimonial card ─────────────────────────────────────────────────────────
const TestimonialCard = memo(function TestimonialCard({ testimonial: t, }: { testimonial: Testimonial }) {
    return (
        <article className="group relative flex h-full flex-col rounded-2xl border border-card-border bg-card p-5 sm:p-6 transition-all duration-300 ease-out hover:border-border-strong hover:shadow-md">
            {/* Decorative quote */}
            <div className="absolute right-4 top-4 opacity-[0.06] group-hover:opacity-[0.10] transition-opacity duration-500 pointer-events-none" aria-hidden>
                <Quote size={44} strokeWidth={1} />
            </div>

            {/* Stars + date */}
            <div className="mb-3.5 flex items-center justify-between gap-2">
                <Rating rating={t.star} size="sm" />
                {t.date && (
                    <time className="shrink-0 text-[11px] font-medium tracking-wide text-text-tertiary">
                        {t.date}
                    </time>
                )}
            </div>

            {/* Review text */}
            <blockquote className="flex-1 mb-5">
                <p className="text-[13px] leading-[1.7] text-text-secondary line-clamp-5">
                    {t.review}
                </p>
            </blockquote>

            <div className="h-px w-full bg-divider mb-4" />

            {/* Author */}
            <div className="flex items-center gap-3">
                <div className="relative size-9 shrink-0 overflow-hidden rounded-full ring-2 ring-border-subtle ring-offset-1 ring-offset-card">
                    <Image
                        src={t.image}
                        alt={t.name}
                        fill
                        sizes="36px"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                </div>
                <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                        <span className="text-[13px] font-semibold text-text-primary truncate">
                            {t.name}
                        </span>
                        {t.verified && (
                            <BadgeCheck
                                className="size-3.5 text-accent shrink-0"
                                aria-label="Verified buyer"
                            />
                        )}
                    </div>
                    {t.location && (
                        <p className="text-[11px] text-text-tertiary truncate">{t.location}</p>
                    )}
                </div>
            </div>

            {t.product && (
                <p className="mt-2.5 text-[10px] font-medium text-accent truncate">
                    Purchased: {t.product}
                </p>
            )}
        </article>
    );
});

export default TestimonialCard