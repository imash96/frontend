export const dynamic = 'force-static'

import buildJsonLd from "@/lib/util/jsonld"
import ReturnRefundPolicy from "@/module/policy/templates/return-refund-policy"
import type { Metadata } from "next"

export default function Page() {
    return <ReturnRefundPolicy />
}

export async function generateMetadata(): Promise<Metadata> {
    const canonical = "https://vellehide.com/policy/return-and-refund-policy"
    const policyLd = {
        "@context": "https://schema.org",
        "@type": "MerchantReturnPolicy",
        name: "Velle Hide Return & Refund Policy",
        url: canonical,
        applicableCountry: "IN",
        itemCondition: "https://schema.org/NewCondition",
        returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: 14,
        returnMethod: "https://schema.org/ReturnByMail",
        returnFees: "https://schema.org/ReturnFeesCustomerResponsibility",
        inStoreReturnsOffered: false,
        refundType: "https://schema.org/FullRefund",
        restockingFee: {
            "@type": "MonetaryAmount",
            value: "15",
            unitCode: "P1"
        },
        additionalProperty: [
            { "@type": "PropertyValue", name: "Return Label", value: "Download and print (Free)" },
            { "@type": "PropertyValue", name: "Refund Processing Time", value: "2 business days" },
            { "@type": "PropertyValue", name: "Exchanges", value: "Accepted" },
            { "@type": "PropertyValue", name: "Restocking Fee Details", value: "15% for non-defective; waived for defective" }
        ],
        merchantReturnLink: canonical
    }

    return {
        title: "Return & Refund Policy | Velle Hide",
        description:
            "Easy 14-day returns and exchanges for orders in India. Accept both defective and non-defective products in new condition. Free downloadable return labels by mail, 15% restocking fee on non-defective returns, and 2-business-day refund processing.",
        alternates: { canonical },
        openGraph: {
            type: "website",
            title: "Return & Refund Policy | Velle Hide",
            description:
                "Easy 14-day returns and exchanges for orders in India. Accept both defective and non-defective products in new condition. Free downloadable return labels by mail, 15% restocking fee on non-defective returns, and 2-business-day refund processing.",
            url: canonical,
            siteName: "Velle Hide",
        },
        twitter: {
            card: "summary",
            title: "Return & Refund Policy | Velle Hide",
            description:
                "Easy 14-day returns and exchanges for orders in India. Accept both defective and non-defective products in new condition. Free downloadable return labels by mail, 15% restocking fee on non-defective returns, and 2-business-day refund processing.",
        },
        robots: { index: true, follow: true },
        other: buildJsonLd(policyLd),
    }
}