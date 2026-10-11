import type { Metadata } from "next"
import buildJsonLd from "@/lib/util/jsonld"
import PaymentPolicy from "@/module/policy/templates/payment-policy"
import { baseURL } from "@/lib/constant"

export default function Page() {
    return (
        <PaymentPolicy />
    )
}

export async function generateMetadata(): Promise<Metadata> {
    const canonical = `${baseURL}/policy/payment-policy`
    const policyLd = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "Payment Policy | VelleHide",
        "url": canonical,
        "description": "VelleHide's Payment Policy for secure cross-border transactions from India. Accepted methods include cards, UPI, wallets, and international gateways like Stripe. Details on security, currencies, refunds, and more.",
        "isPartOf": {
            "@type": "WebSite",
            "name": "VelleHide",
            "url": baseURL
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
                    "item": baseURL
                },
                {
                    "@type": "ListItem",
                    "position": 2,
                    "name": "Payment Policy"
                }
            ]
        }
    }

    return {
        title: "Payment Policy | VelleHide",
        description:
            "Explore VelleHide's Payment Policy for e-commerce exports from India: Secure methods like credit cards, UPI, Stripe; currency details, security, refund processes, and support for international buyers.",
        alternates: { canonical },
        openGraph: {
            type: "website",
            title: "Payment Policy | VelleHide",
            description:
                "Explore VelleHide's Payment Policy for e-commerce exports from India: Secure methods like credit cards, UPI, Stripe; currency details, security, refund processes, and support for international buyers.",
            url: canonical,
            siteName: "VelleHide",
        },
        twitter: {
            card: "summary",
            title: "Payment Policy | VelleHide",
            description:
                "Explore VelleHide's Payment Policy for e-commerce exports from India: Secure methods like credit cards, UPI, Stripe; currency details, security, refund processes, and support for international buyers.",
        },
        robots: { index: true, follow: true },
        other: buildJsonLd(policyLd),
    }
}