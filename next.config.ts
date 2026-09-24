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
  // cacheLife: {
  //   static: {
  //     stale: 3600,
  //     revalidate: 900,
  //     expire: 86400,
  //   },
  // },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [50, 60, 70, 75, 78, 80, 100],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*",
      },
      {
        protocol: "http",
        hostname: "*",
      },
    ]
  },
  experimental: {
    useLightningcss: true, // Speeds up Webpack CSS minification
  },
};

export default nextConfig;
