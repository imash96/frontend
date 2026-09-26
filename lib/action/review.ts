"use server"

import { sdk } from "@/lib/sdk"
import { getAuthHeaders, updateCacheTags } from "./cookies"
import { ProductReviewStats } from "@/types/product"

export type ReviewFormState = {
    success: boolean
    error: string | null
}

export type CustomerReview = {
    id: string
    product_id: string
    order_id: string | null
    order_line_item_id: string | null
    name: string | null
    rating: number
    title: string | null
    content: string | null
    status: string
    verified: boolean
    created_at: string
    updated_at: string
    product?: {
        id: string
        title: string
        handle: string
        thumbnail: string | null
    }
    images?: { id: string; url: string }[]
    response?: { id: string; content: string } | null
}

export async function submitReview(
    _currentState: unknown,
    formData: FormData
): Promise<ReviewFormState> {
    "use server"

    const order_id = formData.get("order_id") as string
    const order_line_item_id = formData.get("order_line_item_id") as string
    const rating = Number(formData.get("rating"))
    const title = formData.get("title") as string
    const content = formData.get("content") as string

    if (!order_id || !order_line_item_id || !rating) {
        return { success: false, error: "Order info and rating are required." }
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
                reviews: [
                    {
                        order_id,
                        order_line_item_id,
                        rating,
                        title: title || "Review",
                        content: content || "Great product",
                        images: [],
                    },
                ],
            },
            headers,
        })

        await updateCacheTags("reviews")
        return { success: true, error: null }
    } catch (error: any) {
        // Handle duplicate review (409 Conflict)
        if (error?.status === 409 || error?.message?.includes("DUPLICATE_REVIEW") || error?.message?.includes("already submitted")) {
            return { success: false, error: "You have already submitted a review for this item." }
        }
        const message =
            error instanceof Error ? error.message : "Failed to submit review."
        return { success: false, error: message }
    }
}

export async function submitAnonymousReview(
    _currentState: unknown,
    formData: FormData
): Promise<ReviewFormState> {
    "use server"

    const product_id = formData.get("product_id") as string
    const rating = Number(formData.get("rating"))
    const title = formData.get("title") as string
    const content = formData.get("content") as string
    const full_name = formData.get("full_name") as string
    const email = formData.get("email") as string

    if (!product_id || !rating || !full_name || !email) {
        return { success: false, error: "All fields are required." }
    }

    if (rating < 1 || rating > 5) {
        return { success: false, error: "Rating must be between 1 and 5." }
    }

    if (content && content.length < 20) {
        return { success: false, error: "Review must be at least 20 characters." }
    }

    try {
        await sdk.client.fetch(`/store/product-review/${product_id}`, {
            method: "POST",
            body: {
                title: title || "Review",
                full_name,
                email,
                rating,
                content: content || "Great product",
                media: [],
            },
        })

        await updateCacheTags("reviews")
        return { success: true, error: null }
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Failed to submit review."
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
        // Step 1: Get customer's orders to find their order IDs
        const { orders } = await sdk.client.fetch<{
            orders: { id: string }[]
        }>(`/store/orders`, {
            method: "GET",
            query: { fields: "id", limit: 100 },
            headers,
        })

        if (!orders || orders.length === 0) return []

        const orderIds = orders.map((o) => o.id)

        // Step 2: Fetch reviews for those orders
        const { product_reviews } = await sdk.client.fetch<{
            product_reviews: CustomerReview[]
        }>(`/store/product-reviews`, {
            method: "GET",
            query: {
                order_id: orderIds,
                status: ["approved", "pending"],
                fields: "id,product_id,order_id,order_line_item_id,name,rating,title,content,status,verified,created_at,updated_at,response.*,images.*,product.*",
            },
            headers,
        })

        return product_reviews ?? []
    } catch {
        return []
    }
}

export async function fetchProductReviews(productId: string): Promise<{
    reviews: CustomerReview[]
    count: number
}> {
    try {
        const result = await sdk.client.fetch<{
            reviews: CustomerReview[]
            count: number
        }>(`/store/product-review/${productId}`, {
            method: "GET",
        })

        return { reviews: result.reviews ?? [], count: result.count ?? 0 }
    } catch {
        return { reviews: [], count: 0 }
    }
}

export async function fetchProductReviewStats(productId: string): Promise<ProductReviewStats | null> {
    try {
        const { product_review_stats } = await sdk.client.fetch<{
            product_review_stats: ProductReviewStats[]
        }>(`/store/product-review-stats`, {
            method: "GET",
            query: { product_id: productId },
        })

        return product_review_stats?.[0] ?? null
    } catch {
        return null
    }
}
