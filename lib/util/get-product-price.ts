import type { StoreProduct } from "@medusajs/types"
import { getPercentageDiff } from "./get-precentage-diff";
import { convertToLocale } from "./money";

export const getPricesForVariant = (variant: any) => {
    const price = variant?.calculated_price;
    if (!price) return null;

    const { calculated_amount, original_amount, currency_code, calculated_price } = price;

    return {
        calculated_price_number: calculated_amount,
        calculated_price: convertToLocale({ amount: calculated_amount, currency_code }),
        original_price_number: original_amount,
        original_price: convertToLocale({ amount: original_amount, currency_code }),
        currency_code,
        price_type: calculated_price.price_list_type,
        percentage_diff: getPercentageDiff(original_amount, calculated_amount),
    }
}

export function getProductPrice({ product, variantId }: { product: StoreProduct; variantId?: string }) {
    if (!product.id) {
        throw new Error("No product provided")
    }

    const getCheapestPrice = () => {
        const variants = product.variants?.filter(v => v.calculated_price) || [];
        if (variants.length === 0) return null

        const cheapestVariant = variants.sort((a: any, b: any) => a.calculated_price.calculated_amount - b.calculated_price.calculated_amount)[0]

        return getPricesForVariant(cheapestVariant)
    }

    const getVariantPrice = () => {
        if (!variantId) return null

        const variant = product.variants?.find(v => v.id === variantId || v.sku === variantId)

        return getPricesForVariant(variant || null);
    }

    return {
        // product,
        cheapestPrice: getCheapestPrice(),
        variantPrice: getVariantPrice(),
    }
}