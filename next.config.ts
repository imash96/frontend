import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  typedRoutes: true,
  reactStrictMode: true,
  allowedDevOrigins: ['192.168.0.101'],
  reactCompiler: true,
  cacheComponents: true,
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  images: {
    formats: ["image/avif", "image/webp"],
    // Reduced from 7 levels to 3 — fewer variants means better CDN cache hit
    // rates and faster image delivery. Most images only need these tiers.
    qualities: [60, 75, 90],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "*.leathercult.com",
      },
      {
        protocol: "https",
        hostname: "*.vellehide.com",
      },
      {
        protocol: "https",
        hostname: "**.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "*.artisanhide.com",
      },
      // Add your actual image CDN domains here. The wildcard `hostname: "*"`
      // was removed because it disables Next.js image optimizer security checks
      // and prevents domain-specific optimizations.
    ],
  },
  experimental: {
    useLightningcss: true, // Speeds up Webpack CSS minification
  },
};

export default nextConfig;
