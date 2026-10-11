"use server"

import { AuthRedirectResponse, FetchError } from "@medusajs/js-sdk"
import { StoreCustomer, StoreUpdateCustomer, StoreUpdateCustomerAddress } from "@medusajs/types"
import type { Route } from "next";
import { redirect } from "next/navigation"
import { sdk } from "@/lib/sdk"
import medusaError from "@/lib/util/medusa-error"
import { getAuthHeaders, getCacheOptions, getCartId, getPendingCustomer, removeAuthToken, removeCartId, removePendingCustomer, setAuthToken, setPendingCustomer, updateCacheTags, } from "./cookies"

export type CustomerAuthState = { state: "error"; error: string } | { state: "verification_required"; email: string } | { state: "success" } | null

// Requests a verification email for the given customer. The request must be
// authenticated with a token tied to the auth identity (the token returned by
// register or by a login that requires verification).
async function requestVerificationEmail(email: string, token: string) {
    await sdk.auth.verification.request(
        {
            entity_id: email,
            entity_type: "email",
        },
        {
            authorization: `Bearer ${token}`,
        }
    )
}

// Plain read, not a Server Action - see the note in locale-actions.ts for
// why pure reads are kept out of the action surface.
export const retrieveCustomer =
    async (): Promise<StoreCustomer | null> => {
        const headers = await getAuthHeaders()

        const next = {
            ...(await getCacheOptions("customers")),
        }

        return await sdk.client
            .fetch<{ customer: StoreCustomer }>(`/store/customers/me`, {
                method: "GET",
                query: {
                    // fields: "*orders",
                },
                headers,
                next,
                cache: "force-cache",
            })
            .then(({ customer }) => customer)
            .catch(() => null)
    }

export const updateCustomer = async (body: StoreUpdateCustomer) => {
    const headers = {
        ...(await getAuthHeaders()),
    }

    const updateRes = await sdk.store.customer
        .update(body, {}, headers)
        .then(({ customer }) => customer)
        .catch(medusaError)

    await updateCacheTags("customers")

    return updateRes
}

export async function signup(_currentState: unknown, formData: FormData): Promise<CustomerAuthState> {

    const password = formData.get("password") as string
    const customerForm = {
        email: formData.get("email") as string,
        first_name: formData.get("first_name") as string,
        last_name: formData.get("last_name") as string,
        phone: formData.get("phone") as string,
    }

    try {
        await sdk.auth.register("customer", "emailpass", {
            email: customerForm.email,
            password,
        })
    } catch (error) {
        const fetchError = error as FetchError
        // An existing identity (for example, an admin user with the same email) is
        // expected and handled: the customer can still log in to link a customer
        // record. Any other error is surfaced.
        if (
            fetchError.statusText !== "Unauthorized" ||
            fetchError.message !== "Identity with email already exists"
        ) {
            return { state: "error", error: String(error) }
        }
    }

    // Persist the extra signup fields. The customer record is created during
    // login, which is deferred until after email verification when the backend
    // requires it.
    await setPendingCustomer(customerForm)

    // Continue by logging in. The login response tells us whether the backend
    // requires email verification - we don't need a storefront-side flag.
    return completeLogin(customerForm.email, password)
}

export async function login(_currentState: unknown, formData: FormData): Promise<CustomerAuthState> {
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    return completeLogin(email, password)
}

// Logs the customer in and reconciles the customer record. The behavior is
// driven entirely by the backend's login response, so it works whether or not
// email verification is enabled.
async function completeLogin(email: string, password: string): Promise<CustomerAuthState> {
    let result: Awaited<ReturnType<typeof sdk.auth.login>>

    try {
        result = await sdk.auth.login("customer", "emailpass", { email, password })
    } catch (error) {
        return { state: "error", error: String(error) }
    }


    // A `location` is returned by third-party auth providers, which this flow
    // doesn't support.
    if (typeof result === "object" && "location" in result) {
        return {
            state: "error",
            error: "This login method isn't supported by the storefront.",
        }
    }

    // The backend requires email verification and the customer hasn't verified
    // yet. Send the verification email and ask them to check their inbox.
    if (
        typeof result === "object" &&
        "verification_required" in result &&
        result.verification_required
    ) {
        try {
            await requestVerificationEmail(email, result.token)
        } catch {
            // Ignore: the customer can resend from the verification page.
        }
        redirect(`/auth/verify-account?email=${encodeURIComponent(email)}`)
    }

    if (typeof result !== "string") {
        return {
            state: "error",
            error: "Authentication requires additional steps that aren't supported.",
        }
    }
    let token = result

    // The token may not be tied to a customer record yet - right after
    // registration, or after verifying a brand-new account. Ask the backend:
    // `/store/customers/me` rejects tokens without a registered actor, so a
    // failed retrieve means we still need to create the customer, then log in
    // again to obtain a customer-bound token.
    const customerExists = await sdk.store.customer
        .retrieve({}, { authorization: `Bearer ${token}` })
        .then(() => true)
        .catch(() => false)

    if (!customerExists) {
        const pending = await getPendingCustomer()
        try {
            await sdk.store.customer.create(
                {
                    email,
                    first_name: pending?.first_name,
                    last_name: pending?.last_name,
                    phone: pending?.phone,
                },
                {},
                { authorization: `Bearer ${token}` }
            )

            token = (await sdk.auth.login("customer", "emailpass", {
                email,
                password,
            })) as string
        } catch (error) {
            return { state: "error", error: String(error) }
        }

        await removePendingCustomer()
    }

    await setAuthToken(token)
    await updateCacheTags("customers")

    try {
        await transferCart()
    } catch (error) {
        return { state: "error", error: String(error) }
    }

    redirect("/account/profile")
}

// Confirms a customer's email using the token from the verification link.
//
// The confirm route doesn't require authentication, so this works even when the
// customer opens the link on a different device than the one they signed up on.
export async function confirmEmailVerification(token: string): Promise<{ success: boolean; error?: string }> {

    if (!token) {
        return {
            success: false,
            error: "Verification token is missing.",
        }
    }

    try {
        await sdk.auth.verification.confirm({ code: token })
        return { success: true }
    } catch (error) {
        return { success: false, error: String(error) }
    }
}

export async function signout() {
    await sdk.auth.logout()
    await removeAuthToken()
    await removeCartId()
    await updateCacheTags("customers", "carts")

    redirect(`/auth`)
}

export async function transferCart() {
    const cartId = await getCartId()

    if (!cartId) {
        return
    }

    const headers = await getAuthHeaders()

    await sdk.store.cart.transferCart(cartId, {}, headers)
    await updateCacheTags("carts")
}

export const addCustomerAddress = async (currentState: Record<string, unknown>, formData: FormData): Promise<{ success: boolean; error: string | null }> => {

    const isDefaultBilling = (currentState.isDefaultBilling as boolean) || false
    const isDefaultShipping = (currentState.isDefaultShipping as boolean) || false

    const address = {
        first_name: formData.get("first_name") as string,
        last_name: formData.get("last_name") as string,
        company: formData.get("company") as string,
        address_1: formData.get("address_1") as string,
        address_2: formData.get("address_2") as string,
        city: formData.get("city") as string,
        postal_code: formData.get("postal_code") as string,
        province: formData.get("province") as string,
        country_code: formData.get("country_code") as string,
        phone: formData.get("phone") as string,
        is_default_billing: isDefaultBilling,
        is_default_shipping: isDefaultShipping,
    }

    const headers = {
        ...(await getAuthHeaders()),
    }

    return sdk.store.customer
        .createAddress(address, {}, headers)
        .then(async () => {
            await updateCacheTags("customers")
            return { success: true, error: null }
        })
        .catch((err) => {
            return { success: false, error: err.toString() }
        })
}

export const deleteCustomerAddress = async (addressId: string): Promise<void> => {

    const headers = {
        ...(await getAuthHeaders()),
    }

    await sdk.store.customer
        .deleteAddress(addressId, headers)
        .then(async () => {
            await updateCacheTags("customers")
            return { success: true, error: null }
        })
        .catch((err) => {
            return { success: false, error: err.toString() }
        })
}

export const updateCustomerAddress = async (currentState: Record<string, unknown>, formData: FormData): Promise<{ success: boolean; error: string | null }> => {
    const addressId = (currentState.addressId as string) || (formData.get("addressId") as string)

    if (!addressId) {
        return { success: false, error: "Address ID is required" }
    }

    const address = {
        first_name: formData.get("first_name") as string,
        last_name: formData.get("last_name") as string,
        company: formData.get("company") as string,
        address_1: formData.get("address_1") as string,
        address_2: formData.get("address_2") as string,
        city: formData.get("city") as string,
        postal_code: formData.get("postal_code") as string,
        province: formData.get("province") as string,
        country_code: formData.get("country_code") as string,
    } as StoreUpdateCustomerAddress

    const phone = formData.get("phone") as string

    if (phone) {
        address.phone = phone
    }

    const headers = {
        ...(await getAuthHeaders()),
    }

    return sdk.store.customer
        .updateAddress(addressId, address, {}, headers)
        .then(async () => {
            await updateCacheTags("customers")
            return { success: true, error: null }
        })
        .catch((err) => {
            return { success: false, error: err.toString() }
        })
}

export async function updatePassword(_currentState: unknown, formData: FormData): Promise<{ success: boolean; error: string | null }> {

    const currentPassword = formData.get("current_password") as string
    const newPassword = formData.get("new_password") as string
    const confirmPassword = formData.get("confirm_password") as string

    if (!currentPassword || !newPassword || !confirmPassword) {
        return { success: false, error: "All password fields are required." }
    }

    if (newPassword !== confirmPassword) {
        return { success: false, error: "New passwords do not match." }
    }

    if (newPassword.length < 8) {
        return { success: false, error: "Password must be at least 8 characters." }
    }

    // Step 1: Retrieve current customer to get their email
    const customer = await retrieveCustomer()
    if (!customer?.email) {
        return { success: false, error: "Unable to retrieve account information." }
    }

    // Step 2: Verify current password by attempting login
    try {
        await sdk.auth.login("customer", "emailpass", {
            email: customer.email,
            password: currentPassword,
        })
    } catch {
        return { success: false, error: "Current password is incorrect." }
    }

    // Step 3: Request a token
    try {
        const { token } = await sdk.auth.refresh()
        sdk.auth.updateProvider(
            "customer",
            "emailpass",
            {
                password: newPassword
            },
            token
        )
    } catch {
        return { success: false, error: "Failed to update password. Please try again." }
    }

    return { success: true, error: null }
}

// ── Password Reset ──────────────────────────────────────────────────────

export async function requestPasswordReset(_currentState: unknown, formData: FormData): Promise<{ success: boolean; error: string | null }> {
    const email = formData.get("email") as string

    if (!email) {
        return { success: false, error: "Email address is required." }
    }

    try {
        await sdk.auth.resetPassword("customer", "emailpass", {
            identifier: email
        })
    } catch {
        // Always show success to prevent email enumeration attacks
    }

    return { success: true, error: null }
}

export async function resetPasswordWithToken(_currentState: unknown, formData: FormData): Promise<{ success: boolean; error: string | null }> {
    const token = formData.get("token") as string
    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirm_password") as string

    if (!token) {
        return { success: false, error: "Reset token is missing or invalid." }
    }

    if (!password || !confirmPassword) {
        return { success: false, error: "Both password fields are required." }
    }

    if (password !== confirmPassword) {
        return { success: false, error: "Passwords do not match." }
    }

    if (password.length < 8) {
        return { success: false, error: "Password must be at least 8 characters." }
    }

    try {
        await sdk.client.fetch(`/auth/customer/emailpass/update`, {
            method: "POST",
            body: { password },
            headers: { authorization: `Bearer ${token}` },
        })
    } catch {
        return {
            success: false,
            error: "This reset link is invalid or has expired. Please request a new one.",
        }
    }

    return { success: true, error: null }
}

// ── Google OAuth ────────────────────────────────────────────────────────

export async function googleLogin() {
    const result = await sdk.auth.login("customer", "google", {}) as AuthRedirectResponse

    if (typeof result === "object" && result.location) {
        redirect(result.location as Route)
    }
}

export async function completeOAuthCallback(provider: string, code: string, params?: string | null): Promise<{ success: boolean; error?: string }> {
    if (!code) {
        return { success: false, error: "Authentication code is missing." }
    }

    let token: string | undefined

    try {
        const query: Record<string, string> = { code }
        if (params) query.state = params

        const result = await sdk.auth.callback("customer", provider, query)
        if (typeof result === "string") {
            token = result
        } else if (typeof result === "object" && "token" in result) {
            token = result.token as string
        } else {
            return { success: false, error: "Unexpected response from authentication provider." }
        }
    } catch (error) {
        console.error("OAuth callback error:", error)
        return { success: false, error: "Failed to authenticate with provider." }
    }

    if (!token) {
        return { success: false, error: "Failed to retrieve authentication token." }
    }

    // Decode the JWT payload to extract user_metadata (email, name, etc.)
    // The token from the callback has actor_id="" because no customer record
    // is linked yet — we need the user_metadata to create one.
    let userMetadata: {
        email?: string
        name?: string
        given_name?: string
        family_name?: string
    } = {}
    try {
        const payloadBase64 = token.split(".")[1]
        const payloadJson = Buffer.from(payloadBase64, "base64").toString("utf-8")
        const payload = JSON.parse(payloadJson)
        userMetadata = payload.user_metadata || {}
    } catch {
        // If decoding fails, we'll try to create without metadata
    }

    // Check if a customer record is already linked to this auth identity
    const customerExists = await sdk.store.customer
        .retrieve({}, { authorization: `Bearer ${token}` })
        .then(() => true)
        .catch(() => false)

    if (!customerExists) {
        if (!userMetadata.email) {
            return {
                success: false,
                error: "Could not retrieve email from authentication provider.",
            }
        }

        try {
            await sdk.store.customer.create(
                {
                    email: userMetadata.email,
                    first_name: userMetadata.given_name || userMetadata.name,
                    last_name: userMetadata.family_name,
                },
                {},
                { authorization: `Bearer ${token}` }
            )
        } catch {
            // Customer may already exist from a previous attempt
        }

        // After creating the customer, refresh the token to get one that
        // has the actor_id populated (the original token has actor_id="").
        try {
            const refreshedResult = await sdk.auth.refresh(
                { authorization: `Bearer ${token}` }
            )
            if (typeof refreshedResult === "string") {
                token = refreshedResult
            } else if (
                typeof refreshedResult === "object" &&
                "token" in refreshedResult
            ) {
                token = refreshedResult.token as string
            }
        } catch (error) {
            console.error("Token refresh failed after customer creation:", error)
            // If refresh fails, we still continue with the original token.
            // The customer was created, so a subsequent login will work.
        }
    }

    await setAuthToken(token)
    await updateCacheTags("customers")

    try {
        await transferCart()
    } catch {
        // Cart transfer failure is non-critical
    }

    return { success: true }
}