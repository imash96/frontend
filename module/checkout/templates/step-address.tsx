import type { StoreCart, StoreCustomer } from "@medusajs/types"
import compareAddresses from "@/lib/util/compare-addresses"
import AddressCard, { SummaryBlock } from "../components/address-card"
import AddressForm from "../components/address-form"
import CheckoutStepHeader from "../components/step-header"

export default function StepAddress({ cart, customer }: StepAddressProps) {
    const { shipping_address: shipping, billing_address: billing } = cart

    // Computed once here and shared by the form (options) and the summary (display names).
    const countryOptions = (cart.region?.countries ?? []).flatMap((c) =>
        c.iso_2 ? [{ value: c.iso_2, label: c.display_name ?? c.iso_2.toUpperCase() }] : [],
    )
    const countryNames = new Map(countryOptions.map((o) => [o.value, o.label]))

    const sameAsDelivery = Boolean(shipping && billing && compareAddresses(shipping, billing))

    // No padding of its own: the step header's panel already provides it (it used to be doubled).
    const completedView = (
        <div className="grid gap-4 sm:grid-cols-3 sm:gap-6">
            <SummaryBlock title="Contact">
                {cart.email && <p>{cart.email}</p>}
                {shipping?.phone && <p>{shipping.phone}</p>}
            </SummaryBlock>

            <AddressCard
                title="Delivery address"
                address={shipping}
                countryName={shipping?.country_code ? countryNames.get(shipping.country_code) : undefined}
            />

            {sameAsDelivery ? (
                <SummaryBlock title="Billing address">
                    <p className="text-foreground-tertiary">Same as delivery address</p>
                </SummaryBlock>
            ) : (
                <AddressCard
                    title="Billing address"
                    address={billing}
                    countryName={billing?.country_code ? countryNames.get(billing.country_code) : undefined}
                />
            )}
        </div>
    )

    return (
        <CheckoutStepHeader
            title="Shipping Address"
            subtitle="Where should we deliver?"
            number={1}
            stepId="address"
            completedContent={completedView}
        >
            {/* Plain props only (not the whole cart) cross into the client form. */}
            <AddressForm countryOptions={countryOptions} defaults={getAddressDefaults(cart, customer)} />
        </CheckoutStepHeader>
    )
}

type StepAddressProps = {
    cart: StoreCart
    customer: StoreCustomer | null
}

export type AddressValues = Partial<Record<| "first_name" | "last_name" | "company" | "address_1" | "address_2" | "city" | "province" | "postal_code" | "country_code" | "phone", string | null>>

export type AddressDefaults = {
    email: string
    shipping?: AddressValues
    billing?: AddressValues
    sameAsBilling: boolean
}

/**
 * Starting values for the address form. The cart always wins (it is what the customer already
 * saved); otherwise a logged-in customer's saved addresses and profile fill the gaps, so they
 * don't retype what the store already knows.
 */
export function getAddressDefaults(
    cart: Pick<StoreCart, "email" | "shipping_address" | "billing_address">,
    customer: StoreCustomer | null,
): AddressDefaults {
    const saved = customer?.addresses ?? []

    const shipping: AddressValues | undefined =
        (cart.shipping_address?.address_1 ? cart.shipping_address : undefined) ??
        saved.find((a) => a.is_default_shipping) ??
        saved[0] ??
        (customer
            ? { first_name: customer.first_name, last_name: customer.last_name, phone: customer.phone }
            : undefined)

    const billing: AddressValues | undefined =
        (cart.billing_address?.address_1 ? cart.billing_address : undefined) ??
        saved.find((a) => a.is_default_billing)

    return {
        email: cart.email || customer?.email || "",
        shipping,
        billing,
        // Billing is only shown separately when it actually differs from the delivery address.
        sameAsBilling: shipping && billing ? Boolean(compareAddresses(shipping, billing)) : true,
    }
}