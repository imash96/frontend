"use client"

import type { StoreProduct } from "@medusajs/types"
import {
    AlertCircle,
    Award,
    Check,
    CheckCircle2,
    Clock,
    CreditCard,
    Heart,
    Loader2,
    Lock,
    Minus,
    Palette,
    Plus,
    Ruler,
    Share2,
    Shield,
    ShoppingBag,
    Sparkles,
    Truck,
    Undo2,
    Zap,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import PayPal from "@/icon/checkout-paypal"
import { useDrawerStore } from "@/lib/store/drawer-store"
import { usePreviewFlowStore } from "@/lib/store/preview-flow-store"
import {
    getDisplayImages,
    getSwatchUrl,
    isOptionValueInStock,
    useProductStore,
} from "@/lib/store/product-store"
import { useWishlistStore } from "@/lib/store/wishlist-store"
import type { ProductCalculatedPrice } from "@/lib/util/get-product-price"
import Breadcrumbs from "@/module/products/components/breadcrumbs"
import type { ProductReviewStats } from "@/types/product"
import Button from "@/ui/button"
import RatingSystem from "@/ui/rating-system"
import PreviewCustomize, {
    type BespokeCustomizationState,
    buildCustomizationMetadata,
    DEFAULT_BESPOKE_CUSTOMIZATION,
    getBespokeSurcharge,
} from "./preview-customize"
import SizeGuideModal from "./size-guide-modal"

type PreviewInfoActionsProps = {
    product: StoreProduct
    countryCode: string
    initialPrice: ProductCalculatedPrice
    reviewStats?: ProductReviewStats | null
    isFallbackData?: boolean
}

export default function PreviewInfoActions({
    product,
    countryCode,
    initialPrice,
    reviewStats,
    isFallbackData = false,
}: PreviewInfoActionsProps) {
    const router = useRouter()
    const openDrawer = useDrawerStore((s) => s.open)
    const addPreviewItem = usePreviewFlowStore((s) => s.addPreviewItem)

    const {
        setProduct,
        options,
        setOption,
        quantity,
        incrementQuantity,
        decrementQuantity,
        selectedVariant,
        isValidVariant,
        inStock,
        availableQuantity,
        cheapestPrice,
        variantPrice,
        isPending,
        lastError,
        handleAddToCart,
    } = useProductStore()

    const [customizing, setCustomizing] = useState(false)
    const [customization, setCustomization] = useState<BespokeCustomizationState>(
        DEFAULT_BESPOKE_CUSTOMIZATION,
    )
    const [sizeGuideOpen, setSizeGuideOpen] = useState(false)
    const [addedToast, setAddedToast] = useState(false)
    const [buyingNow, setBuyingNow] = useState(false)
    const [copied, setCopied] = useState(false)
    const [showStickyBar, setShowStickyBar] = useState(false)
    const mainCtaRef = useRef<HTMLDivElement>(null)

    const { hydrate: hydrateWishlist, toggle: toggleWishlist, isLoading: wishlistLoading } =
        useWishlistStore()
    const variantIds = useWishlistStore((s) => s.variantIds)
    const [localSaved, setLocalSaved] = useState(false)
    const isSaved =
        localSaved || (selectedVariant?.id ? variantIds.has(selectedVariant.id) : false)

    useEffect(() => {
        setProduct(product, countryCode)
        hydrateWishlist()
    }, [product, countryCode, setProduct, hydrateWishlist])

    // Observe main CTA visibility for sticky mobile purchase bar
    useEffect(() => {
        const el = mainCtaRef.current
        if (!el || typeof IntersectionObserver === "undefined") return
        const observer = new IntersectionObserver(
            ([entry]) => {
                setShowStickyBar(!entry.isIntersecting)
            },
            { threshold: 0.1 },
        )
        observer.observe(el)
        return () => observer.disconnect()
    }, [])

    const activePrice = selectedVariant ? variantPrice : cheapestPrice ?? initialPrice
    const baseNumericPrice = Number(activePrice?.calculated_price_number ?? 420)
    const origNumericPrice = Number(activePrice?.original_price_number ?? baseNumericPrice)
    const surcharge = getBespokeSurcharge(customization)
    const unitFinalPrice = baseNumericPrice + surcharge
    const totalLinePrice = unitFinalPrice * quantity
    const installmentAmount = (unitFinalPrice / 4).toFixed(2)
    const isSale = activePrice?.price_type === "sale" && origNumericPrice > baseNumericPrice

    // Estimated delivery dates (3-6 days from today)
    const deliveryWindow = useMemo(() => {
        const now = new Date()
        const start = new Date(now)
        start.setDate(now.getDate() + 3)
        const end = new Date(now)
        end.setDate(now.getDate() + 6)
        const fmt = (d: Date) =>
            d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
        return `${fmt(start)} – ${fmt(end)}`
    }, [])

    const crumbs = useMemo(() => {
        const base = [{ label: "Home", href: "/" }]
        if (product.categories?.length) {
            for (const c of product.categories) {
                base.push({ label: c.name, href: `/categories/${c.handle}` })
            }
        } else {
            base.push({ label: "Leather Collection", href: "/collections" })
        }
        base.push({
            label: product.title,
            href: `/product-preview/${product.handle}`,
        })
        return base
    }, [product.categories, product.title, product.handle])

    const sizeOption = useMemo(
        () =>
            product.options?.find(
                (o) => o.title?.toLowerCase() === "size",
            ),
        [product.options],
    )
    const availableSizes = useMemo(
        () => sizeOption?.values?.map((v) => v.value) ?? ["XS", "S", "M", "L", "XL", "2XL"],
        [sizeOption],
    )

    const syncToPreviewStore = useCallback(() => {
        const displayImgs = getDisplayImages(product, selectedVariant)
        const thumb =
            selectedVariant?.thumbnail ||
            displayImgs[0]?.url ||
            product.thumbnail ||
            "/images/col_thumb/col_mens_1.webp"
        const metadata = buildCustomizationMetadata(customization)

        addPreviewItem({
            id: `item_${selectedVariant?.id || product.id}_${Date.now()}`,
            productId: product.id,
            productTitle: product.title,
            productHandle: product.handle,
            thumbnail: thumb,
            variantId: selectedVariant?.id || "var_default",
            variantTitle:
                selectedVariant?.title ||
                Object.values(options).filter(Boolean).join(" / ") ||
                "Standard",
            variantSku: selectedVariant?.sku || product.mid_code || "VH-MLN-01",
            unitPrice: unitFinalPrice,
            originalUnitPrice: origNumericPrice + surcharge,
            quantity,
            currencyCode: activePrice?.currency_code ?? "usd",
            metadata,
        })
    }, [
        product,
        selectedVariant,
        customization,
        addPreviewItem,
        options,
        unitFinalPrice,
        origNumericPrice,
        surcharge,
        quantity,
        activePrice?.currency_code,
    ])

    const onAddToBag = useCallback(async () => {
        if (!isValidVariant || !inStock || isPending) return
        const metadata = buildCustomizationMetadata(customization)

        // Always sync into the preview flow store so /checkout-preview reflects it immediately
        syncToPreviewStore()

        // Also attempt live Medusa server action if not strictly offline fallback
        if (!isFallbackData) {
            const ok = await handleAddToCart(metadata)
            if (ok) {
                openDrawer("cart")
            }
        }

        setAddedToast(true)
        window.setTimeout(() => setAddedToast(false), 3500)
    }, [
        isValidVariant,
        inStock,
        isPending,
        customization,
        syncToPreviewStore,
        isFallbackData,
        handleAddToCart,
        openDrawer,
    ])

    const onBuyNow = useCallback(async () => {
        if (!isValidVariant || !inStock || buyingNow) return
        setBuyingNow(true)
        try {
            const metadata = buildCustomizationMetadata(customization)
            syncToPreviewStore()
            if (!isFallbackData) {
                await handleAddToCart(metadata).catch(() => null)
            }
            router.push("/checkout-preview")
        } finally {
            setBuyingNow(false)
        }
    }, [
        isValidVariant,
        inStock,
        buyingNow,
        customization,
        syncToPreviewStore,
        isFallbackData,
        handleAddToCart,
        router,
    ])

    const onShare = async () => {
        const url = `${window.location.origin}${window.location.pathname}`
        try {
            if (navigator.share) {
                await navigator.share({ title: product.title, url })
                return
            }
            await navigator.clipboard.writeText(url)
            setCopied(true)
            window.setTimeout(() => setCopied(false), 2000)
        } catch {
            // Ignore
        }
    }

    const onWishlistClick = async () => {
        setLocalSaved((prev) => !prev)
        if (selectedVariant?.id && !isFallbackData) {
            await toggleWishlist(selectedVariant.id).catch(() => null)
        }
    }

    const canPurchase = isValidVariant && inStock && !isPending && !buyingNow
    const typeName = (product as any).type?.value as string | undefined

    return (
        <div className="flex flex-col gap-y-5">
            {/* Breadcrumbs */}
            <Breadcrumbs items={crumbs} />

            {/* Eyebrow + Title + Subtitle */}
            <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-accent">
                        <Sparkles className="size-3" />
                        {product.collection?.title || "Atelier Reserve"}
                        {typeName ? ` · ${typeName}` : ""}
                    </span>
                    {(selectedVariant?.sku || product.mid_code) && (
                        <span className="rounded-md bg-muted px-2 py-0.5 font-mono text-[11px] text-text-tertiary">
                            SKU: {selectedVariant?.sku || product.mid_code}
                        </span>
                    )}
                </div>

                <h1 className="font-heading text-2xl font-bold leading-tight tracking-tight text-text-primary sm:text-3xl">
                    {product.title}
                </h1>

                {product.subtitle && (
                    <p className="text-sm leading-relaxed text-text-secondary">
                        {product.subtitle}
                    </p>
                )}
            </div>

            {/* Rating & Stock Row */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-divider pb-4">
                <a
                    href="#reviews"
                    className="inline-flex items-center gap-2 transition-opacity hover:opacity-80"
                >
                    <RatingSystem
                        averageRating={reviewStats?.average_rating ?? 4.9}
                        reviewCount={reviewStats?.review_count ?? 128}
                        size="md"
                    />
                    <span className="text-xs font-medium text-link underline underline-offset-2">
                        Read reviews
                    </span>
                </a>

                {/* Stock Status Pill */}
                <div>
                    {!isValidVariant ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-warning-subtle px-2.5 py-1 text-xs font-medium text-warning">
                            <Clock className="size-3.5" />
                            Select options
                        </span>
                    ) : inStock ? (
                        availableQuantity != null && availableQuantity <= 5 ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-warning-subtle px-2.5 py-1 text-xs font-semibold text-warning">
                                <span className="size-2 animate-pulse rounded-full bg-warning" />
                                Low Stock — Only {availableQuantity} left
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-success-subtle px-2.5 py-1 text-xs font-semibold text-success">
                                <CheckCircle2 className="size-3.5" />
                                In Stock · Ships in 24h
                            </span>
                        )
                    ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-destructive-subtle px-2.5 py-1 text-xs font-semibold text-destructive">
                            <AlertCircle className="size-3.5" />
                            Currently Out of Stock
                        </span>
                    )}
                </div>
            </div>

            {/* Price & Pay Later Breakdown Box */}
            <div className="rounded-2xl border border-border bg-surface p-4 shadow-xs">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <div className="flex flex-wrap items-baseline gap-2.5">
                        <span
                            className={`font-heading text-2xl font-bold tabular-nums sm:text-3xl ${
                                isSale ? "text-price-sale" : "text-price-current"
                            }`}
                        >
                            ${unitFinalPrice.toFixed(2)}
                        </span>
                        {isSale && (
                            <>
                                <s className="text-base tabular-nums text-price-original">
                                    ${(origNumericPrice + surcharge).toFixed(2)}
                                </s>
                                <span className="rounded-md bg-badge-sale px-2 py-0.5 text-xs font-bold text-badge-sale-foreground">
                                    Save ${(origNumericPrice - baseNumericPrice).toFixed(0)} (
                                    {activePrice?.percentage_diff || 25}% OFF)
                                </span>
                            </>
                        )}
                        {surcharge > 0 && (
                            <span className="rounded-md bg-accent/15 px-2 py-0.5 text-xs font-semibold text-accent">
                                Includes +${surcharge} Bespoke Upgrade
                            </span>
                        )}
                    </div>
                    <span className="text-[11px] text-text-tertiary">
                        Taxes &amp; duties included
                    </span>
                </div>

                {/* Pay Later / Installments Banner */}
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-divider pt-3 text-xs text-text-secondary">
                    <p className="flex items-center gap-1.5">
                        <PayPal className="size-4 shrink-0" />
                        <span>
                            Pay in 4 interest-free payments of{" "}
                            <strong className="font-semibold text-text-primary">
                                ${installmentAmount}
                            </strong>{" "}
                            with <strong className="font-semibold text-text-primary">Pay Later</strong>
                        </span>
                    </p>
                    <span className="rounded bg-accent-subtle px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent">
                        0% APR
                    </span>
                </div>
            </div>

            {/* Variant Options (Color & Size) */}
            {(product.options?.length ?? 0) > 0 && (
                <div className="space-y-4">
                    {product.options?.map((option) => {
                        const title = option.title ?? ""
                        const key = title.toLowerCase()
                        const isColor = key === "color" || key === "colour"
                        const isSize = key === "size"
                        const selectedVal = options[option.id]

                        const sortedValues = [...(option.values ?? [])].sort(
                            (a, b) =>
                                ((a as any).rank ?? Infinity) -
                                ((b as any).rank ?? Infinity),
                        )

                        if (isColor) {
                            return (
                                <div key={option.id} className="space-y-2.5">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                                            Leather Finish &amp; Color
                                        </span>
                                        <span className="text-xs font-semibold text-text-primary">
                                            {selectedVal || "Select a color"}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap gap-3">
                                        {sortedValues.map((v) => {
                                            const val = v.value
                                            const isSelected = selectedVal === val
                                            const swatchUrl = getSwatchUrl(product, val)
                                            const valInStock = isOptionValueInStock(
                                                product,
                                                options,
                                                option.id,
                                                val,
                                            )

                                            return (
                                                <button
                                                    key={val}
                                                    type="button"
                                                    onClick={() => setOption(option.id, val)}
                                                    aria-pressed={isSelected}
                                                    aria-label={`Color ${val}${!valInStock ? " (Out of stock)" : ""}`}
                                                    className={`group relative flex items-center gap-2.5 rounded-xl border-2 p-1.5 pr-3 transition-all duration-200 ${
                                                        isSelected
                                                            ? "border-primary bg-primary/5 shadow-xs"
                                                            : "border-border bg-surface hover:border-border-strong"
                                                    } ${!valInStock ? "opacity-55" : ""}`}
                                                >
                                                    <span className="relative size-9 overflow-hidden rounded-lg border border-border bg-white shrink-0">
                                                        {swatchUrl ? (
                                                            <Image
                                                                src={swatchUrl}
                                                                alt={val}
                                                                width={40}
                                                                height={40}
                                                                sizes="40px"
                                                                className="size-full object-cover"
                                                            />
                                                        ) : (
                                                            <span className="flex size-full items-center justify-center text-[10px] font-bold uppercase">
                                                                {val.slice(0, 2)}
                                                            </span>
                                                        )}
                                                    </span>
                                                    <span className="text-left">
                                                        <span className="block text-xs font-semibold text-text-primary">
                                                            {val}
                                                        </span>
                                                        <span className="block text-[10px] text-text-tertiary">
                                                            {valInStock ? "Aniline Full-Grain" : "Waitlist"}
                                                        </span>
                                                    </span>
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                            )
                        }

                        return (
                            <div key={option.id} className="space-y-2.5">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                                        {title}
                                    </span>
                                    {isSize && (
                                        <button
                                            type="button"
                                            onClick={() => setSizeGuideOpen(true)}
                                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-link transition-colors hover:text-link-hover"
                                        >
                                            <Ruler className="size-3.5" />
                                            <span className="underline underline-offset-2">
                                                Size Guide &amp; Fit Finder
                                            </span>
                                        </button>
                                    )}
                                </div>

                                <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                                    {sortedValues.map((v) => {
                                        const val = v.value
                                        const isSelected = selectedVal === val
                                        const valInStock = isOptionValueInStock(
                                            product,
                                            options,
                                            option.id,
                                            val,
                                        )

                                        return (
                                            <button
                                                key={val}
                                                type="button"
                                                onClick={() => setOption(option.id, val)}
                                                aria-pressed={isSelected}
                                                className={`relative flex flex-col items-center justify-center rounded-xl border-2 py-2.5 px-3 text-sm font-semibold transition-all duration-150 ${
                                                    isSelected
                                                        ? "border-primary bg-primary text-primary-foreground shadow-sm"
                                                        : valInStock
                                                          ? "border-border bg-surface text-text-primary hover:border-border-strong hover:bg-muted/50"
                                                          : "border-border-subtle bg-muted/40 text-text-disabled line-through"
                                                }`}
                                            >
                                                <span>{val}</span>
                                                {!valInStock && (
                                                    <span className="text-[9px] font-normal no-underline">
                                                        Sold Out
                                                    </span>
                                                )}
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            {/* Bespoke Customization Toggle Banner */}
            <div>
                <button
                    type="button"
                    onClick={() => setCustomizing((prev) => !prev)}
                    aria-expanded={customizing}
                    className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition-all ${
                        customizing || surcharge > 0
                            ? "border-accent bg-accent/10 text-text-primary"
                            : "border-border bg-surface hover:border-border-strong"
                    }`}
                >
                    <div className="flex items-center gap-3">
                        <span className="flex size-9 items-center justify-center rounded-lg bg-accent/20 text-accent">
                            <Palette className="size-4.5" />
                        </span>
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-text-primary sm:text-sm">
                                Personalize Lining, Hardware &amp; Monogram
                            </p>
                            <p className="text-xs text-text-secondary">
                                {surcharge > 0
                                    ? `Active bespoke upgrades (+$${surcharge}) · Click to edit`
                                    : "Optional bespoke upgrades from +$5 · Complimentary custom sizing"}
                            </p>
                        </div>
                    </div>
                    <span className="rounded-lg border border-border bg-background px-2.5 py-1 text-xs font-semibold text-text-primary">
                        {customizing ? "Hide Studio" : "Customize"}
                    </span>
                </button>

                {customizing && (
                    <div className="mt-3">
                        <PreviewCustomize
                            open={customizing}
                            state={customization}
                            onChange={setCustomization}
                            onReset={() => setCustomization(DEFAULT_BESPOKE_CUSTOMIZATION)}
                        />
                    </div>
                )}
            </div>

            {/* Quantity + Primary & Express Checkout CTAs */}
            <div ref={mainCtaRef} className="space-y-3 pt-1">
                <div className="flex items-stretch gap-3">
                    {/* Quantity Stepper */}
                    <div
                        className="inline-flex h-12 sm:h-13 items-center rounded-xl border-2 border-border bg-surface px-1"
                        aria-label="Quantity selector"
                    >
                        <button
                            type="button"
                            onClick={decrementQuantity}
                            disabled={quantity <= 1 || isPending}
                            aria-label="Decrease quantity"
                            className="flex size-10 items-center justify-center rounded-lg text-text-primary transition-colors hover:bg-muted disabled:opacity-40"
                        >
                            <Minus className="size-4" />
                        </button>
                        <span className="min-w-8 text-center font-heading text-base font-bold tabular-nums text-text-primary">
                            {quantity}
                        </span>
                        <button
                            type="button"
                            onClick={incrementQuantity}
                            disabled={
                                isPending ||
                                (availableQuantity != null && quantity >= availableQuantity)
                            }
                            aria-label="Increase quantity"
                            className="flex size-10 items-center justify-center rounded-lg text-text-primary transition-colors hover:bg-muted disabled:opacity-40"
                        >
                            <Plus className="size-4" />
                        </button>
                    </div>

                    {/* Add to Bag Button */}
                    <Button
                        onClick={onAddToBag}
                        isLoading={isPending}
                        disabled={!canPurchase}
                        size="lg"
                        className="flex-1 h-12 sm:h-13 rounded-xl text-sm sm:text-base font-semibold"
                        icon={<ShoppingBag className="size-5" aria-hidden />}
                    >
                        {!isValidVariant
                            ? "Select Size & Color"
                            : !inStock
                              ? "Out of Stock"
                              : `Add to Bag · $${totalLinePrice.toFixed(2)}`}
                    </Button>
                </div>

                {/* Express Checkout CTA -> /checkout-preview */}
                <button
                    type="button"
                    onClick={onBuyNow}
                    disabled={!canPurchase}
                    className="flex h-12 sm:h-13 w-full items-center justify-center gap-2 rounded-xl border-2 border-accent bg-accent text-accent-foreground font-heading text-sm sm:text-base font-bold tracking-wide shadow-sm transition-all hover:bg-accent-hover active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {buyingNow ? (
                        <>
                            <Loader2 className="size-5 animate-spin" />
                            <span>Preparing Express Checkout…</span>
                        </>
                    ) : (
                        <>
                            <Zap className="size-4.5 fill-current" />
                            <span>Buy It Now — Instant Checkout</span>
                        </>
                    )}
                </button>

                {/* Added to Bag Feedback Banner with Direct Link to /checkout-preview */}
                {addedToast && (
                    <div
                        role="status"
                        aria-live="polite"
                        className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-success/40 bg-success-subtle px-4 py-3 text-xs sm:text-sm text-success"
                    >
                        <span className="inline-flex items-center gap-2 font-semibold">
                            <Check className="size-4 shrink-0" />
                            Added to your bag ({quantity} × {product.title})
                        </span>
                        <Link
                            href="/checkout-preview"
                            className="inline-flex items-center gap-1 rounded-lg bg-success px-3 py-1.5 text-xs font-bold text-success-foreground shadow-xs transition-opacity hover:opacity-90"
                        >
                            <span>Proceed to Checkout</span>
                            <span>→</span>
                        </Link>
                    </div>
                )}

                {lastError && (
                    <p className="text-xs font-medium text-destructive" role="alert">
                        {lastError}
                    </p>
                )}
            </div>

            {/* Wishlist, Share & Direct Checkout Preview Link */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-y border-divider py-3 text-xs">
                <div className="flex items-center gap-4">
                    <button
                        type="button"
                        onClick={onWishlistClick}
                        disabled={wishlistLoading}
                        aria-pressed={isSaved}
                        className="inline-flex items-center gap-1.5 font-medium text-text-secondary transition-colors hover:text-text-primary"
                    >
                        <Heart
                            className={`size-4 transition-colors ${
                                isSaved ? "fill-destructive text-destructive" : ""
                            }`}
                        />
                        <span>{isSaved ? "Saved to Wishlist" : "Save to Wishlist"}</span>
                    </button>

                    <span className="h-3.5 w-px bg-divider" aria-hidden />

                    <button
                        type="button"
                        onClick={onShare}
                        className="inline-flex items-center gap-1.5 font-medium text-text-secondary transition-colors hover:text-text-primary"
                    >
                        <Share2 className="size-4" />
                        <span>{copied ? "Link Copied!" : "Share Piece"}</span>
                    </button>
                </div>

                <Link
                    href="/checkout-preview"
                    className="inline-flex items-center gap-1 font-semibold text-accent hover:underline"
                >
                    <span>Go to Checkout Preview</span>
                    <span>→</span>
                </Link>
            </div>

            {/* Delivery & Payment Providers Card */}
            <div className="space-y-3 rounded-2xl border border-border bg-background-secondary/50 p-4">
                <div className="flex items-start gap-3">
                    <Truck className="mt-0.5 size-5 shrink-0 text-accent" />
                    <div className="text-xs">
                        <p className="font-semibold text-text-primary">
                            Complimentary Express Insured Delivery
                        </p>
                        <p className="mt-0.5 text-text-secondary">
                            Order today for estimated arrival between{" "}
                            <strong className="text-text-primary">{deliveryWindow}</strong>. Ships in signature dust bag &amp; cedar-lined presentation box.
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-3 border-t border-divider pt-3">
                    <Undo2 className="mt-0.5 size-5 shrink-0 text-accent" />
                    <div className="text-xs">
                        <p className="font-semibold text-text-primary">
                            30-Day Risk-Free Returns &amp; Free Size Exchange
                        </p>
                        <p className="mt-0.5 text-text-secondary">
                            Pre-paid return courier label included with every order. 2-Year Craftsmanship &amp; Hardware Warranty.
                        </p>
                    </div>
                </div>

                {/* Supported Payment Providers */}
                <div className="border-t border-divider pt-3">
                    <div className="flex items-center justify-between text-[11px] text-text-tertiary mb-2">
                        <span className="inline-flex items-center gap-1 font-medium">
                            <Lock className="size-3 text-success" />
                            256-Bit Encrypted Checkout Providers
                        </span>
                        <span>Instant Approval</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                        <div className="flex items-center justify-center gap-1.5 rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs font-semibold text-text-primary">
                            <PayPal className="size-3.5" />
                            <span>PayPal</span>
                        </div>
                        <div className="flex items-center justify-center gap-1.5 rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs font-semibold text-text-primary">
                            <CreditCard className="size-3.5 text-accent" />
                            <span>PayPal Card</span>
                        </div>
                        <div className="flex items-center justify-center gap-1.5 rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs font-semibold text-text-primary">
                            <Clock className="size-3.5 text-accent" />
                            <span>Pay Later</span>
                        </div>
                        <div className="flex items-center justify-center gap-1.5 rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs font-semibold text-text-primary">
                            <Shield className="size-3.5 text-success" />
                            <span>PayU</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 4 Pillars Mini Grid */}
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                {[
                    { icon: Shield, title: "100% Full-Grain", sub: "Italian Lambskin" },
                    { icon: Award, title: "47-Step Craft", sub: "Hand-Stitched" },
                    { icon: Truck, title: "Free Express", sub: "Insured Courier" },
                    { icon: Undo2, title: "30-Day Returns", sub: "Free Exchanges" },
                ].map((b) => (
                    <div
                        key={b.title}
                        className="flex flex-col items-center rounded-xl border border-border bg-surface p-3 text-center"
                    >
                        <b.icon className="size-5 text-accent mb-1.5" strokeWidth={1.5} />
                        <span className="text-xs font-semibold text-text-primary">
                            {b.title}
                        </span>
                        <span className="text-[10px] text-text-tertiary">{b.sub}</span>
                    </div>
                ))}
            </div>

            {/* Interactive Size Guide Modal */}
            <SizeGuideModal
                open={sizeGuideOpen}
                onClose={() => setSizeGuideOpen(false)}
                availableSizes={availableSizes}
                selectedSize={sizeOption ? options[sizeOption.id] : undefined}
                onSelectSize={(sizeVal) => {
                    if (sizeOption) setOption(sizeOption.id, sizeVal)
                }}
            />

            {/* Sticky Mobile/Tablet Bottom Purchase Bar */}
            {showStickyBar && (
                <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface/95 px-3 py-2.5 shadow-2xl backdrop-blur-md lg:hidden">
                    <div className="mx-auto flex max-w-xl items-center justify-between gap-3">
                        <div className="min-w-0">
                            <p className="truncate text-xs font-semibold text-text-primary">
                                {product.title}
                            </p>
                            <p className="text-xs font-bold text-accent tabular-nums">
                                ${unitFinalPrice.toFixed(2)}{" "}
                                <span className="font-normal text-text-tertiary">
                                    ·{" "}
                                    {Object.values(options).filter(Boolean).join(" / ") ||
                                        "Select options"}
                                </span>
                            </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                            <button
                                type="button"
                                onClick={onAddToBag}
                                disabled={!canPurchase}
                                className="rounded-lg bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground shadow-xs disabled:opacity-50"
                            >
                                Add to Bag
                            </button>
                            <button
                                type="button"
                                onClick={onBuyNow}
                                disabled={!canPurchase}
                                className="rounded-lg bg-accent px-3.5 py-2 text-xs font-bold text-accent-foreground shadow-xs disabled:opacity-50"
                            >
                                Buy Now
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
