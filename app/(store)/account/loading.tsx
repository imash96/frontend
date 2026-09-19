export default function AccountLoading() {
  const shimmerStyle = {
    backgroundImage:
      "linear-gradient(90deg, transparent 0%, var(--muted-hover) 50%, transparent 100%)",
    backgroundSize: "200% 100%",
  };

  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="space-y-3 animate-shimmer" style={shimmerStyle}>
        <div className="h-6 w-40 rounded bg-muted" />
        <div className="h-4 w-72 rounded bg-muted" />
      </div>

      {/* Content cards skeleton */}
      <div className="space-y-4">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="rounded-lg border border-border p-5 space-y-4 animate-shimmer"
            style={{
              ...shimmerStyle,
              animationDelay: `${(i + 1) * 100}ms`,
            }}
          >
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-md bg-muted shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-48 rounded bg-muted" />
                <div className="h-3 w-32 rounded bg-muted" />
                <div className="h-3 w-24 rounded bg-muted" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
