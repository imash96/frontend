import "server-only"

import { sdk } from "@/lib/sdk"
import { HttpTypes } from "@medusajs/types"

const DEFAULT_REGION = process.env.NEXT_PUBLIC_DEFAULT_REGION || "dk"

export const listRegions = async () => {
    return await sdk.client.fetch<{ regions: HttpTypes.StoreRegion[] }>(`/store/regions`, {
        method: "GET",
        next: {
            tags: ["regions"],
        },
        cache: "force-cache",
    }).then(({ regions }) => regions)
}

export const retrieveRegion = async (id: string) => {

    return await sdk.client.fetch<{ region: HttpTypes.StoreRegion }>(`/store/regions/${id}`, {
        method: "GET",
        next: {
            tags: [`regions-${id}`],
        },
        cache: "force-cache",
    }).then(({ region }) => region)
}

/**
 * Looks up a region by country code.
 *
 * The original cached the country->region map in a module-level `Map`
 * that, once populated, was never rebuilt for the life of the server
 * process - a region added or edited in Medusa Admin would never show up
 * until a redeploy, because `listRegions()`'s own cache tag (which *is*
 * properly revalidatable via updateCacheTags("regions")) was never
 * consulted again after the first call. Rebuilding the map from
 * `listRegions()` on every call fixes that: it's still cheap (an
 * in-memory forEach over already-cached data, not a new network call)
 * and now correctly reflects revalidation.
 *
 * Also now falls back to the default/first region rather than returning
 * undefined for an unrecognized country code, matching the same
 * never-leave-the-visitor-stuck fallback chain used when the country code
 * is resolved in the first place.
 */
export const getRegion = async (countryCode: string) => {
    const regions = await listRegions()

    if (!regions?.length) {
        return null
    }

    const regionMap = new Map<string, HttpTypes.StoreRegion>()
    regions.forEach((region) => {
        region.countries?.forEach((c) => {
            if (c.iso_2) {
                regionMap.set(c.iso_2.toLowerCase(), region)
            }
        })
    })

    const normalizedCode = countryCode?.toLowerCase()

    return (
        (normalizedCode && regionMap.get(normalizedCode)) ||
        regionMap.get(DEFAULT_REGION) ||
        regionMap.values().next().value ||
        null
    )
}