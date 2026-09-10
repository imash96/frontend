import { ProductCategory } from "@/types/common";

export function getRandomItems<T>(items: T[], count: number): T[] {
    // Shuffle the array
    const shuffled = items.sort(() => Math.random() - 0.5);

    // Slice to the desired count and sort by rank
    return shuffled.slice(0, count);
}

function getStyle(categories: ProductCategory[], count: number) {
    const combinedCategories = categories.flatMap(child => {
        return child.category_children?.map((nChild) => ({
            ...nChild,
            name: nChild.name,
            handle: nChild.handle
        }))
    }).filter(Boolean)
    return getRandomItems(combinedCategories, count) as ProductCategory[]
}

function getShop(categories: ProductCategory[], count: number) {
    const combinedCategories = categories.flatMap(child => {
        return child.category_children?.map((nChild) => ({
            ...nChild,
            name: nChild.name,
            handle: nChild.handle,
        }))
    }).filter(Boolean)
    return getRandomItems(combinedCategories, count) as ProductCategory[]
}

export function getEnhancedCategories(category: ProductCategory) {
    const shop = getShop(category.category_children || [], 5);
    const style = getStyle(shop, 5);
    return { name: category.name, id: category.id, handle: category.handle, shop, style, };
}