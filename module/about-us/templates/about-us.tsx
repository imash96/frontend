import { ArrowRight, BadgeCheck, Calendar, CheckCircle, Eye, Gem, Heart, HeartHandshake, Layers, Quote, Scissors, ShieldCheck, Sparkles, Star, Wrench, } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { overallStats, testimonials } from "@/data/testimonials";
import Button from "@/ui/button";
import Container from "@/ui/container";
import Badge from "@/ui/custom/custom-badge";
import { div as Div, dl as DL, li as LI } from "motion/react-client"

/* ─────────────────────────────────────────────────────────────────────────────
   ABOUT US — Velle Hide
   Server component. All copy is drawn from data already shipped in this repo
   (data/testimonials.ts, data/trust-badges.ts) so the page never contradicts
   the storefront. Colour/spacing use only tokens verified to compile against
   css/globals.css.
   ──────────────────────────────────────────────────────────────────────────── */

export default function AboutUs() {
    return (
        <>
            <Hero />
            <StatStrip />
            <OurStory />
            <Principles />
            <Process />
            <WornBy />
            <Voice />
            <ClosingCta />
        </>
    );
}

/* ── Shared bits ─────────────────────────────────────────────────────────── */

function Eyebrow({ children }: { children: React.ReactNode }) {
    return (
        <span className="block text-xs font-semibold uppercase tracking-[0.25em] text-accent">
            {children}
        </span>
    );
}

function Hairline({ className = "" }: { className?: string }) {
    return (
        <div
            aria-hidden="true"
            className={`h-px bg-linear-to-r from-accent via-border to-transparent ${className}`}
        />
    );
}

/* ── 1. Hero ─────────────────────────────────────────────────────────────── */

function Hero() {
    return (
        <section
            aria-label="About Velle Hide"
            className="relative isolate overflow-hidden"
        >
            {/* Atelier photograph, laid under the brand's own hero gradient */}
            <Image
                src="/images/about-us/leather-craftsman-working-in-workshop.jpg"
                alt="A Velle Hide craftsman hand-working a leather panel at the bench"
                fill
                priority
                sizes="100vw"
                className="-z-10 object-cover object-center"
            />
            <div
                aria-hidden="true"
                className="absolute inset-0 -z-10 [background-image:var(--gradient-hero)] opacity-90"
            />
            <div
                aria-hidden="true"
                className="absolute inset-0 -z-10 bg-linear-to-t from-black/85 via-black/55 to-black/30"
            />

            <Container size="lg" className="py-24 md:py-32 lg:py-44">
                <div className="max-w-2xl">
                    <Eyebrow>The Atelier · Est. 1995</Eyebrow>

                    <h1 className="mt-6 font-heading text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.05] font-bold tracking-tight text-white">
                        Cut by hand.
                        <br />
                        <span className="font-light text-accent italic">
                            Worn for decades.
                        </span>
                    </h1>

                    <p className="mt-8 max-w-xl text-base leading-relaxed text-white/75 md:text-lg">
                        Velle Hide is a small leather house making jackets, coats and bags
                        from full-grain hides — chosen one at a time, cut by hand, and
                        finished to be repaired rather than replaced.
                    </p>

                    <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
                        <Button
                            href="/collections/mens-leather-apparel"
                            size="lg"
                            icon={<ArrowRight className="size-4" />}
                            iconPosition="right"
                            className="w-full sm:w-auto"
                        >
                            Shop the collection
                        </Button>
                        <Button
                            href="/guides/bespoke-order"
                            variant="outline"
                            size="lg"
                            className="w-full border-white/25 text-white hover:bg-white/10 hover:text-white sm:w-auto"
                        >
                            Commission a bespoke piece
                        </Button>
                    </div>
                </div>
            </Container>
        </section>
    );
}

/* ── 2. Stat strip ───────────────────────────────────────────────────────── */

function StatStrip() {
    return (
        <Container
            size="lg"
            section="Velle Hide in numbers"
            className="py-14 md:py-16"
        >
            <DL
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="grid grid-cols-2 gap-y-10 lg:grid-cols-4">
                {stats.map((stat) => (
                    <div
                        key={stat.label}
                        className="border-border-subtle flex flex-col items-center px-2 text-center lg:border-l lg:first:border-l-0 lg:px-6"
                    >
                        {/* DOM order keeps dt before dd for screen readers; flex order
                flips them so the figure reads first. */}
                        <dt className="order-2 mt-2 text-xs tracking-widest text-foreground-tertiary uppercase">
                            {stat.label}
                        </dt>
                        <dd className="order-1 font-heading text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                            {stat.value}
                        </dd>
                    </div>
                ))}
            </DL>
        </Container>
    );
}

const stats = [
    { value: "1995", label: "The year we began" },
    { value: "10,000+", label: "Pieces in circulation" },
    {
        value: overallStats.totalReviews.toLocaleString("en-US"),
        label: "Verified reviews",
    },
    { value: "2-Year", label: "Warranty, every piece" },
];

/* ── 3. Our story ────────────────────────────────────────────────────────── */

async function OurStory() {
    return (
        <section
            aria-label="Our story"
            className="bg-background-secondary py-20 md:py-28"
        >
            <Container size="lg">
                <Div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
                    <div>
                        <Eyebrow>Our Story</Eyebrow>
                        <h2 className="mt-5 font-heading text-3xl font-bold tracking-tight md:text-5xl">
                            One bench, one hide,{" "}
                            <span className="text-accent">one jacket at a time</span>
                        </h2>

                        <div className="mt-8 space-y-5 text-base leading-relaxed text-foreground-secondary">
                            <p>
                                We started in 1995 with a single bench, a sack of offcuts and a
                                stubborn belief: a leather jacket should be the last one you
                                ever have to buy. Not because it is indestructible — leather is
                                skin, and skin marks — but because it can be mended, re-lined
                                and re-worn for thirty years.
                            </p>
                            <p>
                                Everything since has followed from that. We buy full-grain hides
                                by the piece rather than by the roll, so we can read the surface
                                before we cut it. We cut by hand, because a hide is not uniform
                                and a press is. We build every seam so it can be opened again by
                                someone with a needle.
                            </p>
                            <p>
                                What we do not do is chase a season. Our patterns are revised
                                slowly, our hardware is chosen to be replaced, and our catalogue
                                stays small on purpose.
                            </p>
                        </div>

                        <div className="mt-10 grid gap-3 sm:grid-cols-3">
                            {storyMarks.map(({ icon: Icon, text }) => (
                                <div
                                    key={text}
                                    className="border-card-border bg-card flex items-center gap-3 rounded-lg border p-4"
                                >
                                    <Icon
                                        className="size-5 shrink-0 text-accent"
                                        strokeWidth={1.5}
                                        aria-hidden="true"
                                    />
                                    <span className="text-sm font-medium">{text}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Portrait with an inset credential */}
                    <div className="relative">
                        <div className="aspect-4/5 relative overflow-hidden rounded-2xl">
                            <Image
                                src="/images/about-us/leather-craftsman-working-in-workshop.jpg"
                                alt="Detail of hand-stitching on a leather jacket panel"
                                fill
                                sizes="(min-width: 1024px) 40vw, 100vw"
                                className="object-cover"
                            />
                        </div>

                        <div className="bg-accent text-accent-foreground shadow-accent absolute -bottom-6 -left-2 rounded-xl p-6 sm:-left-6">
                            <div className="font-heading text-3xl font-bold">{await getExperienceAt()}+</div>
                            <div className="mt-1 text-xs tracking-widest uppercase opacity-80">
                                Years at the bench
                            </div>
                        </div>
                    </div>
                </Div>
            </Container>
        </section>
    );
}

const storyMarks = [
    { icon: Scissors, text: "Hand cut" },
    { icon: Eye, text: "Hide inspected" },
    { icon: HeartHandshake, text: "Made to be repaired" },
];

/* ── 4. Principles ───────────────────────────────────────────────────────── */

function Principles() {
    return (
        <Container
            size="lg"
            section="What we will not compromise on"
            className="py-20 md:py-28"
        >
            <div className="max-w-2xl">
                <Eyebrow>Our Standard</Eyebrow>
                <h2 className="mt-5 font-heading text-3xl font-bold tracking-tight md:text-5xl">
                    Four things we refuse to trade away
                </h2>
                <Hairline className="mt-8" />
            </div>

            <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-card-border bg-card-border sm:grid-cols-2">
                {principles.map(({ icon: Icon, title, body }) => (
                    <article
                        key={title}
                        className="bg-card group hover:bg-card-hover p-8 transition-colors duration-300 md:p-10"
                    >
                        <div className="border-accent/30 bg-accent/10 group-hover:bg-accent/20 inline-flex size-12 items-center justify-center rounded-full border transition-colors duration-300">
                            <Icon
                                className="size-5 text-accent"
                                strokeWidth={1.5}
                                aria-hidden="true"
                            />
                        </div>
                        <h3 className="mt-6 font-heading text-xl font-semibold tracking-tight">
                            {title}
                        </h3>
                        <p className="mt-3 text-sm leading-relaxed text-foreground-secondary">
                            {body}
                        </p>
                    </article>
                ))}
            </div>
        </Container>
    );
}

const principles = [
    {
        icon: Gem,
        title: "Full-grain, always",
        body: "The outermost layer of the hide, with its pores and markings intact. It is harder to work and slower to finish, and it is the only leather that gains character instead of losing it.",
    },
    {
        icon: Scissors,
        title: "Cut by hand",
        body: "No two hides are alike, so no two panels should be stamped out identically. Our cutters read the grain and place each pattern piece around the hide's natural stretch.",
    },
    {
        icon: Wrench,
        title: "Repairable by design",
        body: "Zips, linings and hardware are fitted to be removed. Bring a ten-year-old jacket back to us and we will put it right — that is what the warranty is for.",
    },
    {
        icon: BadgeCheck,
        title: "Priced without theatre",
        body: "We sell direct from the workshop, so the price reflects the hide and the hours, not a markup ladder built for a wholesale chain.",
    },
];

/* ── 5. Process ──────────────────────────────────────────────────────────── */

function Process() {
    return (
        <section
            aria-label="How a jacket is made"
            className="bg-background-secondary py-20 md:py-28"
        >
            <Container size="lg">
                <div className="max-w-2xl">
                    <Eyebrow>From Hide to Heirloom</Eyebrow>
                    <h2 className="mt-5 font-heading text-3xl font-bold tracking-tight md:text-5xl">
                        Five hands, one jacket
                    </h2>
                    <p className="mt-6 text-base leading-relaxed text-foreground-secondary">
                        Roughly nine days pass between a hide arriving at the workshop and a
                        jacket leaving it. Nothing in that chain is automated away.
                    </p>
                </div>

                <ol className="mt-14 space-y-0">
                    {process.map((step, i) => (
                        <LI
                            key={step.title}
                            className="border-border-subtle group grid gap-4 border-t py-8 transition-colors duration-300 last:border-b md:grid-cols-[5rem_16rem_1fr] md:items-baseline md:gap-8"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.2 }}
                            viewport={{ once: true }}
                        >
                            <span className="font-heading text-accent/60 group-hover:text-accent text-2xl font-bold transition-colors duration-300 md:text-3xl">
                                {String(i + 1).padStart(2, "0")}
                            </span>
                            <h3 className="font-heading text-lg font-semibold tracking-tight md:text-xl">
                                {step.title}
                            </h3>
                            <p className="text-sm leading-relaxed text-foreground-secondary">
                                {step.body}
                            </p>
                        </LI>
                    ))}
                </ol>
            </Container>
        </section>
    );
}

const process = [
    {
        title: "Selecting the hide",
        body: "Each hide is laid out and read under light. Scars, belly stretch and thickness variation decide what it can become — a jacket front, a sleeve, or a smaller good.",
    },
    {
        title: "Pattern and cut",
        body: "Panels are chalked and cut by hand around the natural grain, so the jacket moves with you instead of against you.",
    },
    {
        title: "Skiving and stitching",
        body: "Edges are skived down so seams sit flat, then closed on a walking-foot machine with bonded thread at a stitch count chosen per leather.",
    },
    {
        title: "Hardware and finish",
        body: "Zips, snaps and rings are set by hand, edges are burnished, and the piece is conditioned before it is ever touched by a customer.",
    },
    {
        title: "Inspection and dispatch",
        body: "Every jacket is turned inside out, checked seam by seam against the bench record, and packed with its care card and the name of the maker.",
    },
];

/* ── 6. Worn by ──────────────────────────────────────────────────────────── */

function WornBy() {
    return (
        <Container
            size="lg"
            section="Worn by our customers"
            className="py-20 md:py-28"
        >
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                <div className="max-w-xl">
                    <Eyebrow>In the Wild</Eyebrow>
                    <h2 className="mt-5 font-heading text-3xl font-bold tracking-tight md:text-5xl">
                        Worn in, never out
                    </h2>
                </div>
                <p className="max-w-sm text-sm leading-relaxed text-foreground-secondary">
                    Leather records where it has been. These pieces belong to people who
                    bought them years ago and have kept wearing them since.
                </p>
            </div>

            <Div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
                {showcase.map((person, i) => (
                    <figure
                        key={person.name}
                        className={`group relative overflow-hidden rounded-xl ${i === 0 ? "col-span-2 row-span-2" : ""}`}
                    >
                        {/* Image `fill` needs a positioned parent — this div is it. */}
                        <div className={`relative w-full ${i === 0 ? "h-full min-h-64 md:aspect-auto" : "aspect-square"}`}>
                            <Image
                                src={person.image}
                                alt={`${person.name} wearing the ${person.product}`}
                                fill
                                sizes="(min-width: 768px) 25vw, 50vw"
                                className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                            />
                        </div>

                        <div
                            aria-hidden="true"
                            className="absolute inset-0 bg-linear-to-t from-black/75 via-black/10 to-transparent opacity-70 transition-opacity duration-300 group-hover:opacity-95"
                        />

                        <figcaption className="absolute inset-x-0 bottom-0 p-4 text-white">
                            <div className="text-sm font-semibold">{person.name}</div>
                            <div className="mt-0.5 text-xs text-white/70">
                                {person.product}
                            </div>
                        </figcaption>
                    </figure>
                ))}
            </Div>
        </Container>
    );
}

const showcase = [
    {
        name: "Sophia Lee",
        product: "Heritage Rider Jacket",
        image: "/images/about-us/woman-brown-jacket.jpg",
    },
    {
        name: "Daniel Carter",
        product: "Vintage Biker",
        image: "/images/about-us/man-black-biker.jpg",
    },
    {
        name: "Emily Stone",
        product: "Classic Bomber",
        image: "/images/about-us/woman-tan-bomber.jpg",
    },
    {
        name: "James Park",
        product: "Executive Blazer",
        image: "/images/about-us/man-dark-blazer.jpg",
    },
    {
        name: "Olivia Green",
        product: "Urban Leather",
        image: "/images/about-us/woman-cognac-urban.jpg",
    },
];

/* ── 7. Voice ────────────────────────────────────────────────────────────── */

// Stable keys for the decorative 5-star row (avoids array-index keys).
const STAR_SLOTS = ["one", "two", "three", "four", "five"];

async function Voice() {
    const featured = testimonials[0];
    const second = testimonials[4];

    return (
        <>
            {/* Craft Process */}
            < section className="py-20 overflow-x-hidden md:py-28 bg-card/30" >
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
                    <div className="text-center mb-16">
                        <Badge variant="outline" className="mb-4">
                            Our Process
                        </Badge>
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">
                            Handcrafted <span className="text-primary">Excellence</span>
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Every piece follows our time-tested process, ensuring the highest quality and attention to detail.
                        </p>
                    </div>
                    <Div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
                    >
                        {(await craftProcess()).map((process) => (
                            <div key={process.step} className="text-center group">
                                <div className="w-16 h-16 mx-auto flex items-center justify-center rounded-full bg-primary/10 mb-6 group-hover:bg-primary/20 transition-colors">
                                    <div className="text-primary">{process.icon}</div>
                                </div>
                                <h3 className="text-lg font-semibold mb-3">{process.title}</h3>
                                <p className="text-sm text-muted-foreground">{process.description}</p>
                            </div>
                        ))}
                    </Div>
                </div>
            </section >
            <section
                aria-label="What customers say"
                className="relative overflow-hidden py-20 md:py-28"
            >
                <div
                    aria-hidden="true"
                    className="absolute inset-0 [background-image:var(--gradient-warm)]"
                />

                <Container size="lg" className="relative">
                    <div className="flex flex-col items-center text-center">
                        <div className="flex items-center gap-1" aria-hidden="true">
                            {STAR_SLOTS.map((slot) => (
                                <Star
                                    key={slot}
                                    className="size-5 fill-current text-rating-filled"
                                    strokeWidth={0}
                                />
                            ))}
                        </div>

                        <p className="mt-6 font-heading text-lg leading-relaxed font-medium tracking-tight md:text-2xl">
                            {overallStats.averageRating} out of 5 across{" "}
                            {overallStats.totalReviews.toLocaleString("en-US")} verified reviews
                        </p>

                        <Hairline className="mt-10 w-40" />
                    </div>

                    <div className="mt-12 grid gap-6 md:grid-cols-2">
                        {[featured, second].map((t) => (
                            <figure
                                key={t.id}
                                className="border-card-border bg-card shadow-sm hover:shadow-lg flex flex-col rounded-2xl border p-8 transition-shadow duration-300"
                            >
                                <Quote
                                    className="size-7 shrink-0 text-accent"
                                    strokeWidth={1.5}
                                    aria-hidden="true"
                                />
                                <blockquote className="mt-5 grow text-sm leading-relaxed text-foreground-secondary">
                                    “{t.review}”
                                </blockquote>
                                <figcaption className="mt-6 flex items-center gap-3 border-border-subtle border-t pt-5">
                                    <div>
                                        <div className="text-sm font-semibold">{t.name}</div>
                                        <div className="mt-0.5 text-xs text-foreground-tertiary">
                                            {t.product} · {t.location}
                                        </div>
                                    </div>
                                    <span className="bg-success-subtle text-success ml-auto inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium">
                                        <BadgeCheck
                                            className="size-3.5"
                                            strokeWidth={2}
                                            aria-hidden="true"
                                        />
                                        Verified
                                    </span>
                                </figcaption>
                            </figure>
                        ))}
                    </div>
                </Container>
            </section>
        </>
    );
}

/* ── 8. Closing CTA ──────────────────────────────────────────────────────── */

function ClosingCta() {
    return (
        <section aria-label="Next steps" className="py-20 md:py-28">
            <Container size="lg">
                <div className="border-card-border bg-card relative overflow-hidden rounded-2xl border">
                    <div
                        aria-hidden="true"
                        className="absolute inset-0 [background-image:var(--gradient-card)]"
                    />

                    <div className="relative grid gap-10 p-8 md:grid-cols-[1fr_auto] md:items-center md:p-14">
                        <div className="max-w-xl">
                            <Eyebrow>
                                <Sparkles className="mr-2 inline size-3.5" aria-hidden="true" />
                                Your Turn
                            </Eyebrow>
                            <h2 className="mt-5 font-heading text-3xl font-bold tracking-tight md:text-4xl">
                                Start with a jacket you will still own in 2045
                            </h2>
                            <p className="mt-5 text-base leading-relaxed text-foreground-secondary">
                                Browse the ready-to-wear collection, or sit down with our
                                cutters and specify every panel yourself.
                            </p>
                        </div>

                        <div className="flex flex-col gap-3 md:items-end">
                            <Button
                                href="/collections"
                                size="lg"
                                icon={<ArrowRight className="size-4" />}
                                iconPosition="right"
                                className="w-full md:w-auto"
                            >
                                Browse collections
                            </Button>
                            <Link
                                href="/guides/leather-types"
                                className="text-foreground-secondary hover:text-link inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
                            >
                                <Layers
                                    className="size-4 text-accent"
                                    strokeWidth={1.5}
                                    aria-hidden="true"
                                />
                                Compare our leathers first
                            </Link>
                        </div>
                    </div>
                </div>

                <p className="text-foreground-tertiary mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs">
                    <span className="inline-flex items-center gap-1.5">
                        <Calendar
                            className="size-3.5"
                            strokeWidth={1.5}
                            aria-hidden="true"
                        />
                        Established 1995
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                        <ShieldCheck
                            className="size-3.5"
                            strokeWidth={1.5}
                            aria-hidden="true"
                        />
                        2-year warranty
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                        <Wrench className="size-3.5" strokeWidth={1.5} aria-hidden="true" />
                        <Link
                            href="/guides/warranty-and-repairs"
                            className="hover:text-link transition-colors"
                        >
                            Repairs for life
                        </Link>
                    </span>
                </p>
            </Container>
        </section>
    );
}

const craftProcess = async () => [
    { step: "01", title: "Premium Leather Selection", description: "We source only the finest full-grain leather from certified tanneries worldwide.", icon: <Eye className="h-6 w-6" /> },
    { step: "02", title: "Master Craftsmanship", description: `Each piece is hand-cut and stitched by our skilled artisans with ${await getExperienceAt()}+ years experience.`, icon: <Scissors className="h-6 w-6" /> },
    { step: "03", title: "Quality Assurance", description: "Every item undergoes rigorous quality checks before leaving our workshop.", icon: <CheckCircle className="h-6 w-6" /> },
    { step: "04", title: "Lifetime Support", description: "We provide ongoing care instructions and repair services for life.", icon: <Heart className="h-6 w-6" /> },
]

export async function getExperienceAt() {
    'use cache'
    return new Date().getFullYear() - 1995
}