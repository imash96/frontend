import { deriveCheckoutProgress } from "@/lib/store/checkout-store"
import type { StoreCart, StoreCartShippingOption } from "@medusajs/types"
import { Truck, TruckElectric } from "lucide-react"
import DeliveryCard from "../components/delivery-card"
import { convertToLocale } from "@/lib/util/money"
import CheckoutStepHeader from "../components/step-header"

export default function StepShipping({ cart, shippingMethods }: StepShippingProps) {
    // The newest method wins, as in the Medusa starter. Its name/amount come from the cart itself,
    // so the summary shows what the customer is actually charged even if the options list changed.
    const selectedMethod = cart.shipping_methods?.at(-1)
    const selectedOption = shippingMethods.find((o) => o.id === selectedMethod?.shipping_option_id)

    const awaitingOptions = !deriveCheckoutProgress(cart).completed.includes("address")

    let completedView: React.ReactNode = null
    if (selectedMethod) {
        const Icon = selectedOption && isExpressOption(selectedOption) ? TruckElectric : Truck
        const estimate = selectedOption ? getDeliveryEstimate(selectedOption) : null

        // No padding here: the step header's panel already provides it (it used to be doubled).
        completedView = (
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                        <Icon className="size-4" aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-foreground">
                            {selectedMethod.name ?? selectedOption?.name}
                        </p>
                        {estimate && <p className="text-xs text-foreground-muted sm:text-sm">{estimate}</p>}
                    </div>
                </div>
                <span className="text-sm font-semibold tabular-nums text-foreground">
                    {formatShippingPrice(selectedMethod.amount, cart.currency_code)}
                </span>
            </div>
        )
    }

    return (
        <CheckoutStepHeader
            title="Delivery Method"
            subtitle="Choose your preferred shipping speed"
            number={2}
            stepId="shipping"
            completedContent={completedView}
        >
            <DeliveryCard
                availableMethods={shippingMethods}
                currencyCode={cart.currency_code}
                selectedMethodId={selectedMethod?.shipping_option_id}
                awaitingOptions={awaitingOptions}
            />
        </CheckoutStepHeader>
    )
}

type StepShippingProps = {
    cart: StoreCart
    shippingMethods: StoreCartShippingOption[]
}

const EXPRESS_TYPE_CODES: ReadonlySet<string> = new Set(["expedite", "express"])

export function isExpressOption(option: Pick<StoreCartShippingOption, "type">) {
    return EXPRESS_TYPE_CODES.has(option.type?.code ?? "")
}

/**
 * "Free" for 0, a formatted price otherwise. Calculated-price options have no amount until the
 * method is added to the cart, so they point at the order summary instead of showing NaN.
 */
export function formatShippingPrice(amount: number | null | undefined, currencyCode: string) {
    if (typeof amount !== "number") return "Shown in order summary"
    if (amount === 0) return "Free"
    return convertToLocale({ amount, currency_code: currencyCode })
}

/**
 * What we can honestly tell the customer about timing: a configured estimate, or the option's
 * description. There is deliberately no default: the old "3-5 business days" fallback promised a
 * delivery time nobody had configured.
 */
export function getDeliveryEstimate(
    option: Pick<StoreCartShippingOption, "type" | "data">,
): string | null {
    const days = option.data?.estimated_days
    if (typeof days === "number") return `${days} business ${days === 1 ? "day" : "days"}`
    if (typeof days === "string" && days.trim()) return days.trim()
    return option.type?.description?.trim() || null
}