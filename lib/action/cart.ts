"use server"

import { HttpTypes, SelectParams, StoreInitializePaymentSession } from "@medusajs/types"
import { redirect } from "next/navigation"
import { sdk } from "@/lib/sdk"
import medusaError from "@/lib/util/medusa-error"
import { getAuthHeaders, getCacheOptions, getCartId, setCartId, setCountryCode, updateCacheTags, } from "./cookies"
import { getLocale } from "./locale"
import { getRegion } from "./regions"
import { CART_FIELDS } from "../constant"

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
        const { cart } = await sdk.store.cart.create(
            { region_id: region.id, locale: locale || undefined },
            {},
            headers,
        )
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

export async function setShippingMethod({
    cartId,
    shippingMethodId,
}: {
    cartId: string
    shippingMethodId: string
}) {
    const headers = {
        ...(await getAuthHeaders()),
    }

    try {
        await sdk.store.cart.addShippingMethod(
            cartId,
            { option_id: shippingMethodId },
            {},
            headers,
        );

        await updateCacheTags("carts")

        return { success: true };
    } catch (err) {
        medusaError(err);
    }
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
        .fetch<HttpTypes.StorePaymentCollectionResponse>(
            `/store/payment-collections/${collectionId}/payment-sessions`,
            { method: "POST", headers, body, query },
        )
        .then(async (resp) => {
            await updateCacheTags("carts")
            return resp
        })
        .catch(medusaError)
}

/** Replaces the cart's promo codes with `codes` (Medusa treats the list as the full set). */
export async function applyPromotions(codes: string[]) {
    const cartId = await requireCartId("No existing cart found")
    const headers = await authHeaders()

    return sdk.store.cart
        .update(cartId, { promo_codes: codes }, {}, headers)
        .then(() => updateCacheTags("carts", "fulfillment"))
        .catch(medusaError)
}

export async function applyGiftCard(code: string) {
    //   const cartId = getCartId()
    //   if (!cartId) return "No cartId cookie found"
    //   try {
    //     await updateCart(cartId, { gift_cards: [{ code }] }).then(() => {
    //       revalidateTag("cart")
    //     })
    //   } catch (error: any) {
    //     throw error
    //   }
}

export async function removeDiscount(code: string) {
    // const cartId = getCartId()
    // if (!cartId) return "No cartId cookie found"
    // try {
    //   await deleteDiscount(cartId, code)
    //   revalidateTag("cart")
    // } catch (error: any) {
    //   throw error
    // }
}

export async function removeGiftCard(
    codeToRemove: string,
    giftCards: any[]
    // giftCards: GiftCard[]
) {
    //   const cartId = getCartId()
    //   if (!cartId) return "No cartId cookie found"
    //   try {
    //     await updateCart(cartId, {
    //       gift_cards: [...giftCards]
    //         .filter((gc) => gc.code !== codeToRemove)
    //         .map((gc) => ({ code: gc.code })),
    //     }).then(() => {
    //       revalidateTag("cart")
    //     })
    //   } catch (error: any) {
    //     throw error
    //   }
}

/** Form-action wrapper. Returns an error message, or null on success. */
export async function submitPromotionForm(_currentState: unknown, formData: FormData) {
    const code = formData.get("code")
    if (typeof code !== "string" || !code.trim()) return "Enter a promo code."

    try {
        await applyPromotions([code.trim()])
        return null
    } catch (e) {
        return e instanceof Error ? e.message : "That code couldn't be applied."
    }
}

// TODO: Pass a POJO instead of a form entity here
export async function setAddresses(currentState: unknown, formData: FormData) {
    try {
        if (!formData) {
            throw new Error("No form data found when setting addresses")
        }
        const cartId = await getCartId()
        if (!cartId) {
            throw new Error("No existing cart found when setting addresses")
        }

        const data = {
            shipping_address: {
                first_name: formData.get("shipping_address.first_name"),
                last_name: formData.get("shipping_address.last_name"),
                address_1: formData.get("shipping_address.address_1"),
                address_2: "",
                company: formData.get("shipping_address.company"),
                postal_code: formData.get("shipping_address.postal_code"),
                city: formData.get("shipping_address.city"),
                country_code: formData.get("shipping_address.country_code"),
                province: formData.get("shipping_address.province"),
                phone: formData.get("shipping_address.phone"),
            },
            email: formData.get("email"),
        } as any

        const sameAsBilling = formData.get("same_as_billing")
        if (sameAsBilling === "on") data.billing_address = data.shipping_address

        if (sameAsBilling !== "on")
            data.billing_address = {
                first_name: formData.get("billing_address.first_name"),
                last_name: formData.get("billing_address.last_name"),
                address_1: formData.get("billing_address.address_1"),
                address_2: "",
                company: formData.get("billing_address.company"),
                postal_code: formData.get("billing_address.postal_code"),
                city: formData.get("billing_address.city"),
                country_code: formData.get("billing_address.country_code"),
                province: formData.get("billing_address.province"),
                phone: formData.get("billing_address.phone"),
            }
        await updateCart(data)
    } catch (e: any) {
        return e.message
    }

    redirect(
        `/checkout?step=delivery`
    )
}

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

const authHeaders = async () => ({ ...(await getAuthHeaders()) })

async function requireCartId(message: string) {
    const cartId = await getCartId()
    if (!cartId) throw new Error(message)
    return cartId
}