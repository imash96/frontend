import { SectionHeaderProps } from "@/types/homepage";
import Container from "@/ui/container";

/* ═══════════════════════════════════════════════════════════════════════════
   VARIANT 1 — Classic Left-Aligned
   Clean, minimal left-aligned header with optional action on the right.
   ═══════════════════════════════════════════════════════════════════════════ */
export function SectionHeaderClassic({
    title,
    desc,
    sectionName,
    className = '',
    eyebrow,
    action,
    children,
}: SectionHeaderProps) {
    return (
        <Container size="2xl" as="section" aria-label={sectionName} className="py-10 md:py-14 lg:py-16">
            <div className="mb-6 md:mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-5">
                <div className="flex flex-col gap-2 max-w-xl">
                    {eyebrow && (
                        <p className="inline-flex items-center gap-2.5 text-[10px] font-semibold tracking-[0.30em] uppercase text-accent">
                            <span className="block h-px w-7 bg-accent" aria-hidden="true" />
                            {eyebrow}
                        </p>
                    )}
                    <h2
                        className={`font-heading font-light leading-[1.08] tracking-[-0.02em] text-text-primary text-balance text-[1.85rem] md:text-[2.25rem] lg:text-[2.6rem] ${className}`}
                    >
                        {title}
                    </h2>
                    {desc && (
                        <p className="text-sm md:text-[13.5px] leading-relaxed font-light text-text-secondary mt-0.5">
                            {desc}
                        </p>
                    )}
                </div>
                {action && <div className="shrink-0">{action}</div>}
            </div>
            {children}
        </Container>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════
   VARIANT 2 — Centered Elegant
   Centered with decorative accent lines flanking the eyebrow.
   ═══════════════════════════════════════════════════════════════════════════ */
export function SectionHeaderCentered({
    title,
    desc,
    sectionName,
    className = '',
    eyebrow,
    action,
    children,
}: SectionHeaderProps) {
    return (
        <Container size="2xl" as="section" aria-label={sectionName} className="py-12 md:py-16 lg:py-20">
            <div className="mb-10 md:mb-14 flex flex-col items-center text-center gap-4">
                <div className="flex flex-col items-center gap-3 max-w-2xl">
                    {eyebrow && (
                        <p className="inline-flex items-center gap-3 text-[10px] font-semibold tracking-[0.30em] uppercase text-accent">
                            <span className="block h-px w-10 bg-linear-to-r from-transparent to-accent" aria-hidden="true" />
                            {eyebrow}
                            <span className="block h-px w-10 bg-linear-to-l from-transparent to-accent" aria-hidden="true" />
                        </p>
                    )}
                    <h2
                        className={`font-heading font-light leading-[1.08] tracking-[-0.02em] text-text-primary text-balance text-[1.85rem] md:text-[2.5rem] lg:text-[3rem] ${className}`}
                    >
                        {title}
                    </h2>
                    {desc && (
                        <p className="text-sm md:text-base leading-relaxed font-light text-text-secondary mt-1 max-w-lg">
                            {desc}
                        </p>
                    )}
                    {/* Decorative divider */}
                    <div className="flex items-center gap-2 mt-2" aria-hidden="true">
                        <span className="block h-px w-12 bg-border" />
                        <span className="block size-1.5 rotate-45 bg-accent" />
                        <span className="block h-px w-12 bg-border" />
                    </div>
                </div>
                {action && <div className="mt-2">{action}</div>}
            </div>
            {children}
        </Container>
    );
}