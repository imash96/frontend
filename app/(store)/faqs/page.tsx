import type { Metadata } from "next";
import Link from "next/link";
import { FAQS } from "@/data/faq";
import { baseURL } from "@/lib/constant";
import AccountFooter from "@/layout/account/components/account-footer";
import Container from "@/ui/container";
import JsonLd from "@/module/products/templates/json-ld";
import FAQSearch from "./faq-search";

const title = "Frequently Asked Questions — Leather, Sizing, Orders & Returns";
const description =
  "Find answers to common questions about Velle Hide genuine leather products, sizing and fit, order tracking, returns and exchanges, shipping, care instructions, and more.";

export default function Page() {
  const popularFAQs = FAQS.filter((f) => f.popular).slice(0, 4);

  return (
    <>
      <JsonLd data={faqJsonLd} />
      <Container size="lg" className="py-16 sm:py-24 min-h-dvh space-y-16">
        {/* Header */}
        <header className="text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
            Help Center
          </h1>
          <p className="max-w-prose mx-auto text-lg text-foreground-tertiary">
            Find answers to your questions. If you can't find what you're
            looking for, feel free to{" "}
            <Link
              href="/contact-us"
              className="font-medium text-link hover:underline"
            >
              contact our support team
            </Link>
            .
          </p>
        </header>

        {/* Popular Questions */}
        <section className="space-y-8">
          <h2 className="text-2xl font-semibold">Popular Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {popularFAQs.map(({ question, answer }) => (
              <div
                key={question}
                className="border rounded-lg p-6 bg-surface-elevated hover:shadow-md hover:border-accent transition-all hover:scale-[1.01]"
              >
                <h3 className="font-semibold mb-2">{question}</h3>
                <p className="text-sm text-foreground-tertiary line-clamp-3">
                  {answer}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* All Questions with Search */}
        <FAQSearch />

        <AccountFooter />
      </Container>
    </>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const canonical = `${baseURL}/faqs`;
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

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  name: title,
  url: `${baseURL}/faqs`,
  description,
  isPartOf: {
    "@type": "WebSite",
    name: "Velle Hide",
    url: baseURL,
  },
  mainEntity: FAQS.filter(
    (faq) => typeof faq.answer === "string"
  ).map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};
