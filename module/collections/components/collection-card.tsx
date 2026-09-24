import { StoreCollection } from "@medusajs/types";
import Image from "next/image";
import Link from "next/link";

export default function CollectionCard({ collection, className, priority, }: Props) {

    const isActive = collection.metadata?.is_active !== false;
    return (
        <Link
            href={`/collections/${collection.handle}`}
            aria-disabled={!isActive}
            tabIndex={isActive ? 0 : -1}
            className={`group relative overflow-hidden rounded-2xl border border-card-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-primary/30 focus-visible:ring-2 focus-visible:ring-focus-ring ${!isActive ? "pointer-events-none opacity-70" : ""} ${className || ""}`}
        >
            <div className="absolute inset-0">
                <Image
                    src={collection.metadata?.thumbnail as string}
                    alt={collection.metadata?.alt as string || collection.title}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    priority={priority}
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
            </div>

            <div className="relative flex h-full flex-col justify-end p-4 md:p-5">
                {!isActive && (
                    <span className="mb-2 w-fit rounded-full bg-badge-limited px-2.5 py-1 text-xs font-semibold uppercase tracking-caps text-badge-limited-foreground">
                        Coming soon
                    </span>
                )}
                <h3 className="font-heading text-lg md:text-xl font-semibold text-white drop-shadow-sm">
                    {collection.title}
                </h3>
                {collection.metadata?.description as string && (
                    <p className="mt-1 line-clamp-2 text-sm text-white/80">
                        {collection.metadata?.description as string}
                    </p>
                )}
            </div>
        </Link>
    );
}

type Props = {
    collection: StoreCollection;
    className?: string;
    priority?: boolean;
}