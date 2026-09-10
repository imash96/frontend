import { useProductStore } from "@/lib/store/use-product"
import Button from "@/ui/button"
import { ShoppingBag } from "lucide-react"

export default function AddToCartButton() {
    const { selectedVariant, inStock, isValidVariant, isPending, handleAddToCart } = useProductStore()
    return (
        <Button onClick={() => handleAddToCart()} icon={<ShoppingBag className="w-5 h-5" />} variant="primary" className="w-full h-12 gap-x-2" isLoading={isPending} disabled={!inStock || !selectedVariant || isPending || !isValidVariant}>
            {!selectedVariant ? "Select variant " : !inStock || !isValidVariant ? "Out of stock" : "Add to Bag"}
        </Button>
    )
}