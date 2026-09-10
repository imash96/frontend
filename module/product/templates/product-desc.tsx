"use client"

import Image from "next/image"

export default function ProductDesc() {
    return (
        <section className="mt-6 lg:mt-16 space-y-12 lg:space-y-16">
            {data.map((item, index) => (
                <article
                    key={index}
                    className={`flex flex-col items-center md:items-start gap-8 lg:gap-30 ${item.imageLeft ? "md:flex-row" : "md:flex-row-reverse"}`}
                >
                    {/* Image */}
                    <div className="w-full md:w-[45%] lg:w-1/2 overflow-hidden no-scrollbar rounded-lg shadow-sm">
                        <Image
                            src={item.image}
                            alt={item.heading}
                            sizes="(max-width: 640px) 100vw, 33vw"
                            height={400}
                            width={800}
                            className="w-full h-auto object-cover transition-transform duration-500 hover:scale-105"
                            priority={false}
                        />
                    </div>

                    {/* Text Content */}
                    <div className="w-full md:w-[55%] lg:w-1/2 flex flex-col justify-center space-y-4">
                        <h3 className="text-2xl lg:text-4xl font-semibold tracking-tight">
                            {item.heading}
                        </h3>
                        <p className="text-base lg:text-lg text-foreground-muted leading-relaxed">
                            {item.content}
                        </p>
                        {item.extra && (
                            <p className="text-sm text-foreground-disabled italic">
                                {item.extra}
                            </p>
                        )}
                    </div>
                </article>
            ))}
        </section>
    )
}

const data = [
    {
        image:
            "https://www.thejacketmaker.com/cdn/shop/files/FINEST_RAW_MATERIALS_5c67c9d3-2e74-437c-8b0b-ef74ef9c4028_900x.webp?v=1694691113",
        heading: "Finest Raw Materials",
        content:
            "It all starts with the raw materials. We use nothing but the best full-grain natural leather, YKK zippers, and soft polyester lining to ensure comfort, durability, and timeless appeal.",
        extra: "Every detail, down to the thread, is carefully chosen to make your jacket last a lifetime.",
        imageLeft: true,
    },
    {
        image:
            "https://www.thejacketmaker.com/cdn/shop/files/EXQUISITE_CRAFTSMANSHIP_1d2e6255-4aaa-4009-a775-0a075f3368aa_900x.webp?v=1694691113",
        heading: "Exquisite Craftsmanship",
        content:
            "Each piece is handmade by a single artisan, not mass-produced. This ensures precision, uniqueness, and a level of care you won’t find in chain production.",
        extra: "Our stitching reflects mastery — it’s strong, refined, and built to impress.",
        imageLeft: false,
    },
    {
        image:
            "https://www.thejacketmaker.com/cdn/shop/files/FAIR_PRICING_-_DIRECT_TO_YOU_470b7b38-228f-482c-b134-44d3a12852eb_900x.webp?v=1694691113",
        heading: "Fair Pricing - Direct to You",
        content:
            "We believe luxury should be accessible. By cutting out middlemen, storefront costs, and inefficient marketing, we bring you jackets at a fraction of traditional luxury prices.",
        extra: "Quality that rivals luxury houses, without the markup.",
        imageLeft: true,
    },
    {
        image:
            "https://www.thejacketmaker.com/cdn/shop/files/SIZES_THAT_FIT_ALL_0b65e55e-5613-464f-a115-39570a2a4bd0_900x.webp?v=1694691113",
        heading: "Sizes That Fit All",
        content:
            "We celebrate inclusivity with eight standard sizes (XS–4XL) and a made-to-measure option, ensuring everyone gets the perfect fit.",
        extra: "Your jacket should feel as good as it looks — tailored just for you.",
        imageLeft: false,
    },
    {
        image:
            "https://www.thejacketmaker.com/cdn/shop/files/DISCOVERY___EXPRESSION_3730cca6-0ff3-4a38-8d54-7fcc40329c71_900x.webp?v=1694691113",
        heading: "Discovery & Expression",
        content:
            "Every individual is unique, and your jacket should be too. With our 100% custom design service, you can create a jacket that reflects your personality and style.",
        extra: "From sketch to reality — our design consultants help bring your vision to life.",
        imageLeft: true,
    },
]
