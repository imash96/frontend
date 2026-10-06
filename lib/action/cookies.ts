"use server"

import { updateTag } from "next/cache"
import { cookies as nextCookies } from "next/headers"
import { PendingCustomer } from "@/types/index"

const COOKIE_MAX_AGE = 60 * 60 * 24; // 1 Day in seconds

// Common cookie options factory
const defaultCookieOptions = {
    httpOnly: true,
    sameSite: "strict" as const,
    secure: true,
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
        sameSite: "lax",
        secure: true
    });
}

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