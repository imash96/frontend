"use client"

import { useEffect, useState } from "react"

/**
 * The part of PayPal's card-field `style` option we use. PayPal renders each input inside its own
 * iframe, so CSS variables and Tailwind classes cannot reach it: it needs literal values, limited to
 * PayPal's supported properties (kebab-case) and the `input` / `.invalid` selectors.
 */
export type CardFieldStyle = {
    input: Record<string, string>
    ".invalid": Record<string, string>
}

// Literal class names (so Tailwind generates them). We read what they resolve to in the live theme,
// which keeps the card inputs in step with the rest of the site, dark mode included.
const TEXT_CLASS = "text-foreground"
const INVALID_CLASS = "text-destructive"
const FONT_CLASS = "font-body"

const FALLBACK = {
    text: "rgb(17, 24, 39)",
    invalid: "rgb(220, 38, 38)",
    family: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
}

function probe(className: string, property: "color" | "fontFamily") {
    const el = document.createElement("span")
    el.className = className
    el.style.cssText = "position:absolute;visibility:hidden;pointer-events:none"
    document.body.appendChild(el)
    const value = getComputedStyle(el)[property]
    el.remove()
    return value
}

/** Any CSS colour (rgb, oklch, color(), ...) to plain rgb(), which PayPal's iframe always understands. */
function toRgb(color: string, fallback: string) {
    const ctx = document.createElement("canvas").getContext("2d")
    if (!ctx || !color) return fallback

    ctx.fillStyle = "#010203" // sentinel: an unparseable value leaves it unchanged
    ctx.fillStyle = color
    if (ctx.fillStyle === "#010203") return fallback

    ctx.clearRect(0, 0, 1, 1)
    ctx.fillRect(0, 0, 1, 1)
    const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data
    return a === 255 ? `rgb(${r}, ${g}, ${b})` : `rgba(${r}, ${g}, ${b}, ${(a / 255).toFixed(3)})`
}

/**
 * Returns the themed style once the client has mounted (null before that). Computed once, on purpose:
 * changing the `style` prop later makes PayPal recreate the fields and wipes what the customer typed.
 */
export function useCardTheme(): CardFieldStyle | null {
    const [style, setStyle] = useState<CardFieldStyle | null>(null)

    useEffect(() => {
        const text = toRgb(probe(TEXT_CLASS, "color"), FALLBACK.text)
        const invalid = toRgb(probe(INVALID_CLASS, "color"), FALLBACK.invalid)
        // Web fonts loaded by the page aren't available inside PayPal's iframe, so the font stack
        // ends in system fonts; single quotes keep the value safe to pass through.
        const family = `${probe(FONT_CLASS, "fontFamily").replace(/"/g, "'")}, ${FALLBACK.family}`

        setStyle({
            input: {
                "font-size": "16px", // 16px also stops iOS from zooming into the field
                "font-family": family,
                "font-weight": "400",
                color: text,
                background: "transparent", // the field box (border, radius, fill) is ours
                padding: "0",
            },
            ".invalid": { color: invalid },
        })
    }, [])

    return style
}