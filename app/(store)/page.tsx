import { Suspense } from "react";
import { cookies } from "next/headers";
import type { Metadata } from "next";
import HeroCarousel from "@/module/home/templates/banner";
import IconGridSection from "@/module/home/templates/icon-grid";
import { podData, uspData } from "@/module/home/components/icon-with-text";
import GalleryWall from "@/module/home/templates/gallery-wall";
import Blog from "@/module/home/templates/blog";
import { getRegion } from "@/lib/action/regions";
import Category from "@/module/home/templates/category";
import Collection from "@/module/home/templates/collection";
import Testimonials from "@/module/home/templates/testimonials";
import { NewArrival, OnSale, TrendingNow } from "@/module/home/templates/list-collection";
import CustomMadeBanner from "@/module/home/templates/custom-made";
import Container from "@/ui/container";
import Button from "@/ui/button";
import { ProductSectionSkeleton } from "@/module/home/components/product-section-final";
import JsonLd from "@/module/products/templates/json-ld";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://vellehide.com";

export default async function Page() {
  const countryCode = (await cookies()).get("__country_code")?.value || process.env.NEXT_PUBLIC_DEFAULT_REGION || "us"
  const region = await getRegion(countryCode);

  return (
    <>
      <JsonLd data={organizationJsonLd} />
      <JsonLd data={websiteJsonLd} />
      <h1 className="sr-only">
        Velle Hide — Premium Handcrafted Leather Jackets, Coats, Bags &amp; Accessories
      </h1>
      <HeroCarousel />
      <IconGridSection items={uspData} />
      <Category />
      {region ? (
        <>
          <Suspense fallback={<ProductRowSkeleton />}>
            <NewArrival region_id={region.id} />
          </Suspense>
          <Collection />
          <CustomMadeBanner />
          <Suspense fallback={<ProductRowSkeleton />}>
            <TrendingNow region_id={region.id} />
          </Suspense>
          <GalleryWall />
          <Testimonials />
          <Suspense fallback={<ProductRowSkeleton />}>
            <OnSale region_id={region.id} />
          </Suspense>
        </>
      ) : (
        // Previously `return null` here — a blank 200-status page for
        // both visitors and crawlers if region lookup ever failed.
        <Container size="2xl" className="py-16 text-center">
          <p className="text-sm text-text-secondary">
            We couldn&apos;t load products for your region right now.
          </p>
          <Button href="/" variant="outline" className="mt-4">
            Refresh
          </Button>
          <div className="mt-10">
            <Collection />
          </div>
        </Container>
      )}
      <Blog />
      <IconGridSection items={podData} type="bottom" />
    </>
  );
}

function ProductRowSkeleton() {
  return (
    <Container size="2xl" className="py-8 md:py-12 lg:py-14">
      <div className="mb-7 h-8 w-56 animate-pulse rounded bg-muted md:mb-9" />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="aspect-3/4 animate-pulse rounded-sm bg-muted" />
        ))}
      </div>
    </Container>
  );
}


export async function generateMetadata(): Promise<Metadata> {
  const title = "Shop Premium Handcrafted genuine Leather Goods"
  const description = "Shop high-quality handcrafted genuine leather goods at vellehide.com. Explore our collection of stylish leather jackets, wallets, shoes, and more. Shop now for premium craftsmanship and timeless designs at Velle Hide. Free shipping available!"
  return {
    title,
    description,
    openGraph: {
      siteName: "Velle Hide",
      title: `${title} | Velle Hide`,
      description,
      url: baseUrl,
      type: "website",
      images: [
        {
          url: `${baseUrl}/store.jpg`,
          width: 1200,
          height: 630,
          alt: "Velle Hide premium leather goods",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Velle Hide`,
      description,
      images: [`${baseUrl}/store.jpg`],
    },
    alternates: {
      canonical: "/",
    },
    icons: "/favicon.ico",
  };
}
const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Velle Hide",
  url: baseUrl,
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${baseUrl}/search?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
}

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Velle Hide",
  url: baseUrl,
  logo: `${baseUrl}/logo.png`,
  sameAs: ["https://instagram.com/vellehide", "https://facebook.com/vellehide"],
  contactPoint: {
    "@type": "ContactPoint",
    email: "contact@vellehide.com",
    contactType: "customer service",
  },
};