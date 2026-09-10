import type { StoreProductCategory } from "@medusajs/types";

export function getRandomItems<T>(items: T[], count: number): T[] {
    // Shuffle the array
    const shuffled = items.sort(() => Math.random() - 0.5);

    // Slice to the desired count and sort by rank
    return shuffled.slice(0, count);
}

export function getRandomCategory(categories: StoreProductCategory[], count: number) {
    const combinedCategories = categories.map(child => ({
        ...child,
        name: `Leather ${child.name}`,
    }))

    return getRandomItems(combinedCategories, count);
}

export function getRandomStyle(categories: StoreProductCategory[], count: number) {
    const combinedCategories = categories.filter(category => category.category_children && category.category_children.length > 0).flatMap(category =>
        category.category_children.map(child => ({
            ...child,
            name: `Leather ${child.name}`,
        }))
    );

    return getRandomItems(combinedCategories, count);
}