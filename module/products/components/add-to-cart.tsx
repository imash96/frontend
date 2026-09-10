import { useProductStore } from "@/lib/store/use-product";
import Button from "@/ui/button";
import { ShoppingBag } from "lucide-react";

export default function AddToCartButton() {
  const { selectedVariant, inStock, isValidVariant, isPending } = useProductStore();
  return (
    <Button
      icon={<ShoppingBag className="size-5" />}
      className="w-full h-12 gap-x-2"
      isLoading={isPending}
      disabled={!inStock || !selectedVariant || isPending || !isValidVariant}
    >
      {/* {!selectedVariant ? "Select variant " : !inStock || !isValidVariant ? "Out of stock" : "Add to Cart"} */}
      Add to Cart
    </Button>
  );
}
