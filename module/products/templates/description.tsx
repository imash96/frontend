import { Scissors, Gem, Ruler, Clock } from 'lucide-react'

export default function ProductDesc() {
    return (
        <section className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-14'>
            {/* Section header */}
            <div className='text-center'>
                <span className='block mb-2 text-[10px] uppercase tracking-[0.3em] text-accent font-medium'>
                    Why This Jacket
                </span>
                <h2 className='font-heading text-text-primary text-3xl sm:text-4xl font-semibold tracking-tight'>
                    Crafted for the Discerning
                </h2>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8'>
                {features.map((f, i) => {
                    return (
                        <div key={i} className='transition-all duration-300 luxury text-center py-6 px-4'>
                            <div className='flex items-center justify-center mb-3 size-12 rounded-full border border-accent/30 text-accent mx-auto'>
                                <f.icon className="size-5" strokeWidth={1.5} />
                            </div>
                            <h3 className='font-heading font-semibold text-text-primary mb-1.5 text-sm tracking-wide'>
                                {f.title}
                            </h3>
                            <p className='text-text-secondary leading-relaxed text-[13px]'>
                                {f.desc}
                            </p>
                        </div>
                    )
                })}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10">
                {topBlocks.map((block) => (
                    <div key={block.title} className="space-y-4">
                        <div className="overflow-hidden bg-surface aspect-3/2 rounded-2xl">
                            <img
                                src={block.image}
                                alt={block.imageAlt || ""}
                                loading="lazy"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <h3 className="font-heading text-lg sm:text-xl font-bold text-text-primary">
                            {block.title}
                        </h3>
                        <p className="text-sm text-text-secondary leading-relaxed">
                            {block.text}
                        </p>
                    </div>
                ))}
            </div>

            <p className="text-[10px] uppercase tracking-[0.3em] text-foreground-tertiary text-center mx-auto">Why Velle Hide</p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-14">
                {features.map(f => {
                    return (
                        <div key={f.title} className="text-center">
                            <f.icon className="w-6 h-6 mx-auto mb-4 text-foreground-tertiary" strokeWidth={1.2} />
                            <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-foreground mb-2">{f.title}</h3>
                            <p className="text-xs text-foreground-tertiary leading-relaxed">{f.desc}</p>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10">
                {bottomBlocks.map((block) => (
                    <div key={block.title} className="space-y-4">
                        <div className="overflow-hidden bg-surface aspect-3/2 rounded-2xl">
                            <img
                                src={block.image}
                                alt={block.imageAlt || ""}
                                loading="lazy"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <h3 className="font-heading text-lg sm:text-xl font-bold text-text-primary">
                            {block.title}
                        </h3>
                        <p className="text-sm text-text-secondary leading-relaxed">
                            {block.text}
                        </p>
                    </div>
                ))}
            </div>

        </section>

    )
}

const topBlocks = [
    {
        image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&h=400&fit=crop&q=80",
        imageAlt: "Hand stitching detail",
        title: "Hand-Stitched Precision",
        text: "Over 12,000 individual stitches go into each jacket. Our master craftsmen use waxed linen thread and traditional saddle-stitching techniques that outlast machine stitching by decades.",

    },
    {
        image: "https://images.unsplash.com/photo-1551232864-3f0890e580d9?w=600&h=400&fit=crop&q=80",
        imageAlt: "Hardware detail",
        title: "Premium Hardware",
        text: "Every zipper, snap, and buckle is sourced from YKK Japan and finished in antique brass. Each piece is tested for 10,000+ cycles to ensure a lifetime of reliable use.",
    },
]

const bottomBlocks = [
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
        title: 'Master Craftsmanship',
        desc: 'Each jacket is hand-cut and sewn by artisans with 20+ years of experience in our Florentine workshop.',
        icon: Scissors,
    },
    {
        title: 'Premium Materials',
        desc: 'We source only the finest full-grain Italian lambskin leather, known for its buttery softness and durability.',
        icon: Gem,
    },
    {
        title: 'Precision Fit',
        desc: 'Engineered with articulated seaming for natural movement and a tailored silhouette that flatters every body type.',
        icon: Ruler,
    },
    {
        title: 'Built to Last',
        desc: 'With proper care, your Heritage jacket will develop a beautiful patina and last a lifetime — backed by our warranty.',
        icon: Clock,
    },
]