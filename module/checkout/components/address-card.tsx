import type { StoreCartAddress } from "@medusajs/types"

/** One labelled block of the completed-step summary (an <h3> under the step's <h2>). */
export function SummaryBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="min-w-0 space-y-1.5">
      <h3 className="text-xs font-medium uppercase tracking-wide text-foreground-muted">{title}</h3>
      <div className="space-y-0.5 wrap-break-word text-sm text-foreground">{children}</div>
    </div>
  )
}

export default function AddressCard({ title, address, countryName }: Props) {
  // Same block either way, so the summary grid never changes shape or style.
  if (!address?.address_1) {
    return (
      <SummaryBlock title={title}>
        <p className="text-foreground-muted">Not provided</p>
      </SummaryBlock>
    )
  }

  // Built from the parts that exist: no stray ", " or double spaces when something is missing.
  const name = [address.first_name, address.last_name].filter(Boolean).join(" ")
  const area = [address.province, address.postal_code].filter(Boolean).join(" ")
  const cityLine = [address.city, area].filter(Boolean).join(", ")

  return (
    <SummaryBlock title={title}>
      <address className="space-y-0.5 not-italic">
        {name && <p className="font-medium">{name}</p>}
        {address.company && <p>{address.company}</p>}
        <p>{address.address_1}</p>
        {address.address_2 && <p>{address.address_2}</p>}
        {cityLine && <p>{cityLine}</p>}
        {(countryName ?? address.country_code) && <p>{countryName ?? address.country_code?.toUpperCase()}</p>}
      </address>
    </SummaryBlock>
  )
}

type Props = {
  title: string
  address?: StoreCartAddress | null
  /** Display name for address.country_code ("India" instead of "IN"). */
  countryName?: string
}