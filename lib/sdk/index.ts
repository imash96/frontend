import Medusa, { FetchArgs, FetchInput } from "@medusajs/js-sdk";
import { getLocale } from "../action/locale";

const MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";

export const sdk = new Medusa({
    baseUrl: MEDUSA_BACKEND_URL,
    debug: process.env.NODE_ENV === "development",
    publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
})

const originalFetch = sdk.client.fetch.bind(sdk.client)

sdk.client.fetch = async <T>(input: FetchInput, init?: FetchArgs): Promise<T> => {
    const headers = init?.headers ?? {}
    let localeHeader: Record<string, string | null> | undefined
    try {
        const locale = await getLocale()
        localeHeader = { "x-medusa-locale": locale, } as const
        headers["x-medusa-locale"] ??= localeHeader["x-medusa-locale"]
    } catch { }

    const newHeaders = {
        ...localeHeader,
        ...headers,
    }
    init = {
        ...init,
        headers: newHeaders,
    }
    return originalFetch(input, init)
}