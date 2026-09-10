import Image from "next/image";
import { MarqueeImage } from "@/data/gallery-wall";

import "@/css/marquee.css"

export interface ImageMarqueeProps {
    items: MarqueeImage[];
    /** Scroll direction */
    direction?: "left" | "right";
    /**
     * Duration in seconds for one full loop cycle.
     * Larger value = slower scroll. Default: 40s.
     */
    duration?: number;
    /**
     * Fixed width (px) of each image tile including its gap.
     * This is the *content* width — gap is added on top.
     * Default: 220px.
     */
    tileWidth?: number;
    /** Gap between tiles in pixels. Default: 12 */
    gap?: number;
    /** Image aspect ratio. Default: "3/4" (portrait — fits jacket shots) */
    aspectRatio?: string;
    /** Border radius token. Default: "0.75rem" */
    borderRadius?: string;
    /** aria-label for the scroll region */
    ariaLabel?: string;
}

/* ─── Image tile ────────────────────────────────────────────────────────── */
interface TileProps {
    item: MarqueeImage;
    width: number;
    gap: number;
    aspectRatio: string;
    borderRadius: string;
    index: number;
}

function MarqueeTile({ item, width, gap, aspectRatio, borderRadius, index }: TileProps) {
    const minW = Math.round(width * 0.7)
    const vwCoeff = Math.round(width / 12.8)
    return (
        <div
            className="relative shrink-0 overflow-hidden group will-change-transform"
            style={{
                width: `clamp(${minW}px, ${vwCoeff}vw, ${width}px)`,
                marginRight: `${gap}px`,
                borderRadius,
                aspectRatio,
                /* Guarantee GPU layer per tile — prevents composite promotions mid-paint */
                transform: "translateZ(0)",
            }}
            aria-hidden={index >= 1 ? "true" : undefined}
        >
            {/* ── Image ─────────────────────────────────────────────────────── */}
            <Image
                src={item.src}
                alt={item.alt}
                fill
                loading="lazy"
                decoding="async"
                draggable={false}
                className="absolute inset-0 w-full h-full object-cover object-center select-none pointer-events-none transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                sizes="(max-width: 768px) 45vw, (max-width: 1200px) 18vw, 220px"
                style={{ borderRadius }}
            />

            {/* ── Ambient dark overlay (always) ─────────────────────────────── */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    borderRadius,
                    background: "linear-gradient(to top, oklch(5% 0.01 43 / 0.70) 0%, transparent 45%)",
                }}
                aria-hidden
            />

            {/* ── Hover overlay with shimmer ────────────────────────────────── */}
            <div
                className={[
                    "absolute inset-0 pointer-events-none",
                    "opacity-0 group-hover:opacity-100",
                    "transition-opacity duration-500 ease-out",
                ].join(" ")}
                style={{
                    borderRadius,
                    background: "linear-gradient(135deg, oklch(67% 0.088 48 / 0.08) 0%, transparent 60%)",
                }}
                aria-hidden
            />

            {/* ── Bottom info strip (slides up on hover) ────────────────────── */}
            {(item.customerName || item.tag) && (
                <div
                    className="absolute bottom-0 left-0 right-0 px-3 pb-3 pt-6 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out pointer-events-none"
                >
                    {item.customerName && (
                        <p className="text-white text-[11px] font-semibold tracking-wide truncate font-body">
                            {item.customerName}
                        </p>
                    )}
                    {item.tag && (
                        <p
                            className="text-white/70 text-[10px] tracking-widest uppercase truncate mt-0.5 font-body"
                        >
                            {item.tag}
                        </p>
                    )}
                </div>
            )}

            {/* ── Thin accent border ring (on hover) ───────────────────────── */}
            <div
                className="absolute inset-0 pointer-events-none ring-inset opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                    borderRadius,
                    boxShadow: "inset 0 0 0 1.5px oklch(67% 0.088 48 / 0.55)",
                }}
                aria-hidden
            />
        </div>
    );
}

/* ─── Public component ──────────────────────────────────────────────────── */
export function ImageMarquee({
    items,
    direction = "left",
    duration = 40,
    tileWidth = 220,
    gap = 12,
    aspectRatio = "3/4",
    borderRadius = "0.75rem",
    ariaLabel = "Scrolling customer image gallery",
}: ImageMarqueeProps) {
    if (!items.length) return null;
    const cssClass = direction === "left" ? "marquee-track--left" : "marquee-track--right";

    return (
        <div
            id={`marquee-${direction}-aspectRatio`}
            className="marquee-root marquee-mask relative w-full overflow-hidden"
            role="region"
            aria-label={ariaLabel}
            aria-live="off"
        >
            <div
                className={`marquee-track ${cssClass} will-change-transform`}
                style={{
                    animationDuration: `${duration}s`,
                    gap: `${gap}px`,
                    paddingRight: `${gap}px`, /* prevent collapsed gap at wrap */
                    transform: "translateZ(0)", // GPU stabilize
                }}
            >
                {[...items, ...items, ...items, ...items].map((item, i) => (
                    <MarqueeTile
                        key={`${item.id}-${i}`}
                        item={item}
                        width={tileWidth}
                        gap={0} /* gap handled by flex gap above */
                        aspectRatio={aspectRatio}
                        borderRadius={borderRadius}
                        index={Math.floor(i / items.length)}
                    />
                ))}
            </div>
        </div>
    );
}

export default ImageMarquee;
