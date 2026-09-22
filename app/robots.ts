import type { MetadataRoute } from "next";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://vellehide.com";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                disallow: [
                    "/account",
                    "/account/",
                    "/checkout",
                    "/checkout/",
                    "/cart",
                    "/auth",
                    "/auth/",
                    "/verify-account",
                    "/forget-password",
                    "/api/",
                ],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
        host: baseUrl,
    };
}