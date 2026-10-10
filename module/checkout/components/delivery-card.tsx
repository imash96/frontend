"use client"

import type { StoreCartShippingOption } from "@medusajs/types"
import { CheckCircle, Circle, Clock, Loader2, Truck, TruckElectric } from "lucide-react"
import { memo, useCallback, useMemo, useOptimistic, useTransition } from "react"
import { useShallow } from "zustand/react/shallow"
import { selectIsBusy, useCheckoutStore } from "@/lib/store/checkout-store"
import ErrorMessage from "@/module/common/templates/error-message"
import Button from "@/ui/button"
import { convertToLocale } from "@/lib/util/money"
import { formatShippingPrice, getDeliveryEstimate, isExpressOption } from "../templates/step-shipping"

export default function DeliveryCard({ availableMethods, currencyCode, selectedMethodId, awaitingOptions }: Props) {
    const { error, isBusy, selectShippingOption } = useCheckoutStore(
        useShallow((s) => ({
            error: s.error,
            isBusy: selectIsBusy(s),
            selectShippingOption: s.selectShippingOption,
        })),
    )
    const [isTransitioning, startTransition] = useTransition()

    // The radio flips instantly. React reverts it if the request fails and keeps it until the
    // refreshed cart arrives if it succeeds, so there's no flash back to the old method.
    const [optimisticId, setOptimisticId] = useOptimistic(selectedMethodId)
    const isLocked = isTransitioning || isBusy

    // Plain strings only, so each memoised row re-renders only when its own data changes.
    // Sorted cheapest first: the API returns options in no guaranteed order.
    const options = useMemo(
        () =>
            [...availableMethods]
                .sort((a, b) => (a.amount ?? 0) - (b.amount ?? 0))
                .map((method) => ({
                    id: method.id,
                    name: method.name,
                    estimate: getDeliveryEstimate(method),
                    price: formatShippingPrice(method.amount, currencyCode),
                    isFree: method.amount === 0,
                    isExpress: isExpressOption(method),
                })),
        [availableMethods, currencyCode],
    )

    const select = useCallback(
        (optionId: string) => {
            startTransition(async () => {
                setOptimisticId(optionId)
                await selectShippingOption(optionId)
            })
        },
        [selectShippingOption, setOptimisticId],
    )

    // Right after the address is saved, the cart (and its options) arrive a moment later.
    // Show a placeholder instead of flashing "no delivery options".
    if (awaitingOptions) return <OptionsSkeleton />

    if (options.length === 0) {
        return (
            <p role="alert" className="text-sm text-foreground-muted">
                No delivery options are available for this address. Please check your address or contact support.
            </p>
        )
    }

    // When editing, the saved method is already selected, and radios can't be re-clicked. This
    // button re-saves it (refreshing its price for a changed address) and moves on to payment.
    const confirmId = options.some((o) => o.id === selectedMethodId) ? selectedMethodId : undefined

    return (
        <div className="space-y-4">
            <div
                role="radiogroup"
                aria-label="Delivery method"
                aria-busy={isLocked}
                className={`grid gap-3 ${options.length > 1 ? "sm:grid-cols-2" : ""}`}
            >
                {options.map((option) => (
                    <DeliveryOption
                        key={option.id}
                        {...option}
                        isSelected={optimisticId === option.id}
                        isSwitching={isTransitioning && optimisticId === option.id && selectedMethodId !== option.id}
                        disabled={isLocked}
                        onSelect={select}
                    />
                ))}
            </div>

            <div aria-live="polite">
                <ErrorMessage error={error} />
            </div>

            {confirmId && (
                <Button
                    size="lg"
                    fullWidth
                    className="sm:w-auto sm:min-w-48"
                    isLoading={isTransitioning}
                    disabled={isLocked}
                    onClick={() => select(confirmId)}
                >
                    Continue to Payment
                </Button>
            )}
        </div>
    )
}

type OptionProps = {
    id: string
    name: string
    estimate: string | null
    price: string
    isFree: boolean
    isExpress: boolean
    isSelected: boolean
    isSwitching: boolean
    disabled: boolean
    onSelect: (id: string) => void
}

const DeliveryOption = memo(function DeliveryOption({
    id,
    name,
    estimate,
    price,
    isFree,
    isExpress,
    isSelected,
    isSwitching,
    disabled,
    onSelect,
}: OptionProps) {
    const Icon = isExpress ? TruckElectric : Truck

    return (
        <label
            className={`flex items-start gap-3 rounded-xl border p-3 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-focus-ring sm:p-4 ${isSelected ? "border-accent bg-accent/5" : "border-border hover:border-accent/50"
                } ${disabled ? "cursor-not-allowed" : "cursor-pointer"} ${disabled && !isSelected ? "opacity-60" : ""}`}
        >
            {/* Native radio: arrow-key navigation and screen-reader semantics come for free.
                aria-disabled instead of disabled so keyboard focus survives the request. */}
            <input
                type="radio"
                name="shipping-method"
                value={id}
                checked={isSelected}
                aria-disabled={disabled}
                onChange={() => {
                    if (!disabled) onSelect(id)
                }}
                className="sr-only"
            />

            <span aria-hidden="true" className="mt-0.5 shrink-0 text-accent">
                {isSwitching ? (
                    <Loader2 className="size-5 animate-spin text-foreground-muted" />
                ) : isSelected ? (
                    <CheckCircle className="size-5" />
                ) : (
                    <Circle className="size-5 text-foreground-muted" />
                )}
            </span>

            {/* Spans, not <h3>: headings are invalid inside interactive content. */}
            <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2 text-sm font-semibold text-foreground sm:text-base">
                    <Icon
                        className={`size-4 shrink-0 ${isExpress ? "text-accent" : "text-foreground-muted"}`}
                        aria-hidden="true"
                    />
                    <span className="truncate">{name}</span>
                </span>

                {estimate && (
                    <span className="mt-1 flex items-center gap-1.5 text-xs text-foreground-muted sm:text-sm">
                        <Clock className="size-3.5 shrink-0" aria-hidden="true" />
                        <span className="line-clamp-2">{estimate}</span>
                    </span>
                )}

                <span className={`mt-2 block text-sm font-semibold ${isFree ? "text-success" : "text-foreground"}`}>
                    {price}
                </span>
            </span>
        </label>
    )
})

function OptionsSkeleton() {
    return (
        <div role="status" aria-busy="true" className="grid gap-3 sm:grid-cols-2">
            <span className="sr-only">Loading delivery options</span>
            <div className="h-24 animate-pulse rounded-xl bg-muted" />
            <div className="h-24 animate-pulse rounded-xl bg-muted" />
        </div>
    )
}

type Props = {
    availableMethods: StoreCartShippingOption[]
    currencyCode: string
    /** shipping_option_id of the method currently on the cart. */
    selectedMethodId?: string
    /** True while the saved address hasn't reached the page yet, so options can't be known. */
    awaitingOptions?: boolean
}