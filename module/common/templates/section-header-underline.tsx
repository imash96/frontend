

export default function SectionHeaderUnderline({
    label,
    title,
    description,
}: SectionHeaderProps) {
    return (
        <div className="mb-10">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent mb-2 block">
                {label}
            </span>
            <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight mb-2">
                {title}
            </h3>
            <p className="text-sm text-foreground-secondary max-w-2xl leading-relaxed">
                {description}
            </p>
            <div className="mt-4 h-px bg-linear-to-r from-accent via-border to-transparent" />
        </div>
    );
}


type SectionHeaderProps = {
    label: string;
    title: string;
    description: string;
}