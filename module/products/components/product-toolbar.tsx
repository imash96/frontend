"use client"

import { useState } from "react"
import { Heart, Share2 } from "lucide-react"

export default function ProductToolbar({ title }: { title: string }) {
    const [saved, setSaved] = useState(false)
    const [copied, setCopied] = useState(false)

    const onWishlist = () => setSaved((v) => !v)

    const onShare = async () => {
        const url = typeof window !== "undefined" ? window.location.href : ""
        try {
            if (navigator.share) {
                await navigator.share({ title, url })
                return
            }
            await navigator.clipboard.writeText(url)
            setCopied(true)
            window.setTimeout(() => setCopied(false), 2000)
        } catch {
            /* user cancelled share */
        }
    }

    return (
        <div className="flex items-center gap-3 py-1">
            <button
                type="button"
                onClick={onWishlist}
                aria-pressed={saved}
                className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-text-secondary transition-colors hover:text-text-primary"
            >
                <Heart
                    className="size-3.5"
                    strokeWidth={1.5}
                    fill={saved ? "currentColor" : "none"}
                />
                {saved ? "Saved" : "Add to Wishlist"}
            </button>
            <span className="text-border" aria-hidden>
                |
            </span>
            <button
                type="button"
                onClick={onShare}
                className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-text-secondary transition-colors hover:text-text-primary"
            >
                <Share2 className="size-3.5" strokeWidth={1.5} />
                {copied ? "Link copied" : "Share"}
            </button>
        </div>
    )
}
