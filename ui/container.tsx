// ─── Types ────────────────────────────────────────────────────────────────────

/**
 * Container size variants - maps 1:1 to CSS classes in containers.css
 *
 *  xs   →  max-w: 640px   - Narrow prose, labels, footnotes
 *  sm   →  max-w: 768px   - Articles, blog content, editorial
 *  md   →  max-w: 1024px  - Most content sections
 *  lg   →  max-w: 1280px  - Standard full layout          ← default
 *  xl   →  max-w: 1440px  - Wide grids, 1440+ displays
 *  2xl  →  max-w: 1680px  - Showcase sections, 1920+ displays
 *  3xl  →  max-w: 1680px  - ultra-wide 2560+displays
 *  full →  max-w: 2048px  - Heroes, banners, ultra-wide 100%
 */
type ContainerSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "full"

/**
 * Padding modifier - composes with the size class
 *
 *  default → standard responsive scale
 *  tight   → ~half scale (dense UI panels, data tables)
 *  loose   → ~1.5× scale (hero / landing sections)
 *  none    → 0 padding (full-bleed inside max-width)
 */
type ContainerPadding = "default" | "tight" | "loose" | "none"

type ContainerProps<T extends React.ElementType = "div"> = {
    /** HTML element or React component to render as. Defaults to "div". */
    as?: T
    /** Width constraint. Defaults to "lg" (1280px). */
    size?: ContainerSize
    /** Horizontal padding scale. Defaults to "default". */
    padding?: ContainerPadding
    /**
     * When provided, wraps the container in a <section> with this
     * aria-label - gives semantic structure for screen readers and
     * browser reader-mode without extra wrapper components.
     */
    section?: string
    className?: string
    children?: React.ReactNode
} & Omit<React.ComponentPropsWithoutRef<T>, "className" | "children" | "as">

// ─── Maps ─────────────────────────────────────────────────────────────────────

const sizeClass: Record<ContainerSize, string> = {
    xs: "container-xs",
    sm: "container-sm",
    md: "container-md",
    lg: "container-lg",
    xl: "container-xl",
    "2xl": "container-2xl",
    "3xl": "container-3xl",
    full: "container-full",
}

const paddingClass: Record<ContainerPadding, string> = {
    default: "",            // no modifier - standard scale from containers.css
    tight: "px-safe-tight",
    loose: "px-safe-loose",
    none: "px-safe-0",
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Container
 *
 * The single layout primitive for every section of the site.
 * Handles max-width capping and responsive horizontal padding
 * across all target device widths (375 → 2560px).
 *
 * @example
 * // Standard content section
 * <Container section="Featured Collection">
 *   <ProductGrid />
 * </Container>
 *
 * @example
 * // Narrow editorial prose
 * <Container size="sm" as="article">
 *   <BrandStory />
 * </Container>
 *
 * @example
 * // Wide hero - full-bleed image, contained text inside
 * <div className="bg-background-tertiary">
 *   <Container size="full" padding="loose">
 *     <HeroBanner />
 *   </Container>
 * </div>
 *
 * @example
 * // Data table - tight padding, no section wrapper
 * <Container size="xl" padding="tight" as="main">
 *   <OrderTable />
 * </Container>
 */
export default function Container<T extends React.ElementType = "div">({
    as,
    size = "lg",
    padding = "default",
    section,
    className = "",
    children,
    ...props
}: ContainerProps<T>) {
    const Tag = (as ?? "div") as React.ElementType

    const inner = (
        <Tag className={`${sizeClass[size]} ${className} ${paddingClass[padding]}`} {...props}>
            {children}
        </Tag>
    )

    if (section) {
        return (
            <section aria-label={section}>
                {inner}
            </section>
        )
    }

    return inner
}