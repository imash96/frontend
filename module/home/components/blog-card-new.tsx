"use client"

import Image from "next/image"
import Link from "next/link"
import { Calendar, Clock, ArrowRight } from "lucide-react"

interface Props {
    post: BlogPost
    className?: string
    size?: "default" | "tall"
}

export default function BlogCardOverlay({
    post,
    className = "",
    size = "default",
}: Props) {

    const formattedDate = new Date(post.uploadDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    })

    return (
        <article className={`group relative overflow-hidden rounded-xl transition-all duration-300 ease-out hover:shadow-xl focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background ${size === "tall" ? "aspect-3/4" : "aspect-4/3"} ${className}`}>
            {/* Image */}
            <Image
                src={post.thumbnail}
                alt={post.title}
                fill
                sizes="(max-width:768px)100vw,(max-width:1280px)50vw,33vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                priority={false}
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-hover-overlay" />

            {/* Category badge */}
            <div className="absolute top-4 left-4 z-10">
                <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white bg-black/30 backdrop-blur-md rounded-full border border-white/20">
                    {post.category}
                </span>
            </div>

            {/* Content */}
            <div className="absolute inset-x-0 bottom-0 z-10 p-5 flex flex-col gap-2.5">

                {/* Meta */}
                <div className="flex items-center gap-3 text-[11px] text-neutral-50">

                    <span className="inline-flex items-center gap-1">
                        <Calendar className="size-3" />
                        <time dateTime={post.uploadDate}>{formattedDate}</time>
                    </span>

                    <span className="w-px h-3 bg-white/20" />

                    <span className="inline-flex items-center gap-1">
                        <Clock className="size-3" />
                        {post.readTime}
                    </span>

                </div>

                {/* Title */}
                <h3 className="text-base md:text-lg font-semibold leading-snug line-clamp-2">
                    <Link href={`/blog/${post.slug}`} className="text-white group-hover:text-white/90 transition-colors after:absolute after:inset-0 focus:outline-none"
                    >
                        {post.title}
                    </Link>
                </h3>

                {/* Excerpt */}
                {size === "tall" && (
                    <p className="text-xs text-neutral-300 leading-relaxed line-clamp-2">
                        {post.excerpt}
                    </p>
                )}

                {/* Author + CTA */}
                <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-2">
                        <Image
                            src={post.author.avatar}
                            alt={post.author.name}
                            width={24}
                            height={24}
                            className="rounded-full object-cover border border-white/30"
                        />
                        <span className="text-xs font-medium text-neutral-200">
                            {post.author.name}
                        </span>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-white/80 group-hover:text-white group-hover:gap-2 transition-all duration-200">
                        Read
                        <ArrowRight className="size-3" />
                    </span>
                </div>
            </div>
        </article>
    )
}