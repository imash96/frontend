"use client"

import { ExternalLink, Loader2, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { removeFromWishlist } from "@/lib/action/wishlist"
import { AlertModal } from "@/ui/alert-modal"

export default function WishlistItemActions({
    wishlistId,
    itemId,
    productHandle,
}: {
    wishlistId: string
    itemId: string
    productHandle?: string | null
}) {
    const router = useRouter()
    const [showConfirm, setShowConfirm] = useState(false)
    const [isRemoving, startTransition] = useTransition()

    return (
        <>
            <div className="flex items-center gap-1">
                {productHandle && (
                    <a
                        href={`/products/${productHandle}`}
                        className="p-1.5 text-muted-foreground hover:text-foreground rounded-md transition-colors"
                        aria-label="View product"
                    >
                        <ExternalLink size={14} />
                    </a>
                )}
                <button
                    type="button"
                    onClick={() => setShowConfirm(true)}
                    disabled={isRemoving}
                    className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                    aria-label="Remove from wishlist"
                >
                    {isRemoving ? (
                        <Loader2 size={14} className="animate-spin" />
                    ) : (
                        <Trash2 size={14} />
                    )}
                </button>
            </div>

            <AlertModal
                open={showConfirm}
                onOpenChange={setShowConfirm}
                variant="danger"
                title="Remove from Wishlist"
                description="Are you sure you want to remove this item from your wishlist?"
                confirmLabel="Remove"
                cancelLabel="Keep"
                isLoading={isRemoving}
                onConfirm={() => {
                    startTransition(async () => {
                        await removeFromWishlist(wishlistId, itemId)
                        setShowConfirm(false)
                        router.refresh()
                    })
                }}
            />
        </>
    )
}
