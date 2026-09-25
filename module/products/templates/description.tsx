import { Scissors, Gem, Ruler, Clock, Layers, Droplets, Heart } from "lucide-react"
import Image from "next/image"
import Container from "@/ui/container"

export default function ProductDesc() {
    return (
        <Container size="2xl" as="section" aria-labelledby="craftsmanship-heading" className="py-12 md:py-16 lg:py-20">
            <div className="mb-10 space-y-3 text-center md:mb-14">
                <span className="block text-sm font-medium uppercase tracking-[0.3em] text-accent">
                    Why This Jacket
                </span>
                <h2
                    id="craftsmanship-heading"
                    className="font-heading text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl"
                >
                    Crafted for the Discerning
                </h2>
            </div>
            <div className="mb-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
                {features.map((f) => (
                    <div key={f.title} className="px-2 py-4 text-center">
                        <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full border border-accent/30 text-accent">
                            <f.icon className="size-5" strokeWidth={1.5} />
                        </div>
                        <h3 className="mb-1.5 font-heading text-sm font-semibold tracking-wide text-text-primary">
                            {f.title}
                        </h3>
                        <p className="text-[13px] leading-relaxed text-text-secondary">{f.desc}</p>
                    </div>
                ))}
            </div>
            <StoryBlock storyBlocks={storyBlocksT} />
            <div className="max-w-[1600px] mx-auto px-5 sm:px-8 lg:px-16 py-16 sm:py-24">
                <p className="text-ms uppercase tracking-[0.3em] text-foreground-tertiary text-center mx-auto mb-12">Why VELLE HIDE</p>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                    {APLUS.map(f => {
                        return (
                            <div key={f.title} className="text-center">
                                <f.icon className="w-6 h-6 mx-auto mb-4 text-foreground-tertiary" strokeWidth={1.2} />
                                <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-foreground mb-2">{f.title}</h3>
                                <p className="text-xs text-foreground-tertiary leading-relaxed">{f.desc}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
            <StoryBlock storyBlocks={storyBlocksB} />
        </Container>
    )
}

function StoryBlock({ storyBlocks }: { storyBlocks: StoryBlocks }) {
    return (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-10">
            {storyBlocks.map((block) => (
                <article key={block.title} className="space-y-4">
                    <div className="relative aspect-3/2 overflow-hidden bg-surface">
                        <Image
                            src={block.image}
                            alt={block.imageAlt}
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            quality={75}
                            className="object-cover"
                        />
                    </div>
                    <h3 className="font-heading text-lg font-semibold text-text-primary sm:text-xl">
                        {block.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-text-secondary">{block.text}</p>
                </article>
            ))}
        </div>
    )
}

const storyBlocksT = [
    {
        image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&h=534&fit=crop&q=80",
        imageAlt: "Hand stitching detail",
        title: "Hand-Stitched Precision",
        text: "Over 12,000 individual stitches go into each jacket. Our master craftsmen use waxed linen thread and traditional saddle-stitching techniques that outlast machine stitching by decades.",
    },
    {
        image: "https://images.unsplash.com/photo-1551232864-3f0890e580d9?w=800&h=534&fit=crop&q=80",
        imageAlt: "Hardware detail",
        title: "Premium Hardware",
        text: "Every zipper, snap, and buckle is sourced from YKK Japan and finished in antique brass. Each piece is tested for 10,000+ cycles to ensure a lifetime of reliable use.",
    },
]
const storyBlocksB = [
    {
        image: "https://images.artisanhide.com/storefront/images/prod_desc/FINEST_RAW_MATERIALS.webp",
        imageAlt: "Finest raw materials",
        title: "Finest Raw Materials",
        text: "It all starts with the raw materials. We use nothing but the best full-grain natural leather, YKK zippers, and soft polyester lining to ensure comfort, durability, and timeless appeal.",
    },
    {
        image: "https://images.artisanhide.com/storefront/images/prod_desc/FAIR_PRICING_DIRECT_TO_YOU.webp",
        imageAlt: "Fair pricing direct to you",
        title: "Fair Pricing - Direct to You",
        text: "We believe luxury should be accessible. By cutting out middlemen, storefront costs, and inefficient marketing, we bring you jackets at a fraction of traditional luxury prices.",
    },
]

const features = [
    {
        title: "Master Craftsmanship",
        desc: "Each jacket is hand-cut and sewn by artisans with 20+ years of experience in our Florentine workshop.",
        icon: Scissors,
    },
    {
        title: "Premium Materials",
        desc: "We source only the finest full-grain Italian lambskin leather, known for its buttery softness and durability.",
        icon: Gem,
    },
    {
        title: "Precision Fit",
        desc: "Engineered with articulated seaming for natural movement and a tailored silhouette that flatters every body type.",
        icon: Ruler,
    },
    {
        title: "Built to Last",
        desc: "With proper care, your Heritage jacket will develop a beautiful patina and last a lifetime - backed by our warranty.",
        icon: Clock,
    },
]

const APLUS = [
    { icon: Layers, title: 'Full-Grain Calfskin', desc: 'Sourced from the finest Italian tanneries, aged for 6 months before cutting.' },
    { icon: Scissors, title: '47-Step Process', desc: 'Each jacket passes through 47 handcraft stages from hide to finished garment.' },
    { icon: Droplets, title: 'Weather-Resistant', desc: 'Natural wax finish repels light rain while allowing the leather to breathe.' },
    { icon: Heart, title: 'Ages Beautifully', desc: 'Develops a rich patina unique to you - more character with every wear.' },
]

type StoryBlocks = {
    image: string;
    imageAlt: string;
    title: string;
    text: string;
}[]