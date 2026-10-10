"use client"

import { AnimatePresence } from "motion/react"
import { div as Div } from "motion/react-client"
import { memo, useState } from "react"
import { useShallow } from "zustand/react/shallow"
import { useCheckoutStore } from "@/lib/store/checkout-store"
import ErrorMessage from "@/module/common/templates/error-message"
import Button from "@/ui/button"
import CustomInput from "@/ui/input"
import CustomSelect from "@/ui/native-select"
import { AddressDefaults, AddressValues } from "../templates/step-address"

type CountryOption = { value: string; label: string }

type Props = {
  countryOptions: CountryOption[]
  defaults: AddressDefaults
}

export default function AddressForm({ countryOptions, defaults }: Props) {
  const { saveAddress, isPending, error } = useCheckoutStore(
    useShallow((s) => ({ saveAddress: s.saveAddress, isPending: s.isPending, error: s.error })),
  )

  // Local state is enough: only this form reads it. The lazy initial value comes from what the
  // cart (or the customer's saved addresses) already holds, and is computed once.
  const [sameAsBilling, setSameAsBilling] = useState(defaults.sameAsBilling)

  // onSubmit instead of <form action>: React 19 resets uncontrolled fields after a form action
  // finishes, which wiped everything typed whenever validation failed. The store advances the
  // step only once the server confirms the save.
  const onSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    void saveAddress(new FormData(event.currentTarget))
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <FormSection title="Contact">
        <CustomInput label="Email" name="email" type="email" defaultValue={defaults.email} required autoComplete="email" />
      </FormSection>

      <FormSection title="Delivery address">
        <AddressFields prefix="shipping_address" data={defaults.shipping} countryOptions={countryOptions} />
      </FormSection>

      <FormSection title="Billing address">
        <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-background-secondary/40 p-3 sm:p-4">
          {/* `name` is what the server reads; without it the value was never submitted. */}
          <input
            type="checkbox"
            name="same_as_billing"
            checked={sameAsBilling}
            onChange={(e) => setSameAsBilling(e.target.checked)}
            className="size-4 shrink-0 accent-primary"
          />
          <span className="text-sm text-foreground">Same as my delivery address</span>
        </label>

        <AnimatePresence initial={false}>
          {!sameAsBilling && (
            <Div
              key="billing-fields"
              // -m-1 p-1 keeps focus rings from being clipped by overflow-hidden.
              className="-m-1 overflow-hidden p-1"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <AddressFields prefix="billing_address" data={defaults.billing} countryOptions={countryOptions} />
            </Div>
          )}
        </AnimatePresence>
      </FormSection>

      <div className="space-y-3">
        <div aria-live="polite">
          <ErrorMessage error={error} />
        </div>
        <Button
          type="submit"
          size="lg"
          fullWidth
          isLoading={isPending}
          disabled={isPending}
          className="sm:w-auto sm:min-w-48"
        >
          {isPending ? "Saving..." : "Continue to Shipping"}
        </Button>
      </div>
    </form>
  )
}

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h3 className="font-heading text-sm font-semibold text-foreground sm:text-base">{title}</h3>
      {children}
    </section>
  )
}

type AddressFieldsProps = {
  prefix: "shipping_address" | "billing_address"
  data?: AddressValues
  countryOptions: CountryOption[]
}

const AddressFields = memo(function AddressFields({ prefix, data, countryOptions }: AddressFieldsProps) {
  // "shipping given-name" / "billing postal-code" lets browsers autofill the right address.
  const section = prefix === "shipping_address" ? "shipping" : "billing"
  const ac = (token: string) => `${section} ${token}`

  // A region with a single country needs no choice: preselect it instead of making them pick.
  const defaultCountry = data?.country_code || (countryOptions.length === 1 ? countryOptions[0].value : undefined)

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
          defaultValue={defaultCountry}
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