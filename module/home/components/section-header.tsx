import Container from "@/ui/container"

type SectionHeaderProps = {
    title: string
    desc?: string
    sectionName: string
    className?: string
    align?: "left" | "center"
    eyebrow?: string
    action?: React.ReactNode
} & React.PropsWithChildren

export default function SectionHeader({
    title,
    desc,
    sectionName,
    className = "",
    align = "left",
    eyebrow,
    action,
    children,
}: SectionHeaderProps) {
    const isCenter = align === "center"

    return (
        <Container
            size="2xl"
            as="section"
            aria-label={sectionName}
            className="py-8 md:py-12 lg:py-14"
        >
            {/* Header row */}
            <div className={`flex flex-col gap-4 ${isCenter ? "items-center text-center" : "sm:flex-row sm:items-end sm:justify-between gap-5"} mb-7 md:mb-9`}>
                <div className={`flex flex-col gap-2 ${isCenter ? "max-w-2xl" : "max-w-xl"}`}>
                    {eyebrow && (
                        <p className={`inline-flex items-center gap-2.5 text-[10px] font-semibold tracking-[0.30em] uppercase text-accent ${isCenter ? "mx-auto" : ""}`}>
                            <span className="block h-px w-7 bg-accent" aria-hidden="true" />
                            {eyebrow}
                            {isCenter && <span className="block h-px w-7 bg-accent" aria-hidden="true" />}
                        </p>
                    )}
                    <h2 className={`font-heading font-light leading-[1.08] tracking-[-0.02em] text-text-primary text-balance text-[1.85rem] md:text-[2.25rem] lg:text-[2.6rem] ${className}`}>
                        {title}
                    </h2>
                    {desc && (
                        <p className="text-sm md:text-[13.5px] leading-relaxed font-light text-text-secondary mt-0.5">
                            {desc}
                        </p>
                    )}
                </div>

                {action && !isCenter && <>{action}</>}
            </div>

            {children}
        </Container>
    )
}