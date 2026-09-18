import { trustBadges } from "@/data/trust-badges"

export function TrustBadges() {
    return (
        <div className="grid grid-cols-2 gap-2 py-2 sm:grid-cols-4 sm:gap-3">
            {trustBadges.map((b) => (
                <div key={b.label} className="flex flex-col items-center gap-1.5 py-2 text-center sm:py-3">
                    <div className="flex size-10 items-center justify-center rounded-full bg-accent-subtle sm:size-12">
                        <b.icon className="size-5 text-accent sm:size-6" strokeWidth={1.5} />
                    </div>
                    <p className="text-[11px] font-medium leading-tight text-text-primary sm:text-xs">{b.label}</p>
                    <p className="text-[10px] leading-tight text-text-tertiary">{b.sublabel}</p>
                </div>
            ))}
        </div>
    )
}
