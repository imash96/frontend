import { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Inter } from "next/font/google";
import Link from "next/link";

import "@/css/globals.css";
import { baseURL } from "@/lib/constant";

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
})

export const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
})


export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F9F6F3" },
    { media: "(prefers-color-scheme: dark)", color: "#1D1611" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-theme="light"
      className={`${inter.variable} ${bricolage.variable} h-full antialiased`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        {/* Read theme cookie before first paint — no flash, page stays static */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var m=document.cookie.match(/(?:^|; )__theme=([^;]*)/);if(m)document.documentElement.setAttribute("data-theme",decodeURIComponent(m[1]))}catch(e){}})()`,
          }}
        />
      </head>
      <body className="flex min-h-dvh flex-col">
        <SkipToContent />
        {children}
      </body>
    </html>
  );
}

export function SkipToContent() {
  return (
    <Link href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-100 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-primary-foreground focus:shadow-lg"
    >
      Skip to main content
    </Link>
  );
}

export const metadata: Metadata = {
  metadataBase: new URL(baseURL),
  title: {
    default: "Velle Hide | Premium Handcrafted Leather Goods",
    template: "%s | Velle Hide",
  },
  description:
    "Shop handcrafted genuine leather jackets, coats, blazers, bags, and accessories at Velle Hide. Full-grain leather, hand-finished by artisans, made to last.",
  applicationName: "Velle Hide",
  authors: [{ name: "Velle Hide" }],
  keywords: [
    "leather jackets",
    "leather coats",
    "genuine leather",
    "handcrafted leather goods",
    "leather blazers",
    "leather bags",
  ],
  referrer: "origin-when-cross-origin",
  formatDetection: { email: false, address: false, telephone: false },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    // apple: "/apple-touch-icon.png", // TODO: add once that asset exists in /public
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: "Velle Hide",
    locale: "en_US",
    url: baseURL,
  },
  twitter: {
    card: "summary_large_image",
    site: "@vellehide",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};