import type { Metadata } from "next"
import buildJsonLd from "@/lib/util/jsonld"
import BespokeOrder from "@/module/guides/templates/bespoke-order"
import { baseURL } from "@/lib/constant";

export default function Page() {
    return <BespokeOrder />;
}

export async function generateMetadata(): Promise<Metadata> {
    const canonical = `${baseURL}/guides/bespoke-order`
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "Bespoke Order Guide | VelleHide",
        "url": canonical,
        "description": "Learn how to place a bespoke custom order for handcrafted leather goods at VelleHide. Choose your leather, lining, hardware, embossing, and more from our in-house manufacturing workshop.",
        "isPartOf": {
            "@type": "WebSite",
            "name": "VelleHide",
            "url": baseURL
        },
        "datePublished": "2025-09-25",
        "dateModified": "2025-09-25"
    }

    return {
        title: "Bespoke Custom Order Guide | VelleHide",
        description:
            "Design your dream leather jacket, coat, or accessory from scratch. Select leather type, lining, zippers, embossing, padding & more. Handcrafted in our own manufacturing workshop.",
        alternates: { canonical },
        openGraph: {
            type: "website",
            title: "Bespoke Custom Order Guide | VelleHide",
            description:
                "Design your dream leather jacket, coat, or accessory from scratch. Select leather type, lining, zippers, embossing, padding & more.",
            url: canonical,
            siteName: "VelleHide",
        },
        twitter: {
            card: "summary",
            title: "Bespoke Custom Order Guide | VelleHide",
            description:
                "Design your dream leather jacket, coat, or accessory from scratch. Select leather type, lining, zippers, embossing, padding & more.",
        },
        robots: { index: true, follow: true },
        other: buildJsonLd(jsonLd),
    }
}