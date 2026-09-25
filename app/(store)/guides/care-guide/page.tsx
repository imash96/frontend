import CareGuide from "@/module/guides/templates/care-guide"
import buildJsonLd from "@/lib/util/jsonld"
import type { Metadata } from "next"

export default function Page() {
    return <CareGuide />
}

export async function generateMetadata(): Promise<Metadata> {
    const canonical = "https://vellehide.com/guides/care-guide"
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "Leather Care Guide | VelleHide",
        "url": canonical,
        "description": "Complete leather care guide for jackets, pants, skirts, bags, pillow covers, and more. Learn cleaning, conditioning, waterproofing, stain removal, and storage techniques.",
        "isPartOf": {
            "@type": "WebSite",
            "name": "VelleHide",
            "url": "https://vellehide.com"
        },
        "datePublished": "2025-09-25",
        "dateModified": "2025-09-25"
    }

    return {
        title: "Leather Care Guide | VelleHide",
        description:
            "Expert leather care tips for jackets, pants, skirts, bags, pillow covers & accessories. Cleaning, conditioning, waterproofing, stain removal, and seasonal storage advice.",
        alternates: { canonical },
        openGraph: {
            type: "website",
            title: "Leather Care Guide | VelleHide",
            description:
                "Expert leather care tips for jackets, pants, skirts, bags, pillow covers & accessories.",
            url: canonical,
            siteName: "VelleHide",
        },
        twitter: {
            card: "summary",
            title: "Leather Care Guide | VelleHide",
            description:
                "Expert leather care tips for jackets, pants, skirts, bags, pillow covers & accessories.",
        },
        robots: { index: true, follow: true },
        other: buildJsonLd(jsonLd),
    }
}