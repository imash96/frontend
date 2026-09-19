import { cookies } from "next/headers";
import HeroCarousel from "@/module/home/templates/banner";
import IconGridSection from "@/module/home/templates/icon-grid";
import { podData, uspData } from "@/module/home/components/icon-with-text";
import GalleryWall from "@/module/home/templates/gallery-wall";
import Blog from "@/module/home/templates/blog";
import { getRegion } from "@/lib/action/regions";
import Category from "@/module/home/templates/category";
import Collection from "@/module/home/templates/collection";
import Testimonials from "@/module/home/templates/testimonials";
import { NewArrival, OnSale, TrendingNow } from "@/module/home/templates/list-collection";
import CustomMadeBanner from "@/module/home/templates/custom-made";

export default async function Page() {
  const countryCode = (await cookies()).get("__country_code")?.value || process.env.NEXT_PUBLIC_DEFAULT_REGION || "us"
  const region = await getRegion(countryCode);
  if (!region) return null;

  return (
    <>
      <HeroCarousel />
      <IconGridSection items={uspData} />
      <Category />
      <NewArrival region_id={region.id} />
      <Collection />
      <CustomMadeBanner />
      <TrendingNow region_id={region.id} />
      <GalleryWall />
      <Testimonials />
      <OnSale region_id={region.id} />
      <Blog />
      <IconGridSection items={podData} type="bottom" />
    </>
  );
}