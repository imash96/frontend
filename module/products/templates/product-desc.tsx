"use client";

import Image from "next/image";

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
  );
}

const data = [
  {
    image:
      "https://images.vellehide.com/storefront/images/prod_desc/FINEST_RAW_MATERIALS.webp",
    heading: "Finest Raw Materials",
    content:
      "It all starts with the raw materials. We use nothing but the best full-grain natural leather, YKK zippers, and soft polyester lining to ensure comfort, durability, and timeless appeal.",
    extra:
      "Every detail, down to the thread, is carefully chosen to make your jacket last a lifetime.",
    imageLeft: true,
  },
  {
    image:
      "https://images.vellehide.com/storefront/images/prod_desc/EXQUISITE_CRAFTSMANSHIP.webp",
    heading: "Exquisite Craftsmanship",
    content:
      "Each piece is handmade by a single artisan, not mass-produced. This ensures precision, uniqueness, and a level of care you won’t find in chain production.",
    extra:
      "Our stitching reflects mastery — it’s strong, refined, and built to impress.",
    imageLeft: false,
  },
  {
    image:
      "https://images.vellehide.com/storefront/images/prod_desc/FAIR_PRICING_DIRECT_TO_YOU.webp",
    heading: "Fair Pricing - Direct to You",
    content:
      "We believe luxury should be accessible. By cutting out middlemen, storefront costs, and inefficient marketing, we bring you jackets at a fraction of traditional luxury prices.",
    extra: "Quality that rivals luxury houses, without the markup.",
    imageLeft: true,
  },
  {
    image:
      "https://images.vellehide.com/storefront/images/prod_desc/SIZES_THAT_FIT_ALL.webp",
    heading: "Sizes That Fit All",
    content:
      "We celebrate inclusivity with eight standard sizes (XS–4XL) and a made-to-measure option, ensuring everyone gets the perfect fit.",
    extra:
      "Your jacket should feel as good as it looks — tailored just for you.",
    imageLeft: false,
  },
  {
    image:
      "https://images.vellehide.com/storefront/images/prod_desc/DISCOVERY_EXPRESSION.webp",
    heading: "Discovery & Expression",
    content:
      "Every individual is unique, and your jacket should be too. With our 100% custom design service, you can create a jacket that reflects your personality and style.",
    extra:
      "From sketch to reality — our design consultants help bring your vision to life.",
    imageLeft: true,
  },
];
