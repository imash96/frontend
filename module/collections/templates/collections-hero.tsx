import { StoreCollection } from "@medusajs/types";
import Link from "next/link";
import CollectionCard from "../components/collection-card";

interface CollectionsHeroProps {
  collections: StoreCollection[];
}

export function CollectionsHero({ collections }: CollectionsHeroProps) {
  // Use the first 5 active collections as the hero constellation pieces.
  const featured = collections.filter((c) => c.metadata?.is_active !== false).slice(0, 5);

  return (
    <section className="container-xl relative py-12 md:py-20">
      {/* Decorative dot grids inspired by the reference design */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-[15%] opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle, var(--border) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-[15%] opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle, var(--border) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
        aria-hidden="true"
      />

      <div className="relative grid min-h-[70vh] grid-cols-1 gap-4 md:grid-cols-12 md:grid-rows-6 md:gap-6">
        {/* Central title block */}
        <div className="order-1 flex flex-col items-center justify-center rounded-3xl border border-card-border bg-card p-8 text-center shadow-lg md:col-span-4 md:col-start-5 md:row-span-2 md:row-start-3">
          <h1 className="font-heading text-4xl font-bold tracking-tight text-text-primary md:text-5xl lg:text-6xl">
            Collections
          </h1>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-text-secondary md:text-base">
            From formal wear to everyday essentials, find everything you need
            for a flawless and attractive look right here.
          </p>
          <Link
            href="#all-collections"
            className="mt-6 inline-flex items-center justify-center rounded-full bg-button-primary px-6 py-3 text-sm font-semibold text-button-primary-foreground transition-colors hover:bg-button-primary-hover active:bg-button-primary-active"
          >
            Shop now
          </Link>
        </div>

        {/* Featured constellation cards - hidden on mobile, visible on md+ */}
        {featured[0] && (
          <div className="hidden md:col-span-5 md:col-start-5 md:row-span-2 md:row-start-1 md:block">
            <CollectionCard collection={featured[0]} className="h-full" priority />
          </div>
        )}
        {featured[1] && (
          <div className="hidden md:col-span-3 md:col-start-2 md:row-span-2 md:row-start-2 md:block">
            <CollectionCard collection={featured[1]} className="h-full" priority />
          </div>
        )}
        {featured[2] && (
          <div className="hidden md:col-span-3 md:col-start-3 md:row-span-2 md:row-start-5 md:block">
            <CollectionCard collection={featured[2]} className="h-full" priority />
          </div>
        )}
        {featured[3] && (
          <div className="hidden md:col-span-2 md:col-start-6 md:row-span-2 md:row-start-5 md:block">
            <CollectionCard collection={featured[3]} className="h-full" priority />
          </div>
        )}
        {featured[4] && (
          <div className="hidden md:col-span-3 md:col-start-9 md:row-span-2 md:row-start-3 md:block">
            <CollectionCard collection={featured[4]} className="h-full" priority />
          </div>
        )}

        {/* Mobile fallback strip */}
        <div className="order-2 grid grid-cols-2 gap-4 md:hidden">
          {featured.slice(0, 4).map((collection) => (
            <CollectionCard
              key={collection.id}
              collection={collection}
              className="aspect-4/5"
              priority
            />
          ))}
        </div>
      </div>
    </section>
  );
}
