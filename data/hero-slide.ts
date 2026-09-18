import { HeroSlide } from "@/types/homepage";
import { DollarSign, Scissors, ShieldCheck, ShoppingBag, Sparkles } from "lucide-react";

export const heroSlides: HeroSlide[] = [
    {
        id: 1,
        variant: "brand-story",
        badge: "VELLEHIDE",
        tagline: "Premium Leather. Honest Value.",
        title: "Leather Goods Made",
        titleAccent: "to Last",
        description:
            "Premium leather goods designed for everyday life, crafted with care and priced fairly. From jackets and bags to wallets, belts and footwear - made for men, women and kids.",
        features: [
            "Premium Materials",
            "Made for Everyday",
            "Fair Pricing",
        ],
        cta: {
            primary: {
                text: "Shop Leather Goods",
                href: "/collections",
            },
            secondary: {
                text: "Our Story",
                href: "/about",
            },
        },
        image:
            "https://images.pexels.com/photos/35055788/pexels-photo-35055788.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=1800",
        imageAlt:
            "Leather artisan carefully working on a handcrafted leather product",
        overlayGradient:
            "linear-gradient(105deg, rgba(15,12,9,0.90) 0%, rgba(28,21,15,0.72) 45%, rgba(20,15,10,0.28) 100%)",
        accentColor: "#C9A57A",
        icon: Sparkles
    },
    {
        id: 2,
        variant: "collection",
        badge: "EXPLORE THE COLLECTION",
        tagline: "Everyday Leather Essentials",
        title: "From Wardrobe",
        titleAccent: "to Everyday Carry",
        description:
            "Discover leather essentials across every part of your day - jackets, coats, bags, wallets, belts, footwear and accessories, with options for the whole family.",
        features: [
            "Men & Women",
            "Kids Collection",
            "Bags & Accessories",
        ],
        cta: {
            primary: {
                text: "Shop All Collections",
                href: "/collections",
            },
            secondary: {
                text: "Explore Best Sellers",
                href: "/collections/best-sellers",
            },
        },
        image:
            "https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?auto=format&fit=crop&w=1800&q=80",
        imageAlt:
            "Model wearing a premium leather jacket in a modern setting",
        overlayGradient:
            "linear-gradient(110deg, rgba(15,11,8,0.90) 0%, rgba(30,22,15,0.70) 42%, rgba(25,18,12,0.25) 100%)",
        accentColor: "#D2AF83",
        icon: Scissors
    },
    {
        id: 3,
        variant: "leather-quality",
        badge: "CRAFTED WITH CARE",
        tagline: "Materials That Age Beautifully",
        title: "Good Leather",
        titleAccent: "Gets Better",
        description:
            "We focus on dependable leather, thoughtful construction and finishes that become more personal with use. Every piece is made to be worn, carried and enjoyed.",
        features: [
            "Quality Leather",
            "Carefully Finished",
            "Built for Daily Use",
        ],
        cta: {
            primary: {
                text: "Discover Our Materials",
                href: "/materials",
            },
            secondary: {
                text: "Leather Care Guide",
                href: "/leather-care",
            },
        },
        image:
            "https://images.pexels.com/photos/3160389/pexels-photo-3160389.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=1800",
        imageAlt:
            "Close-up of premium leather showing natural texture",
        overlayGradient:
            "linear-gradient(108deg, rgba(18,13,9,0.92) 0%, rgba(42,29,19,0.72) 45%, rgba(36,24,15,0.25) 100%)",
        accentColor: "#B98A60",
        icon: ShieldCheck
    },
    {
        id: 4,
        variant: "d2c-value",
        badge: "PREMIUM WITHOUT THE EXCESS",
        tagline: "Better Value by Design",
        title: "Quality Leather",
        titleAccent: "at a Fair Price",
        description:
            "We focus on the product instead of unnecessary layers of markup. That means you can invest in better materials, useful design and lasting craftsmanship without paying only for a label.",
        features: [
            "Fair Pricing",
            "Thoughtful Design",
            "No Unnecessary Markups",
        ],
        cta: {
            primary: {
                text: "Shop Best Sellers",
                href: "/collections/best-sellers",
            },
            secondary: {
                text: "Why Vellehide?",
                href: "/about#why-vellehide",
            },
        },
        image:
            "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1800&q=80",
        imageAlt:
            "Person wearing a premium leather jacket in an urban setting",
        overlayGradient:
            "linear-gradient(108deg, rgba(15,11,8,0.92) 0%, rgba(33,24,16,0.76) 45%, rgba(30,21,14,0.24) 100%)",
        accentColor: "#C6A47A",
        icon: DollarSign
    },
    {
        id: 5,
        variant: "bespoke",
        badge: "BESPOKE & CUSTOM ORDERS",
        tagline: "Made Around Your Idea",
        title: "Your Design.",
        titleAccent: "Our Craft.",
        description:
            "Looking for something specific? We create made-to-order and bespoke leather pieces including clothing, bags, wallets, belts, footwear and home accents such as cushions and covers.",
        features: [
            "Custom Designs",
            "Made-to-Order",
            "Personalized Details",
        ],
        cta: {
            primary: {
                text: "Start a Bespoke Order",
                href: "/bespoke",
            },
            secondary: {
                text: "View Custom Options",
                href: "/bespoke#options",
            },
        },
        image:
            "https://images.pexels.com/photos/17783369/pexels-photo-17783369.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=1800",
        imageAlt:
            "Leather artisan working on a custom leather product",
        overlayGradient:
            "linear-gradient(108deg, rgba(16,11,7,0.93) 0%, rgba(38,26,15,0.76) 46%, rgba(32,21,13,0.24) 100%)",
        accentColor: "#D6B386",
        icon: ShoppingBag
    },
];