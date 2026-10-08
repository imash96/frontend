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
// Helpers
// ────────────────────────────────────────────────────────────────────────────

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function cleanString(value: FormDataEntryValue | null | undefined, maxLen = 255): string {
  if (typeof value !== "string") return ""
  return value.trim().slice(0, maxLen)
}

async function resolveVerifiedCartId(passedCartId?: string): Promise<string | null> {
  const cookieCartId = await getCartId()
  if (cookieCartId) {
    // If both exist and don't match, always trust the server-side httpOnly cookie
    return cookieCartId
  }
  return passedCartId ? passedCartId.trim() : null
}

// ────────────────────────────────────────────────────────────────────────────
// Cart
// ────────────────────────────────────────────────────────────────────────────

const CART_FIELDS =
  "*items, *region, *items.product, *items.variant, *items.thumbnail, *items.metadata, +items.total, *promotions, *shipping_address, *billing_address, *shipping_methods, +shipping_methods.name, *payment_collection, *payment_collection.payment_sessions"

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
        fields: "*addresses,*orders",
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
  const verifiedCartId = (await resolveVerifiedCartId(cartId)) || cartId
  if (!verifiedCartId) return null

  const headers = { ...(await getAuthHeaders()) }
  const next = { ...(await getCacheOptions("fulfillment")) }

  return sdk.client
    .fetch<HttpTypes.StoreShippingOptionListResponse>(
      `/store/shipping-options`,
      {
        method: "GET",
        query: { cart_id: verifiedCartId },
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
  if (!regionId) return null
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

    const email = cleanString(formData.get("email"), 254).toLowerCase()
    if (!email || !EMAIL_REGEX.test(email)) {
      throw new Error("Please enter a valid email address.")
    }

    const shippingAddress = {
      first_name: cleanString(formData.get("shipping_address.first_name"), 100),
      last_name: cleanString(formData.get("shipping_address.last_name"), 100),
      address_1: cleanString(formData.get("shipping_address.address_1"), 255),
      address_2: cleanString(formData.get("shipping_address.address_2"), 255),
      company: cleanString(formData.get("shipping_address.company"), 150),
      postal_code: cleanString(formData.get("shipping_address.postal_code"), 32),
      city: cleanString(formData.get("shipping_address.city"), 120),
      country_code: cleanString(formData.get("shipping_address.country_code"), 4).toLowerCase(),
      province: cleanString(formData.get("shipping_address.province"), 120),
      phone: cleanString(formData.get("shipping_address.phone"), 40),
    }

    if (
      !shippingAddress.first_name ||
      !shippingAddress.last_name ||
      !shippingAddress.address_1 ||
      !shippingAddress.city ||
      !shippingAddress.postal_code ||
      !shippingAddress.country_code ||
      !shippingAddress.phone
    ) {
      throw new Error("Please fill in all required shipping address fields.")
    }

    const sameAsBilling = formData.get("same_as_billing")
    let billingAddress = shippingAddress

    if (sameAsBilling !== "on") {
      billingAddress = {
        first_name: cleanString(formData.get("billing_address.first_name"), 100),
        last_name: cleanString(formData.get("billing_address.last_name"), 100),
        address_1: cleanString(formData.get("billing_address.address_1"), 255),
        address_2: cleanString(formData.get("billing_address.address_2"), 255),
        company: cleanString(formData.get("billing_address.company"), 150),
        postal_code: cleanString(formData.get("billing_address.postal_code"), 32),
        city: cleanString(formData.get("billing_address.city"), 120),
        country_code: cleanString(formData.get("billing_address.country_code"), 4).toLowerCase(),
        province: cleanString(formData.get("billing_address.province"), 120),
        phone: cleanString(formData.get("billing_address.phone"), 40) || shippingAddress.phone,
      }

      if (
        !billingAddress.first_name ||
        !billingAddress.last_name ||
        !billingAddress.address_1 ||
        !billingAddress.city ||
        !billingAddress.postal_code ||
        !billingAddress.country_code
      ) {
        throw new Error("Please fill in all required billing address fields.")
      }
    }

    const headers = { ...(await getAuthHeaders()) }

    const data: HttpTypes.StoreUpdateCart = {
      shipping_address: shippingAddress,
      billing_address: billingAddress,
      email,
    }

    await sdk.store.cart.update(cartId, data, {}, headers)
    await updateCacheTags("carts", "fulfillment")

    return { success: true, error: null }
  } catch (e: any) {
    return { success: false, error: e?.message || "Failed to save addresses" }
  }
}

// ────────────────────────────────────────────────────────────────────────────
// Set Shipping Method
// ────────────────────────────────────────────────────────────────────────────

export async function setCheckShipping(cartId: string, optionId: string) {
  const verifiedCartId = await resolveVerifiedCartId(cartId)
  if (!verifiedCartId || !optionId) {
    return { success: false, error: "Missing cart or shipping option." }
  }

  const headers = { ...(await getAuthHeaders()) }

  try {
    await sdk.store.cart.addShippingMethod(
      verifiedCartId,
      { option_id: optionId },
      {},
      headers,
    )
    await updateCacheTags("carts")
    return { success: true, error: null }
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to set shipping method" }
  }
}

// ────────────────────────────────────────────────────────────────────────────
// Initiate Payment Session
// ────────────────────────────────────────────────────────────────────────────

export async function initCheckPayment(
  cartId: string,
  providerId: string,
  collectionId?: string,
  extraData?: Record<string, unknown>,
) {
  const verifiedCartId = await resolveVerifiedCartId(cartId)
  if (!verifiedCartId) {
    throw new Error("No active cart found to initialize payment.")
  }

  const headers = { ...(await getAuthHeaders()) }

  if (!collectionId) {
    // Check if cart already has a payment_collection before creating one
    const currentCart = await getCheckCart()
    collectionId = currentCart?.payment_collection?.id

    if (!collectionId) {
      collectionId = (
        await sdk.client.fetch<HttpTypes.StorePaymentCollectionResponse>(
          `/store/payment-collections`,
          {
            method: "POST",
            headers,
            body: { cart_id: verifiedCartId },
          },
        )
      ).payment_collection.id
    }
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
            payment_description: "Velle Hide Handcrafted Leather Goods",
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

export async function applyCheckDiscount(code: string) {
  const cleanCode = code.trim()
  if (!cleanCode) throw new Error("Please enter a promo code")

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
  const allCodes = [...new Set([...existingCodes, cleanCode])]

  await sdk.store.cart.update(cartId, { promo_codes: allCodes }, {}, headers)
  await updateCacheTags("carts", "fulfillment")

  return { success: true }
}

export async function removeCheckDiscount(code: string) {
  const cleanCode = code.trim()
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
    (c) => c.toLowerCase() !== cleanCode.toLowerCase(),
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
  const id = await resolveVerifiedCartId(cartId)
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

  const errMsg =
    (cartRes as any)?.error?.message ||
    (cartRes as any)?.error ||
    "Order could not be completed. Please verify your payment details and try again."
  throw new Error(typeof errMsg === "string" ? errMsg : "Order completion failed.")
}

// ────────────────────────────────────────────────────────────────────────────
// PayPal API
// ────────────────────────────────────────────────────────────────────────────

export async function createToken() {
  return await sdk.client.fetch<{ client_token: string }>(`/store/paypal/client-token`, {
    method: "POST",
    headers: {
      ...(await getAuthHeaders()),
      "Content-Type": "application/json",
    },
  })
}

export async function createOrder(cartId?: string, isCardPayment = false) {
  const verifiedCartId = await resolveVerifiedCartId(cartId)
  if (!verifiedCartId) {
    throw new Error("No active cart found for PayPal order creation.")
  }

  return await sdk.client.fetch<{ id: string }>(`/store/paypal/create-order`, {
    method: "POST",
    headers: {
      ...(await getAuthHeaders()),
      "Content-Type": "application/json",
    },
    body: { cart_id: verifiedCartId, is_card_payment: isCardPayment },
  })
}

export async function captureOrder(cartId: string, orderId: string) {
  const verifiedCartId = await resolveVerifiedCartId(cartId)
  if (!verifiedCartId || !orderId) {
    throw new Error("Missing cart ID or PayPal order ID for capture.")
  }

  return await sdk.client.fetch<Record<string, unknown>>(`/store/paypal/capture-order`, {
    method: "POST",
    headers: {
      ...(await getAuthHeaders()),
      "Content-Type": "application/json",
    },
    body: {
      cart_id: verifiedCartId,
      order_id: orderId,
    },
  })
}

export async function markPaymentComplete(cartId: string): Promise<{ ok: boolean } & Record<string, any>> {
  const verifiedCartId = await resolveVerifiedCartId(cartId)
  if (!verifiedCartId) return { ok: false }

  try {
    const resp = await sdk.client.fetch<Record<string, any>>(`/store/paypal-complete`, {
      method: "POST",
      headers: {
        ...(await getAuthHeaders()),
        "Content-Type": "application/json",
      },
      body: { cart_id: verifiedCartId },
    })

    await updateCacheTags("carts")
    return { ok: true, ...(resp || {}) }
  } catch (e) {
    console.warn("[PayPal] paypal-complete call failed:", e)
    return { ok: false }
  }
}
