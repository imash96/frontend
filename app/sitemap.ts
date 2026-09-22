import type { MetadataRoute } from "next";
import { product_categories } from "@/data/category";
import { product_collections } from "@/data/collection";
import { blogData } from "@/data/blog";
import type { ProductCategory } from "@/types/common";
import { sdk } from "@/lib/sdk";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://vellehide.com";

function flattenCategoryHandles(categories: ProductCategory[]): string[] {
    return categories.flatMap((category) => [
        category.handle,
        ...(category.category_children ? flattenCategoryHandles(category.category_children) : []),
    ]);
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const now = new Date();

    const staticRoutes: MetadataRoute.Sitemap = [
        { url: baseUrl, lastModified: now, changeFrequency: "daily", priority: 1 },
        { url: `${baseUrl}/category`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
        { url: `${baseUrl}/about-us`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
        { url: `${baseUrl}/contact-us`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
        { url: `${baseUrl}/faqs`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
        { url: `${baseUrl}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
        { url: `${baseUrl}/policy/privacy-policy`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
        { url: `${baseUrl}/policy/return-and-refund-policy`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
        { url: `${baseUrl}/policy/shipping-policy`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
        { url: `${baseUrl}/policy/payment-policy`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
        { url: `${baseUrl}/policy/terms-of-sale`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    ];

    const categoryRoutes: MetadataRoute.Sitemap = flattenCategoryHandles(product_categories).map((handle) => ({
        url: `${baseUrl}/category/${handle}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.7,
    }));

    const collectionRoutes: MetadataRoute.Sitemap = product_collections
        .filter((c) => c.metadata?.is_active)
        .map((c) => ({
            url: `${baseUrl}/collection/${c.handle}`,
            lastModified: now,
            changeFrequency: "weekly",
            priority: 0.6,
        }));

    const blogRoutes: MetadataRoute.Sitemap = blogData
        .filter((post) => post.status === "published")
        .map((post) => ({
            url: `${baseUrl}/blog/${post.slug}`,
            lastModified: new Date(post.uploadDate),
            changeFrequency: "monthly",
            priority: 0.5,
        }));

    const productRoutes: MetadataRoute.Sitemap = await sdk.store.product
        .list({ fields: "handle,updated_at", limit: 1000 })
        .then(({ products }) =>
            products.map((p) => ({
                url: `${baseUrl}/products/${p.handle}`,
                lastModified: p.updated_at ? new Date(p.updated_at) : now,
                changeFrequency: "weekly" as const,
                priority: 0.8,
            })),
        )
        .catch(() => []);

    return [...staticRoutes, ...categoryRoutes, ...collectionRoutes, ...blogRoutes, ...productRoutes];
}