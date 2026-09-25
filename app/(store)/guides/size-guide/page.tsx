import SizeGuide from "@/module/guides/templates/size-guide"
import buildJsonLd from "@/lib/util/jsonld"
import type { Metadata } from "next"

export default function Page() {
    return <SizeGuide />
}

export async function generateMetadata(): Promise<Metadata> {
    const canonical = "https://vellehide.com/guides/size-guide"
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "Size & Measurement Guide | VelleHide",
        "url": canonical,
        "description": "Find your perfect fit with VelleHide's comprehensive size charts and measurement guides for leather jackets, blazers, coats, pants, skirts, shorts, shirts, and T-shirts.",
        "isPartOf": {
            "@type": "WebSite",
            "name": "VelleHide",
            "url": "https://vellehide.com"
        },
        "datePublished": "2025-09-25",
        "dateModified": "2025-09-25"
    }

    return {
        title: "Size & Measurement Guide | VelleHide",
        description:
            "Complete size charts and measurement guides for leather jackets, blazers, coats, pants, skirts, shorts, shirts, and T-shirts. Men's and women's sizing for the perfect fit.",
        alternates: { canonical },
        openGraph: {
            type: "website",
            title: "Size & Measurement Guide | VelleHide",
            description:
                "Complete size charts and measurement guides for all leather garments. Find your perfect fit.",
            url: canonical,
            siteName: "VelleHide",
        },
        twitter: {
            card: "summary",
            title: "Size & Measurement Guide | VelleHide",
            description:
                "Complete size charts and measurement guides for all leather garments. Find your perfect fit.",
        },
        robots: { index: true, follow: true },
        other: buildJsonLd(jsonLd),
    }
}