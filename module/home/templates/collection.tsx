import Image from "next/image"
import Link from "next/link"
import { product_collections } from "@/data/collection"
import Button from "@/ui/button"
import SectionHeader from "../components/section-header"
import { ArrowRight } from "lucide-react"

export default async function Collection() {
  const active = product_collections.filter((col) =>
    collecionToShow.includes(col.title)
  )

  return (
    <SectionHeader
      title="Shop by Collection"
      desc="Curated edits for every occasion - from the boardroom to the open road."
      sectionName="collections"
      eyebrow="Curated Edits"
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 gap-y-7 md:gap-4 md:gap-y-9">
        {active.map((item) => (
          <Link
            key={item.id}
            href={`/collection/${item.handle}`}
            className="group flex flex-col gap-3 ring-1 ring-border/40 hover:ring-border overflow-hidden transition-all duration-300"
          >
            {/* FIX 1: aspect-[3/4] prevents CLS */}
            <div className="relative aspect-3/4 overflow-hidden bg-card">
              <Image
                src={(item.metadata as any)?.thumbnail ?? ""}
                alt={(item.metadata as any)?.alt ?? item.title}
                fill
                loading="lazy"
                className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.05] will-change-transform"
                sizes="(max-width: 640px) 33vw, (max-width: 1024px) 17vw, 14vw"
              />

              {/* Hover reveal */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3"
                style={{
                  background: "linear-gradient(to top, var(--scrim) 0%, transparent 60%)",
                }}
                aria-hidden="true"
              >
                <span className="flex items-center gap-1 text-white text-[10px] font-semibold tracking-[0.12em] uppercase">
                  Explore
                  <ArrowRight className="size-2.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                </span>
              </div>

              {/* Corner accent */}
              <span
                className="absolute top-2 right-2 size-4 border-t border-r border-white/0 group-hover:border-white/50 group-hover:size-5 transition-all duration-300"
                aria-hidden="true"
              />
            </div>

            {/* Title */}
            <div className="space-y-1 text-center px-1 pb-2">
              <h3 className="text-sm font-light text-text-primary group-hover:text-primary transition-colors duration-200 leading-snug">
                {item.title}
              </h3>
              {/* Animated underline */}
              <div
                className="mx-auto h-px w-0 bg-accent group-hover:w-8 transition-all duration-300 ease-out"
                aria-hidden="true"
              />
            </div>
          </Link>
        ))}
      </div>

      <div className="flex justify-center mt-8 md:mt-10">
        <Button
          href="/collection"
          variant="outline"
          icon={<ArrowRight className="size-3.5" />}
          iconPosition="right"
        >
          View all Collections
        </Button>
      </div>
    </SectionHeader>
  )
}

const collecionToShow = [
  "Men's Apparel",
  "Travel Essentials",
  "Women's Apparel",
  "Celebrity Jackets",
  "Best Seller",
  "Men's Wallets",
];