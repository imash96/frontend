import Container from "@/ui/container"
import { ChevronRight } from "lucide-react"
import Link from "next/link"
import type { Route } from "next"
import JsonLd from "@/module/products/templates/json-ld"

type Crumb = { label: string; href: string }

interface CategoryHeroProps {
    name: string
    desc: string
    crumbs: Crumb[]
}

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://vellehide.com"

export default function CategoryHero({ name, desc, crumbs }: CategoryHeroProps) {
    // Build JSON-LD BreadcrumbList for SEO
    const breadcrumbJsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: crumbs.map((crumb, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: crumb.label,
            ...(crumb.href !== "#" && {
                item: crumb.href.startsWith("http")
                    ? crumb.href
                    : `${baseUrl}${crumb.href.startsWith("/") ? crumb.href : `/${crumb.href}`}`,
            }),
        })),
    }

    return (
        <section className="relative overflow-hidden bg-linear-to-br from-surface-sunken to-surface-elevated">
            {/* Subtle pattern overlay */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage:
                        "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
                }}
                aria-hidden="true"
            />

            {/* Ambient glow */}
            <div
                className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-[0.06] blur-[80px] pointer-events-none"
                style={{ background: "var(--color-accent, #8b5cf6)" }}
                aria-hidden="true"
            />

            {/* JSON-LD Breadcrumb */}
            <JsonLd data={breadcrumbJsonLd} />

            <Container size="2xl" className="py-6 sm:py-8 md:py-10 lg:py-14 relative z-10">
                {/* Breadcrumb Navigation */}
                <nav aria-label="Breadcrumb" className="mb-4 sm:mb-6">
                    <ol className="flex items-center gap-1 sm:gap-1.5 flex-wrap text-xs sm:text-sm">
                        {crumbs.map((c, i) => {
                            const isLast = i === crumbs.length - 1
                            return (
                                <li key={i} className="flex items-center gap-1 sm:gap-1.5">
                                    {isLast ? (
                                        <span
                                            className="font-medium text-primary"
                                            aria-current="page"
                                        >
                                            {c.label}
                                        </span>
                                    ) : (
                                        <>
                                            <Link
                                                href={c.href as Route}
                                                className="text-text-tertiary hover:text-text-primary transition-colors"
                                            >
                                                {c.label}
                                            </Link>
                                            <ChevronRight
                                                className="size-3 text-text-disabled shrink-0"
                                                aria-hidden
                                            />
                                        </>
                                    )}
                                </li>
                            )
                        })}
                    </ol>
                </nav>

                {/* Title & Description */}
                <div className="max-w-2xl">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-text-primary tracking-tight leading-[1.1] mb-2 sm:mb-3">
                        {name}
                    </h1>
                    {desc && (
                        <p className="text-text-secondary text-sm sm:text-base leading-relaxed max-w-xl">
                            {desc}
                        </p>
                    )}
                </div>
            </Container>
        </section>
    )
}