"use client"

import { StoreProduct } from "@medusajs/types"
import { Palette, ShoppingBag, X } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { useDrawerStore } from "@/lib/store/drawer-store"
import { useProductStore } from "@/lib/store/product-store"
import Button from "@/ui/button"
import CustomizePanel, { CustomizationState, getCustomizationSurcharge, INITIAL_CUSTOMIZATION } from "../components/customize-panel"
import OptionSelect from "../components/option-select"
import ProductToolbar from "../components/product-toolbar"

export default function ProductActions({ product, countryCode }: ProductActionsProps) {
    const { setProduct, options, setOption, selectedVariant, isValidVariant, inStock, isPending, lastError, handleAddToCart, } = useProductStore()
    const open = useDrawerStore((s) => s.open)

    const [customizing, setCustomizing] = useState(false)
    const [customization, setCustomization] = useState<CustomizationState>(INITIAL_CUSTOMIZATION)

    const hasOptions = (product.options?.length ?? 0) > 0
    const surcharge = getCustomizationSurcharge(customization)

    // Button is purchasable when we have a valid variant that is in stock
    const canAddToCart = isValidVariant && inStock && !isPending

    // Determine label for the add-to-cart button
    const addToCartLabel = !isValidVariant ? "Add to Bag" : !inStock ? "Out of stock" : surcharge > 0 ? `Add to Bag (+$${surcharge})` : "Add to Bag"

    const onAddToCart = useCallback(async () => {
        const success = await handleAddToCart()
        if (success) open("cart")
    }, [handleAddToCart, open])

    // const toggleCustomize = useCallback(() => {
    //     if (customizing) {
    //         // Reset customization when cancelling
    //         setCustomization(INITIAL_CUSTOMIZATION)
    //     }
    //     setCustomizing((v) => !v)
    // }, [customizing])

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
            {/* <CustomizePanel
                open={customizing}
                state={customization}
                onChange={setCustomization}
            /> */}

            <div className="flex items-stretch gap-3">
                <Button
                    onClick={onAddToCart}
                    isLoading={isPending}
                    disabled={!canAddToCart}
                    size="lg"
                    className="flex-1"
                    icon={<ShoppingBag className="size-5" aria-hidden />}
                >
                    {addToCartLabel}
                </Button>
                <Button
                    variant={customizing ? "destructive" : "outline"}
                    size="lg"
                    // onClick={toggleCustomize}
                    icon={customizing ? <X className="size-5" aria-hidden /> : <Palette className="size-5" aria-hidden />}
                >
                    {customizing ? "Cancel" : "Customize"}
                </Button>
            </div>

            {lastError && (
                <p className="text-sm text-destructive" role="alert">
                    {lastError}
                </p>
            )}

            <ProductToolbar title={product.title} variantId={selectedVariant?.id ?? null} />
        </div>
    )
}

type ProductActionsProps = {
    product: StoreProduct
    countryCode: string
}
