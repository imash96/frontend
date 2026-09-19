/**
 * - `__country_code` cookie: persisted across visits, wins over geo-IP once set.
 * - `x-country-code` request header: same value, forwarded so Server
 *   Components rendered during *this* request can read it immediately via
 *   headers() (a cookie set on the response isn't visible to this request's
 *   own render pass yet - only to the next one, once the browser sends it back).
 */
import type { StoreRegion } from "@medusajs/types"
import { NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL
const PUBLISHABLE_API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
const DEFAULT_REGION = process.env.NEXT_PUBLIC_DEFAULT_REGION || "dk"

const COUNTRY_CODE_COOKIE = "__country_code"
const COUNTRY_CODE_HEADER = "x-country-code"
const CACHE_ID_COOKIE = "_medusa_cache_id"

const REGION_CACHE_TTL_MS = 60 * 60 * 1000 // 1 hour
const CACHE_ID_MAX_AGE = 60 * 60 * 24 // 1 day, in seconds
const COUNTRY_CODE_MAX_AGE = 60 * 60 * 24 * 365 // 1 year, in seconds

const regionMapCache = {
    regionMap: new Map<string, StoreRegion>(),
    regionMapUpdated: Date.now(),
}

async function getRegionMap(cacheId: string) {
    if (!BACKEND_URL) {
        throw new Error(
            "proxy.ts: Error fetching regions. Did you set up regions in your Medusa Admin and define a NEXT_PUBLIC_MEDUSA_BACKEND_URL environment variable?"
        )
    }

    const isStale = regionMapCache.regionMap.size === 0 || regionMapCache.regionMapUpdated < Date.now() - REGION_CACHE_TTL_MS

    if (!isStale) {
        return regionMapCache.regionMap
    }

    // Plain fetch keeps this proxy light. Next.js 16 runs proxy.ts on the
    // Node.js runtime by default, so the Medusa JS client would work here
    // too now, but there's no need to pull it in just to hit one endpoint.
    const response = await fetch(`${BACKEND_URL}/store/regions`, {
        method: "GET",
        headers: {
            "x-publishable-api-key": PUBLISHABLE_API_KEY ?? "",
        },
        next: {
            revalidate: REGION_CACHE_TTL_MS / 1000,
            tags: [`regions-${cacheId}`],
        },
        cache: "force-cache",
    })

    if (!response.ok) {
        throw new Error(`Backend returned ${response.status}`)
    }

    const { regions } = (await response.json()) as { regions: StoreRegion[] }

    if (!regions?.length) {
        return regionMapCache.regionMap
    }

    const nextRegionMap = new Map<string, StoreRegion>()
    regions.forEach((region) => {
        region.countries?.forEach((c) => {
            if (c.iso_2) {
                nextRegionMap.set(c.iso_2, region)
            }
        })
    })

    regionMapCache.regionMap = nextRegionMap
    regionMapCache.regionMapUpdated = Date.now()

    return regionMapCache.regionMap
}

/**
 * Resolves the visitor's country code, in priority order:
 * 1. An existing `__country_code` cookie (so a manual region switch sticks)
 * 2. Geo headers from the hosting platform (Vercel / Cloudflare)
 * 3. The configured default region, or the first region available
 */
function getCountryCode(request: NextRequest, regionMap: Map<string, StoreRegion>): string {
    const cookieCountryCode = request.cookies.get(COUNTRY_CODE_COOKIE)?.value?.toLowerCase()

    const cloudflareCountryCode = (request as { cf?: { country?: string } }).cf?.country?.toLowerCase()

    const vercelCountryCode = request.headers.get("x-vercel-ip-country")?.toLowerCase()

    if (cookieCountryCode && regionMap.has(cookieCountryCode)) {
        return cookieCountryCode
    }
    if (cloudflareCountryCode && regionMap.has(cloudflareCountryCode)) {
        return cloudflareCountryCode
    }
    if (vercelCountryCode && regionMap.has(vercelCountryCode)) {
        return vercelCountryCode
    }
    if (regionMap.has(DEFAULT_REGION)) {
        return DEFAULT_REGION
    }

    return regionMap.keys().next().value ?? DEFAULT_REGION
}

async function retrieveCustomer(token: string | undefined) {
    const response = await fetch(`${BACKEND_URL}/store/customers/me`, {
        method: "GET",
        headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            "x-publishable-api-key": PUBLISHABLE_API_KEY ?? "",
        },
    })

    return response
}

/**
 * Handle authentication routes
 */
async function handleAuthRoutes(request: NextRequest, pathname: string): Promise<NextResponse | null> {
    // Protected routes - require authentication
    const token = request.cookies.get("_medusa_jwt")?.value

    if (pathname.startsWith("/account")) {
        console.log("/account")
        try {
            const customer = await retrieveCustomer(token);
            console.log(customer)
            if (customer.status != 200) {
                const url = new URL("/auth", request.url);
                url.searchParams.set("redirect", pathname);
                return NextResponse.redirect(url);
            }
        } catch (error) {
            console.error("Error retrieving customer:", error);
            return NextResponse.redirect(new URL("/auth", request.url));
        }
        return null; // Continue to next middleware logic
    }

    // Auth page - redirect if already logged in
    if (pathname.startsWith("/auth")) {
        console.log("/auth")
        try {
            const customer = await retrieveCustomer(token);
            console.log(customer)
            if (customer.status === 200) {
                const redirectParam = request.nextUrl.searchParams.get("redirect");
                const redirectUrl = redirectParam && redirectParam.startsWith("/") ? redirectParam : "/account/profile";
                return NextResponse.redirect(new URL(redirectUrl, request.url));
            }
        } catch (error) {
            console.error("Error checking auth status:", error);
            // Allow access to auth page on error
        }
        return NextResponse.next();
    }

    return null;
}

export async function proxy(request: NextRequest) {
    // Belt-and-suspenders: catches any static-file extension not already
    // excluded by the matcher below.
    if (request.nextUrl.pathname.includes(".")) {
        return NextResponse.next()
    }

    const { pathname } = request.nextUrl;
    // Handle authentication routes
    const authResponse = await handleAuthRoutes(request, pathname);
    if (authResponse) {
        return authResponse;
    }

    const cacheIdCookie = request.cookies.get(CACHE_ID_COOKIE)
    const cacheId = cacheIdCookie?.value || crypto.randomUUID()

    let countryCode = DEFAULT_REGION

    try {
        const regionMap = await getRegionMap(cacheId)
        countryCode = getCountryCode(request, regionMap)
    } catch (error) {
        // Don't let a Medusa hiccup 500 every single page - fall back to the
        // default region and let individual data calls surface their own errors.
        console.error("[proxy] Failed to resolve region:", error)
    }

    const requestHeaders = new Headers(request.headers)
    requestHeaders.set(COUNTRY_CODE_HEADER, countryCode)

    const response = NextResponse.next({
        request: { headers: requestHeaders },
    })

    if (!cacheIdCookie) {
        response.cookies.set(CACHE_ID_COOKIE, cacheId, {
            maxAge: CACHE_ID_MAX_AGE,
            path: "/",
        })
    }

    if (request.cookies.get(COUNTRY_CODE_COOKIE)?.value !== countryCode) {
        response.cookies.set(COUNTRY_CODE_COOKIE, countryCode, {
            maxAge: COUNTRY_CODE_MAX_AGE,
            path: "/",
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
        })
    }

    return response
}

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:ico|png|jpg|jpeg|gif|webp|svg|css|js)$).*)",
    ],
}