"use client"

import { StoreProduct } from "@medusajs/types"
import { Gem, Hammer, Heart, HeartPlus, Pencil, Scissors, Wind } from "lucide-react"
import Button from "@/ui/button"
import { useIntersection } from "@/lib/hook/use-in-view"
import OptionSelect from "../components/option-select"
import ProductPrice from "../components/product-price"
import { useProductStore } from '@/lib/store/use-product'
import MobileActions from "../components/mobile-action"
import { useRef } from "react"
import AddToCartButton from "../components/add-to-cart"

export default function ProductActions({ product }: ProductActionsProps) {
    const { selectedVariant, isPending } = useProductStore()
    const actionsRef = useRef<HTMLDivElement>(null)
    const inView = useIntersection(actionsRef, "0px")

    return (
        <>
            <div className="flex flex-col gap-y-4" >
                <ProductPrice />
                <div className="flex flex-col gap-y-3 text-sm text-foreground-muted">
                    <div className="flex items-center gap-x-3">
                        <Hammer width={32} />
                        <span>
                            <strong>Handcrafted Excellence</strong> – Each jacket is made to order by skilled artisans, ensuring uniqueness in every stitch.
                        </span>
                    </div>
                    <div className="flex items-center gap-x-3">
                        <Scissors width={32} />
                        <span>
                            <strong>Tailored Fit</strong> – Designed to complement your style with precision and comfort.
                        </span>
                    </div>
                    <div className="flex items-center gap-x-3">
                        <Gem width={32} />
                        <span>
                            <strong>Premium Leather</strong> – Crafted from 100% genuine leather for lasting quality and luxury appeal.
                        </span>
                    </div>
                    <div className="flex items-center gap-x-3">
                        <Wind width={32} />
                        <span>
                            <strong>Adaptive Comfort</strong> – Natural leather breathes, stretches, and molds to your body over time.
                        </span>
                    </div>
                </div>
                <div className="flex flex-col gap-y-4">
                    {(product.options || []).map((option) => (
                        <OptionSelect
                            key={option.id}
                            option={option}
                            title={option.title}
                            disabled={isPending}
                        />
                    ))}
                </div>
                <div className="flex flex-col md:flex-row items-center gap-2" ref={actionsRef}>
                    <AddToCartButton />
                    <div className="flex items-center gap-2 w-full">
                        <Button variant="outline" icon={<Pencil className="w-5 h-5" />} color="secondary" className="w-full h-12">
                            Customize
                        </Button>
                        <Button shape="pill" icon={<HeartPlus className="w-5 h-5" />} color="secondary" className="h-12 px-4" />
                    </div>
                </div>
                <MobileActions
                    pOption={product.options}
                    show={inView}
                />
            </div>
        </>
    )
}

type ProductActionsProps = {
    product: StoreProduct
}


{/* <div className="flex items-center gap-4">
    <Button
        onClick={handleAddToCart}
        variant="solid"
        className="w-full h-12 flex-1"
        isLoading={isPending}
        disabled={!inStock || !selectedVariant || disabled || isPending || !isValidVariant}
    >
        {!selectedVariant ? "Select variant" : !inStock || !isValidVariant ? "Out of stock" :
            <span className="flex items-center justify-center gap-x-2">
                {isPending ? <Loader className="w-5 h-5 animate-spin" /> : <ShoppingBag className="w-5 h-5" />}
                Add to Bag
            </span>}
    </Button>
    <Button
        variant="outline"
        className="w-full h-12 flex-1"
    >
        {!isValidVariant ? "Select variant" : !inStock ? "Out of stock" : (
            <span className="flex items-center justify-center gap-x-2">
                {!isValidVariant ? <Loader className="w-5 h-5 animate-spin" /> : <Pencil className="w-5 h-5" />}
                Customize
            </span>
        )}
    </Button>
</div> */}