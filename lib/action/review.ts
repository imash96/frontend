"use server"

import { sdk } from "@/lib/sdk"
import { getAuthHeaders, updateCacheTags } from "./cookies"

export type ReviewFormState = {
    success: boolean
    error: string | null
}

export type CustomerReview = {
    id: string
    product_id: string
    customer_id: string
    rating: number
    title: string
    content: string
    created_at: string
    updated_at: string
    product?: {
        id: string
        title: string
        handle: string
        thumbnail: string | null
    }
    images?: { id: string; url: string }[]
}

export async function submitReview(
    _currentState: unknown,
    formData: FormData
): Promise<ReviewFormState> {
    "use server"

    const product_id = formData.get("product_id") as string
    const rating = Number(formData.get("rating"))
    const title = formData.get("title") as string
    const content = formData.get("content") as string

    if (!product_id || !rating) {
        return { success: false, error: "Product and rating are required." }
    }

    if (rating < 1 || rating > 5) {
        return { success: false, error: "Rating must be between 1 and 5." }
    }

    if (content && content.length < 20) {
        return { success: false, error: "Review must be at least 20 characters." }
    }

    if (content && content.length > 1000) {
        return { success: false, error: "Review must be under 1000 characters." }
    }

    const headers = await getAuthHeaders()

    try {
        await sdk.client.fetch(`/store/product-reviews`, {
            method: "POST",
            body: {
                product_id,
                rating,
                title: title || undefined,
                content: content || undefined,
            },
            headers,
        })

        await updateCacheTags("reviews")
        return { success: true, error: null }
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Failed to submit review."
        return { success: false, error: message }
    }
}

export async function updateReview(
    reviewId: string,
    _currentState: unknown,
    formData: FormData
): Promise<ReviewFormState> {
    "use server"

    const rating = Number(formData.get("rating"))
    const title = formData.get("title") as string
    const content = formData.get("content") as string

    if (!rating || rating < 1 || rating > 5) {
        return { success: false, error: "Rating must be between 1 and 5." }
    }

    if (content && content.length < 20) {
        return { success: false, error: "Review must be at least 20 characters." }
    }

    const headers = await getAuthHeaders()

    try {
        await sdk.client.fetch(`/store/product-reviews/${reviewId}`, {
            method: "POST",
            body: {
                rating,
                title: title || undefined,
                content: content || undefined,
            },
            headers,
        })

        await updateCacheTags("reviews")
        return { success: true, error: null }
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Failed to update review."
        return { success: false, error: message }
    }
}

export async function deleteReview(
    reviewId: string
): Promise<ReviewFormState> {
    "use server"

    const headers = await getAuthHeaders()

    try {
        await sdk.client.fetch(`/store/product-reviews/${reviewId}`, {
            method: "DELETE",
            headers,
        })

        await updateCacheTags("reviews")
        return { success: true, error: null }
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Failed to delete review."
        return { success: false, error: message }
    }
}

export async function listCustomerReviews(): Promise<CustomerReview[]> {
    const headers = await getAuthHeaders()

    try {
        const { product_reviews } = await sdk.client.fetch<{
            product_reviews: CustomerReview[]
        }>(`/store/product-reviews`, {
            method: "GET",
            query: { my_reviews: "true" },
            headers,
        })

        return product_reviews ?? []
    } catch {
        return []
    }
}
