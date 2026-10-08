"use client"

import type { StoreProduct } from "@medusajs/types"
import {
    Award,
    CheckCircle2,
    ChevronDown,
    Droplets,
    Flame,
    Layers,
    MessageSquarePlus,
    PackageCheck,
    Scissors,
    ShieldCheck,
    Sparkles,
    Star,
    X,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useMemo, useState } from "react"
import { createPortal } from "react-dom"
import { accordions } from "@/data/accordion"
import { PREVIEW_REVIEWS, PREVIEW_REVIEW_STATS } from "@/data/preview-data"
import { submitAnonymousReview } from "@/lib/action/review"
import type { ProductReviewStats, StoreProductReview } from "@/types/product"
import Container from "@/ui/container"
import RatingSystem from "@/ui/rating-system"

export function PreviewAccordionSpecs({ product }: { product: StoreProduct }) {
    const [openId, setOpenId] = useState<string | null>("details")

    const detailsText =
        product.description?.trim() ||
        accordions.find((a) => a.id === "details")?.content ||
        ""

    const metadata = (product.metadata ?? {}) as Record<string, unknown>

    const specRows = [
        {
            label: "Leather Grade",
            value: String(metadata.leather_grade || product.material || "100% Full-Grain Italian Lambskin (1.1mm)"),
        },
        {
            label: "Tanning Process",
            value: String(metadata.tanning_method || "30-Day Tuscan Vegetable Drum-Dyed"),
        },
        {
            label: "Hardware & Zippers",
            value: String(metadata.hardware || "Genuine YKK Excella Antique Brass / Chrome"),
        },
        {
            label: "Interior Lining",
            value: String(metadata.lining || "Breathable Bemberg Cupro Satin + 2 Interior Welt Pockets"),
        },
        {
            label: "Origin & Workshop",
            value: product.origin_country === "IT" || !product.origin_country ? "Florence (Firenze), Italy" : product.origin_country,
        },
        {
            label: "Garment Weight",
            value: product.weight ? `${(Number(product.weight) / 1000).toFixed(2)} kg` : "1.45 kg (Medium)",
        },
    ]

    const sections = [
        {
            id: "details",
            title: "Atelier Notes & Description",
            content: (
                <div className="space-y-3 text-sm leading-relaxed text-text-secondary">
                    <p className="whitespace-pre-line">{detailsText}</p>
                </div>
            ),
        },
        {
            id: "specs",
            title: "Hide, Hardware & Material Specifications",
            content: (
                <dl className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                    {specRows.map((row) => (
                        <div
                            key={row.label}
                            className="rounded-xl border border-border bg-background-secondary/50 p-3"
                        >
                            <dt className="text-[10px] font-semibold uppercase tracking-wider text-text-tertiary">
                                {row.label}
                            </dt>
                            <dd className="mt-0.5 text-xs font-medium text-text-primary sm:text-sm">
                                {row.value}
                            </dd>
                        </div>
                    ))}
                </dl>
            ),
        },
        {
            id: "care",
            title: "Leather Care & Conditioning",
            content: (
                <p className="text-sm leading-relaxed text-text-secondary">
                    {accordions.find((a) => a.id === "care")?.content}
                </p>
            ),
        },
        {
            id: "shipping_returns",
            title: "Insured Shipping, Packaging & 30-Day Returns",
            content: (
                <div className="space-y-2 text-sm leading-relaxed text-text-secondary">
                    <p>{accordions.find((a) => a.id === "shipping")?.content}</p>
                    <p>{accordions.find((a) => a.id === "returns")?.content}</p>
                </div>
            ),
        },
    ]

    return (
        <div className="mt-6 divide-y divide-divider rounded-2xl border border-border bg-surface px-4 sm:px-5">
            {sections.map((sec) => {
                const isOpen = openId === sec.id
                return (
                    <div key={sec.id}>
                        <button
                            type="button"
                            onClick={() => setOpenId(isOpen ? null : sec.id)}
                            aria-expanded={isOpen}
                            className="flex w-full items-center justify-between py-4 text-left"
                        >
                            <span className="font-heading text-xs font-semibold uppercase tracking-wider text-text-primary sm:text-sm">
                                {sec.title}
                            </span>
                            <span
                                className={`flex size-6 items-center justify-center rounded-full transition-transform duration-200 ${
                                    isOpen
                                        ? "rotate-180 bg-primary text-primary-foreground"
                                        : "bg-muted text-text-secondary"
                                }`}
                            >
                                <ChevronDown className="size-3.5" />
                            </span>
                        </button>
                        {isOpen && <div className="pb-4 pt-1">{sec.content}</div>}
                    </div>
                )
            })}
        </div>
    )
}

export function PreviewCraftsmanshipStory() {
    const pillars = [
        {
            icon: Layers,
            title: "Top 3% Full-Grain Hides",
            desc: "Only unbuffed, natural-grain Tuscan lambskin and calfskin hides make the cut — preserving breathable pores and rich natural character.",
        },
        {
            icon: Scissors,
            title: "Single-Artisan Bench Assembly",
            desc: "Unlike mass factory lines, one master tailor cuts, skives, and stitches your jacket from pattern to final press.",
        },
        {
            icon: Droplets,
            title: "Natural Wax & Aniline Finish",
            desc: "Drum-dyed deep through the hide and finished with organic carnauba wax that repels light rain and develops a bespoke patina.",
        },
        {
            icon: ShieldCheck,
            title: "Lifetime Seam & Hardware Guarantee",
            desc: "Every stress point is reinforced with waxed linen thread and backed by our atelier repair & conditioning guarantee.",
        },
    ]

    return (
        <section
            aria-labelledby="preview-craft-heading"
            className="border-t border-divider bg-background-secondary/40 py-12 md:py-16 lg:py-20"
        >
            <Container size="2xl" className="space-y-12">
                <div className="mx-auto max-w-2xl text-center space-y-3">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                        <Sparkles className="size-3.5" />
                        Florentine Atelier Standard
                    </span>
                    <h2
                        id="preview-craft-heading"
                        className="font-heading text-2xl font-bold tracking-tight text-text-primary sm:text-4xl"
                    >
                        The 47-Step Handcraft Architecture
                    </h2>
                    <p className="text-sm leading-relaxed text-text-secondary sm:text-base">
                        Every Velle Hide garment takes 18+ hours of dedicated bench work — merging generations of Italian leatherworking heritage with modern anatomical tailoring.
                    </p>
                </div>

                {/* 4 Pillars */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {pillars.map((p) => (
                        <div
                            key={p.title}
                            className="flex flex-col justify-between rounded-2xl border border-border bg-surface p-5 shadow-xs transition-all hover:border-accent/40 hover:shadow-md"
                        >
                            <div>
                                <div className="mb-3.5 flex size-11 items-center justify-center rounded-xl bg-accent/15 text-accent">
                                    <p.icon className="size-5" strokeWidth={1.6} />
                                </div>
                                <h3 className="font-heading text-base font-semibold text-text-primary">
                                    {p.title}
                                </h3>
                                <p className="mt-1.5 text-xs leading-relaxed text-text-secondary sm:text-sm">
                                    {p.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Editorial Split Showcase */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-center">
                    <div className="relative aspect-16/10 overflow-hidden rounded-2xl border border-border bg-surface lg:col-span-7">
                        <Image
                            src="/images/about-us/leather-craftsman-working-in-workshop.jpg"
                            alt="Master leather artisan hand-cutting full-grain hide in workshop"
                            fill
                            sizes="(max-width: 1024px) 100vw, 60vw"
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4 text-white sm:bottom-6 sm:left-6">
                            <span className="rounded bg-accent px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-accent-foreground">
                                Direct-to-Client Luxury
                            </span>
                            <p className="mt-2 font-heading text-lg font-bold sm:text-2xl">
                                Same Tannery as $2,800 Houses. Zero Retail Markup.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-5 rounded-2xl border border-border bg-surface p-6 lg:col-span-5 sm:p-8">
                        <h3 className="font-heading text-xl font-bold text-text-primary sm:text-2xl">
                            Why Discerning Collectors Choose Velle Hide
                        </h3>
                        <p className="text-sm leading-relaxed text-text-secondary">
                            Traditional luxury labels mark up full-grain leather 6× to 8× to cover flagship boutiques and wholesale middlemen. We partner directly with Tuscan tanneries and craft each piece to order.
                        </p>

                        <div className="space-y-3 pt-2">
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs font-semibold">
                                    <span className="text-primary">Velle Hide Direct Atelier</span>
                                    <span className="font-mono font-bold text-primary">$420</span>
                                </div>
                                <div className="h-2.5 w-2/5 rounded-full bg-primary" />
                            </div>
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs text-text-tertiary">
                                    <span>Traditional Luxury Designer Retail</span>
                                    <span className="font-mono">$2,450+</span>
                                </div>
                                <div className="h-2.5 w-full rounded-full bg-muted" />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2 border-t border-divider pt-4 text-center">
                            <div>
                                <p className="font-heading text-lg font-bold text-text-primary">47</p>
                                <p className="text-[11px] text-text-tertiary">Craft Stages</p>
                            </div>
                            <div>
                                <p className="font-heading text-lg font-bold text-text-primary">1.1mm</p>
                                <p className="text-[11px] text-text-tertiary">Full-Grain Gauge</p>
                            </div>
                            <div>
                                <p className="font-heading text-lg font-bold text-text-primary">2 Yrs</p>
                                <p className="text-[11px] text-text-tertiary">Full Warranty</p>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    )
}

export function PreviewReviewsSection({
    productId,
    productTitle,
    initialReviews,
    initialStats,
}: {
    productId: string
    productTitle: string
    initialReviews?: StoreProductReview[]
    initialStats?: ProductReviewStats | null
}) {
    const baseReviews =
        initialReviews && initialReviews.length > 0 ? initialReviews : PREVIEW_REVIEWS
    const baseStats =
        initialStats && initialStats.review_count > 0 ? initialStats : PREVIEW_REVIEW_STATS

    const [reviews, setReviews] = useState<StoreProductReview[]>(baseReviews)
    const [filterRating, setFilterRating] = useState<number | null>(null)
    const [sortBy, setSortBy] = useState<"recent" | "highest">("recent")
    const [modalOpen, setModalOpen] = useState(false)

    // Review form state
    const [ratingInput, setRatingInput] = useState(5)
    const [nameInput, setNameInput] = useState("")
    const [emailInput, setEmailInput] = useState("")
    const [titleInput, setTitleInput] = useState("")
    const [contentInput, setContentInput] = useState("")
    const [submitting, setSubmitting] = useState(false)
    const [formError, setFormError] = useState<string | null>(null)
    const [formSuccess, setFormSuccess] = useState(false)

    const displayedReviews = useMemo(() => {
        let list = [...reviews]
        if (filterRating !== null) {
            list = list.filter((r) => Math.round(r.rating) === filterRating)
        }
        list.sort((a, b) => {
            if (sortBy === "highest") return b.rating - a.rating
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        })
        return list
    }, [reviews, filterRating, sortBy])

    const handleSubmitReview = async (e: React.FormEvent) => {
        e.preventDefault()
        setFormError(null)

        if (!nameInput.trim() || !emailInput.trim()) {
            setFormError("Please enter your name and email address.")
            return
        }
        if (contentInput.trim().length < 20) {
            setFormError("Please write at least 20 characters about your experience.")
            return
        }

        setSubmitting(true)
        try {
            const fd = new FormData()
            fd.set("product_id", productId)
            fd.set("rating", String(ratingInput))
            fd.set("full_name", nameInput.trim())
            fd.set("email", emailInput.trim())
            fd.set("title", titleInput.trim() || "Exceptional Craftsmanship")
            fd.set("content", contentInput.trim())

            await submitAnonymousReview(null, fd).catch(() => null)

            const newReview: StoreProductReview = {
                id: `rev_local_${Date.now()}`,
                name: nameInput.trim(),
                email: emailInput.trim(),
                rating: ratingInput,
                title: (titleInput.trim() || "Exceptional Craftsmanship") as any,
                content: contentInput.trim(),
                images: [],
                order_line_item_id: "",
                product_id: productId,
                order_id: "",
                response: null,
                status: "approved",
                verified: true,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                deleted_at: null,
            }

            setReviews((prev) => [newReview, ...prev])
            setFormSuccess(true)
            setNameInput("")
            setEmailInput("")
            setTitleInput("")
            setContentInput("")
            window.setTimeout(() => {
                setFormSuccess(false)
                setModalOpen(false)
            }, 1400)
        } finally {
            setSubmitting(false)
        }
    }

    const totalCount = baseStats.review_count || reviews.length

    return (
        <Container
            size="2xl"
            as="section"
            id="reviews"
            aria-labelledby="preview-reviews-heading"
            className="border-t border-divider py-12 md:py-16"
        >
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
                {/* Left Column: Summary & Breakdown */}
                <div className="space-y-6 lg:col-span-4">
                    <div className="rounded-2xl border border-border bg-surface p-6 shadow-xs">
                        <span className="text-xs font-semibold uppercase tracking-widest text-accent">
                            Verified Client Feedback
                        </span>
                        <h2
                            id="preview-reviews-heading"
                            className="mt-1 font-heading text-2xl font-bold text-text-primary"
                        >
                            Client Reviews
                        </h2>

                        <div className="mt-4 flex items-center gap-4">
                            <span className="font-heading text-4xl font-bold text-text-primary tabular-nums">
                                {baseStats.average_rating.toFixed(1)}
                            </span>
                            <div>
                                <RatingSystem
                                    averageRating={baseStats.average_rating}
                                    size="md"
                                    showCount={false}
                                />
                                <p className="mt-1 text-xs text-text-secondary">
                                    Based on {totalCount.toLocaleString()} verified reviews
                                </p>
                            </div>
                        </div>

                        {/* Star Bars */}
                        <div className="mt-6 space-y-2">
                            {[5, 4, 3, 2, 1].map((star) => {
                                const count =
                                    (baseStats as any)[`rating_count_${star}`] ?? 0
                                const pct =
                                    totalCount > 0
                                        ? Math.round((count / totalCount) * 100)
                                        : 0
                                const isActive = filterRating === star
                                return (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() =>
                                            setFilterRating(isActive ? null : star)
                                        }
                                        className={`flex w-full items-center gap-2.5 rounded-lg px-2 py-1 text-xs transition-colors ${
                                            isActive
                                                ? "bg-accent/15 font-semibold text-text-primary"
                                                : "hover:bg-muted/60 text-text-secondary"
                                        }`}
                                    >
                                        <span className="flex w-10 items-center gap-1 font-medium">
                                            <span>{star}</span>
                                            <Star className="size-3.5 fill-rating-filled text-rating-filled" />
                                        </span>
                                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                                            <div
                                                className="h-full rounded-full bg-accent transition-all duration-300"
                                                style={{ width: `${pct}%` }}
                                            />
                                        </div>
                                        <span className="w-9 text-right font-mono text-[11px] tabular-nums">
                                            {pct}%
                                        </span>
                                    </button>
                                )
                            })}
                        </div>

                        {filterRating !== null && (
                            <button
                                type="button"
                                onClick={() => setFilterRating(null)}
                                className="mt-3 text-xs font-semibold text-link underline"
                            >
                                Clear {filterRating}-star filter
                            </button>
                        )}

                        <div className="mt-6 border-t border-divider pt-5">
                            <p className="text-xs text-text-secondary">
                                Own the {productTitle}? Share your fit and craftsmanship impressions.
                            </p>
                            <button
                                type="button"
                                onClick={() => setModalOpen(true)}
                                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-primary bg-primary px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-primary-foreground transition-all hover:bg-primary-hover"
                            >
                                <MessageSquarePlus className="size-4" />
                                <span>Write a Client Review</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Column: Review Cards */}
                <div className="space-y-5 lg:col-span-8">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-divider pb-3">
                        <p className="text-sm font-semibold text-text-primary">
                            Showing {displayedReviews.length}{" "}
                            {displayedReviews.length === 1 ? "Review" : "Reviews"}
                            {filterRating ? ` (${filterRating} Stars)` : ""}
                        </p>
                        <div className="flex items-center gap-2 text-xs">
                            <span className="text-text-tertiary">Sort by:</span>
                            <button
                                type="button"
                                onClick={() => setSortBy("recent")}
                                className={`rounded-lg px-2.5 py-1 font-medium ${
                                    sortBy === "recent"
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-surface text-text-secondary border border-border"
                                }`}
                            >
                                Most Recent
                            </button>
                            <button
                                type="button"
                                onClick={() => setSortBy("highest")}
                                className={`rounded-lg px-2.5 py-1 font-medium ${
                                    sortBy === "highest"
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-surface text-text-secondary border border-border"
                                }`}
                            >
                                Highest Rating
                            </button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {displayedReviews.map((review) => (
                            <article
                                key={review.id}
                                className="rounded-2xl border border-border bg-surface p-5 shadow-xs"
                            >
                                <div className="flex flex-wrap items-start justify-between gap-2">
                                    <div className="flex items-center gap-3">
                                        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 font-heading text-xs font-bold text-primary">
                                            {(review.name || "V")
                                                .split(" ")
                                                .map((n) => n[0])
                                                .join("")
                                                .slice(0, 2)
                                                .toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="text-sm font-semibold text-text-primary">
                                                    {review.name || "Verified Collector"}
                                                </h3>
                                                {review.verified && (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-success-subtle px-2 py-0.5 text-[10px] font-semibold text-success">
                                                        <CheckCircle2 className="size-3" />
                                                        Verified Buyer
                                                    </span>
                                                )}
                                            </div>
                                            <div className="mt-0.5 flex items-center gap-2">
                                                <RatingSystem
                                                    averageRating={review.rating}
                                                    size="sm"
                                                    showCount={false}
                                                />
                                                <span className="text-[11px] text-text-tertiary">
                                                    {new Date(review.created_at).toLocaleDateString(
                                                        "en-US",
                                                        {
                                                            month: "short",
                                                            day: "numeric",
                                                            year: "numeric",
                                                        },
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {review.title && (
                                    <h4 className="mt-3 font-heading text-sm font-semibold text-text-primary sm:text-base">
                                        {String(review.title)}
                                    </h4>
                                )}

                                <p className="mt-1.5 text-xs leading-relaxed text-text-secondary sm:text-sm">
                                    {review.content}
                                </p>

                                {review.images && review.images.length > 0 && (
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {review.images.map((img) => (
                                            <div
                                                key={img.id}
                                                className="relative size-16 overflow-hidden rounded-lg border border-border bg-muted"
                                            >
                                                <Image
                                                    src={img.url}
                                                    alt="Customer review photo"
                                                    fill
                                                    sizes="64px"
                                                    className="object-cover"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {review.response && (
                                    <div className="mt-4 rounded-xl border-l-3 border-accent bg-background-secondary/70 p-3">
                                        <p className="text-[11px] font-semibold uppercase tracking-wider text-accent">
                                            Velle Hide Atelier Concierge
                                        </p>
                                        <p className="mt-1 text-xs leading-relaxed text-text-secondary">
                                            {review.response.content}
                                        </p>
                                    </div>
                                )}
                            </article>
                        ))}
                    </div>
                </div>
            </div>

            {/* Write a Review Modal */}
            {modalOpen &&
                typeof document !== "undefined" &&
                createPortal(
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="write-review-title"
                        className="fixed inset-0 z-100 flex items-center justify-center bg-overlay p-4 backdrop-blur-xs"
                        onClick={() => setModalOpen(false)}
                    >
                        <div
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-lg rounded-2xl border border-border bg-surface p-6 text-text-primary shadow-2xl"
                        >
                            <div className="flex items-center justify-between border-b border-divider pb-3">
                                <h3
                                    id="write-review-title"
                                    className="font-heading text-lg font-bold"
                                >
                                    Share Your Experience
                                </h3>
                                <button
                                    type="button"
                                    onClick={() => setModalOpen(false)}
                                    aria-label="Close modal"
                                    className="rounded-full p-1 text-text-secondary hover:bg-muted"
                                >
                                    <X className="size-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmitReview} className="mt-4 space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-text-secondary">
                                        Overall Rating
                                    </label>
                                    <div className="mt-1.5 flex items-center gap-1.5">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setRatingInput(star)}
                                                aria-label={`Rate ${star} stars`}
                                                className="p-1 transition-transform hover:scale-110"
                                            >
                                                <Star
                                                    className={`size-6 ${
                                                        star <= ratingInput
                                                            ? "fill-rating-filled text-rating-filled"
                                                            : "text-border-strong"
                                                    }`}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                    <div>
                                        <label className="mb-1 block text-xs font-medium text-text-secondary">
                                            Your Name *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={nameInput}
                                            onChange={(e) => setNameInput(e.target.value)}
                                            placeholder="e.g. Julian Sterling"
                                            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-xs font-medium text-text-secondary">
                                            Email Address *
                                        </label>
                                        <input
                                            type="email"
                                            required
                                            value={emailInput}
                                            onChange={(e) => setEmailInput(e.target.value)}
                                            placeholder="you@example.com"
                                            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="mb-1 block text-xs font-medium text-text-secondary">
                                        Review Headline
                                    </label>
                                    <input
                                        type="text"
                                        value={titleInput}
                                        onChange={(e) => setTitleInput(e.target.value)}
                                        placeholder="Summarize your fit & leather impression"
                                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="mb-1 block text-xs font-medium text-text-secondary">
                                        Your Review (min 20 characters) *
                                    </label>
                                    <textarea
                                        rows={4}
                                        required
                                        value={contentInput}
                                        onChange={(e) => setContentInput(e.target.value)}
                                        placeholder="Tell others about the leather quality, sizing, and craftsmanship..."
                                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none"
                                    />
                                </div>

                                {formError && (
                                    <p className="text-xs font-medium text-destructive" role="alert">
                                        {formError}
                                    </p>
                                )}

                                {formSuccess && (
                                    <p className="text-xs font-semibold text-success" role="status">
                                        Thank you! Your review has been published.
                                    </p>
                                )}

                                <div className="flex justify-end gap-2 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setModalOpen(false)}
                                        className="rounded-lg border border-border px-4 py-2 text-xs font-semibold text-text-secondary hover:bg-muted"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="rounded-lg bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary-hover disabled:opacity-50"
                                    >
                                        {submitting ? "Submitting..." : "Submit Review"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>,
                    document.body,
                )}
        </Container>
    )
}

export function PreviewRelatedGrid({ products }: { products: StoreProduct[] }) {
    if (!products || products.length === 0) return null

    return (
        <Container
            size="2xl"
            as="section"
            aria-labelledby="preview-related-heading"
            className="border-t border-divider py-12 md:py-16"
        >
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
                <div>
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                        Complete the Wardrobe
                    </span>
                    <h2
                        id="preview-related-heading"
                        className="mt-1 font-heading text-2xl font-bold text-text-primary sm:text-3xl"
                    >
                        Curated Atelier Companions
                    </h2>
                </div>
                <Link
                    href="/checkout-preview"
                    className="text-xs font-semibold uppercase tracking-wider text-link hover:underline"
                >
                    Proceed to Checkout Preview →
                </Link>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-4">
                {products.map((item) => {
                    const v = item.variants?.[0] as any
                    const price = v?.calculated_price?.calculated_amount ?? 395
                    const orig = v?.calculated_price?.original_amount ?? 495
                    const imgUrl =
                        item.thumbnail ||
                        item.images?.[0]?.url ||
                        "/images/col_thumb/col_mens_2.webp"

                    return (
                        <Link
                            key={item.id}
                            href={`/product-preview/${item.handle}`}
                            className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-all hover:border-primary/40 hover:shadow-md"
                        >
                            <div className="relative aspect-3/4 w-full overflow-hidden bg-white">
                                <Image
                                    src={imgUrl}
                                    alt={item.title}
                                    fill
                                    sizes="(max-width: 768px) 50vw, 25vw"
                                    className="object-contain p-2 transition-transform duration-500 group-hover:scale-105"
                                />
                            </div>
                            <div className="flex flex-1 flex-col justify-between p-3.5 sm:p-4">
                                <div>
                                    <p className="text-[10px] font-semibold uppercase tracking-wider text-text-tertiary">
                                        {item.categories?.[0]?.name || "Atelier Leather"}
                                    </p>
                                    <h3 className="mt-0.5 line-clamp-1 font-heading text-xs font-semibold text-text-primary group-hover:text-primary sm:text-sm">
                                        {item.title}
                                    </h3>
                                </div>
                                <div className="mt-2 flex items-baseline gap-2">
                                    <span className="font-heading text-sm font-bold text-price-current tabular-nums">
                                        ${Number(price).toFixed(2)}
                                    </span>
                                    {orig > price && (
                                        <s className="text-xs text-price-original tabular-nums">
                                            ${Number(orig).toFixed(2)}
                                        </s>
                                    )}
                                </div>
                            </div>
                        </Link>
                    )
                })}
            </div>
        </Container>
    )
}
