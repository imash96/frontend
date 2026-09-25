import type { Metadata } from "next"
import buildJsonLd from "@/lib/util/jsonld"
import PrivacyPolicy from "@/module/policy/templates/privacy-policy"

export default function Page() {
    return (
        <PrivacyPolicy />
    )
}

export async function generateMetadata(): Promise<Metadata> {
    const canonical = "https://vellehide.com/policy/privacy-policy"
    const policyLd = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "Privacy Policy | VelleHide",
        "url": canonical,
        "description": "VelleHide's Privacy Policy explains how we collect, use, and protect your personal data in compliance with Indian laws like the DPDP Act. Learn about your rights, data security, and more.",
        "isPartOf": {
            "@type": "WebSite",
            "name": "VelleHide",
            "url": "https://vellehide.com"
        },
        "datePublished": "2025-08-28",
        "dateModified": "2025-08-28"
    }

    return {
        title: "Privacy Policy | VelleHide",
        description:
            "Discover how VelleHide handles your personal information with transparency and security. Compliant with DPDP Act, IT Act, and best practices for e-commerce data protection in India. Learn about data collection, usage, sharing, and your rights.",
        alternates: { canonical },
        openGraph: {
            type: "website",
            title: "Privacy Policy | VelleHide",
            description:
                "Discover how VelleHide handles your personal information with transparency and security. Compliant with DPDP Act, IT Act, and best practices for e-commerce data protection in India. Learn about data collection, usage, sharing, and your rights.",
            url: canonical,
            siteName: "VelleHide",
        },
        twitter: {
            card: "summary",
            title: "Privacy Policy | VelleHide",
            description:
                "Discover how VelleHide handles your personal information with transparency and security. Compliant with DPDP Act, IT Act, and best practices for e-commerce data protection in India. Learn about data collection, usage, sharing, and your rights.",
        },
        robots: { index: true, follow: true },
        other: buildJsonLd(policyLd),
    }
}