"use server"

import { updateTag } from "next/cache"
import { cookies as nextCookies } from "next/headers"
import { PendingCustomer } from "@/types/index"

const COOKIE_MAX_AGE = 60 * 60 * 24; // 1 Day in seconds

// Common cookie options factory
const defaultCookieOptions = {
    httpOnly: true,
    sameSite: "strict" as const,
    secure: process.env.NODE_ENV === "production",
};

export const getAuthHeaders = async (): Promise<{ authorization: string } | Record<string, never>> => {
    try {
        const token = (await nextCookies()).get("_medusa_jwt")?.value

        return token ? { authorization: `Bearer ${token}` } : {}
    } catch {
        return {}
    }
}

export const getCacheTag = async (tag: string): Promise<string> => {
    try {
        const cacheId = (await nextCookies()).get("_medusa_cache_id")?.value

        if (!cacheId) {
            return ""
        }

        return `${tag}-${cacheId}`
    } catch {
        return ""
    }
}

export const getCacheOptions = async (tag: string): Promise<{ tags: string[] } | Record<string, never>> => {
    // No `typeof window` check here: the `server-only` import above already
    // makes it impossible for this module to end up in a browser bundle.
    const cacheTag = await getCacheTag(tag)


    return cacheTag ? { tags: [`${cacheTag}`] } : {}
}

export async function getNextHeader(cacheKey: string) {
    const [headers, next] = await Promise.all([
        getAuthHeaders(),
        getCacheOptions(cacheKey),
    ]);
    return { headers, next };
}

// `sameSite: "lax"` rather than `"strict"`: the customer returns from a
// redirect-based payment method (iDEAL, Bancontact, ...) via a cross-site
// top-level navigation. A "strict" cookie is withheld on that navigation, so
// the storefront would see a logged-out, cartless visitor and render a 404 for
// the checkout page instead of resuming the order. "lax" is sent on top-level
// GET navigations while still blocking cross-site subrequests.
export const setAuthToken = async (token: string) => {
    (await nextCookies()).set("_medusa_jwt", token, {
        ...defaultCookieOptions,
        maxAge: COOKIE_MAX_AGE * 7,
        sameSite: "lax",
    })
}

export const removeAuthToken = async () => {
    (await nextCookies()).delete("_medusa_jwt")
}

// During the email verification flow the customer record isn't created until
// the customer verifies their email and logs in. We temporarily persist the
// extra signup fields in a cookie so they survive the customer leaving to open
// their inbox, and read them back when creating the customer at login.
export const setPendingCustomer = async (customer: PendingCustomer) => {
    (await nextCookies()).set("_medusa_pending_customer", JSON.stringify(customer), {
        ...defaultCookieOptions,
        maxAge: COOKIE_MAX_AGE,
    })
}


export const getPendingCustomer = async (): Promise<PendingCustomer | null> => {
    const value = (await nextCookies()).get("_medusa_pending_customer")?.value

    if (!value) {
        return null
    }

    try {
        return JSON.parse(value) as PendingCustomer
    } catch {
        return null
    }
}

export const removePendingCustomer = async () => {
    (await nextCookies()).delete("_medusa_pending_customer")
}

export const getCartId = async () => {
    return (await nextCookies()).get("_medusa_cart_id")?.value
}

// See the note on `setAuthToken`: `sameSite: "lax"` so the cart cookie survives
// the cross-site return navigation from a redirect-based payment method.
export const setCartId = async (cartId: string) => {
    (await nextCookies()).set("_medusa_cart_id", cartId, {
        ...defaultCookieOptions,
        maxAge: COOKIE_MAX_AGE * 7,
        sameSite: "lax",
    })
}

export const removeCartId = async () => {
    (await nextCookies()).delete("_medusa_cart_id")
}

export async function setCountryCode(countryCode: string) {
    (await nextCookies()).set("__country_code", countryCode, {
        maxAge: COOKIE_MAX_AGE * 365,
        sameSite: "strict",
    });
}

/**
 * Immediately invalidates one or more per-visitor cache tags - the
 * read-your-own-writes counterpart to `getCacheOptions`. Call this after a
 * mutation the current visitor triggered (cart update, login, address
 * change, region switch, ...) so they see the effect on the very next
 * render instead of stale content while a background revalidation catches
 * up (which is what `revalidateTag(tag, "max")` would give you instead).
 *
 * Silently skips any tag that resolves to "" (no `_medusa_cache_id` cookie
 * yet) rather than calling `updateTag("")`. Only usable inside Server
 * Actions — `updateTag` itself is action-only, same as `revalidateTag`.
 */
export async function updateCacheTags(...tags: string[]): Promise<void> {
    await Promise.all(
        tags.map(async (tag) => {
            const cacheTag = await getCacheTag(tag)
            if (cacheTag) {
                updateTag(cacheTag)
            }
        })
    )
}