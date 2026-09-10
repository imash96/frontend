"use client";

import type { StoreCustomerAddress } from "@medusajs/types";
import { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/ui/modal";
import AddressForm from "./address-form";

export default function AddressModal({
  mode = "create",
  children,
  address,
  countryOptions,
  isDefaultShipping,
}: AddressModalProps) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <div className="space-y-1">
            <DialogTitle className="text-xl font-semibold">
              {mode === "create" ? "Add New Address" : "Edit Address"}
            </DialogTitle>
            <DialogDescription>
              {mode === "create"
                ? "Enter the shipping address you’d like to save to your account."
                : "Update the shipping address and save your changes."}
            </DialogDescription>
          </div>
          <DialogClose />
        </DialogHeader>

        <AddressForm
          mode={mode}
          address={address}
          countryOptions={countryOptions}
          isDefaultShipping={isDefaultShipping}
          onClose={setOpen}
        />
      </DialogContent>
    </Dialog>
  );
}

type AddressModalProps = {
  mode: "create" | "edit";
  address?: StoreCustomerAddress;
  countryOptions: {
    value: string;
    label: string;
  }[];
  isDefaultShipping?: boolean;
} & React.PropsWithChildren;
