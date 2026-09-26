"use server"

import { sdk } from "@/lib/sdk"
import { getAuthHeaders, updateCacheTags } from "./cookies"

// ── Types ──

export type WishlistItem = {
    id: string
    product_variant_id: string
    wishlist_id: string
    created_at: string
    updated_at: string
    deleted_at: string | null
    product_variant: {
        id: string
        title: string
        product: {
            id: string
            handle: string
            thumbnail: string | null
        }
    } | null
}

export type Wishlist = {
    id: string
    customer_id: string | null
    sales_channel_id: string
    created_at: string
    updated_at: string
    deleted_at: string | null
    items: WishlistItem[]
    items_count?: number
}

export type WishlistActionResult = {
    success: boolean
    error: string | null
}

// ── Actions ──

/**
 * Get or create a wishlist for the current customer.
 * The backend POST is idempotent: returns existing wishlist if one exists.
 */
export async function getOrCreateWishlist(): Promise<Wishlist | null> {
    const headers = await getAuthHeaders()
    if (!headers.authorization) return null

    try {
        // Try to get existing wishlists first
        const { data } = await sdk.client.fetch<{
            data: Wishlist[]
        }>(`/store/wishlists`, {
            method: "GET",
            headers,
        })

        if (data && data.length > 0) {
            return data[0]
        }

        // Create a new one if none exists.
        // Resolve sales_channel_id from the store config.
        const salesChannelId = await resolveSalesChannelId(headers)
        if (!salesChannelId) {
            console.error("Could not resolve sales_channel_id for wishlist creation")
            return null
        }

        const wishlist = await sdk.client.fetch<Wishlist>(`/store/wishlists`, {
            method: "POST",
            body: { sales_channel_id: salesChannelId },
            headers,
        })

        return wishlist
    } catch (error) {
        console.error("Failed to get/create wishlist:", error)
        return null
    }
}

/**
 * Resolve the default sales channel ID.
 * Checks env var first, then falls back to the customer's existing cart.
 */
async function resolveSalesChannelId(
    headers: Record<string, string>,
): Promise<string | null> {
    // 1. Env var override
    const envId = process.env.NEXT_PUBLIC_MEDUSA_SALES_CHANNEL_ID
    if (envId) return envId

    // 2. Get sales channel from existing cart
    try {
        const { getCartId } = await import("./cookies")
        const cartId = await getCartId()
        if (cartId) {
            const { cart } = await sdk.store.cart.retrieve(cartId, {}, headers)
            const salesChannelId = (cart as any)?.sales_channel_id
            if (salesChannelId) return salesChannelId
        }
    } catch {
        // ignore
    }

    // 3. Last resort: query regions and create a minimal cart
    try {
        const { regions } = await sdk.client.fetch<{
            regions: { id: string }[]
        }>(`/store/regions`, { method: "GET", headers })

        if (regions?.[0]?.id) {
            const { cart } = await sdk.store.cart.create(
                { region_id: regions[0].id },
                {},
                headers,
            )
            return (cart as any)?.sales_channel_id ?? null
        }
    } catch {
        // ignore
    }

    return null
}

/**
 * Fetch the current customer's wishlist with items.
 */
export async function fetchWishlist(): Promise<Wishlist | null> {
    const headers = await getAuthHeaders()
    if (!headers.authorization) return null

    try {
        const { data } = await sdk.client.fetch<{
            data: Wishlist[]
        }>(`/store/wishlists`, {
            method: "GET",
            headers,
        })

        if (!data || data.length === 0) return null

        // Get the full wishlist with items
        const wishlist = await sdk.client.fetch<Wishlist>(
            `/store/wishlists/${data[0].id}`,
            {
                method: "GET",
                query: { include_calculated_price: true },
                headers,
            },
        )

        return wishlist
    } catch {
        return null
    }
}

/**
 * Get total wishlist items count for the badge.
 */
export async function fetchWishlistCount(): Promise<number> {
    const headers = await getAuthHeaders()
    if (!headers.authorization) return 0

    try {
        const { total_items_count } = await sdk.client.fetch<{
            total_items_count: number
        }>(`/store/wishlists/total-items-count`, {
            method: "GET",
            headers,
        })

        return total_items_count ?? 0
    } catch {
        return 0
    }
}

/**
 * Add a product variant to the wishlist.
 */
export async function addToWishlist(
    productVariantId: string,
): Promise<WishlistActionResult> {
    const headers = await getAuthHeaders()
    if (!headers.authorization) {
        return { success: false, error: "Please sign in to save items to your wishlist." }
    }

    try {
        // Get or create wishlist
        const wishlist = await getOrCreateWishlist()
        if (!wishlist) {
            return { success: false, error: "Failed to get wishlist." }
        }

        await sdk.client.fetch(
            `/store/wishlists/${wishlist.id}/add-item`,
            {
                method: "POST",
                body: { product_variant_id: productVariantId },
                headers,
            },
        )

        await updateCacheTags("wishlist")
        return { success: true, error: null }
    } catch (error: any) {
        // Handle duplicate item
        if (error?.message?.includes("unique") || error?.message?.includes("duplicate")) {
            return { success: false, error: "This item is already in your wishlist." }
        }
        const message = error instanceof Error ? error.message : "Failed to add item."
        return { success: false, error: message }
    }
}

/**
 * Remove an item from the wishlist.
 */
export async function removeFromWishlist(
    wishlistId: string,
    itemId: string,
): Promise<WishlistActionResult> {
    const headers = await getAuthHeaders()
    if (!headers.authorization) {
        return { success: false, error: "Not authenticated." }
    }

    try {
        await sdk.client.fetch(
            `/store/wishlists/${wishlistId}/items/${itemId}`,
            {
                method: "DELETE",
                headers,
            },
        )

        await updateCacheTags("wishlist")
        return { success: true, error: null }
    } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to remove item."
        return { success: false, error: message }
    }
}

/**
 * Check if a specific variant is in the customer's wishlist.
 */
export async function isVariantInWishlist(
    productVariantId: string,
): Promise<boolean> {
    const headers = await getAuthHeaders()
    if (!headers.authorization) return false

    try {
        const wishlist = await fetchWishlist()
        if (!wishlist) return false

        return wishlist.items.some(
            (item) => item.product_variant_id === productVariantId,
        )
    } catch {
        return false
    }
}
