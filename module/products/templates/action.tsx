"use client"

import { useUIStore } from "@/lib/store/ui-store"
import { useProductStore } from "@/lib/store/use-product"
import { ProductCalculatedPrice } from "@/lib/util/get-product-price"
import { StoreProduct } from "@medusajs/types"
import { useCallback, useState, useTransition } from "react"

export default function ProductAction({ product, countryCode }: ProductActionsProps) {
    const { setProduct, options, setOption, quantity, setQuantity, availableQuantity, selectedVariant, isValidVariant, inStock, isPending, lastError, handleAddToCart } = useProductStore()
    const { open } = useUIStore()
    const [, startTransition] = useTransition()


    const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({ Color: "black", Size: "m" });
    const handleVariantSelect = useCallback((name: string, value: string) => {
        setSelectedVariants((prev) => ({ ...prev, [name]: value }));
    }, []);
    return (
        <div className="space-y-5 pt-2">
            {/* Color */}
            <div>
                <div className="flex items-center justify-between mb-2.5">
                    <span className="text-xs font-semibold uppercase tracking-wider text-foreground-secondary">Color</span>
                    <span className="text-xs text-foreground-tertiary">{selectedVariants.Color}</span>
                </div>
                <div className="flex gap-2.5">
                    {PRODUCT.variants[0].options.map((c, i) => (
                        <button
                            key={c.value}
                            onClick={() => c.available && handleVariantSelect("Color", c.label)}
                            className={`w-10 h-10 rounded-full border-2 transition-all duration-200 ${selectedVariants.Color === c.value ? 'border-primary ring-2 ring-primary/20 scale-110' : 'border-border hover:border-border-strong hover:scale-105'}`}
                            style={{ backgroundColor: c.value }}
                            title={c.label}
                            aria-label={c.label}
                        />
                    ))}
                </div>
            </div>

            {/* Size */}
            <div>
                <div className="flex items-center justify-between mb-2.5">
                    <span className="text-xs font-semibold uppercase tracking-wider text-foreground-secondary">Size</span>
                    <button className="text-xs text-link hover:text-link-hover underline underline-offset-2 transition-colors">Size Guide</button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {PRODUCT.variants[1].options.map(s => (
                        <button
                            key={s.value}
                            onClick={() => s.available && handleVariantSelect("Size", s.value)}
                            disabled={!s.available}
                            className={`min-w-12 px-4 py-2.5 text-sm font-medium border rounded-lg transition-all duration-200 ${selectedVariants.Size === s.value ? 'bg-primary text-primary-foreground border-primary shadow-primary' : s.available ? 'border-border text-foreground hover:border-border-strong hover:bg-muted' : 'border-border-subtle text-text-disabled line-through opacity-50 cursor-not-allowed'}`}
                        >
                            {s.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}

type ProductActionsProps = {
    product: StoreProduct
    countryCode: string
}

export interface ProductImage {
    id: string;
    src: string;
    alt: string;
}

export interface ProductVariantOption {
    label: string;
    value: string;
    available: boolean;
    hex?: string;
}

export interface ProductVariantGroup {
    name: string;
    type: "size" | "color";
    options: ProductVariantOption[];
}

export interface CustomizationOption {
    id: string;
    label: string;
    type: "select" | "text" | "color-picker";
    options?: { value: string; label: string; price?: number }[];
    placeholder?: string;
    maxLength?: number;
}

export interface AccordionItem {
    id: string;
    title: string;
    content: string;
}

export interface RelatedProduct {
    id: string;
    title: string;
    price: number;
    originalPrice?: number;
    image: string;
    badge?: string;
}

export interface Product {
    id: string;
    title: string;
    subtitle: string;
    price: number;
    originalPrice?: number;
    currency: string;
    rating: number;
    reviewCount: number;
    sku: string;
    images: ProductImage[];
    variants: ProductVariantGroup[];
    customizations: CustomizationOption[];
    trustBadges: { icon: string; text: string }[];
    accordions: AccordionItem[];
    description: string;
    features: string[];
    materials: { name: string; percentage: number }[];
    relatedProducts: RelatedProduct[];
    breadcrumbs: { label: string; href: string }[];
}

export const PRODUCT: Product = {
    id: "clj-mil-001",
    title: "Milano Hand-Stitched Leather Biker Jacket",
    subtitle: "Crafted from full-grain Italian lambskin with premium YKK hardware",
    price: 489_00,
    originalPrice: 649_00,
    currency: "USD",
    rating: 4.8,
    reviewCount: 247,
    sku: "CLJ-MIL-BLK",
    images: [
        { id: "img-1", src: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&h=1067&fit=crop&crop=center", alt: "Milano Biker Jacket - Front View" },
        { id: "img-2", src: "https://images.unsplash.com/photo-1520975954732-35dd22299614?w=800&h=1067&fit=crop&crop=center", alt: "Milano Biker Jacket - Side View" },
        { id: "img-3", src: "https://images.unsplash.com/photo-1559551409-dadc959f76b8?w=800&h=1067&fit=crop&crop=center", alt: "Milano Biker Jacket - Detail" },
        { id: "img-4", src: "https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?w=800&h=1067&fit=crop&crop=center", alt: "Milano Biker Jacket - Back View" },
        { id: "img-5", src: "https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?w=800&h=1067&fit=crop&crop=center", alt: "Milano Biker Jacket - Lifestyle" },
    ],
    variants: [
        {
            name: "Color",
            type: "color",
            options: [
                { label: "Midnight Black", value: "black", available: true, hex: "#1a1a1a" },
                { label: "Cognac Brown", value: "cognac", available: true, hex: "#8B4513" },
                { label: "Dark Navy", value: "navy", available: true, hex: "#1a1a3e" },
                { label: "Oxblood", value: "oxblood", available: false, hex: "#4a0000" },
            ],
        },
        {
            name: "Size",
            type: "size",
            options: [
                { label: "2XS", value: "2xs", available: true },
                { label: "XS", value: "xs", available: true },
                { label: "S", value: "s", available: true },
                { label: "M", value: "m", available: true },
                { label: "L", value: "l", available: true },
                { label: "XL", value: "xl", available: true },
                { label: "XXL", value: "xxl", available: false },
                { label: "3XL", value: "3xl", available: false },
                { label: "4XL", value: "4xl", available: true },
                { label: "5XL", value: "5xl", available: false },
                { label: "Bespoke", value: "os", available: true },
            ],
        },
    ],
    customizations: [
        {
            id: "lining",
            label: "Jacket Lining",
            type: "select",
            options: [
                { value: "satin", label: "Classic Satin", price: 0 },
                { value: "quilted", label: "Quilted Polyester", price: 25_00 },
                { value: "silk", label: "Italian Silk", price: 75_00 },
                { value: "cashmere", label: "Cashmere Blend", price: 150_00 },
            ],
        },
        {
            id: "hardware",
            label: "Zipper & Hardware Color",
            type: "select",
            options: [
                { value: "silver", label: "Brushed Silver", price: 0 },
                { value: "gold", label: "Antique Gold", price: 35_00 },
                { value: "gunmetal", label: "Gunmetal Black", price: 20_00 },
                { value: "rose-gold", label: "Rose Gold", price: 45_00 },
            ],
        },
        {
            id: "monogram",
            label: "Monogram Engraving",
            type: "text",
            placeholder: "Enter initials (max 4 characters)",
            maxLength: 4,
        },
    ],
    trustBadges: [
        { icon: "return", text: "30-Day Free Returns" },
        { icon: "genuine", text: "100% Genuine Leather" },
        { icon: "shipping", text: "Free Express Shipping" },
        { icon: "warranty", text: "2-Year Warranty" },
    ],
    accordions: [
        {
            id: "details",
            title: "Product Details",
            content: "Our Milano Biker Jacket is meticulously hand-stitched from premium full-grain Italian lambskin leather. Each jacket undergoes a 47-step craftsmanship process, from pattern cutting to final pressing. The leather is sourced from select Italian tanneries with decades of heritage, ensuring exceptional softness, durability, and a natural patina that develops beautifully over time. Features include asymmetric zip closure, snap-down lapels, zippered cuffs, and three exterior pockets.",
        },
        {
            id: "sizing",
            title: "Sizing & Fit",
            content: "This jacket features a slim-to-regular fit designed to contour the body while allowing comfortable layering underneath. We recommend ordering your usual size for a fitted look, or sizing up if you prefer a relaxed fit. Shoulder seams should align with your natural shoulder edge. Model is 6'1\" wearing size M. Chest: S(36\"), M(38-40\"), L(42-44\"), XL(46\"), XXL(48\").",
        },
        {
            id: "shipping",
            title: "Shipping & Delivery",
            content: "All orders ship within 1-2 business days via express courier. Standard delivery: 3-5 business days (free on orders over $250). Express delivery: 1-2 business days ($25). International shipping available to 40+ countries. All jackets are carefully packed in our signature dust bag and gift box. Tracking provided via email upon dispatch.",
        },
        {
            id: "care",
            title: "Care & Maintenance",
            content: "To maintain the beauty of your leather jacket: Store on a padded hanger in a breathable garment bag. Apply leather conditioner every 3-6 months using our recommended Cordova Leather Care Kit. Avoid prolonged exposure to direct sunlight or heat. If wet, allow to air dry naturally. For stains, consult a professional leather cleaner. Do not machine wash or dry clean with standard solvents.",
        },
        {
            id: "returns",
            title: "Returns & Exchanges",
            content: "We offer a 30-day hassle-free return policy on all unworn items with original tags attached. Custom-engraved or personalized items are final sale. To initiate a return, contact our concierge team or use the pre-paid return label included with your order. Refunds are processed within 5-7 business days of receiving the returned item. Exchanges are subject to availability.",
        },
    ],
    description: "Born in the workshops of Milan, our signature biker jacket represents the pinnacle of Italian leather craftsmanship. Every stitch tells a story of heritage, precision, and uncompromising quality.",
    features: [
        "Full-grain Italian lambskin leather",
        "Hand-stitched detailing throughout",
        "Premium YKK zippers with custom pulls",
        "Quilted satin interior lining",
        "Asymmetric front zip closure",
        "Three exterior + two interior pockets",
        "Adjustable waist belt with buckle",
        "Snap-down collar and lapels",
    ],
    materials: [
        { name: "Italian Lambskin", percentage: 100 },
        { name: "Satin Lining", percentage: 100 },
        { name: "YKK Hardware", percentage: 100 },
    ],
    relatedProducts: [
        {
            id: "rel-1",
            title: "Heritage Suede Bomber",
            price: 375_00,
            originalPrice: 450_00,
            image: "https://images.unsplash.com/photo-1520975954732-35dd22299614?w=400&h=533&fit=crop&crop=center",
            badge: "Sale",
        },
        {
            id: "rel-2",
            title: "Artisan Leather Gloves",
            price: 89_00,
            image: "https://images.unsplash.com/photo-1531310197839-ccf54634509e?w=400&h=533&fit=crop&crop=center",
        },
        {
            id: "rel-3",
            title: "Cordova Leather Belt",
            price: 125_00,
            image: "https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=400&h=533&fit=crop&crop=center",
            badge: "Bestseller",
        },
        {
            id: "rel-4",
            title: "Vintage Moto Jacket",
            price: 549_00,
            image: "https://images.unsplash.com/photo-1559551409-dadc959f76b8?w=400&h=533&fit=crop&crop=center",
            badge: "New",
        },
    ],
    breadcrumbs: [
        { label: "Home", href: "/" },
        { label: "Men", href: "/men" },
        { label: "Jackets", href: "/men/jackets" },
        { label: "Milano Biker Jacket", href: "#" },
    ],
};

export function formatPrice(amount: number, currency: string = "USD"): string {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
        minimumFractionDigits: 2,
    }).format(amount / 100);
}

export function getDiscountPercent(price: number, originalPrice?: number): number {
    if (!originalPrice || originalPrice <= price) return 0;
    return Math.round(((originalPrice - price) / originalPrice) * 100);
}