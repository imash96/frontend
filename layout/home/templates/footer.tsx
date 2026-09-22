import { ArrowRight, Sparkles, Globe } from 'lucide-react';
import { footerLinks, contactInfo, socialLinks } from '@/data/footer';
import AccordionSection from '../components/footer-links';
import Link from 'next/link';
import LogoRect from '@/icon/logo-rect';
import { cookies } from 'next/headers';
import RegionModal from './region-modal';

export default async function FooterVariant4() {

    const countryCode = (await cookies()).get('__country_code')?.value
    return (
        <footer aria-labelledby="footer" className="relative overflow-hidden border-t border-border">
            <h2 id="footer" className="sr-only">Footer</h2>

            {/* ── Main dark section ─────────────────────────────── */}
            <div className="bg-card-foreground text-foreground">
                {/* CTA + Newsletter */}
                <div className="mx-auto max-w-7xl px-6 py-16">
                    <div className="flex flex-col lg:flex-row items-start md:items-center justify-between gap-6 mb-14">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 mb-4">
                                <Sparkles className="w-4 h-4 text-accent" />
                                <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-accent">
                                    Exclusive Access
                                </span>
                            </div>
                            <h3 className="font-heading text-3xl lg:text-4xl font-bold text-card leading-tight">
                                Elevate your everyday<br />
                                <span className="text-accent">with artisan leather.</span>
                            </h3>
                            <p className="mt-4 text-sm text-card-hover leading-relaxed max-w-md">
                                Join 12,000+ leather enthusiasts. First look at launches, styling tips, and member-only offers.
                            </p>
                        </div>
                        <form className="flex w-full md:w-auto md:min-w-[320px]">
                            <input
                                name="email"
                                type="email"
                                placeholder="Your email address"
                                className="flex-1 h-12 px-4 bg-accent-foreground border border-accent-hover text-sm text-accent placeholder:text-accent-hover rounded-l-xl focus:outline-none focus:border-accent-active transition-colors"
                                required
                                autoComplete="email"
                            />
                            <button className="h-12 px-6 bg-accent text-accent-foreground text-sm font-semibold rounded-r-xl hover:bg-accent-hover transition-colors flex items-center gap-2 shrink-0">
                                Join
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </form>
                    </div>

                    {/* ── Divider ───────────────────────────────────── */}
                    <div className="h-px bg-accent-hover mb-14" />

                    {/* ── Grid: brand + links ───────────────────────── */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-x-10 lg:gap-x-8">
                        {/* Brand & contact - spans 2 cols */}
                        <div className="lg:col-span-2 space-y-6 pb-10 lg:pb-0 border-b border-border md:border-none">
                            <Link href="/" className="inline-block">
                                <LogoRect
                                    className="w-3/4 sm:w-11/12 fill-accent mx-auto"
                                    aria-label="Brand Logo"
                                />
                            </Link>

                            <div className="space-y-3">
                                {contactInfo.map((info, idx) => {
                                    return (
                                        <div key={idx} className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-md bg-primary/80 flex items-center justify-center shrink-0">
                                                <info.icon className="w-3.5 h-3.5 text-card" strokeWidth={1.5} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase tracking-widest text-card-border">{info.title}</p>
                                                <p className="text-sm text-card">{info.content}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Social */}
                            <div className="flex items-center gap-3 pt-2">
                                {socialLinks.map((social) => (
                                    <Link
                                        key={social.name}
                                        href="#"
                                        className="w-10 h-10 rounded-xl bg-primary/60 flex items-center justify-center text-primary-foreground hover:text-primary-active hover:bg-primary transition-all duration-200"
                                        aria-label={social.name}
                                    >
                                        <social.icon className="w-4 h-4" />
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Link columns */}
                        {/* Navigation Columns */}
                        {Object.entries(footerLinks).map(([title, links]) => (
                            <AccordionSection key={title} title={title}>
                                <ul className="space-y-2.5 pl-0">
                                    {links.map((item) => (
                                        <li key={item.name}>
                                            <Link href={item.href} className="relative group inline-flex gap-x-2 items-center text-sm text-card-hover transition-colors duration-200 hover:text-card-border">
                                                <span className="w-0 group-hover:w-3 h-px bg-primary transition-all duration-200" />
                                                <span>{item.name}</span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </AccordionSection>
                        ))}
                    </div>
                </div>

                {/* ── Bottom strip ────────────────────────────────── */}
                <div className="border-t border-primary/60 pb-14 lg:pb-0">
                    <div className="mx-auto max-w-7xl px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-4">
                        {/* Copyright */}
                        <p className="text-[11px] text-card uppercase tracking-widest">
                            &copy; {new Date().getFullYear()} Velle Hide · Handcrafted with care
                        </p>

                        {/* Region */}
                        <RegionModal countryCode={countryCode} />
                    </div>
                </div>
            </div>
        </footer>
    );
}