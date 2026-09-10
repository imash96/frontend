import { SectionHeaderProps } from "@/types/homepage";
import Container from "@/ui/container";

export function SectionHeaderEditorial({
    title,
    desc,
    sectionName,
    className = '',
    eyebrow,
    action,
    children,
}: SectionHeaderProps) {
    return (
        <Container size="md" as="section" aria-label={sectionName} className="py-10 md:py-14 lg:py-16">
            <div className="mb-10 md:mb-14 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                <div className="flex gap-4 md:gap-5">
                    {/* Accent stripe */}
                    <div className="hidden md:flex flex-col items-center gap-1 pt-1" aria-hidden="true">
                        <span className="w-0.5 flex-1 bg-linear-to-b from-accent to-accent/20 rounded-full" />
                    </div>
                    <div className="flex flex-col gap-2 max-w-2xl">
                        {eyebrow && (
                            <p className="text-[10px] font-bold tracking-[0.35em] uppercase text-accent/80">
                                {eyebrow}
                            </p>
                        )}
                        <h2 className={`font-heading font-extralight leading-[1.05] tracking-[-0.03em] text-text-primary text-balance text-[2rem] md:text-[2.75rem] lg:text-[3.25rem] ${className}`}>
                            {title}
                        </h2>
                        {desc && (
                            <p className="text-sm md:text-[14px] leading-relaxed font-light text-text-tertiary mt-1 max-w-md border-l-2 border-border pl-4">
                                {desc}
                            </p>
                        )}
                    </div>
                </div>
                {action && <div className="shrink-0 self-end">{action}</div>}
            </div>
            {children}
        </Container>
    );
}