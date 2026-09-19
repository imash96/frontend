"use server"

import { sdk } from "@/lib/sdk"
import medusaError from "@/lib/util/medusa-error"
import { HttpTypes, StoreInitializePaymentSession } from "@medusajs/types"
import { redirect } from "next/navigation"
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

export async function initCheckPayment(
  cartId: string,
  providerId: string,
  collectionId?: string,
) {
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
          data: { payment_description: "Leather Goods" },
        } satisfies StoreInitializePaymentSession,
      },
    )
    .then(async (resp) => {
      await updateCacheTags("carts", "fulfillments")
      return resp
    })
    .catch(medusaError)
}

// ────────────────────────────────────────────────────────────────────────────
// Discount / Promo Codes (additive apply, individual remove)
// ────────────────────────────────────────────────────────────────────────────

export async function applyCheckDiscount(code: string) {
  const cartId = await getCartId()
  if (!cartId) throw new Error("No existing cart found")

  const headers = { ...(await getAuthHeaders()) }

  // Fetch current promo codes from cart
  const { cart } = await sdk.client.fetch<HttpTypes.StoreCartResponse>(
    `/store/carts/${cartId}`,
    {
      method: "GET",
      query: { fields: "+promotions.code" },
      headers,
    },
  )

  const existingCodes: string[] =
    cart.promotions?.map((p: any) => p.code).filter(Boolean) ?? []

  // Additive: keep existing + add new
  const allCodes = [...new Set([...existingCodes, code])]

  await sdk.store.cart.update(cartId, { promo_codes: allCodes }, {}, headers)
  await updateCacheTags("carts", "fulfillment")

  return { success: true }
}

export async function removeCheckDiscount(code: string) {
  const cartId = await getCartId()
  if (!cartId) throw new Error("No existing cart found")

  const headers = { ...(await getAuthHeaders()) }

  // Fetch current promo codes from cart
  const { cart } = await sdk.client.fetch<HttpTypes.StoreCartResponse>(
    `/store/carts/${cartId}`,
    {
      method: "GET",
      query: { fields: "+promotions.code" },
      headers,
    },
  )

  const existingCodes: string[] =
    cart.promotions?.map((p: any) => p.code).filter(Boolean) ?? []

  // Remove the target code
  const remaining = existingCodes.filter(
    (c) => c.toLowerCase() !== code.toLowerCase(),
  )

  await sdk.store.cart.update(
    cartId,
    { promo_codes: remaining },
    {},
    headers,
  )
  await updateCacheTags("carts", "fulfillment")

  return { success: true }
}

// ────────────────────────────────────────────────────────────────────────────
// Place Order
// ────────────────────────────────────────────────────────────────────────────

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
