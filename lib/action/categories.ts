import "server-only"

import { StoreProductCategory, StoreProductCategoryListResponse } from "@medusajs/types"
import { sdk } from "@/lib/sdk"

export const listCategories = async (query?: Record<string, unknown>) => {
    const limit = query?.limit || 100

    return sdk.client.fetch<{ product_categories: StoreProductCategory[] }>(
        "/store/product-categories",
        {
            query: {
                fields:
                    "*category_children, *parent_category, *parent_category.parent_category",
                limit,
                ...query,
            },
            next: {
                tags: ["categories"],
            },
            cache: "force-cache",
        }
    ).then(({ product_categories }) => product_categories)
}

export const getCategoryByHandle = async (categoryHandle: string[]) => {
    const handle = `${categoryHandle.join("/")}`

    return sdk.client.fetch<StoreProductCategoryListResponse>(
        `/store/product-categories`,
        {
            query: {
                fields: "*category_children, *parent_category",
                handle,
            },
            next: {
                tags: [`categories-${handle}`],
            },
            cache: "force-cache",
        }
    ).then(({ product_categories }) => product_categories[0])
}

export async function listParentCategories(): Promise<StoreProductCategory[]> {
    return listCategories({
        parent_category_id: "null",
        include_descendants_tree: true,
    });
}