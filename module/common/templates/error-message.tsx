export default function ErrorMessage({ error }: { error?: string | null }) {
  if (!error) return null;

  return (
    <div className="pt-2 text-destructive text-center text-sm font-normal">
      <span>{error}</span>
    </div>
  );
}
