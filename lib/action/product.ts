import "server-only"

import { sdk } from "@/lib/sdk"
import { OptionValueIds } from "@/lib/util/product-option-filters"
import { sortProducts } from "@/lib/util/sort-products"
import { FindParams, StoreProduct, StoreProductListParams } from "@medusajs/types"
import { SortOptions } from "@/types/common"
import { getAuthHeaders, getCacheOptions } from "./cookies"
import { getRegion, retrieveRegion } from "./regions"

type ProductListQueryParams = (FindParams &
    StoreProductListParams) & {
        options?: string[]
        option_value_id?: string | string[]
    }

export const listProducts = async ({
    pageParam = 1,
    queryParams,
    countryCode,
    regionId,
}: ListProductsProps): Promise<ListProductsResp> => {
    if (!countryCode && !regionId) {
        throw new Error("Country code or region ID is required")
    }

    const limit = queryParams?.limit || 12
    const _pageParam = Math.max(pageParam, 1)
    const offset = _pageParam === 1 ? 0 : (_pageParam - 1) * limit

    const region = countryCode
        ? await getRegion(countryCode)
        : await retrieveRegion(regionId!)

    if (!region) {
        return {
            response: { products: [], count: 0 },
            nextPage: null,
        }
    }

    const headers = {
        ...(await getAuthHeaders()),
    }

    const next = {
        ...(await getCacheOptions("products")),
    }

    return sdk.client
        .fetch<{ products: StoreProduct[]; count: number }>(
            `/store/products`,
            {
                method: "GET",
                query: {
                    limit,
                    offset,
                    region_id: region?.id,
                    fields:
                        "*variants.calculated_price,+variants.inventory_quantity,*variants.images,*variants.options,+metadata,+tags,",
                    ...queryParams,
                },
                headers,
                next,
                cache: "force-cache",
            }
        )
        .then(({ products, count }) => {
            const nextPage = count > offset + limit ? pageParam + 1 : null

            return {
                response: {
                    products,
                    count,
                },
                nextPage: nextPage,
                queryParams,
            }
        })
}

/**
 * This will fetch 100 products to the Next.js cache and sort them based on the sortBy parameter.
 * It will then return the paginated products based on the page and limit parameters.
 */
export const listProductsWithSort = async ({
    page = 0,
    queryParams,
    sortBy = "created_at",
    countryCode,
    optionValueIds,
}: ListProductsWithSortProps): Promise<ListProductsWithSortResp> => {
    const limit = queryParams?.limit || 12
    const optionFilters = Array.from(
        new Set((optionValueIds || []).filter(Boolean))
    )

    const {
        response: { products },
    } = await listProducts({
        pageParam: 0,
        queryParams: {
            ...queryParams,
            ...(optionFilters.length ? { option_value_id: optionFilters } : {}),
            limit: 100,
        },
        countryCode,
    })

    const sortedProducts = sortProducts(products, sortBy)

    const pageParam = (page - 1) * limit

    const filteredCount = products.length

    const nextPage = filteredCount > pageParam + limit ? pageParam + limit : null

    const paginatedProducts = sortedProducts.slice(pageParam, pageParam + limit)

    return {
        response: {
            products: paginatedProducts,
            count: filteredCount,
        },
        nextPage,
        queryParams,
    }
}

export async function fetchProductsByCollection({ regionId, collectionId, limit = 6 }: FetchByCollectionProps): Promise<StoreProduct[]> {
    const { response: { products } } = await listProducts(
        {
            regionId,
            queryParams: {
                collection_id: [collectionId],
                limit,
                fields: "id,handle,title,*images,*variants.calculated_price",
            },
        },
    );
    return products;
}

type ListProductsProps = {
    pageParam?: number
    queryParams?: FindParams & StoreProductListParams
    countryCode?: string
    regionId?: string
}

type ListProductsResp = {
    response: { products: StoreProduct[]; count: number }
    nextPage: number | null
    queryParams?: FindParams & StoreProductListParams
}

type ListProductsWithSortProps = {
    page?: number
    queryParams?: FindParams & StoreProductListParams
    sortBy?: SortOptions
    countryCode: string
    optionValueIds?: OptionValueIds
}

type ListProductsWithSortResp = {
    response: { products: StoreProduct[]; count: number }
    nextPage: number | null
    queryParams?: ProductListQueryParams
}

type FetchByCollectionProps = {
    regionId: string;
    collectionId: string;
    limit?: number
};