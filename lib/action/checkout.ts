"use server"

import { HttpTypes, StoreInitializePaymentSession } from "@medusajs/types"
import { redirect } from "next/navigation"
import { sdk } from "@/lib/sdk"
import medusaError from "@/lib/util/medusa-error"
import { getAuthHeaders, getCacheOptions, getCartId, removeCartId, updateCacheTags, } from "./cookies"
import { initiatePaymentSession } from "./cart"
import { CART_FIELDS, isPayU } from "../constant"

async function resolveCartId(provided?: string) {
  const cookieId = await getCartId()
  if (!cookieId) throw new Error("No existing cart found")
  if (provided && provided !== cookieId) throw new Error("Cart mismatch")
  return cookieId
}

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

export async function getCheckoutCustomer() {
  const next = { ...(await getCacheOptions("customers")) }

  return sdk.client
    .fetch<HttpTypes.StoreCustomerResponse>(`/store/customers/me`, {
      method: "GET",
      query: {
        fields: "*orders",
      },
      headers: await getAuthHeaders(),
      next,
      cache: "force-cache",
    })
    .then(({ customer }) => customer)
    .catch(() => null)
}

// ─── Reads ──────────────────────────────────────────────────────────────────

export async function getCheckoutShippingMethods(cartId: string) {
  const [headers, cacheOptions] = await Promise.all([authHeaders(), getCacheOptions("fulfillment")])

  return sdk.client
    .fetch<HttpTypes.StoreShippingOptionListResponse>(`/store/shipping-options`, {
      method: "GET",
      query: { cart_id: cartId },
      headers,
      next: { ...cacheOptions },
      cache: "force-cache",
    })
    .then(({ shipping_options }) => shipping_options)
    .catch(() => null)
}

export async function getCheckoutPaymentMethods(regionId: string) {
  const [headers, cacheOptions] = await Promise.all([
    authHeaders(),
    getCacheOptions("payment_providers"),
  ])

  return sdk.client
    .fetch<HttpTypes.StorePaymentProviderListResponse>(`/store/payment-providers`, {
      method: "GET",
      query: { region_id: regionId },
      headers,
      next: { ...cacheOptions },
      cache: "force-cache",
    })
    .then(({ payment_providers }) =>
      // copy first - sorting the response in place mutates the cached object
      [...payment_providers].sort((a, b) => a.id.localeCompare(b.id)),
    )
    .catch(() => null)
}

// ─── Address ────────────────────────────────────────────────────────────────

/** Usable directly with useActionState. On success the caller should run store.completeStep("address"). */

function readField(formData: FormData, key: string) {
  const value = formData.get(key)
  return typeof value === "string" ? value.trim() : ""
}

function readAddress(formData: FormData, prefix: "shipping_address" | "billing_address") {
  const get = (name: string) => readField(formData, `${prefix}.${name}`)
  return {
    first_name: get("first_name"),
    last_name: get("last_name"),
    address_1: get("address_1"),
    address_2: get("address_2"),
    company: get("company"),
    postal_code: get("postal_code"),
    city: get("city"),
    country_code: get("country_code").toLowerCase(),
    province: get("province"),
    phone: get("phone"),
  }
}

function missingFields(address: ReturnType<typeof readAddress>) {
  return REQUIRED_ADDRESS_FIELDS.filter((key) => !address[key]).map((key) => key.replace(/_/g, " "))
}

export async function setCheckoutAddresses(formData: FormData,) {
  const cartId = await resolveCartId()
  try {
    if (!formData) {
      throw new Error("No form data found when setting addresses")
    }
    const email = readField(formData, "email")
    if (!EMAIL_RE.test(email)) return fail("Enter a valid email address.")

    const shipping = readAddress(formData, "shipping_address")
    const shippingMissing = missingFields(shipping)
    if (shippingMissing.length) return fail(`Please fill in: ${shippingMissing.join(", ")}.`)

    let billing = shipping
    if (readField(formData, "same_as_billing") !== "on") {
      billing = readAddress(formData, "billing_address")
      const billingMissing = missingFields(billing)
      if (billingMissing.length) return fail(`Billing address - please fill in: ${billingMissing.join(", ")}.`)
    }

    const data: HttpTypes.StoreUpdateCart = {
      email,
      shipping_address: shipping,
      billing_address: billing,
    }

    await sdk.store.cart.update(cartId, data, {}, await authHeaders())
    await updateCacheTags("carts", "fulfillment") // shipping options depend on the address

    return OK
  } catch (e) {
    return fail(toMessage(e))
  }
}

// ────────────────────────────────────────────────────────────────────────────
// Set Shipping Method
// ────────────────────────────────────────────────────────────────────────────

export async function setCheckoutShipping(optionId: string) {
  if (!optionId) return fail("Choose a delivery method.")

  try {
    const cartId = await resolveCartId()
    await sdk.store.cart.addShippingMethod(cartId, { option_id: optionId }, {}, await authHeaders())
    await updateCacheTags("carts")
    return OK
  } catch (e) {
    return fail(toMessage(e))
  }
}

// ─── Payment session ────────────────────────────────────────────────────────

/**
 * Provider-specific session data is built here, not on the client, so the phone number /
 * customer id sent to PayU can't be tampered with. PayU's plugin reads `shipping_address_phone`
 * (not `phone`) plus `cart_id` / `customer_id` from the session data.
 */
async function buildPaymentData(cartId: string, providerId: string) {
  const data: Record<string, unknown> = { payment_description: PAYMENT_DESCRIPTION }

  if (isPayU(providerId)) {
    const { cart } = await sdk.store.cart.retrieve(
      cartId,
      { fields: "id,customer_id,*shipping_address,*billing_address" },
      await authHeaders(),
    )
    const phone = cart.shipping_address?.phone || cart.billing_address?.phone
    data.cart_id = cart.id
    if (phone) data.shipping_address_phone = phone
    if (cart.customer_id) data.customer_id = cart.customer_id
  }

  return data
}

export async function initCheckoutPayment(
  cartId: string,
  providerId: string,
  collectionId?: string,
): Promise<ActionResult> {
  try {
    const id = await resolveCartId(cartId)
    await initiatePaymentSession(
      id,
      {
        provider_id: providerId,
        data: await buildPaymentData(id, providerId),
      } satisfies StoreInitializePaymentSession,
      collectionId,
    )
    return OK
  } catch (e) {
    // Thrown errors from server actions are masked in production, so return the message instead.
    return fail(toMessage(e, "Failed to initialize payment method."))
  }
}

// ────────────────────────────────────────────────────────────────────────────
// Discount / Promo Codes (additive apply, individual remove)
// ────────────────────────────────────────────────────────────────────────────

export async function applyDiscount(code: string) {
  const cartId = await resolveCartId()
  try {
    await sdk.store.cart.update(cartId, { promo_codes: [code] }, {}, await authHeaders())
    await updateCacheTags("carts", "fulfillment")

    return OK
  } catch (e) {
    return fail(toMessage(e))
  }
}

export async function removeDiscount() {
  const cartId = await resolveCartId()
  try {
    await sdk.store.cart.update(cartId, { promo_codes: [] }, {}, await authHeaders())
    await updateCacheTags("carts", "fulfillment")

    return OK
  } catch (e) {
    return fail(toMessage(e))
  }
}

// ─── Place order ────────────────────────────────────────────────────────────

/**
 * Completes the cart. On success this redirects (never returns);
 * on failure it returns { success: false, error }.
 */
export async function placeCheckoutOrder(cartId?: string): Promise<ActionResult> {
  let orderId: string

  // redirect() works by throwing, so it must stay outside the try/catch.
  try {
    const id = await resolveCartId(cartId)
    const res = await sdk.store.cart.complete(id, {}, await authHeaders())

    if (res.type !== "order") {
      await updateCacheTags("carts")
      return fail(res.error?.message ?? "We couldn't complete your payment. Please try again.")
    }
    orderId = res.order.id
  } catch (e) {
    return fail(toMessage(e))
  }

  await updateCacheTags("carts", "orders")
  await removeCartId()
  redirect(`/order/${orderId}/confirmed`)
}

// ─── PayPal ─────────────────────────────────────────────────────────────────

export async function createToken(): Promise<ActionResult & { client_token: string | null }> {
  try {
    // Some plugin versions answer with camelCase `clientToken`; accept both.
    const res = await sdk.client.fetch<{ client_token?: string; clientToken?: string }>(
      `/store/paypal/client-token`,
      { method: "POST", headers: await authHeaders() },
    )
    const token = res.client_token ?? res.clientToken
    if (!token) return { ...fail("PayPal didn't return a client token."), client_token: null }
    return { ...OK, client_token: token }
  } catch (e) {
    console.error("[PayPal] client token failed:", toMessage(e))
    return { ...fail(toMessage(e, "Couldn't load the secure card form.")), client_token: null }
  }
}

export async function createOrder(
  cartId?: string,
  isCardPayment = false,
): Promise<ActionResult & { id: string | null }> {
  try {
    const id = await resolveCartId(cartId)
    const res = await sdk.client.fetch<{ id?: string }>(`/store/paypal/create-order`, {
      method: "POST",
      headers: await authHeaders(),
      body: { cart_id: id, is_card_payment: isCardPayment },
    })
    if (!res?.id) return { ...fail("PayPal didn't return an order ID."), id: null }
    return { ...OK, id: res.id }
  } catch (e) {
    console.error("[PayPal] create order failed:", toMessage(e))
    return { ...fail(toMessage(e, "We couldn't start your PayPal payment.")), id: null }
  }
}

export async function captureOrder(cartId: string, orderId: string): Promise<ActionResult> {
  try {
    const id = await resolveCartId(cartId)
    await sdk.client.fetch(`/store/paypal/capture-order`, {
      method: "POST",
      headers: await authHeaders(),
      body: { cart_id: id, order_id: orderId },
    })
    return OK
  } catch (e) {
    console.error("[PayPal] capture failed:", toMessage(e))
    return fail(toMessage(e, "We couldn't confirm your PayPal payment."))
  }
}

export async function markPaymentComplete(cartId: string): Promise<ActionResult> {
  try {
    const id = await resolveCartId(cartId)
    await sdk.client.fetch(`/store/paypal-complete`, {
      method: "POST",
      headers: await authHeaders(),
      body: { cart_id: id },
    })
    return OK
  } catch (e) {
    console.warn("[PayPal] paypal-complete failed:", toMessage(e))
    return fail(toMessage(e))
  }
}

export type ActionResult = { success: true; error: null } | { success: false; error: string }

const PAYMENT_DESCRIPTION = process.env.PAYMENT_DESCRIPTION ?? "Online order"
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const REQUIRED_ADDRESS_FIELDS = [
  "first_name",
  "last_name",
  "address_1",
  "postal_code",
  "city",
  "country_code",
] as const

const OK: ActionResult = { success: true, error: null }
const fail = (error: string): ActionResult => ({ success: false, error })

const authHeaders = async () => ({ ...(await getAuthHeaders()) })

function toMessage(e: unknown, fallback = "Something went wrong. Please try again.") {
  return e instanceof Error && e.message ? e.message : fallback
}