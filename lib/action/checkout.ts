"use server"

import { HttpTypes, StoreInitializePaymentSession } from "@medusajs/types"
import { redirect } from "next/navigation"
import { sdk } from "@/lib/sdk"
import medusaError from "@/lib/util/medusa-error"
import {
  getAuthHeaders,
  getCacheOptions,
  getCartId,
  removeCartId,
  updateCacheTags,
} from "./cookies"

// ────────────────────────────────────────────────────────────────────────────
// Cart
// ────────────────────────────────────────────────────────────────────────────

const CART_FIELDS =
  "*items, *region, *items.product, *items.variant, *items.thumbnail, *items.metadata, +items.total, *promotions, +shipping_methods.name"

export async function getCheckCart() {
  const cartId = await getCartId()
  if (!cartId) return null

  const headers = { ...(await getAuthHeaders()) }
  const next = { ...(await getCacheOptions("carts")) }

  return sdk.client
    .fetch<HttpTypes.StoreCartResponse>(`/store/carts/${cartId}`, {
      method: "GET",
      query: { fields: CART_FIELDS },
      headers,
      next,
      cache: "force-cache",
    })
    .then(({ cart }) => cart)
    .catch(() => null)
}

// ────────────────────────────────────────────────────────────────────────────
// Customer
// ────────────────────────────────────────────────────────────────────────────

export async function getCheckCustomer() {
  const headers = { ...(await getAuthHeaders()) }
  const next = { ...(await getCacheOptions("customers")) }

  return sdk.client
    .fetch<HttpTypes.StoreCustomerResponse>(`/store/customers/me`, {
      method: "GET",
      query: {
        fields: "*orders",
      },
      headers,
      next,
      cache: "force-cache",
    })
    .then(({ customer }) => customer)
    .catch(() => null)
}

// ────────────────────────────────────────────────────────────────────────────
// Shipping Methods
// ────────────────────────────────────────────────────────────────────────────

export async function getCheckShippingMethods(cartId: string) {
  const headers = { ...(await getAuthHeaders()) }
  const next = { ...(await getCacheOptions("fulfillment")) }

  return sdk.client
    .fetch<HttpTypes.StoreShippingOptionListResponse>(
      `/store/shipping-options`,
      {
        method: "GET",
        query: { cart_id: cartId },
        headers,
        next,
        cache: "force-cache",
      },
    )
    .then(({ shipping_options }) => shipping_options)
    .catch(() => null)
}

// ────────────────────────────────────────────────────────────────────────────
// Payment Methods
// ────────────────────────────────────────────────────────────────────────────

export async function getCheckPaymentMethods(regionId: string) {
  const headers = { ...(await getAuthHeaders()) }
  const next = { ...(await getCacheOptions("payment_providers")) }

  return sdk.client
    .fetch<HttpTypes.StorePaymentProviderListResponse>(
      `/store/payment-providers`,
      {
        method: "GET",
        query: { region_id: regionId },
        headers,
        next,
        cache: "force-cache",
      },
    )
    .then(({ payment_providers }) =>
      payment_providers.sort((a, b) => (a.id > b.id ? 1 : -1)),
    )
    .catch(() => null)
}

// ────────────────────────────────────────────────────────────────────────────
// Set Addresses (returns result, no redirect)
// ────────────────────────────────────────────────────────────────────────────

export async function setCheckAddresses(
  _currentState: unknown,
  formData: FormData,
) {
  try {
    if (!formData) {
      throw new Error("No form data found when setting addresses")
    }
    const cartId = await getCartId()
    if (!cartId) {
      throw new Error("No existing cart found when setting addresses")
    }

    const headers = { ...(await getAuthHeaders()) }

    const data = {
      shipping_address: {
        first_name: formData.get("shipping_address.first_name"),
        last_name: formData.get("shipping_address.last_name"),
        address_1: formData.get("shipping_address.address_1"),
        address_2: formData.get("shipping_address.address_2") || "",
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
    if (sameAsBilling === "on") {
      data.billing_address = data.shipping_address
    } else {
      data.billing_address = {
        first_name: formData.get("billing_address.first_name"),
        last_name: formData.get("billing_address.last_name"),
        address_1: formData.get("billing_address.address_1"),
        address_2: formData.get("billing_address.address_2") || "",
        company: formData.get("billing_address.company"),
        postal_code: formData.get("billing_address.postal_code"),
        city: formData.get("billing_address.city"),
        country_code: formData.get("billing_address.country_code"),
        province: formData.get("billing_address.province"),
        phone: formData.get("billing_address.phone"),
      }
    }

    await sdk.store.cart.update(cartId, data, {}, headers)
    await updateCacheTags("carts", "fulfillment")

    return { success: true, error: null }
  } catch (e: any) {
    return { success: false, error: e.message }
  }
}

// ────────────────────────────────────────────────────────────────────────────
// Set Shipping Method
// ────────────────────────────────────────────────────────────────────────────

export async function setCheckShipping(cartId: string, optionId: string) {
  const headers = { ...(await getAuthHeaders()) }

  try {
    await sdk.store.cart.addShippingMethod(
      cartId,
      { option_id: optionId },
      {},
      headers,
    )
    await updateCacheTags("carts")
    return { success: true, error: null }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

// ────────────────────────────────────────────────────────────────────────────
// Initiate Payment Session
// ────────────────────────────────────────────────────────────────────────────

export async function initCheckPayment(cartId: string, providerId: string, collectionId?: string, extraData?: Record<string, unknown>,) {
  const headers = { ...(await getAuthHeaders()) }

  if (!collectionId) {
    collectionId = (
      await sdk.client.fetch<HttpTypes.StorePaymentCollectionResponse>(
        `/store/payment-collections`,
        {
          method: "POST",
          headers,
          body: { cart_id: cartId },
        },
      )
    ).payment_collection.id
  }

  return sdk.client
    .fetch<HttpTypes.StorePaymentCollectionResponse>(
      `/store/payment-collections/${collectionId}/payment-sessions`,
      {
        method: "POST",
        headers,
        body: {
          provider_id: providerId,
          data: {
            payment_description: "Leather Goods",
            ...extraData,
          },
        } satisfies StoreInitializePaymentSession,
      },
    )
    .then(async (resp) => {
      await updateCacheTags("carts", "fulfillment")
      return resp
    })
    .catch(medusaError)
}

// ────────────────────────────────────────────────────────────────────────────
// Discount / Promo Codes (additive apply, individual remove)
// ────────────────────────────────────────────────────────────────────────────

export async function applyDiscount(code: string) {
  const cartId = await getCartId()
  if (!cartId) throw new Error("No existing cart found")

  const headers = { ...(await getAuthHeaders()) }

  await sdk.store.cart.update(cartId, { promo_codes: [code] }, {}, headers)
  await updateCacheTags("carts", "fulfillment")

  return { success: true }
}

export async function removeDiscount(code: string) {
  const cartId = await getCartId()
  if (!cartId) throw new Error("No existing cart found")

  const headers = { ...(await getAuthHeaders()) }

  await sdk.store.cart.update(cartId, { promo_codes: [] }, {}, headers,)
  await updateCacheTags("carts", "fulfillment")

  return { success: true }
}

// ────────────────────────────────────────────────────────────────────────────
// Place Order
// ────────────────────────────────────────────────────────────────────────────
/**
 * Places an order for a cart. If no cart ID is provided, it will use the cart ID from the cookies.
 * @param cartId - optional - The ID of the cart to place an order for.
 * @returns The cart object if the order was successful, or null if not.
 */

export async function placeCheckOrder(cartId?: string) {
  const id = cartId || (await getCartId())
  if (!id) throw new Error("No existing cart found when placing an order")

  const headers = { ...(await getAuthHeaders()) }

  const cartRes = await sdk.store.cart
    .complete(id, {}, headers)
    .then(async (res) => {
      await updateCacheTags("carts")
      return res
    })
    .catch(medusaError)

  if (cartRes?.type === "order") {
    await updateCacheTags("orders")
    await removeCartId()
    redirect(`/order/${cartRes.order.id}/confirmed`)
  }

  return cartRes.cart
}

// ────────────────────────────────────────────────────────────────────────────
// PayPal api
// ────────────────────────────────────────────────────────────────────────────

export async function createToken() {
  return await sdk.client.fetch<{ client_token: string }>(`/store/paypal/client-token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
}

export async function createOrder(cartId?: string, isCardPayment = false) {
  return await sdk.client.fetch<{ id: string }>(`/store/paypal/create-order`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: { cart_id: cartId, is_card_payment: isCardPayment },
  })
}

export async function captureOrder(cartId: string, orderId: string) {
  return await sdk.client.fetch<Record<string, unknown>>(`/store/paypal/capture-order`, {
    method: "POST",
    headers: {
      ...(await getAuthHeaders()),
      "Content-Type": "application/json",
    },
    body: {
      cart_id: cartId,
      order_id: orderId
    },
  })

}

export async function markPaymentComplete(cartId: string): Promise<{ ok: boolean } & Record<string, any>> {
  try {
    const resp = await sdk.client.fetch(`/store/paypal-complete`, {
      method: "POST",
      headers: {
        ...(await getAuthHeaders()),
        "Content-Type": "application/json",
      },
      body: { cart_id: cartId },
    })

    console.log(resp)

    console.warn("[PayPal] paypal-complete returned", resp)
    return { ok: true, ...(resp || {}) }
  } catch (e) {
    console.warn("[PayPal] paypal-complete call failed:", e)
    return { ok: false }
  }
}

// { success: boolean, cart_id: string, order_id?: string, request_id?: string, message?: string }