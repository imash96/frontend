import { ArrowUpRight, BookOpen, CircleHelp, Clock, Mail, MapPin, MessageCircleQuestion, Package, Ruler, ShieldCheck, Wrench, } from "lucide-react";
import Link from "next/link";
import { contactInfo } from "@/data/footer";
import Facebook from "@/icon/icon-facebok";
import Instagram from "@/icon/icon-instagram";
import ContactForm from "@/module/contact-us/components/contact-form";
import Container from "@/ui/container";

/* ─────────────────────────────────────────────────────────────────────────────
   CONTACT US — Velle Hide
   The sidebar reads hours/phone/email from data/footer.ts so this page can
   never drift out of sync with the site footer.
   ──────────────────────────────────────────────────────────────────────────── */

export default function ContactUs() {
    return (
        <Container size="lg" className="space-y-16 py-10 md:space-y-24 md:py-16">
            <Header />

            <section
                aria-label="Contact form and direct channels"
                className="grid gap-12 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:gap-16"
            >
                <div className="border-card-border bg-card rounded-2xl border p-6 shadow-sm md:p-10">
                    <ContactForm />
                </div>

                <Channels />
            </section>

            <QuickAnswers />
            <ResponseTimes />
        </Container>
    );
}

/* ── Header ──────────────────────────────────────────────────────────────── */

function Header() {
    return (
        <header className="mx-auto max-w-2xl text-center">
            <span className="block text-xs font-semibold tracking-[0.25em] text-accent uppercase">
                We&apos;re Listening
            </span>
            <h1 className="mt-5 font-heading text-4xl font-bold tracking-tight md:text-6xl">
                Talk to someone who{" "}
                <span className="text-accent italic">works with leather</span>
            </h1>
            <p className="text-foreground-secondary mx-auto mt-6 max-w-xl text-base leading-relaxed md:text-lg">
                Sizing, a bespoke commission, an order that hasn&apos;t moved, or a
                ten-year-old jacket that needs a new zip — write to us and a person from
                the workshop will answer.
            </p>
            <div
                aria-hidden="true"
                className="bg-border-subtle mx-auto mt-10 h-px w-40 bg-linear-to-r from-transparent via-accent to-transparent"
            />
        </header>
    );
}

/* ── Channels sidebar ────────────────────────────────────────────────────── */

function Channels() {
    return (
        <aside className="space-y-8 lg:pt-2">
            <div className="space-y-6">
                <h2 className="font-heading text-xl font-semibold tracking-tight">
                    Direct channels
                </h2>

                {/* Sourced from data/footer.ts — one source of truth for the whole site */}
                <ul className="space-y-5">
                    {contactInfo.map(({ icon: Icon, title, content }) => (
                        <li key={title} className="flex items-start gap-4">
                            <span className="border-accent/30 bg-accent/10 mt-0.5 inline-flex size-10 shrink-0 items-center justify-center rounded-lg border">
                                <Icon
                                    className="size-4 text-accent"
                                    strokeWidth={1.5}
                                    aria-hidden="true"
                                />
                            </span>
                            <div className="min-w-0">
                                <div className="text-xs tracking-widest text-foreground-tertiary uppercase">
                                    {title}
                                </div>
                                <div className="text-foreground mt-1 text-sm break-words font-medium">
                                    {content}
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="border-border-subtle border-t pt-8">
                <h2 className="font-heading text-xl font-semibold tracking-tight">
                    Follow the workshop
                </h2>
                <p className="text-foreground-secondary mt-2 text-sm leading-relaxed">
                    New hides, bench shots and the occasional repair rescue.
                </p>

                <div className="mt-5 flex gap-3">
                    {socials.map(({ name, href, Icon }) => (
                        <Link
                            key={name}
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`Velle Hide on ${name}`}
                            className="border-card-border bg-card hover:bg-card-hover hover:border-accent/40 inline-flex size-11 items-center justify-center rounded-lg border transition-colors duration-200"
                        >
                            <Icon className="text-foreground-secondary size-4" />
                        </Link>
                    ))}
                </div>
            </div>

            <div className="bg-background-secondary rounded-xl p-6">
                <div className="flex items-center gap-2">
                    <MapPin
                        className="size-4 text-accent"
                        strokeWidth={1.5}
                        aria-hidden="true"
                    />
                    <h2 className="font-heading text-sm font-semibold tracking-widest uppercase">
                        The Workshop
                    </h2>
                </div>
                <p className="text-foreground-secondary mt-3 text-sm leading-relaxed">
                    Visits are by appointment only — we&apos;re a working atelier, not a
                    shop floor. Email ahead and we&apos;ll set aside time with a cutter.
                </p>
                <a
                    href="mailto:contact@vellehide.com?subject=Workshop%20visit%20request"
                    className="text-link hover:text-link-hover mt-4 inline-flex items-center gap-1 text-sm font-medium transition-colors"
                >
                    Request a visit
                    <ArrowUpRight
                        className="size-3.5"
                        strokeWidth={1.75}
                        aria-hidden="true"
                    />
                </a>
            </div>
        </aside>
    );
}

// `as const` keeps `href` a literal, which is what Next's typedRoutes
// (`typedRoutes: true`) requires — a widened `string` is not a valid Route.
const socials = [
    {
        name: "Instagram",
        href: "https://instagram.com/vellehide",
        Icon: Instagram,
    },
    { name: "Facebook", href: "https://facebook.com/vellehide", Icon: Facebook },
] as const;

/* ── Quick answers ───────────────────────────────────────────────────────── */

function QuickAnswers() {
    return (
        <section aria-label="Quick answers" className="space-y-8">
            <div className="max-w-xl">
                <h2 className="font-heading text-2xl font-bold tracking-tight md:text-3xl">
                    You may not need to wait for a reply
                </h2>
                <p className="text-foreground-secondary mt-3 text-sm leading-relaxed">
                    Most of what reaches our inbox is already answered somewhere on the
                    site. These four cover the bulk of it.
                </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {quickLinks.map(({ href, icon: Icon, title, body }) => (
                    <Link
                        key={href}
                        href={href}
                        className="border-card-border bg-card hover:bg-card-hover group hover:border-accent/40 flex flex-col rounded-xl border p-6 transition-colors duration-200"
                    >
                        <Icon
                            className="text-foreground-tertiary group-hover:text-accent size-5 transition-colors duration-200"
                            strokeWidth={1.5}
                            aria-hidden="true"
                        />
                        <h3 className="mt-5 text-sm font-semibold">{title}</h3>
                        <p className="text-foreground-tertiary mt-2 grow text-xs leading-relaxed">
                            {body}
                        </p>
                        <span className="text-link mt-4 inline-flex items-center gap-1 text-xs font-medium">
                            Open
                            <ArrowUpRight
                                className="size-3 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                                strokeWidth={1.75}
                                aria-hidden="true"
                            />
                        </span>
                    </Link>
                ))}
            </div>
        </section>
    );
}

// `as const` so each `href` stays a literal and satisfies typedRoutes.
const quickLinks = [
    {
        href: "/faqs",
        icon: CircleHelp,
        title: "Help centre",
        body: "Delivery windows, payment, customs and the questions we get every day.",
    },
    {
        href: "/guides/size-guide",
        icon: Ruler,
        title: "Size & fit",
        body: "How our patterns are cut, and how to measure yourself for a jacket.",
    },
    {
        href: "/account/orders",
        icon: Package,
        title: "Track an order",
        body: "Live status, tracking numbers and invoices for anything you've bought.",
    },
    {
        href: "/guides/warranty-and-repairs",
        icon: Wrench,
        title: "Warranty & repairs",
        body: "What the two-year warranty covers and how to send a piece back to us.",
    },
] as const;

/* ── Response times ──────────────────────────────────────────────────────── */

function ResponseTimes() {
    return (
        <section
            aria-label="How fast we reply"
            className="border-card-border bg-background-secondary rounded-2xl border p-6 md:p-10"
        >
            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                <h2 className="font-heading text-2xl font-bold tracking-tight md:text-3xl">
                    What to expect
                </h2>
                <p className="text-foreground-tertiary inline-flex items-center gap-2 text-xs">
                    <Clock className="size-3.5" strokeWidth={1.5} aria-hidden="true" />
                    Times are working days, from when your message lands
                </p>
            </div>

            <dl className="mt-8 grid gap-px overflow-hidden rounded-xl border border-border-subtle bg-border-subtle sm:grid-cols-2 lg:grid-cols-4">
                {responseTimes.map(({ title, time, body }) => (
                    <div key={title} className="bg-card p-6">
                        <dt className="text-xs tracking-widest text-foreground-tertiary uppercase">
                            {title}
                        </dt>
                        <dd className="font-heading text-accent mt-3 text-2xl font-bold tracking-tight">
                            {time}
                        </dd>
                        <p className="text-foreground-secondary mt-2 text-xs leading-relaxed">
                            {body}
                        </p>
                    </div>
                ))}
            </dl>

            <p className="text-foreground-tertiary mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs">
                <span className="inline-flex items-center gap-1.5">
                    <Mail className="size-3.5" strokeWidth={1.5} aria-hidden="true" />
                    contact@vellehide.com
                </span>
                <span className="inline-flex items-center gap-1.5">
                    <ShieldCheck
                        className="size-3.5"
                        strokeWidth={1.5}
                        aria-hidden="true"
                    />
                    <Link
                        href="/policy/privacy-policy"
                        className="hover:text-link transition-colors"
                    >
                        How we handle your details
                    </Link>
                </span>
                <span className="inline-flex items-center gap-1.5">
                    <BookOpen className="size-3.5" strokeWidth={1.5} aria-hidden="true" />
                    <Link
                        href="/guides/care-guide"
                        className="hover:text-link transition-colors"
                    >
                        Leather care guide
                    </Link>
                </span>
                <span className="inline-flex items-center gap-1.5">
                    <MessageCircleQuestion
                        className="size-3.5"
                        strokeWidth={1.5}
                        aria-hidden="true"
                    />
                    <Link href="/faqs" className="hover:text-link transition-colors">
                        All FAQs
                    </Link>
                </span>
            </p>
        </section>
    );
}

const responseTimes = [
    {
        title: "General enquiries",
        time: "1-2 hours",
        body: "Product questions, leather choices, anything that isn't urgent.",
    },
    {
        title: "Orders & delivery",
        time: "1-2 hours",
        body: "If a parcel is stuck or an item arrived wrong, we treat it as urgent.",
    },
    {
        title: "Bespoke commissions",
        time: "1 days",
        body: "A cutter replies with feasibility, hide options and a timeline.",
    },
    {
        title: "Repairs & warranty",
        time: "1 days",
        body: "Send photos and we'll tell you what's possible before you post it.",
    },
];