import type { Metadata } from "next"
import { listParentCategories } from "@/lib/action/categories"
import Button from "@/ui/button"
import Container from "@/ui/container"
import ParentCategorySection from "@/module/categories/templates/parent-category-section"

export async function generateMetadata(): Promise<Metadata> {
    const canonical = `${process.env.NEXT_PUBLIC_BASE_URL}/category`
    const title = "Shop by Category | Velle Hide"
    const description =
        "Browse Velle Hide's full range of genuine leather goods by category - men's and women's apparel, footwear, bags and luggage, accessories, home decor, and kids."

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
        },
        twitter: {
            card: "summary",
            title,
            description,
        },
    }
}

export default async function Page() {
    const categories = await listParentCategories()

    return (
        <>
            <div className="relative overflow-hidden bg-surface-sunken border-b border-divider">
                {/* Subtle texture overlay */}
                <div className="absolute inset-0 opacity-[0.03]"
                    style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }}
                    aria-hidden="true"
                />
                <Container size="2xl" className="py-12 md:py-16 lg:py-20 space-y-3">
                    <p className="inline-flex items-center gap-2.5 text-[10px] font-bold tracking-[0.30em] uppercase text-accent">
                        <span className="h-px w-8 bg-accent" aria-hidden />
                        Browse by Category
                        <span className="h-px w-8 bg-accent" aria-hidden />
                    </p>
                    <h1 className="font-heading font-bold text-3xl sm:text-4xl md:text-5xl text-text-primary tracking-tight leading-[1.1]">
                        All Categories
                    </h1>
                    <p className="text-sm md:text-base text-text-secondary leading-relaxed max-w-xl">
                        Explore our complete collection of premium genuine leather goods - handcrafted apparel,
                        footwear, bags, accessories, and home décor.
                    </p>
                </Container>
            </div>

            <Container size="2xl">
                {categories.map((parent) => <ParentCategorySection key={parent.id} parent={parent} />)}
            </Container>

            {/* Bottom CTA */}
            <div className="bg-surface-sunken border-t border-border mt-4">
                <Container size="2xl" className="py-12 md:py-16 text-center space-y-4">
                    <h2 className="font-heading font-semibold text-xl md:text-2xl text-text-primary tracking-tight">
                        Can&apos;t find what you&apos;re looking for?
                    </h2>
                    <p className="text-sm text-text-secondary max-w-md mx-auto">
                        Browse our full collection or reach out to our styling team for personalized recommendations.
                    </p>
                    <div className="flex items-center justify-center gap-3 pt-2">
                        <Button href="/contact-us">Contact Us</Button>
                    </div>
                </Container>
            </div>
        </>
    )
}