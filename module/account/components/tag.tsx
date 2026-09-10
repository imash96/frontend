export default function Tag({ icon: Icon, text, className = "" }: any) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border ${className}`}
    >
      {Icon && <Icon className="w-3 h-3" />} {text}
    </span>
  );
}
