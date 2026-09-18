import type { StoreCartAddress } from "@medusajs/types"

export default function CheckAddressCard({
  title,
  address,
  email,
  type,
}: CheckAddressCardProps) {
  if (!address) return null
  if (!address.address_1)
    return (
      <div className="space-y-0.5 text-foreground-muted font-light text-sm p-3 sm:p-4 rounded-lg border border-dashed border-border">
        <h4 className="font-medium mb-1.5 text-sm sm:text-base">{title}</h4>
        <p>{type} address unavailable</p>
      </div>
    )
  return (
    <div className="space-y-1 font-light text-sm p-3 sm:p-4 rounded-lg border border-border bg-background-elevated/50">
      <h4 className="font-medium mb-2 text-sm sm:text-base text-foreground">
        {title}
      </h4>
      <div className="text-foreground-muted space-y-0.5">
        <p className="font-medium text-foreground">{`${address.first_name ?? ""} ${address.last_name ?? ""}`}</p>
        <p>{address.address_1 ?? ""}</p>
        {address.address_2 && <p>{address.address_2}</p>}
        <p>{`${address.city ?? ""}, ${address.province ?? ""} ${address.postal_code ?? ""}`}</p>
        <p>{address.country_code?.toUpperCase() ?? ""}</p>
      </div>
      <div className="pt-2 text-foreground-muted">
        <p className="font-medium text-xs uppercase tracking-wider text-foreground mb-0.5">
          Contact
        </p>
        <p>{address.phone ?? ""}</p>
        {email && <p>{email}</p>}
      </div>
    </div>
  )
}

interface CheckAddressCardProps {
  title: string
  email?: string
  address?: StoreCartAddress
  type: "Shipping" | "Billing"
}
