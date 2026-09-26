"use client"

import { Heart, Loader2, Share2 } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useWishlistStore } from "@/lib/store/wishlist-store"

const buttonClass =
    "flex items-center gap-1.5 rounded-sm px-1 py-1.5 text-[11px] font-medium uppercase tracking-wider text-text-secondary transition-colors hover:text-text-primary"

export default function ProductToolbar({ title, variantId }: { title: string; variantId?: string | null }) {
    const [copied, setCopied] = useState(false)
    const [wishlistError, setWishlistError] = useState<string | null>(null)
    const timer = useRef<number | undefined>(undefined)
    const errorTimer = useRef<number | undefined>(undefined)

    const { hydrate, toggle, isLoading } = useWishlistStore()
    const variantIds = useWishlistStore((s) => s.variantIds)
    const saved = variantId ? variantIds.has(variantId) : false

    useEffect(() => {
        hydrate()
        return () => {
            window.clearTimeout(timer.current)
            window.clearTimeout(errorTimer.current)
        }
    }, [hydrate])

    const onToggleWishlist = async () => {
        if (!variantId) {
            setWishlistError("Please select a variant first")
            window.clearTimeout(errorTimer.current)
            errorTimer.current = window.setTimeout(() => setWishlistError(null), 3000)
            return
        }

        setWishlistError(null)
        const result = await toggle(variantId)

        if (!result.success && result.error) {
            setWishlistError(result.error)
            window.clearTimeout(errorTimer.current)
            errorTimer.current = window.setTimeout(() => setWishlistError(null), 3000)
        }
    }

    const onShare = async () => {
        // Strip tracking params so shared links stay clean.
        const url = `${window.location.origin}${window.location.pathname}`
        try {
            if (navigator.share) {
                await navigator.share({ title, url })
                return
            }
            await navigator.clipboard.writeText(url)
            setCopied(true)
            window.clearTimeout(timer.current)
            timer.current = window.setTimeout(() => setCopied(false), 2000)
        } catch {
            // Share sheet dismissed or clipboard blocked - nothing to recover.
        }
    }

    return (
        <div className="space-y-1">
            <div className="flex items-center gap-3 py-1">
                <button
                    type="button"
                    onClick={onToggleWishlist}
                    disabled={isLoading}
                    aria-pressed={saved}
                    className={buttonClass}
                >
                    {isLoading ? (
                        <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
                    ) : (
                        <Heart
                            className={`size-3.5 transition-colors ${saved ? "text-destructive" : ""}`}
                            strokeWidth={1.5}
                            fill={saved ? "currentColor" : "none"}
                            aria-hidden="true"
                        />
                    )}
                    {saved ? "Saved" : "Add to wishlist"}
                </button>
                <span className="text-border" aria-hidden="true">
                    |
                </span>
                <button type="button" onClick={onShare} className={buttonClass}>
                    <Share2 className="size-3.5" strokeWidth={1.5} aria-hidden="true" />
                    {copied ? "Link copied" : "Share"}
                </button>
                <span role="status" className="sr-only">
                    {copied ? "Product link copied to clipboard" : ""}
                </span>
            </div>
            {wishlistError && (
                <p className="text-[11px] text-destructive animate-fade-in-up" role="alert">
                    {wishlistError}
                </p>
            )}
        </div>
    )
}