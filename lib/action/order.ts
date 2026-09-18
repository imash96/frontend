import "server-only"

import { sdk } from "@/lib/sdk"
import medusaError from "@/lib/util/medusa-error"
import { getAuthHeaders, getCacheOptions, updateCacheTags } from "./cookies"
import { HttpTypes } from "@medusajs/types"

// Plain read, not a Server Action - see the note in locale-actions.ts.
export const retrieveOrder = async (id: string) => {
    const headers = {
        ...(await getAuthHeaders()),
    }

    const next = {
        ...(await getCacheOptions("orders")),
    }

    return sdk.client
        .fetch<HttpTypes.StoreOrderResponse>(`/store/orders/${id}`, {
            method: "GET",
            query: {
                fields:
                    "*payment_collections.payments,*items,*items.metadata,*items.variant,*items.product",
            },
            headers,
            next,
            cache: "force-cache",
        })
        .then(({ order }) => order)
        .catch((err) => medusaError(err))
}

export const listOrders = async (
    limit: number = 10,
    offset: number = 0,
    filters?: Record<string, unknown>
) => {
    const headers = {
        ...(await getAuthHeaders()),
    }

    const next = {
        ...(await getCacheOptions("orders")),
    }

    return sdk.client
        .fetch<HttpTypes.StoreOrderListResponse>(`/store/orders`, {
            method: "GET",
            query: {
                limit,
                offset,
                order: "-created_at",
                fields: "*items,+items.metadata,*items.variant,*items.product",
                ...filters,
            },
            headers,
            next,
            cache: "force-cache",
        })
        .then(({ orders }) => orders)
        .catch((err) => medusaError(err))
}

export const createTransferRequest = async (
    state: {
        success: boolean
        error: string | null
        order: HttpTypes.StoreOrder | null
    },
    formData: FormData
): Promise<{
    success: boolean
    error: string | null
    order: HttpTypes.StoreOrder | null
}> => {
    "use server"

    const id = formData.get("order_id") as string

    if (!id) {
        return { success: false, error: "Order ID is required", order: null }
    }

    const headers = await getAuthHeaders()

    return await sdk.store.order
        .requestTransfer(
            id,
            {},
            {
                fields: "id, email",
            },
            headers
        )
        .then(({ order }) => ({ success: true, error: null, order }))
        .catch((err) => ({ success: false, error: err.message, order: null }))
}

export const acceptTransferRequest = async (id: string, token: string) => {
    "use server"

    const headers = await getAuthHeaders()

    const result = await sdk.store.order
        .acceptTransfer(id, { token }, {}, headers)
        .then(({ order }) => ({ success: true, error: null, order }))
        .catch((err) => ({ success: false, error: err.message, order: null }))

    // Added: the original didn't invalidate anything here. A successful
    // transfer changes who the order belongs to, so this visitor's cached
    // order list is now stale - worth double-checking this matches how you
    // want transfer completion to behave.
    if (result.success) {
        await updateCacheTags("orders")
    }

    return result
}

export const declineTransferRequest = async (id: string, token: string) => {
    "use server"

    const headers = await getAuthHeaders()

    return await sdk.store.order
        .declineTransfer(id, { token }, {}, headers)
        .then(({ order }) => ({ success: true, error: null, order }))
        .catch((err) => ({ success: false, error: err.message, order: null }))
}