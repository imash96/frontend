"use client"

import type { StoreCart } from "@medusajs/types"
import { AnimatePresence, motion } from "motion/react"
import { useActionState, useEffect, useMemo } from "react"
import { setCheckAddresses } from "@/lib/action/checkout"
import { useCheckStore } from "@/lib/store/checkout-store"
import { useToggleState } from "@/lib/hook/use-toggle-state"
import compareAddresses from "@/lib/util/compare-addresses"
import Button from "@/ui/button"
import CustomInput from "@/ui/input"
import CustomSelect from "@/ui/native-select"

export default function CheckAddressForm({ cart }: { cart: StoreCart }) {
  const setStep = useCheckStore((s) => s.setStep)
  const markCompleted = useCheckStore((s) => s.markCompleted)

  const [addressState, addressAction, isPending] = useActionState(
    setCheckAddresses,
    { success: false, error: null } as { success: boolean; error: string | null },
  )

  const { state: sameAsBilling, toggle: toggleSameAsBilling } = useToggleState(
    cart?.shipping_address && cart?.billing_address
      ? compareAddresses(cart?.shipping_address, cart?.billing_address)
      : true,
  )

  useEffect(() => {
    if (addressState.success) {
      markCompleted("address")
      setStep("shipping")
    }
  }, [addressState, setStep, markCompleted])

  const countryOptions = useMemo(() => {
    return (
      cart.region?.countries
        ?.map((country) => ({
          value: country.iso_2,
          label: country.display_name,
        }))
        .filter(
          (opt): opt is { value: string; label: string } => opt !== null,
        ) ?? []
    )
  }, [cart.region])

  return (
    <form action={addressAction} className="flex flex-col flex-1 space-y-3 sm:space-y-4">
      <AddressFields
        prefix="shipping_address"
        data={cart.shipping_address}
        email={cart.email}
        countryOptions={countryOptions}
      />

      <h2 className="text-base sm:text-lg lg:text-xl font-medium pt-1">
        Billing details
      </h2>
      <div className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          id="same_as_billing"
          name="same_as_billing"
          checked={sameAsBilling}
          onChange={toggleSameAsBilling}
          className="w-4 h-4 rounded border-border text-accent focus:ring-accent"
        />
        <label htmlFor="same_as_billing" className="cursor-pointer select-none">
          Same as shipping address
        </label>
      </div>

      <AnimatePresence mode="wait">
        {!sameAsBilling && (
          <motion.div
            key="billing-fields"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <AddressFields
              prefix="billing_address"
              data={cart.billing_address}
              countryOptions={countryOptions}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="pt-2">
        <Button
          isLoading={isPending}
          className="w-full sm:w-auto sm:min-w-40 h-11"
          type="submit"
          disabled={isPending}
        >
          {isPending ? "Saving..." : "Continue to Shipping"}
        </Button>
        <AnimatePresence>
          {addressState.error && (
            <motion.div
              initial={{ y: -8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -8, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="text-destructive-foreground text-sm pt-2"
              role="alert"
              aria-live="polite"
            >
              {addressState.error}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </form>
  )
}

function AddressFields({
  prefix,
  data,
  email,
  countryOptions,
}: AddressFieldsProps) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <CustomInput
          label="First name"
          name={`${prefix}.first_name`}
          defaultValue={data?.first_name || ""}
          required
          autoComplete="given-name"
        />
        <CustomInput
          label="Last name"
          name={`${prefix}.last_name`}
          defaultValue={data?.last_name || ""}
          required
          autoComplete="family-name"
        />
      </div>
      <CustomInput
        label="Company (optional)"
        name={`${prefix}.company`}
        defaultValue={data?.company || ""}
        autoComplete="organization"
      />
      <CustomInput
        label="Address"
        name={`${prefix}.address_1`}
        defaultValue={data?.address_1 || ""}
        required
        autoComplete="address-line1"
      />
      <CustomInput
        label="Apartment, suite, etc. (optional)"
        name={`${prefix}.address_2`}
        defaultValue={data?.address_2 || ""}
        autoComplete="address-line2"
      />

      <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] lg:grid-cols-[200px_1fr] gap-3">
        <CustomInput
          label="Postal code"
          name={`${prefix}.postal_code`}
          defaultValue={data?.postal_code || ""}
          required
          autoComplete="postal-code"
        />
        <CustomInput
          label="City"
          name={`${prefix}.city`}
          defaultValue={data?.city || ""}
          required
          autoComplete="address-level2"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-[1fr_140px] lg:grid-cols-[1fr_200px] gap-3">
        <CustomSelect
          options={countryOptions}
          defaultValue={data?.country_code || undefined}
          label="Country"
          name={`${prefix}.country_code`}
          required
          disabled={countryOptions.length === 0}
          autoComplete="country"
        />
        <CustomInput
          label="Province / State"
          name={`${prefix}.province`}
          defaultValue={data?.province || ""}
          autoComplete="address-level1"
        />
      </div>

      {email !== undefined && (
        <CustomInput
          label="Email"
          name="email"
          type="email"
          defaultValue={email || ""}
          required
          autoComplete="email"
        />
      )}
      <CustomInput
        label="Phone"
        name={`${prefix}.phone`}
        type="tel"
        defaultValue={data?.phone || ""}
        required
        autoComplete="tel"
      />
    </div>
  )
}

type AddressFieldsProps = {
  prefix: string
  data?: StoreCart["shipping_address"] | StoreCart["billing_address"]
  email?: string | null
  countryOptions: { value: string; label: string }[]
}
