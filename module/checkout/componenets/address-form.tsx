"use client"

import type { StoreCart } from "@medusajs/types"
import { AnimatePresence } from "motion/react"
import { div as Div } from "motion/react-client";
import { memo, useActionState, useEffect, useMemo } from "react"
import { setCheckoutAddresses } from "@/lib/action/checkout"
import { useToggleState } from "@/lib/hook/use-toggle-state"
import { useCheckoutStore } from "@/lib/store/checkout-store"
import compareAddresses from "@/lib/util/compare-addresses"
import Button from "@/ui/button"
import CustomInput from "@/ui/input"
import CustomSelect from "@/ui/native-select"
import { useShallow } from "zustand/react/shallow";
import ErrorMessage from "@/module/common/templates/error-message";

export default function AddressForm({ cart }: { cart: StoreCart }) {

  const { state: sameAsBilling, toggle: toggleSameAsBilling } = useToggleState(
    cart?.shipping_address && cart?.billing_address ? compareAddresses(cart?.shipping_address, cart?.billing_address) : true,
  )

  const { saveAddress, isPending, error } = useCheckoutStore(
    useShallow((s) => ({
      saveAddress: s.saveAddress,
      isPending: s.isPending,
      error: s.error,
    })),
  )

  const countryOptions = useMemo<CountryOption[]>(
    () =>
      cart.region?.countries?.flatMap((c) =>
        c.iso_2 ? [{ value: c.iso_2, label: c.display_name ?? c.iso_2.toUpperCase() }] : [],
      ) ?? [],
    [cart.region],
  )

  // Submitting through onSubmit (instead of <form action>) matters: React 19 resets uncontrolled
  // fields after a form action finishes, which wiped everything the customer typed whenever
  // validation failed. The store advances the step only when the server confirms the save.
  const onSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    void saveAddress(new FormData(event.currentTarget))
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <section className="space-y-3">
        <h3 className="font-heading text-sm font-semibold text-foreground sm:text-base">Contact</h3>
        {cart.email !== undefined && (
          <CustomInput label="Email" name="email" type="email" defaultValue={cart.email || ""} required autoComplete="email" />
        )}
      </section>

      <section className="space-y-3">
        <h3 className="font-heading text-sm font-semibold text-foreground sm:text-base">Delivery address</h3>
        <AddressFields prefix="shipping_address" data={cart.shipping_address} countryOptions={countryOptions} />
      </section>

      <section className="space-y-3">
        <h3 className="font-heading text-sm font-semibold text-foreground sm:text-base">Billing address</h3>

        <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-background-secondary/40 p-3 sm:p-4">
          {/* `name` is what the server reads; without it the value was never submitted. */}
          <input
            type="checkbox"
            name="same_as_billing"
            checked={sameAsBilling}
            onChange={toggleSameAsBilling}
            className="size-4 shrink-0 accent-primary"
          />
          <span className="text-sm text-foreground">Same as my delivery address</span>
        </label>

        <AnimatePresence initial={false}>
          {!sameAsBilling && (
            <Div
              key="billing-fields"
              className="-m-1 overflow-hidden p-1"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <AddressFields prefix="billing_address" data={cart.billing_address} countryOptions={countryOptions} />
            </Div>
          )}
        </AnimatePresence>
      </section>

      <div>
        <div aria-live="polite">
          <ErrorMessage error={error} />
        </div>
        <Button
          type="submit"
          size="lg"
          fullWidth
          isLoading={isPending}
          disabled={isPending}
          className="mt-3 sm:w-auto sm:min-w-48"
        >
          {isPending ? "Saving..." : "Continue to Shipping"}
        </Button>
      </div>
    </form>
  )
}

type AddressFieldsProps = {
  prefix: "shipping_address" | "billing_address"
  data?: StoreCart["shipping_address"] | StoreCart["billing_address"]
  countryOptions: CountryOption[]
}

const AddressFields = memo(function AddressFields({ prefix, data, countryOptions }: AddressFieldsProps) {
  // "shipping given-name" / "billing postal-code" lets browsers autofill the right address.
  const section = prefix === "shipping_address" ? "shipping" : "billing"
  const ac = (token: string) => `${section} ${token}`

  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <CustomInput label="First name" name={`${prefix}.first_name`} defaultValue={data?.first_name || ""} required autoComplete={ac("given-name")} />
        <CustomInput label="Last name" name={`${prefix}.last_name`} defaultValue={data?.last_name || ""} required autoComplete={ac("family-name")} />
      </div>
      <CustomInput label="Company (optional)" name={`${prefix}.company`} defaultValue={data?.company || ""} autoComplete={ac("organization")} />
      <CustomInput label="Address" name={`${prefix}.address_1`} defaultValue={data?.address_1 || ""} required autoComplete={ac("address-line1")} />
      <CustomInput label="Apartment, suite, etc. (optional)" name={`${prefix}.address_2`} defaultValue={data?.address_2 || ""} autoComplete={ac("address-line2")} />

      <div className="grid gap-3 sm:grid-cols-[10rem_1fr]">
        <CustomInput label="Postal code" name={`${prefix}.postal_code`} defaultValue={data?.postal_code || ""} required autoComplete={ac("postal-code")} />
        <CustomInput label="City" name={`${prefix}.city`} defaultValue={data?.city || ""} required autoComplete={ac("address-level2")} />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <CustomSelect
          options={countryOptions}
          defaultValue={data?.country_code || undefined}
          label="Country"
          name={`${prefix}.country_code`}
          required
          disabled={countryOptions.length === 0}
          autoComplete={ac("country")}
        />
        <CustomInput label="State / Province" name={`${prefix}.province`} defaultValue={data?.province || ""} autoComplete={ac("address-level1")} />
      </div>

      <CustomInput label="Phone" name={`${prefix}.phone`} type="tel" defaultValue={data?.phone || ""} required autoComplete={ac("tel")} />
    </div>
  )
})

type CountryOption = { value: string; label: string }