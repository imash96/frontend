import type { Metadata } from "next"
import buildJsonLd from "@/lib/util/jsonld"
import GiftingGuide from "@/module/guides/templates/gifting-guide"
import { baseURL } from "@/lib/constant";

export default function Page() {
    return <GiftingGuide />;
}

export async function generateMetadata(): Promise<Metadata> {
    const canonical = `${baseURL}/guides/gifting-guide`
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "Leather Gifting Guide | VelleHide",
        "url": canonical,
        "description": "Find the perfect leather gift for any occasion. From personalized leather jackets to monogrammed wallets, VelleHide makes gifting unforgettable.",
        "isPartOf": {
            "@type": "WebSite",
            "name": "VelleHide",
            "url": baseURL,
        },
        "datePublished": "2025-09-25",
        "dateModified": "2025-09-25"
    }

    return {
        title: "Leather Gifting Guide | VelleHide",
        description: "Discover the perfect leather gift. Personalized jackets, monogrammed wallets, gift wrapping, and custom bespoke gifts for every occasion and budget.",
        alternates: { canonical },
        openGraph: { type: "website", title: "Leather Gifting Guide | VelleHide", description: "The perfect leather gift for every occasion.", url: canonical, siteName: "VelleHide" },
        twitter: { card: "summary", title: "Leather Gifting Guide | VelleHide", description: "The perfect leather gift for every occasion." },
        robots: { index: true, follow: true },
        other: buildJsonLd(jsonLd),
    }
}

