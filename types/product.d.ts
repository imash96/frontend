import { StoreProduct } from "@medusajs/types"
import { StoreProductReview } from "./global"

export type StoreProductWithReviews = StoreProduct & {
    product_review?: StoreProductReview[]
    review_stats?: ProductReviewStats
}

export type StoreProductReview = {
    id: string;
    name: string;
    email: string;
    rating: number;
    title: null;
    content: string;
    images: {
        id: string
        url: string
    }[]
    order_line_item_id: string;
    product_id: string;
    order_id: string;
    response: {
        content: string
    } | null;
    status: string;
    verified: boolean;
    created_at: string;
    updated_at: string;
    deleted_at: null;
}



export type ProductReviewStats = {
    id: string
    product_id: string
    average_rating: number
    review_count: number
    rating_count_1: number
    rating_count_2: number
    rating_count_3: number
    rating_count_4: number
    rating_count_5: number
}