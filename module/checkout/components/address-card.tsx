import type { StoreCartAddress } from "@medusajs/types";

export default function AddressCard({
  title,
  address,
  email,
  type,
}: AddressCardProps) {
  if (!address) return null;
  if (!address.address_1)
    return (
      <div className="space-y-0.5 text-foreground-muted font-light text-sm">
        <h4 className="font-medium mb-2 text-base">{title}</h4>
        <p>{type} address unavailable</p>
      </div>
    );
  return (
    <div className="space-y-0.5 font-light text-sm">
      <h4 className="font-medium mb-2 text-base">{title}</h4>
      <div className="text-foreground-muted space-y-1">
        <p className="font-medium">{`${address.first_name ?? ""} ${address.last_name ?? ""}`}</p>
        <p>{address.address_1 ?? ""}</p>
        <p>{address.address_2 ?? ""}</p>
        <p>{`${address.city ?? ""}, ${address.province ?? ""} ${address.postal_code ?? ""}`}</p>
        <p>{address.country_code?.toUpperCase() ?? ""}</p>
      </div>
      <div className="flex flex-col w-full text-card-foreground md:w-1/3">
        <h3 className="font-medium mb-1">Contact</h3>
        <p>{address.phone ?? ""}</p>
        {email && <p>{email}</p>}
      </div>
    </div>
  );
}

interface AddressCardProps {
  title: string;
  email?: string;
  address?: StoreCartAddress;
  type: "Shipping" | "Billing";
}
