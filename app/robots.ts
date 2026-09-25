import type { MetadataRoute } from "next";
import { baseURL } from "@/lib/constant";

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
        sitemap: `${baseURL}/sitemap.xml`,
        host: baseURL,
    };
}