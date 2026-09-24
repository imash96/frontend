import { listCollections } from "@/lib/action/collections";
import { CollectionsGrid } from "@/module/collections/templates/collections-grid";
import { CollectionsHero } from "@/module/collections/templates/collections-hero";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Collections | Velle Hide",
    description: "Browse our curated collections of premium leather apparel, accessories, and footwear.",
};

export default async function Page() {
    const { collections } = await listCollections({
        fields: 'id,title,handle,metadata'
    });

    return (
        <main className="min-h-screen bg-background" id="all-collections">
            <CollectionsHero collections={collections} />
            <CollectionsGrid collections={collections} />
        </main>
    )
}