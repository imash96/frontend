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
 * header per-request without leaking state across concurrent user requests.
 */
sdk.client.fetch = async <T>(input: FetchInput, init?: FetchArgs): Promise<T> => {
    const headers: Record<string, any> = { ...(init?.headers ?? {}) }

    try {
        if (!headers["x-medusa-locale"]) {
            const locale = await getLocale()
            if (locale) {
                headers["x-medusa-locale"] = locale
            }
        }
    } catch {
        // Ignore when called outside a request / private cache scope
    }

    return originalFetch(input, {
        ...init,
        headers,
    })
}