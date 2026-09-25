import ColorGuide from "@/module/guides/templates/color-guide"
import buildJsonLd from "@/lib/util/jsonld"
import type { Metadata } from "next"

export default function Page() {
    return <ColorGuide />
}

export async function generateMetadata(): Promise<Metadata> {
    const canonical = "https://vellehide.com/guides/color-guide"
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "Leather Color Guide | VelleHide",
        "url": canonical,
        "description": "Explore all available leather colors at VelleHide. As manufacturers, we can craft any product in any color from our extensive palette. View our complete color chart.",
        "isPartOf": {
            "@type": "WebSite",
            "name": "VelleHide",
            "url": "https://vellehide.com"
        },
        "datePublished": "2025-09-25",
        "dateModified": "2025-09-25"
    }

    return {
        title: "Leather Color Guide & Chart | VelleHide",
        description:
            "Browse our complete leather color palette. As manufacturers with our own workshop, we can craft any jacket, bag, or accessory in any color from scratch. View our full color chart.",
        alternates: { canonical },
        openGraph: {
            type: "website",
            title: "Leather Color Guide & Chart | VelleHide",
            description:
                "Browse our complete leather color palette. Any product in any color — crafted from scratch.",
            url: canonical,
            siteName: "VelleHide",
        },
        twitter: {
            card: "summary",
            title: "Leather Color Guide & Chart | VelleHide",
            description:
                "Browse our complete leather color palette. Any product in any color — crafted from scratch.",
        },
        robots: { index: true, follow: true },
        other: buildJsonLd(jsonLd),
    }
}