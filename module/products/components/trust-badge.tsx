import { trustBadges } from "@/data/trust-badges"

export function TrustBadges() {
    return (
        <ul role="list" aria-label="Our promises" className="grid grid-cols-2 gap-2 py-2 sm:grid-cols-4 sm:gap-3">
            {trustBadges.map((badge) => (
                <li key={badge.label} className="flex flex-col items-center gap-1.5 py-2 text-center sm:py-3">
                    <span className="flex size-10 items-center justify-center rounded-full bg-accent-subtle sm:size-12">
                        <badge.icon aria-hidden="true" className="size-5 text-accent sm:size-6" strokeWidth={1.5} />
                    </span>
                    <span className="text-[11px] font-medium leading-tight text-text-primary sm:text-xs">{badge.label}</span>
                    <span className="text-[11px] leading-tight text-text-tertiary">{badge.sublabel}</span>
                </li>
            ))}
        </ul>
    )
}