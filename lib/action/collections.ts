import "server-only"

import { StoreCollection, StoreCollectionListResponse, } from "@medusajs/types"
import { sdk } from "@/lib/sdk"

export const retrieveCollection = async (id: string) => {

    return await sdk.client.fetch<{ collection: StoreCollection }>(
        `/store/collections/${id}`,
        {
            next: {
                tags: [`collections-${id}`],
            },
            cache: "force-cache",
        }
    ).then(({ collection }) => collection)
}

export const listCollections = async (queryParams: Record<string, string> = {}): Promise<{ collections: StoreCollection[]; count: number }> => {

    queryParams.limit = queryParams.limit || "100"
    queryParams.offset = queryParams.offset || "0"

    return await sdk.client.fetch<{ collections: StoreCollection[]; count: number }>(
        "/store/collections",
        {
            query: queryParams,
            next: {
                tags: ["collections"],
            },
            cache: "force-cache",
        }
    ).then(({ collections, count }) => ({ collections, count: count ?? collections.length }))
}

export const getCollectionByHandle = async (
    handle: string
): Promise<StoreCollection | null> => {

    return await sdk.client.fetch<StoreCollectionListResponse>(`/store/collections`, {
        query: { handle, fields: "id,title,handle,metadata" },
        next: {
            tags: [`collections-${handle}`],
        },
        cache: "force-cache",
    }).then(({ collections }) => collections[0] || null)
}