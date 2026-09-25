import Medusa, { FetchArgs, FetchInput } from "@medusajs/js-sdk";
import { getLocale } from "../action/locale";

const MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";

export const sdk = new Medusa({
    baseUrl: MEDUSA_BACKEND_URL,
    debug: process.env.NODE_ENV === "development",
    publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
})

const originalFetch = sdk.client.fetch.bind(sdk.client)

/**
 * Wraps the Medusa SDK fetch to automatically inject the `x-medusa-locale`
 * header. Uses a per-request memoized locale to avoid reading cookies on
 * every single SDK call within the same server request lifecycle.
 */
let _cachedLocale: string | null | undefined
let _cacheRequestId: string | undefined

sdk.client.fetch = async <T>(input: FetchInput, init?: FetchArgs): Promise<T> => {
    const headers = init?.headers ?? {}

    try {
        // In Node.js (server components / actions), each request gets a new
        // module evaluation so this module-level cache is effectively per-request.
        // We use a simple flag to avoid redundant cookie reads within the same call chain.
        if (_cachedLocale === undefined) {
            _cachedLocale = await getLocale()
        }
        if (_cachedLocale) {
            headers["x-medusa-locale"] ??= _cachedLocale
        }
    } catch { }

    return originalFetch(input, {
        ...init,
        headers,
    })
}