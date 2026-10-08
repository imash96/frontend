import { redirect } from "next/navigation"
import { PREVIEW_PRODUCT } from "@/data/preview-data"

export default function ProductPreviewIndexPage() {
    redirect(`/product-preview/${PREVIEW_PRODUCT.handle}`)
}
