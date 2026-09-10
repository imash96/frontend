export default function CustomDivider({ text }: { text?: string }) {
  return (
    <div className="flex items-center gap-5 justify-center">
      <div className="h-[0.5px] w-full bg-divider" />
      {text && (
        <>
          <span className="text-foreground-muted font-light">{text}</span>
          <div className="h-[0.5px] w-full bg-divider" />
        </>
      )}
    </div>
  );
}
