import { StoreCollection } from "@medusajs/types";
import CollectionCard from "../components/collection-card";

interface CollectionsGridProps {
  collections: StoreCollection[];
}

const SIZE_VARIANTS = [
  { col: 1, row: 1 },
  { col: 1, row: 2 },
  { col: 2, row: 1 },
  { col: 2, row: 2 },
  { col: 1, row: 2 },
  { col: 2, row: 1 },
  { col: 1, row: 1 },
  { col: 2, row: 2 },
];

function getSizeClasses(index: number) {
  const variant = SIZE_VARIANTS[index % SIZE_VARIANTS.length];
  return {
    col: variant.col === 2 ? "col-span-2" : "col-span-1",
    row: variant.row === 2 ? "row-span-2" : "row-span-1",
  };
}

export function CollectionsGrid({ collections }: CollectionsGridProps) {
  return (
    <section className="container-xl py-16 md:py-24">
      <div className="mb-10 md:mb-14">
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-text-primary">
          Explore all collections
        </h2>
        <p className="mt-3 max-w-2xl text-text-secondary">
          Every collection is crafted with purpose. Browse the full range and
          find the pieces that match your style.
        </p>
      </div>

      <div
        className={`grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(240px,1fr))] auto-rows-45 md:auto-rows-60 grid-flow-dense gap-4 md:gap-6`}
      >
        {collections.map((collection, index) => {
          const size = getSizeClasses(index);
          return (
            <CollectionCard
              key={collection.id}
              collection={collection}
              className={`${size.col} ${size.row}`}
              priority={index < 6}
            />
          );
        })}
      </div>
    </section>
  );
}
