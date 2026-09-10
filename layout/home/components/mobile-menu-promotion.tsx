import Image from "next/image";

export default function MobileMenuPromotion({ name, thumbnail }: { name?: string; isMegaMenu?: boolean; thumbnail?: string }) {
  if (!name) return null;
  return (
    <>
      <div className="relative h-60">
        <Image
          src={thumbnail || '/svg/placeholder.svg'}
          alt="submenu banner"
          height={400}
          width={600}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="bg-secondary mb-2 text-sm w-[80%] text-secondary-foreground mx-auto px-2 py-2.5 text-center -mt-6 relative">
        {name}
      </div>
    </>
  );
}
