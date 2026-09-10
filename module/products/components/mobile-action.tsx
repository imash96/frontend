import type { StoreProductOption } from "@medusajs/types";
import { ChevronDown } from "lucide-react";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger, } from "@/ui/modal";
import AddToCartButton from "./add-to-cart";
import OptionSelect from "./option-select";
import { useProductStore } from "@/lib/store/use-product";
import Button from "@/ui/button";

export default function MobileActions({ pOption, show }: MobileActionsProps) {
  const { isPending, selectedVariant, options } = useProductStore();

  return (
    <div
      className={`lg:hidden inset-x-0 bottom-0 fixed z-40 transition-opacity duration-300 ease-in-out ${show ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
    >
      <div className="bg-background-muted flex flex-col gap-y-3 justify-center text-base font-normal p-4 border-t border-border">
        {/* Actions */}
        <div className="grid grid-cols-2 w-full gap-x-4">
          <MobileModal options={pOption} isPending={isPending}>
            <Button variant="outline" className="w-full">
              <div className="flex items-center justify-between w-full">
                <span className="text-xs">
                  {selectedVariant ? Object.values(options).join(" / ") : "Select Options"}
                </span>
                <ChevronDown className="h-5 w-5" />
              </div>
            </Button>
          </MobileModal>
          <AddToCartButton />
        </div>
      </div>
    </div>
  );
}

const MobileModal = ({ children, options, isPending }: MobileModalProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        // position="bottom"
        rounded={false}
        aria-describedby="Size Option"
        className="lg:hidden"
      >
        <DialogHeader>
          <DialogTitle className="sr-only">Select Variant</DialogTitle>
          <DialogClose className="ml-auto" />
        </DialogHeader>
        <div className="px-6 py-6">
          <div className="flex flex-col gap-y-6">
            {options?.map((option) => (
              <OptionSelect
                key={option.id}
                option={option}
                title={option.title ?? ""}
                disabled={isPending}
              />
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

type MobileModalProps = {
  isPending: boolean;
  options: StoreProductOption[] | null;
} & React.PropsWithChildren;

type MobileActionsProps = {
  pOption: StoreProductOption[] | null;
  show: boolean;
};
