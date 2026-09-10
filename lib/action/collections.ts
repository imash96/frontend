import "server-only"

import { sdk } from "@/lib/sdk"
import { StoreCollection, StoreCollectionListResponse } from "@medusajs/types"
import { getCacheOptions } from "./cookies"

export const retrieveCollection = async (id: string) => {
    const next = {
        ...(await getCacheOptions("collections")),
    }

    return await sdk.client.fetch<{ collection: StoreCollection }>(
        `/store/collections/${id}`,
        {
            next,
            cache: "force-cache",
        }
    ).then(({ collection }) => collection)
}

export const listCollections = async (
    queryParams: Record<string, string> = {}
): Promise<{ collections: StoreCollection[]; count: number }> => {
    const next = {
        ...(await getCacheOptions("collections")),
    }

    queryParams.limit = queryParams.limit || "100"
    queryParams.offset = queryParams.offset || "0"

    return await sdk.client.fetch<{ collections: StoreCollection[]; count: number }>(
        "/store/collections",
        {
            query: queryParams,
            next,
            cache: "force-cache",
        }
    ).then(({ collections }) => ({ collections, count: collections.length }))
}

export const getCollectionByHandle = async (
    handle: string
): Promise<StoreCollection | null> => {
    const next = {
        ...(await getCacheOptions("collections")),
    }

    return await sdk.client.fetch<StoreCollectionListResponse>(`/store/collections`, {
        query: { handle, fields: "*products" },
        next,
        cache: "force-cache",
    }).then(({ collections }) => collections[0] || null)
}