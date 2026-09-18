"use client"

import { motion } from "motion/react"

export default function CheckSkeletonPayment() {
  return (
    <div className="grid gap-2 sm:gap-3">
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="flex items-center gap-2.5 sm:gap-3 p-3 sm:p-4 border border-border rounded-lg"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1, duration: 0.2, ease: "easeOut" }}
        >
          <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full skeleton-shimmer shrink-0" />
          <div className="flex-1 min-w-0 space-y-1">
            <div className="h-4 w-32 rounded skeleton-shimmer" />
            <div className="h-3 w-48 rounded skeleton-shimmer" />
          </div>
          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded skeleton-shimmer shrink-0" />
        </motion.div>
      ))}
    </div>
  )
}
