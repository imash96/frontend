"use client"

import { Heart, Share2 } from "lucide-react"
import { useEffect, useRef, useState } from "react"

const buttonClass =
    "flex items-center gap-1.5 rounded-sm px-1 py-1.5 text-[11px] font-medium uppercase tracking-wider text-text-secondary transition-colors hover:text-text-primary"

export default function ProductToolbar({ title }: { title: string }) {
    // TODO: wishlist is local UI state only - wire it to a Medusa wishlist module / customer metadata to persist.
    const [saved, setSaved] = useState(false)
    const [copied, setCopied] = useState(false)
    const timer = useRef<number | undefined>(undefined)

    useEffect(() => () => window.clearTimeout(timer.current), [])

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
        <div className="flex items-center gap-3 py-1">
            <button type="button" onClick={() => setSaved((v) => !v)} aria-pressed={saved} className={buttonClass}>
                <Heart className="size-3.5" strokeWidth={1.5} fill={saved ? "currentColor" : "none"} aria-hidden="true" />
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
    )
}