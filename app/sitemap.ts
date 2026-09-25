import type { MetadataRoute } from "next";
import { blogData } from "@/data/blog";
import { product_categories } from "@/data/category";
import { product_collections } from "@/data/collection";
import { baseURL } from "@/lib/constant";
import { sdk } from "@/lib/sdk";
import type { ProductCategory } from "@/types/common";

function flattenCategoryHandles(categories: ProductCategory[]): string[] {
    return categories.flatMap((category) => [
        category.handle,
        ...(category.category_children ? flattenCategoryHandles(category.category_children) : []),
    ]);
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const now = new Date();

    const staticRoutes: MetadataRoute.Sitemap = [
        { url: baseURL, lastModified: now, changeFrequency: "daily", priority: 1 },
        { url: `${baseURL}/categories`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
        { url: `${baseURL}/collections`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
        { url: `${baseURL}/about-us`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
        { url: `${baseURL}/contact-us`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
        { url: `${baseURL}/faqs`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
        { url: `${baseURL}/blogs`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
        { url: `${baseURL}/policy/privacy-policy`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
        { url: `${baseURL}/policy/return-and-refund-policy`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
        { url: `${baseURL}/policy/shipping-policy`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
        { url: `${baseURL}/policy/payment-policy`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
        { url: `${baseURL}/policy/terms-of-sale`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    ];

    const categoryRoutes: MetadataRoute.Sitemap = flattenCategoryHandles(product_categories).map((handle) => ({
        url: `${baseURL}/categories/${handle}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.7,
    }));

    const collectionRoutes: MetadataRoute.Sitemap = product_collections
        .filter((c) => c.metadata?.is_active)
        .map((c) => ({
            url: `${baseURL}/collections${c.handle}`,
            lastModified: now,
            changeFrequency: "weekly",
            priority: 0.6,
        }));

    const blogRoutes: MetadataRoute.Sitemap = blogData
        .filter((post) => post.status === "published")
        .map((post) => ({
            url: `${baseURL}/blogs/${post.slug}`,
            lastModified: new Date(post.uploadDate),
            changeFrequency: "monthly",
            priority: 0.5,
        }));

    const productRoutes: MetadataRoute.Sitemap = await sdk.store.product
        .list({ fields: "handle,updated_at", limit: 1000 })
        .then(({ products }) =>
            products.map((p) => ({
                url: `${baseURL}/products/${p.handle}`,
                lastModified: p.updated_at ? new Date(p.updated_at) : now,
                changeFrequency: "weekly" as const,
                priority: 0.8,
            })),
        )
        .catch(() => []);

    return [...staticRoutes, ...categoryRoutes, ...collectionRoutes, ...blogRoutes, ...productRoutes];
}