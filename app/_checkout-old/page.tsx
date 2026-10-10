import { notFound, redirect } from "next/navigation"
import { getCheckCart, getCheckoutCustomer, getCheckoutPaymentMethods, getCheckoutShippingMethods, } from "@/lib/action/checkout"
import CheckProgress from "@/module/checkout-old/templates/check-progress"
import CheckStoreInitializer from "@/module/checkout-old/templates/check-store-initializer"
import CheckSummary from "@/module/checkout-old/templates/check-summary"
import CheckWrapper from "@/module/checkout-old/templates/check-wrapper"
import StepAddress from "@/module/checkout-old/templates/step-address"
import StepPayment from "@/module/checkout-old/templates/step-payment"
import StepShipping from "@/module/checkout-old/templates/step-shipping"
import type { StepType } from "@/types/common"

/* Checkout is fully user-specific (reads cookies for auth + cart ID) */
export const instant = false

export default async function CheckPage() {
  const cart = await getCheckCart()

  // No cart → 404
  if (!cart) return notFound()

  // Empty cart → redirect to cart page
  if (!cart.items?.length) redirect("/cart")

  // Missing region → helpful error
  if (!cart.region?.id) {
    return (
      <div className="lg:col-span-10 py-8 sm:py-12 text-center space-y-2 px-4">
        <h1 className="text-base sm:text-lg font-semibold text-foreground">
          We couldn&apos;t load checkout
        </h1>
        <p className="text-xs sm:text-sm text-foreground-muted max-w-md mx-auto">
          Your cart is missing region information. Please return to your cart and
          try again.
        </p>
      </div>
    )
  }

  // Parallel data fetching
  const [customer, shippingMethods, paymentMethods] = await Promise.all([
    getCheckoutCustomer(),
    getCheckoutShippingMethods(cart.id),
    getCheckoutPaymentMethods(cart.region.id),
  ])

  if (!shippingMethods || !paymentMethods) {
    return (
      <div className="lg:col-span-10 py-8 sm:py-12 text-center space-y-2 px-4">
        <h1 className="text-base sm:text-lg font-semibold text-foreground">
          We couldn&apos;t load checkout
        </h1>
        <p className="text-xs sm:text-sm text-foreground-muted max-w-md mx-auto">
          Something went wrong loading shipping or payment options. Please
          refresh the page or try again shortly.
        </p>
      </div>
    )
  }

  // Calculate initial step from cart state
  const hasAddress = !!cart.shipping_address?.address_1
  const hasShipping = !!(cart.shipping_methods?.length)

  const initialStep: StepType = !hasAddress ? "address" : !hasShipping ? "shipping" : "payment"

  const initialCompleted: StepType[] = []
  if (hasAddress) initialCompleted.push("address")
  if (hasShipping) initialCompleted.push("shipping")

  return (
    <>
      {/* Hydrate Zustand store with server-computed initial state */}
      <CheckStoreInitializer step={initialStep} completed={initialCompleted} />

      {/* Main checkout form */}
      <div className="lg:col-span-6 space-y-4 sm:space-y-5 lg:space-y-6 order-2 lg:order-1">
        <CheckProgress />
        <CheckWrapper cart={cart}>
          <StepAddress cart={cart} customer={customer} />
          <StepShipping cart={cart} availableMethods={shippingMethods} />
          <StepPayment cart={cart} paymentMethods={paymentMethods} />
        </CheckWrapper>
      </div>

      {/* Order summary sidebar */}
      <div className="lg:col-span-4 lg:sticky lg:top-24 lg:self-start w-full order-1 lg:order-2">
        <CheckSummary cart={cart} />
      </div>
    </>
  )
}
