export default function ProfileHolder({ children, title, desc }: HolderProp) {
  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-4 md:grid-cols-3 py-6">
      <div>
        <h2 className="text-base font-semibold leading-7">{title}</h2>
        <p className="mt-1 text-sm leading-6 text-foreground-muted">{desc}</p>
      </div>
      {children}
    </div>
  );
}

type HolderProp = {
  title: string;
  desc: string;
} & React.PropsWithChildren;
