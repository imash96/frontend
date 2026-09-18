"use client"

import { motion } from "motion/react"
import Button from "@/ui/button"
import { AlertTriangle } from "lucide-react"

export default function CheckError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <motion.div
      className="lg:col-span-10 flex flex-col items-center justify-center min-h-[50vh] text-center px-4 space-y-4"
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 20, delay: 0.1 }}
      >
        <AlertTriangle className="w-12 h-12 text-warning" />
      </motion.div>

      <h1 className="text-lg sm:text-xl font-semibold text-foreground">
        Something went wrong
      </h1>
      <p className="text-sm text-foreground-muted max-w-md">
        {error.message || "An unexpected error occurred during checkout. Please try again."}
      </p>
      <Button onClick={reset} variant="primary" size="md">
        Try Again
      </Button>
    </motion.div>
  )
}
