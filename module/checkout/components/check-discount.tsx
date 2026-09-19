"use client"

import type { StoreCart } from "@medusajs/types"
import { Tag, X, Loader2 } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import { useState, useTransition } from "react"
import { applyCheckDiscount, removeCheckDiscount } from "@/lib/action/checkout"

export default function CheckDiscount({ cart }: { cart: StoreCart }) {
  const [isOpen, setIsOpen] = useState(false)
  const [code, setCode] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [removingCode, setRemovingCode] = useState<string | null>(null)

  const appliedCodes: string[] =
    cart.promotions?.map((p: any) => p.code).filter(Boolean) ?? []

  function handleApply() {
    if (!code.trim() || isPending) return
    setError(null)
    setSuccess(false)

    startTransition(async () => {
      try {
        await applyCheckDiscount(code.trim())
        setCode("")
        setSuccess(true)
        setTimeout(() => setSuccess(false), 2000)
      } catch (err: any) {
        setError(err.message || "Invalid promo code")
      }
    })
  }

  function handleRemove(codeToRemove: string) {
    setRemovingCode(codeToRemove)
    startTransition(async () => {
      try {
        await removeCheckDiscount(codeToRemove)
      } catch (err: any) {
        setError(err.message || "Failed to remove code")
      } finally {
        setRemovingCode(null)
      }
    })
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 text-sm text-accent hover:text-accent/80 transition-colors font-medium"
      >
        <Tag className="w-3.5 h-3.5" />
        {isOpen ? "Hide promo code" : "Have a promo code?"}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="overflow-hidden"
          >
            <div className="pt-2.5 space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value)
                    setError(null)
                  }}
                  onKeyDown={(e) => e.key === "Enter" && handleApply()}
                  placeholder="Enter code"
                  className="flex-1 h-9 px-3 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors"
                  disabled={isPending}
                />
                <button
                  type="button"
                  onClick={handleApply}
                  disabled={!code.trim() || isPending}
                  className="h-9 px-4 text-sm font-medium rounded-md bg-accent text-accent-foreground hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5"
                >
                  {isPending && !removingCode ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : null}
                  Apply
                </button>
              </div>

              {/* Error message */}
              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ y: -8, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -8, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="text-xs text-destructive"
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>

              {/* Success message */}
              <AnimatePresence>
                {success && (
                  <motion.p
                    initial={{ y: -8, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -8, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="text-xs text-green-600"
                  >
                    Promo code applied!
                  </motion.p>
                )}
              </AnimatePresence>

              {/* Applied codes as chips */}
              {appliedCodes.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <AnimatePresence>
                    {appliedCodes.map((appliedCode) => (
                      <motion.span
                        key={appliedCode}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={{ type: "spring", stiffness: 500, damping: 20 }}
                        className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-accent/10 text-accent border border-accent/20"
                      >
                        <Tag className="w-3 h-3" />
                        {appliedCode}
                        <button
                          type="button"
                          onClick={() => handleRemove(appliedCode)}
                          disabled={removingCode === appliedCode}
                          className="ml-0.5 hover:text-destructive transition-colors"
                          aria-label={`Remove code ${appliedCode}`}
                        >
                          {removingCode === appliedCode ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <X className="w-3 h-3" />
                          )}
                        </button>
                      </motion.span>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
