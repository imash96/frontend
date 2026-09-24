import { listParentCategories } from "@/lib/action/categories"
import CategorySection from "@/module/categories/templates/category-section"
import JsonLd from "@/module/products/templates/json-ld"
import Container from "@/ui/container"
import { Metadata } from "next"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

/* ─── Base URL ────────────────────────────────────────────────────────── */
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://vellehide.com"

/* ─── Page ────────────────────────────────────────────────────────────── */

export default async function Page() {
    const categories = await listParentCategories()

    // JSON-LD CollectionPage structured data
    const collectionPageJsonLd = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Shop by Category",
        description:
            "Browse Velle Hide's full range of genuine leather goods by category.",
        url: `${baseUrl}/categories`,
        mainEntity: {
            "@type": "ItemList",
            numberOfItems: categories.length,
            itemListElement: categories.map((cat, idx) => ({
                "@type": "ListItem",
                position: idx + 1,
                name: cat.name,
                url: `${baseUrl}/categories/${cat.handle}`,
            })),
        },
    }

    const breadcrumbJsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: baseUrl,
            },
            {
                "@type": "ListItem",
                position: 2,
                name: "Categories",
            },
        ],
    }

    return (
        <div className="min-h-screen">
            {/* Structured Data */}
            <JsonLd data={collectionPageJsonLd} />
            <JsonLd data={breadcrumbJsonLd} />

            {/* Hero */}
            <section className="relative overflow-hidden bg-linear-to-br from-surface-sunken to-surface-elevated">
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

                <Container size="2xl" className="py-10 md:py-14 lg:py-20 relative z-10">
                    {/* Breadcrumb */}
                    <nav aria-label="Breadcrumb" className="mb-4 sm:mb-6">
                        <ol className="flex items-center gap-1.5 text-xs sm:text-sm">
                            <li className="flex items-center gap-1.5">
                                <Link
                                    href="/"
                                    className="text-text-tertiary hover:text-text-primary transition-colors"
                                >
                                    Home
                                </Link>
                                <ChevronRight className="size-3 text-text-disabled" aria-hidden />
                            </li>
                            <li>
                                <span className="font-medium text-primary" aria-current="page">
                                    Categories
                                </span>
                            </li>
                        </ol>
                    </nav>

                    <div className="max-w-2xl">
                        <p className="inline-flex items-center gap-2.5 text-xs font-semibold tracking-[0.12em] uppercase text-text-accent mb-3">
                            <span className="h-px w-8 bg-accent" aria-hidden />
                            Premium Leather Collections
                            <span className="h-px w-8 bg-accent" aria-hidden />
                        </p>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-text-primary tracking-tight mb-3 leading-[1.1]">
                            Shop by Category
                        </h1>
                        <p className="text-text-secondary text-sm sm:text-base leading-relaxed max-w-lg">
                            Explore our handcrafted genuine leather collections — from iconic
                            outerwear to everyday accessories, each piece made to last a lifetime.
                        </p>
                    </div>
                </Container>
            </section>

            {/* Category Quick Nav */}
            <div className="border-b border-divider bg-surface sticky top-0 z-20">
                <Container size="2xl">
                    <div className="flex items-center gap-2 sm:gap-3 py-3 overflow-x-auto no-scrollbar">
                        {categories.map((cat) => (
                            <Link
                                key={cat.handle}
                                href={`/categories/${cat.handle}`}
                                className="flex items-center gap-1.5 shrink-0 px-3 py-1.5 text-sm rounded-lg text-text-secondary hover:text-primary hover:bg-primary/5 transition-all group"
                            >
                                <span className="font-medium">{cat.name}</span>
                                <span className="text-[10px] text-text-disabled bg-muted px-1.5 py-0.5 rounded-full group-hover:bg-primary/10 group-hover:text-primary transition-colors tabular-nums">
                                    {cat.category_children?.length || 0}
                                </span>
                            </Link>
                        ))}
                    </div>
                </Container>
            </div>

            {/* Category Sections */}
            <Container size="2xl" className="py-8 sm:py-12 lg:py-16">
                <div className="space-y-10 sm:space-y-14 divide-y divide-divider">
                    {categories.map((parentCat, index) => (
                        <CategorySection
                            key={parentCat.id}
                            category={parentCat}
                            index={index}
                            isLast={index === categories.length - 1}
                        />
                    ))}
                </div>
            </Container>
        </div>
    )
}

/* ─── SEO Metadata ───────────────────────────────────────────────────── */

export async function generateMetadata(): Promise<Metadata> {
    const canonical = `${baseUrl}/categories`
    const title = "Shop by Category | Velle Hide — Premium Leather Collections"
    const description =
        "Browse Velle Hide's full range of genuine leather goods by category — men's and women's apparel, footwear, bags and luggage, accessories, home decor, and kids."

    return {
        title,
        description,
        alternates: { canonical },
        openGraph: {
            type: "website",
            title,
            description,
            url: canonical,
            siteName: "Velle Hide",
            images: [
                {
                    url: `${baseUrl}/store.jpg`,
                    width: 1200,
                    height: 630,
                    alt: "Velle Hide leather goods categories",
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [`${baseUrl}/store.jpg`],
        },
        robots: {
            index: true,
            follow: true,
        },
    }
}
