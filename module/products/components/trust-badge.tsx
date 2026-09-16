import { trustBadges } from "@/data/trust-badges";

export function TrustBadges() {
    return (
        <div className="grid grid-cols-4 gap-3 py-2">
            {trustBadges.map((b, i) => {
                return (
                    <div key={i} className="flex flex-col items-center text-center gap-1.5 py-3">
                        <div className="size-12 rounded-full bg-accent-subtle flex items-center justify-center">
                            <b.icon className="size-6 text-accent" strokeWidth={1.5} />
                        </div>
                        <p className="text-xs font-medium text-text-primary leading-tight">
                            {b.label}
                        </p>
                        <p className="text-[10px] text-text-tertiary leading-tight">{b.sublabel}</p>
                    </div>
                )
            })}
        </div>
    )
}