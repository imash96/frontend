"use server"

import type { HttpTypes, SelectParams, StoreInitializePaymentSession } from "@medusajs/types"
import { CART_FIELDS } from "@/lib/constant"
import { sdk } from "@/lib/sdk"
import medusaError from "@/lib/util/medusa-error"
import { getAuthHeaders, getCacheOptions, getCartId, setCartId, setCountryCode, updateCacheTags } from "./cookies"
import { getLocale } from "./locale"
import { getRegion } from "./regions"

type Result = { success: boolean; error: string | null }

const authHeaders = async () => ({ ...(await getAuthHeaders()) })

async function requireCartId(message: string) {
    const cartId = await getCartId()
    if (!cartId) throw new Error(message)
    return cartId
}

/**
 * Retrieves a cart by ID, falling back to the cart ID cookie.
 * Returns null when there is no cart or the request fails.
 */
export async function retrieveCart(cartId?: string, fields: string = CART_FIELDS) {
    const id = cartId || (await getCartId())
    if (!id) return null

    const [headers, cacheOptions] = await Promise.all([authHeaders(), getCacheOptions("carts")])

    return sdk.client
        .fetch<HttpTypes.StoreCartResponse>(`/store/carts/${id}`, {
            method: "GET",
            query: { fields },
            headers,
            next: { ...cacheOptions },
            cache: "force-cache",
        })
        .then(({ cart }) => cart)
        .catch(() => null)
}

export async function getOrSetCart(countryCode: string) {
    const [region, existing, headers] = await Promise.all([
        getRegion(countryCode),
        retrieveCart(undefined, "id,region_id"),
        authHeaders(),
    ])

    if (!region) throw new Error(`Region not found for country code: ${countryCode}`)

    if (!existing) {
        const locale = await getLocale()
        const { cart } = await sdk.store.cart.create({ region_id: region.id, locale: locale || undefined }, {}, headers)
        await setCartId(cart.id)
        await updateCacheTags("carts")
        return cart
    }

    if (existing.region_id !== region.id) {
        await sdk.store.cart.update(existing.id, { region_id: region.id }, {}, headers)
        await updateCacheTags("carts")
    }

    return existing
}

export async function updateCart(data: HttpTypes.StoreUpdateCart) {
    const cartId = await requireCartId("No existing cart found, please create one before updating")
    const headers = await authHeaders()

    return sdk.store.cart
        .update(cartId, data, {}, headers)
        .then(async ({ cart }) => {
            await updateCacheTags("carts", "fulfillment")
            return cart
        })
        .catch(medusaError)
}

export async function addToCart({
    variantId,
    quantity,
    countryCode,
}: {
    variantId: string
    quantity: number
    countryCode: string
}) {
    if (!variantId) throw new Error("Missing variant ID when adding to cart")

    const cart = await getOrSetCart(countryCode)
    const headers = await authHeaders()

    await sdk.store.cart
        .createLineItem(cart.id, { variant_id: variantId, quantity }, {}, headers)
        .then(() => updateCacheTags("carts", "fulfillment"))
        .catch(medusaError)
}

export async function updateLineItem({ lineId, quantity }: { lineId: string; quantity: number }) {
    if (!lineId) throw new Error("Missing lineItem ID when updating line item")

    const cartId = await requireCartId("Missing cart ID when updating line item")
    const headers = await authHeaders()

    await sdk.store.cart
        .updateLineItem(cartId, lineId, { quantity }, {}, headers)
        .then(() => updateCacheTags("carts", "fulfillment"))
        .catch(medusaError)
}

export async function deleteLineItem(lineId: string) {
    if (!lineId) throw new Error("Missing lineItem ID when deleting line item")

    const cartId = await requireCartId("Missing cart ID when deleting line item")
    const headers = await authHeaders()

    await sdk.store.cart
        .deleteLineItem(cartId, lineId, {}, headers)
        .then(() => updateCacheTags("carts", "fulfillment"))
        .catch(medusaError)
}

export async function initiatePaymentSession(
    cartId: string,
    body: StoreInitializePaymentSession,
    collectionId?: string,
    query?: SelectParams,
) {
    const headers = await authHeaders()

    if (!collectionId) {
        const { payment_collection } = await sdk.client.fetch<HttpTypes.StorePaymentCollectionResponse>(
            `/store/payment-collections`,
            { method: "POST", headers, body: { cart_id: cartId } },
        )
        collectionId = payment_collection.id
    }

    return sdk.client
        .fetch<HttpTypes.StorePaymentCollectionResponse>(`/store/payment-collections/${collectionId}/payment-sessions`, {
            method: "POST",
            headers,
            body,
            query,
        })
        .then(async (resp) => {
            await updateCacheTags("carts")
            return resp
        })
        .catch(medusaError)
}

// ─── Promo codes ────────────────────────────────────────────────────────────
// Medusa replaces the cart's whole promo list on update, so adding sends the existing codes plus
// the new one, and removing sends the rest. (Sending only [code] silently dropped every promotion
// already applied, and removing cleared them all.)

function failure(e: unknown, fallback: string): Result {
    return { success: false, error: e instanceof Error && e.message ? e.message : fallback }
}

export async function applyPromoCode(code: string): Promise<Result> {
    const normalized = code.trim()
    if (!normalized) return { success: false, error: "Enter a promo code." }

    try {
        const cartId = await requireCartId("No existing cart found")
        // More than one promo code not allowed.
        await sdk.store.cart.update(cartId, { promo_codes: [normalized] }, {}, await authHeaders())
        await updateCacheTags("carts", "fulfillment")
        return { success: true, error: null }
    } catch (e) {
        return failure(e, "That code couldn't be applied.")
    }
}

/** Removes one code, or every code when none is given. */
export async function removePromoCode(): Promise<Result> {
    try {
        const cartId = await requireCartId("No existing cart found")

        await sdk.store.cart.update(cartId, { promo_codes: [] }, {}, await authHeaders())
        await updateCacheTags("carts", "fulfillment")
        return { success: true, error: null }
    } catch (e) {
        return failure(e, "We couldn't remove that code.")
    }
}

/** Form-action wrapper for the promo input. Returns an error message, or null on success. */
export async function submitPromotionForm(_currentState: unknown, formData: FormData) {
    const code = formData.get("code")
    if (typeof code !== "string") return "Enter a promo code."
    const result = await applyPromoCode(code)
    return result.success ? null : result.error
}

// ─── Region & misc ──────────────────────────────────────────────────────────

/** Updates the country and revalidates region-dependent caches. */
export async function updateRegion(countryCode: string) {
    const [cartId, region] = await Promise.all([getCartId(), getRegion(countryCode)])

    if (!region) throw new Error(`Region not found for country code: ${countryCode}`)

    if (cartId) await updateCart({ region_id: region.id }) // already revalidates carts + fulfillment

    await updateCacheTags("regions", "products")
    await setCountryCode(countryCode)
}

export async function listCartOptions() {
    const [cartId, headers, cacheOptions] = await Promise.all([
        getCartId(),
        authHeaders(),
        getCacheOptions("shippingOptions"),
    ])

    return sdk.client
        .fetch<{ shipping_options: HttpTypes.StoreCartShippingOption[] }>("/store/shipping-options", {
            query: { cart_id: cartId },
            next: { ...cacheOptions },
            headers,
            cache: "force-cache",
        })
        .catch(() => null)
}

export async function fetchCartItemCount() {
    // Only items are needed; skip the heavy default field set.
    const cart = await retrieveCart(undefined, "id,*items")
    return cart?.items?.reduce((total, item) => total + item.quantity, 0) ?? 0
}