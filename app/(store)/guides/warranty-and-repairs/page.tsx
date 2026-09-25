import WarrantyRepairs from "@/module/guides/templates/warranty-repairs"
import buildJsonLd from "@/lib/util/jsonld"
import type { Metadata } from "next"

export default function Page() {
    return <WarrantyRepairs />
}

export async function generateMetadata(): Promise<Metadata> {
    const canonical = "https://vellehide.com/guides/warranty-and-repairs"
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "Warranty & Repairs | VelleHide",
        "url": canonical,
        "description": "Learn about VelleHide's warranty coverage, repair services, and quality guarantee for all leather goods. Craftsmanship you can trust.",
        "isPartOf": { "@type": "WebSite", "name": "VelleHide", "url": "https://vellehide.com" },
        "datePublished": "2025-09-25",
        "dateModified": "2025-09-25"
    }

    return {
        title: "Warranty & Repair Services | VelleHide",
        description: "VelleHide's warranty and repair services for leather jackets, bags, and accessories. Our quality guarantee covers craftsmanship defects, hardware, and stitching.",
        alternates: { canonical },
        openGraph: { type: "website", title: "Warranty & Repairs | VelleHide", description: "Our quality guarantee and repair services for all leather goods.", url: canonical, siteName: "VelleHide" },
        twitter: { card: "summary", title: "Warranty & Repairs | VelleHide", description: "Our quality guarantee and repair services for all leather goods." },
        robots: { index: true, follow: true },
        other: buildJsonLd(jsonLd),
    }
}
