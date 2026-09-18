"use client"

import { useUIStore } from "@/lib/store/ui-store"
import { useProductStore } from "@/lib/store/use-product"
import { StoreProduct } from "@medusajs/types"
import { useCallback, useEffect, useState } from "react"
import OptionSelect from "../components/option-select"
import CustomizePanel, { CustomizationState, INITIAL_CUSTOMIZATION, getCustomizationSurcharge } from "../components/customize-panel"
import Button from "@/ui/button"
import { ShoppingBag, X, Palette } from "lucide-react"
import ProductToolbar from "../components/product-toolbar"

export default function ProductActions({ product, countryCode }: ProductActionsProps) {
    const {
        setProduct,
        options,
        setOption,
        selectedVariant,
        isValidVariant,
        inStock,
        isPending,
        lastError,
        handleAddToCart,
    } = useProductStore()
    const open = useUIStore((s) => s.open)

    const [customizing, setCustomizing] = useState(false)
    const [customization, setCustomization] = useState<CustomizationState>(INITIAL_CUSTOMIZATION)

    const hasOptions = (product.options?.length ?? 0) > 0
    const surcharge = getCustomizationSurcharge(customization)

    const onAddToCart = useCallback(async () => {
        const success = await handleAddToCart()
        if (success) open("cart")
    }, [handleAddToCart, open])

    const toggleCustomize = useCallback(() => {
        if (customizing) {
            // Reset customization when cancelling
            setCustomization(INITIAL_CUSTOMIZATION)
        }
        setCustomizing((v) => !v)
    }, [customizing])

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
                            product={product}
                        />
                    ))}
                </div>
            )}

            {/* Customization panel - slides open above buttons */}
            <CustomizePanel
                open={customizing}
                state={customization}
                onChange={setCustomization}
            />

            <div className="flex items-stretch gap-3">
                <Button
                    onClick={onAddToCart}
                    isLoading={isPending}
                    disabled={!inStock || !selectedVariant || !isValidVariant || isPending}
                    size="lg"
                    className="flex-1"
                    icon={<ShoppingBag className="size-5" aria-hidden />}
                >
                    {!selectedVariant
                        ? "Select options"
                        : !inStock
                            ? "Out of stock"
                            : surcharge > 0
                                ? `Add to Bag (+$${surcharge})`
                                : "Add to Bag"}
                </Button>
                <Button
                    variant={customizing ? "destructive" : "outline"}
                    size="lg"
                    onClick={toggleCustomize}
                    icon={
                        customizing
                            ? <X className="size-5" aria-hidden />
                            : <Palette className="size-5" aria-hidden />
                    }
                >
                    {customizing ? "Cancel" : "Customize"}
                </Button>
            </div>

            {lastError && (
                <p className="text-sm text-destructive" role="alert">
                    {lastError}
                </p>
            )}

            <ProductToolbar title={product.title} />
        </div>
    )
}

type ProductActionsProps = {
    product: StoreProduct
    countryCode: string
}
