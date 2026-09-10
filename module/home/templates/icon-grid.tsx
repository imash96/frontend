import { IconItem } from "@/types/common";
import Container from "@/ui/container";

type IconGridSectionProps = {
    items: IconItem[]
    type?: 'top' | 'bottom'
    className?: string
}

export default function IconGridSection({ items, type = 'top', className = "" }: IconGridSectionProps) {
    return (
        <div className={`w-full border-y border-border py-7 lg:py-9 ${className}`}>
            <Container size="2xl" as="ul" role="list" className={`grid grid-cols-2 gap-4 ${type === "top" ? "lg:grid-cols-4 lg:gap-x-2 xl:gap-x-6" : "md:grid-cols-4 md:gap-6"}`}>
                {items.map(({ name, Icon, description }) => (
                    <li
                        key={name}
                        className="flex flex-col md:flex-row items-center gap-3 md:gap-4 p-3 md:p-4"
                    >
                        <Icon
                            className="size-12 lg:size-14 shrink-0 text-accent"
                            aria-hidden="true"
                        />
                        <div className="flex flex-col items-center md:items-start gap-0.5 text-center md:text-left">
                            <h3 className="text-[13px] md:text-sm font-semibold tracking-wide text-text-primary">
                                {name}
                            </h3>
                            <p className="text-xs font-light leading-snug text-text-secondary">
                                {description}
                            </p>
                        </div>
                    </li>
                ))}
            </Container>
        </div>
    )
}