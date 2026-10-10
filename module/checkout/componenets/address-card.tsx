import type { StoreCartAddress } from "@medusajs/types"

export default function AddressCard({ title, address, type, }: CheckAddressCardProps) {
  if (!address) return null
  if (!address.address_1)
    return (
      <div className="space-y-0.5 text-foreground-muted font-light text-sm p-3 sm:p-4 rounded-lg border border-dashed border-border">
        <h4 className="font-medium mb-1.5 text-sm sm:text-base">{title}</h4>
        <p>{type} address unavailable</p>
      </div>
    )
  return (
    <div>
      <p className="font-semibold uppercase tracking-wider text-text-tertiary">
        {title}
      </p>
      <p className="font-medium text-foreground">{`${address.first_name ?? ""} ${address.last_name ?? ""}`}</p>
      <p>{address.address_1 ?? ""}</p>
      {address.address_2 && <p>{address.address_2}</p>}
      <p>{`${address.city ?? ""}, ${address.province ?? ""} ${address.postal_code ?? ""}`}</p>
      <p>{address.country_code?.toUpperCase() ?? ""}</p>
    </div>
  )
}

interface CheckAddressCardProps {
  title: string
  address?: StoreCartAddress
  type: "Shipping" | "Billing"
}
