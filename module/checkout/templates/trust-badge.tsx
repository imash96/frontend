export function TrustBadge({ children, icon }: { children: React.ReactNode; icon: React.ReactNode }) {
    return (
        <div className="flex items-center gap-1.5 text-xs text-text-tertiary [&_svg]:w-3.5 [&_svg]:h-3.5">
            <span className="text-success">{icon}</span>
            {children}
        </div>
    );
}