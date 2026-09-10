"use client"

import Image from "next/image"
import { Calendar, Clock, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function BlogCard({ post }: { post: BlogPost }) {
    const formattedDate = new Date(post.uploadDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    })

    return (
        <Link
            href={`/blog/${post.slug}`}
            aria-label={`Read: ${post.title}`}
            className="group block overflow-hidden bg-card border border-card-border transition-all duration-150 ease-out hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
            <div className="relative aspect-16/10 overflow-hidden rounded-t-sm">
                <Image
                    src={post.thumbnail ?? "/svg/placeholder.svg"}
                    alt={post.title ?? "Blog thumbnail"}
                    fill
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                    loading="lazy"
                />

                {/* Gradient — only on hover */}
                <div className="absolute inset-0 bg-linear-to-t from-black/40 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                {post.category && (
                    <span className="absolute top-3 left-3 z-10 px-3 py-1 text-xs font-medium bg-accent text-accent-foreground rounded-md shadow-sm">
                        {post.category}
                    </span>
                )}
                {/* Arrow hint — bottom-right on hover */}
                <div
                    className="absolute bottom-3 right-3 z-10 flex items-center justify-center w-8 h-8 bg-black/30 backdrop-blur-sm border border-white/20 text-white opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
                    aria-hidden="true"
                >
                    <ArrowRight className="size-4" />
                </div>
            </div>
            {/* Content */}
            <div className="p-4 space-y-3">
                {/* Meta */}
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 shrink-0" aria-hidden="true" />
                        <time dateTime={post.uploadDate}>{formattedDate}</time>
                    </span>
                    <span className="w-px h-3 bg-border" aria-hidden="true" />
                    <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 shrink-0" aria-hidden="true" />
                        {post.readTime}
                    </span>
                </div>
                {/* Title */}
                <h3 className="text-base font-semibold leading-snug line-clamp-2 text-text-primary group-hover:text-accent transition-colors duration-200">
                    {post.title}
                </h3>
                {/* Excerpt */}
                <p className="text-sm text-text-secondary leading-relaxed line-clamp-3 flex-1">
                    {post.excerpt}
                </p>
                {/* Divider */}
                <div className="h-px w-full bg-divider" />
                {/* Author */}
                <div className="flex items-center gap-2.5">
                    <div className="relative size-7 rounded-full overflow-hidden  border border-border shrink-0">
                        <Image
                            src={post.author.avatar ?? "/svg/placeholder.svg"}
                            alt={`Author: ${post.author.name}`}
                            fill
                            className="object-cover"
                            sizes="28px"
                            loading="lazy"
                        />
                    </div>
                    <p className="text-xs font-medium text-foreground">
                        {post.author.name}
                    </p>
                </div>
            </div>
        </Link>
    )
}