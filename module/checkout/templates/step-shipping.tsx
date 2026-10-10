import { convertToLocale } from "@/lib/util/money"
import { StoreCart, StoreCartShippingOption } from "@medusajs/types"
import { Plane } from "lucide-react"
import CheckoutStepHeader from "../componenets/step-header"
import DeliveryCard from "../componenets/delivery-card"

export default function StepShipping({ cart, shippingMethods }: StepShippingProps) {

    if (!shippingMethods) {
        return (
            <div className="lg:col-span-10 py-8 sm:py-12 text-center space-y-2 px-4">
                <h1 className="text-base sm:text-lg font-semibold text-foreground">
                    We couldn&apos;t load checkout
                </h1>
                <p className="text-xs sm:text-sm text-foreground-muted max-w-md mx-auto">
                    Something went wrong loading shipping options. Please refresh the page or try again shortly.
                </p>
            </div>
        )
    }

    const selectedMethod = cart.shipping_methods?.at(0)
    const selectedOption = shippingMethods.find(
        (m) => m.id === selectedMethod?.shipping_option_id
    )

    const completedView = selectedOption ? (
        <>
            <div className="flex flex-wrap items-center justify-between gap-4 p-5 text-xs sm:px-6">
                <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-xl bg-accent/15 text-accent">
                        <Plane className="size-4" />
                    </div>
                    <div>
                        <p className="font-semibold text-text-primary">
                            {selectedOption.name}
                        </p>
                        <p className="text-text-secondary">
                            {(selectedOption.data as any)?.estimated_days ||
                                "3–5 business days"}{" "}
                            {/* {giftWrap ? "• Includes Cedar & Satin Gift Presentation" : ""} */}
                        </p>
                    </div>
                </div>
                <span className="font-mono text-sm font-bold text-text-primary">
                    {selectedOption.amount === 0
                        ? "FREE"
                        : convertToLocale({
                            amount: selectedOption.amount,
                            currency_code: cart.currency_code || "usd",
                        })}
                </span>
            </div>
        </>
    ) : null

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
                cartId={cart.id}
                currencyCode={cart.currency_code}
                selectedMethodId={cart.shipping_methods?.at(0)?.shipping_option_id}
            />
        </CheckoutStepHeader>
    )
}

type StepShippingProps = {
    cart: StoreCart
    shippingMethods: StoreCartShippingOption[]
}

