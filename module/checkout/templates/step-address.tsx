import { StoreCart, StoreCustomer } from "@medusajs/types"
import CheckoutStepHeader from "../componenets/step-header"
import AddressCard from "../componenets/address-card"
import AddressForm from "../componenets/address-form"

export default function StepAddress({ cart, customer }: StepAddressProps) {

    const completedView = (
        <>
            <div className="grid grid-cols-1 gap-4 p-5 text-xs sm:grid-cols-3 sm:px-6">
                <div>
                    <p className="font-semibold uppercase tracking-wider text-text-tertiary">
                        Recipient
                    </p>
                    <p className="mt-1 font-medium text-text-primary">
                        {cart.shipping_address?.first_name}{" "}
                        {cart.shipping_address?.last_name}
                    </p>
                    <p className="mt-4 font-semibold uppercase tracking-wider text-text-tertiary">
                        Contact
                    </p>
                    <p className="mt-1 font-medium text-text-primary">
                        {cart.shipping_address?.phone ?? ""}<br />
                        {cart.email && cart.email}
                    </p>
                </div>
                <AddressCard
                    title="Shipping Destination"
                    address={cart.shipping_address}
                    type="Shipping"
                />
                <AddressCard
                    title="Billing Address"
                    address={cart.billing_address}
                    type="Billing"
                />
            </div>
        </>
    )

    return (
        <CheckoutStepHeader
            title="Shipping Address"
            subtitle="Where should we deliver?"
            number={1}
            stepId="address"
            completedContent={completedView}
        >
            <AddressForm cart={cart} />
        </CheckoutStepHeader>
    )
}

type StepAddressProps = {
    cart: StoreCart
    customer: StoreCustomer | null
}

