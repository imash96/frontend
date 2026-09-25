"use server"

import { cookies as nextCookies } from "next/headers"
import { sdk } from "@/lib/sdk"
import { Locale } from "@/types/index"
import { getAuthHeaders, getCacheOptions, getCartId, updateCacheTags } from "./cookies"

const LOCALE_COOKIE_NAME = "_medusa_locale"

/**
 * Gets the current locale from cookies.
 *
 * Plain function, not a Server Action: this is a pure read with no reason
 * to be POST-able from the client. Keeping it out of the Server Action
 * surface also means a stray client-side import fails loudly at build
 * time (via `next/headers`) instead of silently round-tripping to the
 * server on every call.
 */
export const getLocale = async (): Promise<string | null> => {
    try {
        const cookies = await nextCookies()
        return cookies.get(LOCALE_COOKIE_NAME)?.value ?? null
    } catch {
        return null
    }
}

/**
 * Sets the locale cookie.
 */
export const setLocaleCookie = async (locale: string) => {

    const cookies = await nextCookies()
    cookies.set(LOCALE_COOKIE_NAME, locale, {
        maxAge: 60 * 60 * 24 * 365, // 1 year
        httpOnly: false, // allow client-side access (e.g. a client-side i18n lib)
        // "lax", not "strict": a visitor arriving via an external link (search
        // results, a shared link, an ad) should still get their previously-set
        // locale on that first request. "strict" withholds the cookie on
        // exactly that top-level cross-site GET, silently reverting them to
        // the default locale for one page load.
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
    })
}

/**
 * Updates the locale preference via SDK and stores in cookie.
 * Also updates the cart with the new locale if one exists.
 */
export const updateLocale = async (localeCode: string): Promise<string> => {
    await setLocaleCookie(localeCode)

    const cartId = await getCartId()

    // updateTag (via updateCacheTags), not revalidateTag(tag, "max"): the
    // customer just changed locale and needs to see it reflected on this
    // render, not stale content while a background revalidation catches up.
    await Promise.all([
        cartId ? refreshCartLocale(cartId, localeCode) : Promise.resolve(),
        updateCacheTags("products", "categories", "collections"),
    ])

    return localeCode
}

async function refreshCartLocale(cartId: string, localeCode: string) {
    const headers = await getAuthHeaders()
    await sdk.store.cart.update(cartId, { locale: localeCode }, {}, headers)
    await updateCacheTags("carts")
}

/**
 * Fetches available locales from the backend.
 * Returns null if the endpoint returns 404 (locales not configured) or if
 * the request otherwise fails.
 */
export const listLocales = async (): Promise<Locale[] | null> => {
    const next = {
        ...(await getCacheOptions("locales")),
    }

    try {
        const { locales } = await sdk.client.fetch<{ locales: Locale[] }>(
            `/store/locales`,
            {
                method: "GET",
                next,
                cache: "force-cache",
            }
        )
        return locales
    } catch (error) {
        const status = (error as { status?: number })?.status
        if (status !== 404) {
            // 404 just means the Translation Module isn't configured for this
            // store - expected for stores that don't use localization. Anything
            // else is worth surfacing.
            console.error("[listLocales] Failed to fetch locales:", error)
        }
        return null
    }
}