import type { Metadata } from "next";
import { baseURL } from "@/lib/constant";
import ContactUs from "@/module/contact-us/templates/contact-us";
import JsonLd from "@/module/products/templates/json-ld";

const title = "Contact Us — Sizing, Orders, Bespoke & Repairs";
const description =
  "Get in touch with the Velle Hide workshop. Ask about sizing and fit, track or fix an order, start a bespoke leather commission, or arrange a repair under our two-year warranty. We answer every enquiry within one working day.";

export default function Page() {
  return (
    <>
      <JsonLd data={contactJsonLd} />
      <ContactUs />
    </>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const canonical = `${baseURL}/contact-us`;

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
    },
    twitter: {
      card: "summary",
      title: `${title} | Velle Hide`,
      description,
    },
    robots: { index: true, follow: true },
  };
}

const contactJsonLd = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: title,
  url: `${baseURL}/contact-us`,
  description,
  isPartOf: {
    "@type": "WebSite",
    name: "Velle Hide",
    url: baseURL,
  },
  mainEntity: {
    "@type": "Organization",
    name: "Velle Hide",
    url: baseURL,
    logo: `${baseURL}/logo.png`,
    sameAs: [
      "https://instagram.com/vellehide",
      "https://facebook.com/vellehide",
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        email: "contact@vellehide.com",
        contactType: "customer service",
        availableLanguage: ["English"],
      },
      {
        "@type": "ContactPoint",
        email: "contact@vellehide.com",
        contactType: "sales",
        availableLanguage: ["English"],
      },
    ],
  },
};
