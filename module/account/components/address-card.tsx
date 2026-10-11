"use client";

import type { StoreCustomer } from "@medusajs/types";
import {
  Edit,
  LoaderCircle,
  LocateFixed,
  MapPinCheckInside,
  Trash2,
} from "lucide-react";
import { useState, useTransition } from "react";
import { deleteCustomerAddress } from "@/lib/action/customer";
import { AlertModal } from "@/ui/alert-modal";
import AddressModal from "./address-modal";
import Tag from "./tag";

export default function AddressCard({
  address,
  addressLines,
  countryOptions,
}: AddressCardProps) {
  const [isRemoving, startTransition] = useTransition();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  return (
    <>
      <div className="border rounded-lg p-5 min-h-60 flex flex-col bg-surface-elevated shadow-sm transition-shadow hover:shadow-md">
        <div className="mt-1 flex-1">
          <h3 className="text-base font-semibold mb-1">
            {address.first_name} {address.last_name}
          </h3>
          {address.company && (
            <div className="text-sm font-light text-foreground-tertiary mb-1">
              {address.company}
            </div>
          )}
          <div className="text-sm leading-relaxed space-y-1">
            {addressLines.map((line, i) => (
              <div key={i}>{line}</div>
            ))}
          </div>
        </div>
        <div className="flex justify-between items-start mt-2">
          <div className="flex flex-wrap gap-2 text-xs font-medium">
            {address.address_name && (
              <Tag
                icon={LocateFixed}
                text={address.address_name}
                className={"bg-accent text-accent-foreground border-border"}
              />
            )}
            {address.is_default_shipping && (
              <Tag
                icon={MapPinCheckInside}
                text={"Default"}
                className={
                  "bg-btn-secondary text-btn-secondary-foreground border-btn-secondary-hover"
                }
              />
            )}
            {address.is_default_billing && (
              <Tag
                icon={MapPinCheckInside}
                text={"Billing"}
                className={
                  "bg-btn-primary text-btn-primary-foreground border-btn-primary-hover"
                }
              />
            )}
          </div>
          <div className="flex gap-2">
            <AddressModal
              mode="edit"
              address={address}
              countryOptions={countryOptions}
            >
              <button
                aria-label="Edit address"
                className="p-2 text-foreground-tertiary hover:text-warning-foreground hover:bg-warning/20 rounded-md transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-warning"
              >
                <Edit size={16} />
              </button>
            </AddressModal>
            <button
              aria-label="Delete address"
              className="p-2 text-foreground-tertiary hover:text-destructive hover:bg-destructive/20 rounded-md transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-destructive"
              onClick={() => setShowDeleteConfirm(true)}
            >
              {isRemoving ? (
                <LoaderCircle size={16} className="animate-spin" />
              ) : (
                <Trash2 size={16} />
              )}
            </button>
          </div>
        </div>
      </div>

      <AlertModal
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        variant="danger"
        title="Delete Address"
        description={`Are you sure you want to delete this address for ${address.first_name} ${address.last_name}? This action cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        isLoading={isRemoving}
        onConfirm={() => {
          startTransition(() => {
            deleteCustomerAddress(address.id);
          });
        }}
      />
    </>
  );
}

type AddressCardProps = {
  address: NonNullable<StoreCustomer["addresses"]>[number];
  addressLines: string[];
  countryOptions: {
    label: string;
    value: string;
  }[];
};
