import { useProductStore } from "@/lib/store/use-product";
import type { StoreProductOption } from "@medusajs/types";
import { Info } from "lucide-react";

type OptionSelectProps = {
  option: StoreProductOption;
  title: string;
  disabled: boolean;
};

export default function OptionSelect({
  option,
  title,
  disabled,
}: OptionSelectProps) {
  const { options, setOption } = useProductStore();
  const current = options?.[option.id];
  const values = option.values?.map((v) => v.value);
  const isSize = title === "Size";

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">
          {title}: <span className="font-normal">{current}</span>
        </span>
        {isSize && (
          <span
            // onClick={() => setShowSizeGuide(true)}
            className="text-xs cursor-pointer underline flex items-center gap-1 underline-offset-4"
          >
            Size guide <Info size={12} strokeWidth={1.5} />
          </span>
        )}
      </div>

      {isSize ? (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
          {values?.map((value) => {
            const isSelected = value === current;
            return (
              <button
                key={value}
                onClick={() => setOption(option.id, value)}
                className={`rounded-xs transition-colors duration-50 inline-block text-xs text-center py-2.5 border-2 cursor-pointer ${isSelected ? "text-accent font-semibold border-transparent ring-2 ring-accent ring-offset-1" : "border-border hover:border-accent"}`}
                disabled={disabled}
                aria-pressed={isSelected}
                aria-label={`${title}: ${value}`}
              >
                {value}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-wrap gap-2 text-sm uppercase">
          {values?.map((value) => (
            <span
              key={value}
              onClick={() => setOption(option.id, value)}
              style={{
                backgroundColor: value,
                outline: current === value ? "2px solid black" : "none",
              }}
              className="inline-block h-8 w-8 border-2 border-border rounded-full cursor-pointer"
            ></span>
          ))}
        </div>
      )}

      {isSize ? (
        <p className="text-xs text-warning font-medium">
          {current === "One Size" || current === "Custom Size"
            ? "Measurements can be added during checkout."
            : "Refer to our size chart for the best fit."}
        </p>
      ) : (
        <span className="text-xs text-warning font-medium">
          Check product images or color chart for actual color
        </span>
      )}
    </div>
  );
}
