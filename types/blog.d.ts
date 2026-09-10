interface BlogPost {
    id: string
    title: string
    slug: string
    uploadDate: string
    author: {
        name: string
        avatar: string
    }
    category: string
    tags: string[]
    excerpt: string
    thumbnail: string
    content?: BlogContent[]
    readTime: string
    status?: "published" | "draft"
    seo?: BlogSEO
}

/**
 * Discriminated union for content blocks
 */
type BlogContent = {
    type: "text"
    heading?: string
    para: string[]
    href?: string
} | {
    type: "image-text"
    heading?: string
    para: string[]
    imageLeft: boolean
    thumbnail: string
    href?: string
} | {
    type: "faq"
    heading?: string
    para: { Q: string; A: string }[]
    href?: string
}
// | {
//     type: "quote"
//     quote: string
//     author?: string
// } | {
//     type: "code"
//     language: string
//     code: string
// }

type BlogSEO = {
    metaTitle: string
    metaDescription: string
    metaKeywords: string[]

    // Canonical URL
    canonicalUrl: string

    // Open Graph (Facebook, LinkedIn, etc.)
    ogTitle: string
    ogDescription: string
    ogImage: string
    ogType?: "article" | "website"
    ogUrl?: string

    // Twitter Card
    twitterTitle?: string
    twitterDescription?: string
    twitterImage?: string
    twitterCard: "summary" | "summary_large_image"

    // Extra SEO
    schemaMarkup?: Record<string, any> // JSON-LD schema
    robots?: string // e.g. "index, follow" or "noindex, nofollow"
    language?: string // ISO code e.g. "en-US"
    altTags?: string[] // alt texts for images for accessibility + SEO
}