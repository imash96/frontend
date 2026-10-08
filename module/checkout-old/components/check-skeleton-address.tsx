import { div as Div } from "motion/react-client";

export default function CheckSkeletonAddress() {
  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Name fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Bone className="h-12 rounded-lg" delay={0} />
        <Bone className="h-12 rounded-lg" delay={0.05} />
      </div>
      {/* Company */}
      <Bone className="h-12 rounded-lg" delay={0.1} />
      {/* Address 1 */}
      <Bone className="h-12 rounded-lg" delay={0.15} />
      {/* Address 2 */}
      <Bone className="h-12 rounded-lg" delay={0.2} />
      {/* Postal + City */}
      <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-3">
        <Bone className="h-12 rounded-lg" delay={0.25} />
        <Bone className="h-12 rounded-lg" delay={0.3} />
      </div>
      {/* Country + Province */}
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_140px] gap-3">
        <Bone className="h-12 rounded-lg" delay={0.35} />
        <Bone className="h-12 rounded-lg" delay={0.4} />
      </div>
      {/* Email */}
      <Bone className="h-12 rounded-lg" delay={0.45} />
      {/* Phone */}
      <Bone className="h-12 rounded-lg" delay={0.5} />
      {/* Button */}
      <Bone className="h-11 w-40 rounded-md mt-2" delay={0.55} />
    </div>
  )
}

function Bone({
  className = "",
  delay = 0,
}: {
  className?: string
  delay?: number
}) {
  return (
    <Div
      className={`skeleton-shimmer ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration: 0.2, ease: "easeOut" }}
    />
  )
}
