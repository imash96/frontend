import "server-only"

import { HttpTypes } from "@medusajs/types"
import { sdk } from "@/lib/sdk"
import { getAuthHeaders, getCacheOptions } from "./cookies"

export const listCartShippingMethods = async (cartId: string) => {
    const headers = {
        ...(await getAuthHeaders()),
    }

    const next = {
        ...(await getCacheOptions("fulfillment")),
    }

    return sdk.client
        .fetch<HttpTypes.StoreShippingOptionListResponse>(
            `/store/shipping-options`,
            {
                method: "GET",
                query: {
                    cart_id: cartId,
                },
                headers,
                next,
                cache: "force-cache",
            }
        )
        .then(({ shipping_options }) => shipping_options)
        .catch(() => {
            return null
        })
}

export const calculatePriceForShippingOption = async (
    optionId: string,
    cartId: string,
    data?: Record<string, unknown>
) => {
    const headers = {
        ...(await getAuthHeaders()),
    }

    const next = {
        ...(await getCacheOptions("fulfillment")),
    }

    // The original built `body` with `data` already included, then had a
    // redundant `if (data) { body.data = data }` right after that reassigned
    // the exact same value - removed, this does the same thing in one step.
    return sdk.client
        .fetch<{ shipping_option: HttpTypes.StoreCartShippingOption }>(
            `/store/shipping-options/${optionId}/calculate`,
            {
                method: "POST",
                body: { cart_id: cartId, data },
                headers,
                next,
            }
        )
        .then(({ shipping_option }) => shipping_option)
        .catch((_e) => {
            return null
        })
}