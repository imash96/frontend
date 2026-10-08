import { div as Div } from "motion/react-client";

export default function CheckSkeletonShipping() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
      {[0, 1].map((i) => (
        <Div
          key={i}
          className="rounded-xl border border-border p-3 sm:p-4 space-y-2"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1, duration: 0.2, ease: "easeOut" }}
        >
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded skeleton-shimmer" />
            <div className="h-4 w-28 rounded skeleton-shimmer" />
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3.5 h-3.5 rounded skeleton-shimmer" />
            <div className="h-3 w-36 rounded skeleton-shimmer" />
          </div>
          <div className="h-4 w-20 rounded skeleton-shimmer mt-2" />
        </Div>
      ))}
    </div>
  )
}
