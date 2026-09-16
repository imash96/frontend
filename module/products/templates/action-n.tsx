"use client"

import { useUIStore } from "@/lib/store/ui-store"
import { useProductStore } from "@/lib/store/use-product"
import { ProductCalculatedPrice } from "@/lib/util/get-product-price"
import { StoreProduct } from "@medusajs/types"
import { useEffect, useTransition } from "react"
import OptionSelect from "../components/option-select"
import Button from "@/ui/button"
import { ShoppingBag } from "lucide-react"

export default function ProductActions({ product, countryCode }: ProductActionsProps) {
    const { setProduct, options, setOption, quantity, setQuantity, availableQuantity, selectedVariant, isValidVariant, inStock, isPending, lastError, handleAddToCart } = useProductStore()
    const { open } = useUIStore()
    const [, startTransition] = useTransition()

    const hasOptions = (product.options?.length ?? 0) > 0

    const onAddToCart = () => {
        startTransition(async () => {
            const success = await handleAddToCart()
            if (success) open.bind(null, 'cart')
        })
    }

    useEffect(() => {
        setProduct(product, countryCode)
    }, [product, countryCode, setProduct])

    return (
        <div className="flex flex-col gap-y-5 py-4 sm:gap-y-6">
            {hasOptions && (
                <div className="flex flex-col gap-y-5">
                    {product.options?.map((option) => (
                        <OptionSelect
                            key={option.id}
                            option={option}
                            value={options[option.id]}
                            onSelect={(value) => setOption(option.id, value)}
                            disabled={isPending}
                        />
                    ))}
                </div>
            )}
            <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                    onClick={onAddToCart}
                    isLoading={isPending}
                    disabled={!inStock || !selectedVariant || !isValidVariant || isPending}
                    size="lg"
                    className="w-full flex-1"
                    icon={<ShoppingBag className="size-5" aria-hidden />}
                >
                    {!selectedVariant ? "Select options" : !inStock ? "Out of stock" : "Add to Bag"}
                </Button>

                <Button
                    onClick={onAddToCart}
                    isLoading={isPending}
                    disabled={!inStock || !selectedVariant || !isValidVariant || isPending}
                    size="lg"
                    className="w-full flex-1"
                    icon={<ShoppingBag className="size-5" aria-hidden />}
                >
                    Customize
                </Button>

            </div>
        </div>
    )
}

type ProductActionsProps = {
    product: StoreProduct
    countryCode: string
}