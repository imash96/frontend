export default function CheckLoading() {
  return (
    <>
      {/* Left column — form skeleton */}
      <div className="lg:col-span-6 space-y-6 order-2 lg:order-1">
        {/* Progress bar skeleton */}
        <div className="flex items-center justify-between">
          {[0, 1, 2].map((i) => (
            <div key={i} className={i < 2 ? "flex items-center flex-1" : "flex items-center"}>
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-full skeleton-shimmer" />
                <div className="hidden sm:block space-y-1">
                  <div className="h-3.5 w-16 rounded skeleton-shimmer" />
                  <div className="h-2.5 w-24 rounded skeleton-shimmer" />
                </div>
              </div>
              {i < 2 && (
                <div className="mx-4 h-0.5 flex-1 rounded-full skeleton-shimmer" />
              )}
            </div>
          ))}
        </div>

        {/* Address step skeleton */}
        <div className="space-y-4 pb-5 border-b border-border">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-5 w-5 rounded skeleton-shimmer" />
            <div className="h-5 w-32 rounded skeleton-shimmer" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="h-12 rounded-lg skeleton-shimmer" />
            <div className="h-12 rounded-lg skeleton-shimmer" />
          </div>
          <div className="h-12 rounded-lg skeleton-shimmer" />
          <div className="h-12 rounded-lg skeleton-shimmer" />
          <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-3">
            <div className="h-12 rounded-lg skeleton-shimmer" />
            <div className="h-12 rounded-lg skeleton-shimmer" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_140px] gap-3">
            <div className="h-12 rounded-lg skeleton-shimmer" />
            <div className="h-12 rounded-lg skeleton-shimmer" />
          </div>
          <div className="h-12 rounded-lg skeleton-shimmer" />
          <div className="h-12 rounded-lg skeleton-shimmer" />
          <div className="h-11 w-full sm:w-40 rounded-md skeleton-shimmer mt-2" />
        </div>

        {/* Shipping step skeleton */}
        <div className="space-y-3 pb-5 border-b border-border">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-5 w-5 rounded skeleton-shimmer" />
            <div className="h-5 w-36 rounded skeleton-shimmer" />
          </div>
        </div>

        {/* Payment step skeleton */}
        <div className="space-y-3 pb-5 border-b border-border">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-5 w-5 rounded skeleton-shimmer" />
            <div className="h-5 w-24 rounded skeleton-shimmer" />
          </div>
        </div>
      </div>

      {/* Right column — summary skeleton */}
      <div className="lg:col-span-4 order-1 lg:order-2">
        <div className="border border-border rounded-lg p-4 sm:p-5 space-y-4">
          {/* Line items */}
          {[0, 1].map((i) => (
            <div key={i} className="flex gap-3">
              <div className="w-15 h-20 rounded-md skeleton-shimmer shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3.5 w-3/4 rounded skeleton-shimmer" />
                <div className="h-3 w-1/2 rounded skeleton-shimmer" />
                <div className="h-3.5 w-16 rounded skeleton-shimmer" />
              </div>
            </div>
          ))}
          <hr className="border-border" />
          {/* Totals */}
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="flex justify-between">
              <div className="h-3.5 w-20 rounded skeleton-shimmer" />
              <div className="h-3.5 w-16 rounded skeleton-shimmer" />
            </div>
          ))}
          <hr className="border-border" />
          <div className="flex justify-between pt-1">
            <div className="h-5 w-16 rounded skeleton-shimmer" />
            <div className="h-5 w-24 rounded skeleton-shimmer" />
          </div>
        </div>
      </div>

      {/* Shimmer animation */}
      <style>{`
        .skeleton-shimmer {
          background: linear-gradient(
            90deg,
            var(--color-border) 25%,
            var(--color-background-elevated, #f0f0f0) 50%,
            var(--color-border) 75%
          );
          background-size: 200% 100%;
          animation: shimmer 1.5s linear infinite;
        }
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </>
  )
}
