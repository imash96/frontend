import type { Metadata } from "next";
import { baseURL } from "@/lib/constant";
import AboutUs from "@/module/about-us/templates/about-us";
import JsonLd from "@/module/products/templates/json-ld";

const title = "Our Story - Handcrafted Leather Jackets Since 1995";
const description = "Velle Hide is a small leather atelier making full-grain jackets, coats and bags by hand since 1995. Meet the makers, see how a hide becomes a jacket, and read why we build every piece to be repaired rather than replaced.";

export default function Page() {
    return (
        <>
            <JsonLd data={aboutJsonLd} />
            <AboutUs />
        </>
    );
}

export async function generateMetadata(): Promise<Metadata> {
    const canonical = `${baseURL}/about-us`;

    return {
        title: `${title} | Velle Hide`,
        description,
        alternates: { canonical },
        openGraph: {
            type: "website",
            title: `${title} | Velle Hide`,
            description,
            url: canonical,
            siteName: "Velle Hide",
            images: [
                {
                    url: `${baseURL}/images/about-us/leather-craftsman-working-in-workshop.jpg`,
                    width: 1024,
                    height: 1024,
                    alt: "A Velle Hide craftsman hand-working a leather panel",
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: `${title} | Velle Hide`,
            description,
            images: [
                `${baseURL}/images/about-us/leather-craftsman-working-in-workshop.jpg`,
            ],
        },
        robots: { index: true, follow: true },
    };
}

const aboutJsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: title,
    url: `${baseURL}/about-us`,
    description,
    isPartOf: {
        "@type": "WebSite",
        name: "Velle Hide",
        url: baseURL,
    },
    about: {
        "@type": "Organization",
        name: "Velle Hide",
        url: baseURL,
        logo: `${baseURL}/logo.png`,
        foundingDate: "1995-01-01",
        description:
            "Handcrafted full-grain leather jackets, coats, bags and accessories, made to be repaired rather than replaced.",
        sameAs: [
            "https://instagram.com/vellehide",
            "https://facebook.com/vellehide",
        ],
        contactPoint: {
            "@type": "ContactPoint",
            email: "contact@vellehide.com",
            contactType: "customer service",
        },
    },
};