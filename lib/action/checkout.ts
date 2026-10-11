"use server"

import type { HttpTypes, StoreInitializePaymentSession } from "@medusajs/types"
import { redirect } from "next/navigation"
import { isPayU } from "@/lib/constant"
import { sdk } from "@/lib/sdk"
import { getAuthHeaders, getCacheOptions, getCartId, removeCartId, updateCacheTags } from "./cookies"
import { applyPromoCode, initiatePaymentSession, removePromoCode } from "./cart"

// "use server" files may only export async functions (types are fine: they're erased).
export type ActionResult = { success: true; error: null } | { success: false; error: string }

const PAYMENT_DESCRIPTION = process.env.PAYMENT_DESCRIPTION ?? "Online order"
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MIN_PHONE_DIGITS = 7
const REQUIRED_ADDRESS_FIELDS = {
  first_name: "first name",
  last_name: "last name",
  address_1: "address",
  postal_code: "postal code",
  city: "city",
  country_code: "country",
} as const

const OK: ActionResult = { success: true, error: null }
const fail = (error: string): ActionResult => ({ success: false, error })

const authHeaders = async () => ({ ...(await getAuthHeaders()) })

function toMessage(e: unknown, fallback = "Something went wrong. Please try again.") {
  return e instanceof Error && e.message ? e.message : fallback
}

/**
 * The cart id always comes from the httpOnly cookie. If a caller also passes one it must match:
 * a client must never act on someone else's cart.
 */
async function resolveCartId(provided?: string) {
  const cookieId = await getCartId()
  if (!cookieId) throw new Error("No existing cart found")
  if (provided && provided !== cookieId) throw new Error("Cart mismatch")
  return cookieId
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
  const [headers, cacheOptions] = await Promise.all([authHeaders(), getCacheOptions("payment_providers")])

  return sdk.client
    .fetch<HttpTypes.StorePaymentProviderListResponse>(`/store/payment-providers`, {
      method: "GET",
      query: { region_id: regionId },
      headers,
      next: { ...cacheOptions },
      cache: "force-cache",
    })
    .then(({ payment_providers }) =>
      // copy first: sorting the response in place mutates the cached object
      [...payment_providers].sort((a, b) => a.id.localeCompare(b.id)),
    )
    .catch(() => null)
}

// ─── Address ────────────────────────────────────────────────────────────────

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
  return (Object.keys(REQUIRED_ADDRESS_FIELDS) as (keyof typeof REQUIRED_ADDRESS_FIELDS)[])
    .filter((key) => !address[key])
    .map((key) => REQUIRED_ADDRESS_FIELDS[key])
}

/** Called by the checkout store (saveAddress), which advances the step on success. */
export async function setCheckoutAddresses(formData: FormData): Promise<ActionResult> {
  try {
    const cartId = await resolveCartId() // inside the try: a missing cart is a result, not a crash

    const email = readField(formData, "email").toLowerCase()
    if (!EMAIL_RE.test(email)) return fail("Enter a valid email address.")

    const shipping = readAddress(formData, "shipping_address")
    const shippingMissing = missingFields(shipping)
    if (shippingMissing.length) return fail(`Please fill in: ${shippingMissing.join(", ")}.`)
    if (shipping.phone.replace(/\D/g, "").length < MIN_PHONE_DIGITS) return fail("Enter a valid phone number.")

    let billing = shipping
    if (readField(formData, "same_as_billing") !== "on") {
      billing = readAddress(formData, "billing_address")
      const billingMissing = missingFields(billing)
      if (billingMissing.length) return fail(`Billing address - please fill in: ${billingMissing.join(", ")}.`)
    }

    const data: HttpTypes.StoreUpdateCart = { email, shipping_address: shipping, billing_address: billing }

    await sdk.store.cart.update(cartId, data, {}, await authHeaders())
    await updateCacheTags("carts", "fulfillment") // shipping options depend on the address

    return OK
  } catch (e) {
    return fail(toMessage(e))
  }
}

// ─── Shipping ───────────────────────────────────────────────────────────────

export async function setCheckoutShipping(optionId: string): Promise<ActionResult> {
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

// ─── Promo codes (additive: see cart.ts) ────────────────────────────────────

export async function applyDiscount(code: string): Promise<ActionResult> {
  const result = await applyPromoCode(code)
  return result.success ? OK : fail(result.error ?? "That code couldn't be applied.")
}

/** Removes one code, or all of them when no code is given. */
export async function removeDiscount(): Promise<ActionResult> {
  const result = await removePromoCode()
  return result.success ? OK : fail(result.error ?? "We couldn't remove that code.")
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
// PayPal actions return results (never throw): production masks thrown server-action messages,
// which made every failure look identical to the customer.

export async function createToken(): Promise<ActionResult & { client_token: string | null }> {
  try {
    // Some plugin versions answer with camelCase `clientToken`; accept both.
    const res = await sdk.client.fetch<{ client_token?: string; clientToken?: string }>(`/store/paypal/client-token`, {
      method: "POST",
      headers: await authHeaders(),
    })
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

/** Best effort: the order is completed afterwards regardless of this result. */
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