import { HeroSlide } from "@/types/homepage";
import { DollarSign, Scissors, ShieldCheck, ShoppingBag, Sparkles } from "lucide-react";

export const heroSlides: HeroSlide[] = [
    {
        id: 1,
        variant: "brand-story",
        badge: "HERITAGE & CRAFT",
        tagline: "Since the First Stitch",
        title: "Leather That",
        titleAccent: "Lives With You.",
        description:
            "Every Vellehide piece begins as raw, hand-selected hide and ends as an heirloom. Crafted by artisans who believe the best leather tells the story of its owner.",
        features: [
            "Artisan Crafted",
            "Generational Quality",
            "Timeless Design",
        ],
        cta: {
            primary: {
                text: "Our Story",
                href: "/about",
            },
            secondary: {
                text: "Shop All",
                href: "/collections",
            },
        },
        image:
            "https://images.unsplash.com/photo-1531310197839-ccf54634509e?auto=format&fit=crop&q=80&w=1600",
        imageAlt:
            "Artisan hand-stitching a premium leather wallet on a workshop bench",
        overlayGradient:
            "linear-gradient(to top, rgba(10,8,6,0.92) 0%, rgba(20,16,12,0.55) 40%, rgba(30,25,20,0.12) 75%, transparent 100%)",
        accentColor: "#D4AF37",
        icon: Sparkles
    },
    {
        id: 2,
        variant: "collection",
        badge: "NEW ARRIVALS",
        tagline: "The Autumn Edit",
        title: "Bold Lines.",
        titleAccent: "Soft Leather.",
        description:
            "Explore this season's must-haves — structured jackets, slouchy totes and buttery-soft accessories designed for the way you actually live.",
        features: [
            "Modern Silhouettes",
            "Versatile Wear",
            "Premium Hardware",
        ],
        cta: {
            primary: {
                text: "Shop Men",
                href: "/collections/men",
            },
            secondary: {
                text: "Shop Women",
                href: "/collections/women",
            },
        },
        image:
            "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=1600",
        imageAlt:
            "Person carrying a rich brown leather messenger bag on the street",
        overlayGradient:
            "linear-gradient(to top, rgba(10,8,6,0.92) 0%, rgba(20,16,12,0.55) 40%, rgba(30,25,20,0.12) 75%, transparent 100%)",
        accentColor: "#E2C285",
        icon: Scissors
    },
    {
        id: 3,
        variant: "leather-quality",
        badge: "OUR MATERIALS",
        tagline: "The Soul of the Hide",
        title: "Full-Grain.",
        titleAccent: "Full Character.",
        description:
            "We work exclusively with full-grain leather — the kind that develops a rich patina, softens with every touch, and never looks the same twice.",
        features: [
            "Full-Grain Leather",
            "Vegetable Tanned",
            "Rich Patina",
        ],
        cta: {
            primary: {
                text: "Our Materials",
                href: "/materials",
            },
            secondary: {
                text: "Care Guide",
                href: "/leather-care",
            },
        },
        image:
            "https://images.unsplash.com/photo-1473188588951-666fce8e7c68?auto=format&fit=crop&q=80&w=1600",
        imageAlt:
            "Close-up of naturally tanned leather showing beautiful grain and patina",
        overlayGradient:
            "linear-gradient(to top, rgba(10,8,6,0.92) 0%, rgba(20,16,12,0.55) 40%, rgba(30,25,20,0.12) 75%, transparent 100%)",
        accentColor: "#C9A57A",
        icon: ShieldCheck
    },
    {
        id: 4,
        variant: "d2c-value",
        badge: "DIRECT TO YOU",
        tagline: "No Middlemen. No Markups.",
        title: "Luxury Leather.",
        titleAccent: "Fair Prices.",
        description:
            "We sell directly to you — no wholesalers, no department stores, no inflated price tags. Just premium materials, honest craftsmanship and a fair deal.",
        features: [
            "No Retail Markups",
            "Direct Sourcing",
            "Unbeatable Value",
        ],
        cta: {
            primary: {
                text: "Best Sellers",
                href: "/collections/best-sellers",
            },
            secondary: {
                text: "Why Vellehide",
                href: "/about#why-vellehide",
            },
        },
        image:
            "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1600&q=80",
        imageAlt:
            "Person wearing a premium leather jacket in a modern setting",
        overlayGradient:
            "linear-gradient(to top, rgba(10,8,6,0.92) 0%, rgba(20,16,12,0.55) 40%, rgba(30,25,20,0.12) 75%, transparent 100%)",
        accentColor: "#C6A47A",
        icon: DollarSign
    },
    {
        id: 5,
        variant: "bespoke",
        badge: "BESPOKE STUDIO",
        tagline: "One of a Kind",
        title: "Your Design.",
        titleAccent: "Our Hands.",
        description:
            "From the leather you choose to the thread colour and monogram — every bespoke piece is built around your idea and finished to our exacting standards.",
        features: [
            "Custom Dimensions",
            "Personalized Details",
            "Exclusive Leathers",
        ],
        cta: {
            primary: {
                text: "Start Your Order",
                href: "/bespoke",
            },
            secondary: {
                text: "View Gallery",
                href: "/bespoke#gallery",
            },
        },
        image:
            "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1600&q=80",
        imageAlt:
            "Bespoke leather crafting tools resting on rich unworked leather",
        overlayGradient:
            "linear-gradient(to top, rgba(10,8,6,0.92) 0%, rgba(20,16,12,0.55) 40%, rgba(30,25,20,0.12) 75%, transparent 100%)",
        accentColor: "#D6B386",
        icon: ShoppingBag
    },
];