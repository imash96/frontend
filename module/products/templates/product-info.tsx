import { Zap } from "lucide-react";
import RatingSystem from "@/ui/rating-system";
import type { Crumb } from "@/types/common";
import Breadcrumb from "../components/breadcrumb";

export default function ProductInfo({
  title,
  hs_code,
  crumbs,
}: ProductInfoProps) {
  return (
    <>
      {crumbs && <Breadcrumb crumbs={crumbs} handle="" />}
      <h1 className=" tracking-tight text-xl md:text-2xl lg:text-3xl leading-snug text-foreground">
        {title}
      </h1>
      {hs_code && <h2>{hs_code}</h2>}
      <RatingSystem
        averageRating={4.4}
        reviewCount={150}
        size="md"
        className="mb-2"
      />
      <div className="flex gap-x-2 text-sm font-semibold">
        <span className="flex items-center gap-x-1 bg-btn-secondary rounded-full px-3 text-secondary-foreground">
          <Zap className="w-3 h-3 shrink-0" />
          Express Delivery
        </span>{" "}
        Get it in 5 – 6 days
      </div>
    </>
  );
}

type ProductInfoProps = {
  title: string;
  hs_code: string | null;
  crumbs?: Crumb[];
};
