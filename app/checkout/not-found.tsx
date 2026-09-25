import { ShoppingBag } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"
import Button from "@/ui/button"

export const metadata: Metadata = {
  title: "Cart Not Found | Velle Hide Store",
  description: "Your cart could not be found. Please start shopping to create a new cart.",
}

export default function CheckNotFound() {
  return (
    <div className="col-span-full flex flex-col items-center justify-center min-h-[50vh] text-center px-4 space-y-4">
      <ShoppingBag className="w-12 h-12 text-foreground-muted" />
      <h1 className="text-lg sm:text-xl font-semibold text-foreground">
        Cart not found
      </h1>
      <p className="text-sm text-foreground-muted max-w-md">
        We couldn&apos;t find your cart. It may have expired or already been
        completed.
      </p>
      <Button href="/" variant="primary" size="md">
        Continue Shopping
      </Button>
    </div>
  )
}
