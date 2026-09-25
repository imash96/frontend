import type { Metadata } from "next"
import buildJsonLd from "@/lib/util/jsonld"
import LeatherTypes from "@/module/guides/templates/leather-types"

export default function Page() {
    return <LeatherTypes />;
}

export async function generateMetadata(): Promise<Metadata> {
    const canonical = "https://vellehide.com/guides/leather-types"
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "Leather Types Guide | VelleHide",
        "url": canonical,
        "description": "Explore the different types of leather used at VelleHide. Learn about full-grain, top-grain, lambskin, suede, nubuck, and more to find the perfect leather for your needs.",
        "isPartOf": { "@type": "WebSite", "name": "VelleHide", "url": "https://vellehide.com" },
        "datePublished": "2025-09-25",
        "dateModified": "2025-09-25"
    }

    return {
        title: "Leather Types & Varieties Guide | VelleHide",
        description: "Comprehensive guide to leather types — full-grain, top-grain, lambskin, goatskin, buffalo, suede, nubuck & more. Learn which leather is right for your jacket, bag, or accessory.",
        alternates: { canonical },
        openGraph: { type: "website", title: "Leather Types Guide | VelleHide", description: "Explore our full range of premium leather types.", url: canonical, siteName: "VelleHide" },
        twitter: { card: "summary", title: "Leather Types Guide | VelleHide", description: "Explore our full range of premium leather types." },
        robots: { index: true, follow: true },
        other: buildJsonLd(jsonLd),
    }
}
