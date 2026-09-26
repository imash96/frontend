"use client"

import { create } from "zustand"
import {
    addToWishlist,
    fetchWishlist,
    fetchWishlistCount,
    removeFromWishlist,
    type Wishlist,
    type WishlistItem,
} from "@/lib/action/wishlist"

interface WishlistState {
    /** The customer's wishlist (null if not loaded or not logged in) */
    wishlist: Wishlist | null
    /** Total items count for nav badge */
    count: number
    /** Loading state */
    isLoading: boolean
    /** Set of variant IDs currently in the wishlist for quick lookup */
    variantIds: Set<string>
    /** Whether the store has been hydrated from the server */
    hydrated: boolean

    /** Hydrate wishlist from server */
    hydrate: () => Promise<void>
    /** Add a variant to wishlist */
    add: (variantId: string) => Promise<{ success: boolean; error: string | null }>
    /** Remove an item from wishlist by item ID */
    remove: (itemId: string) => Promise<{ success: boolean; error: string | null }>
    /** Toggle a variant in wishlist (add if missing, remove if present) */
    toggle: (variantId: string) => Promise<{ success: boolean; error: string | null }>
    /** Check if a variant is in the wishlist */
    has: (variantId: string) => boolean
    /** Reset state (on logout) */
    reset: () => void
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
    wishlist: null,
    count: 0,
    isLoading: false,
    variantIds: new Set(),
    hydrated: false,

    hydrate: async () => {
        if (get().hydrated) return
        set({ isLoading: true })

        try {
            const [wishlist, count] = await Promise.all([
                fetchWishlist(),
                fetchWishlistCount(),
            ])

            const variantIds = new Set(
                wishlist?.items?.map((item) => item.product_variant_id) ?? [],
            )

            set({ wishlist, count, variantIds, hydrated: true, isLoading: false })
        } catch {
            set({ hydrated: true, isLoading: false })
        }
    },

    add: async (variantId: string) => {
        // Optimistic update
        set((state) => ({
            variantIds: new Set([...state.variantIds, variantId]),
            count: state.count + 1,
        }))

        const result = await addToWishlist(variantId)

        if (!result.success) {
            // Rollback on failure
            set((state) => {
                const ids = new Set(state.variantIds)
                ids.delete(variantId)
                return { variantIds: ids, count: Math.max(0, state.count - 1) }
            })
        } else {
            // Re-hydrate to get accurate data
            set({ hydrated: false })
            get().hydrate()
        }

        return result
    },

    remove: async (itemId: string) => {
        const { wishlist } = get()
        if (!wishlist) return { success: false, error: "No wishlist found." }

        const item = wishlist.items.find((i) => i.id === itemId)
        const variantId = item?.product_variant_id

        // Optimistic update
        if (variantId) {
            set((state) => {
                const ids = new Set(state.variantIds)
                ids.delete(variantId)
                return {
                    variantIds: ids,
                    count: Math.max(0, state.count - 1),
                    wishlist: state.wishlist
                        ? {
                            ...state.wishlist,
                            items: state.wishlist.items.filter((i) => i.id !== itemId),
                        }
                        : null,
                }
            })
        }

        const result = await removeFromWishlist(wishlist.id, itemId)

        if (!result.success && variantId) {
            // Rollback
            set({ hydrated: false })
            get().hydrate()
        }

        return result
    },

    toggle: async (variantId: string) => {
        const { wishlist, variantIds } = get()

        if (variantIds.has(variantId)) {
            // Find the item and remove it
            const item = wishlist?.items.find(
                (i) => i.product_variant_id === variantId,
            )
            if (item) {
                return get().remove(item.id)
            }
            return { success: false, error: "Item not found in wishlist." }
        }

        return get().add(variantId)
    },

    has: (variantId: string) => {
        return get().variantIds.has(variantId)
    },

    reset: () => {
        set({
            wishlist: null,
            count: 0,
            isLoading: false,
            variantIds: new Set(),
            hydrated: false,
        })
    },
}))
