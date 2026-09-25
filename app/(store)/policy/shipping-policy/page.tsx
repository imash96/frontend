import type { Metadata } from "next"
import buildJsonLd from "@/lib/util/jsonld"
import ShippingPolicy from "@/module/policy/templates/shipping-policy"

export default function Page() {
    return (
        <ShippingPolicy />
    )
}

export async function generateMetadata(): Promise<Metadata> {
    const canonical = "https://vellehide.com/policy/shipping-policy"
    const policyLd = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "Shipping Policy | VelleHide",
        "url": canonical,
        "description": "VelleHide's Shipping Policy details delivery times, costs, and options for India. Free shipping on orders over ₹999, reliable carriers like Delhivery, and international options available.",
        "isPartOf": {
            "@type": "WebSite",
            "name": "VelleHide",
            "url": "https://vellehide.com"
        },
        "datePublished": "2025-08-28",
        "dateModified": "2025-08-28",
        "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
                {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Home",
                    "item": "https://vellehide.com"
                },
                {
                    "@type": "ListItem",
                    "position": 2,
                    "name": "Shipping Policy"
                }
            ]
        },
        "potentialAction": {
            "@type": "ReadAction",
            "target": canonical
        }
    }

    return {
        title: "Shipping Policy | VelleHide",
        description:
            "Learn about VelleHide's shipping policy for India: Free shipping on prepaid orders over ₹999, delivery in 2-14 days, trusted carriers like Delhivery and BlueDart, tracking, and handling of issues. International shipping available upon request.",
        alternates: { canonical },
        openGraph: {
            type: "website",
            title: "Shipping Policy | VelleHide",
            description:
                "Learn about VelleHide's shipping policy for India: Free shipping on prepaid orders over ₹999, delivery in 2-14 days, trusted carriers like Delhivery and BlueDart, tracking, and handling of issues. International shipping available upon request.",
            url: canonical,
            siteName: "VelleHide",
        },
        twitter: {
            card: "summary",
            title: "Shipping Policy | VelleHide",
            description:
                "Learn about VelleHide's shipping policy for India: Free shipping on prepaid orders over ₹999, delivery in 2-14 days, trusted carriers like Delhivery and BlueDart, tracking, and handling of issues. International shipping available upon request.",
        },
        robots: { index: true, follow: true },
        other: buildJsonLd(policyLd),
    }
}