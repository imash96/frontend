import type { LucideIcon } from "lucide-react";

export default function ProfileHolder({
  children,
  title,
  desc,
  icon: Icon,
}: HolderProp) {
  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-4 md:grid-cols-3 py-6 border-t border-border first:border-t-0">
      <div>
        <div className="flex items-center gap-2">
          {Icon && (
            <Icon
              className="w-5 h-5 text-muted-foreground shrink-0"
              strokeWidth={1.5}
            />
          )}
          <h2 className="text-base font-semibold leading-7">{title}</h2>
        </div>
        <p className="mt-1 text-sm leading-6 text-foreground-muted">{desc}</p>
      </div>
      {children}
    </div>
  );
}

type HolderProp = {
  title: string;
  desc: string;
  icon?: LucideIcon;
} & React.PropsWithChildren;
