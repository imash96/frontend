import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { listProducts } from "@/lib/action/product";
import { getRegion } from "@/lib/action/regions";
import { sdk } from "@/lib/sdk";
import Container from "@/ui/container";
import ProductAccordion from "@/module/products/components/product-accordion";
import ProductActions from "@/module/products/templates/product-action";
import ProductDesc from "@/module/products/templates/product-desc";
import ProductGallery from "@/module/products/templates/product-gallery";
import ProductInfo from "@/module/products/templates/product-info";
import RelatedProducts from "@/module/products/templates/product-related";
import ProductReview from "@/module/products/templates/product-review";

export default async function Page(props: PageProps<"/products/[handle]">) {
  const { handle } = await props.params;
  const countryCode = (await cookies()).get("__country_code")?.value || process.env.NEXT_PUBLIC_DEFAULT_REGION || "us";

  const region = await getRegion(countryCode);

  if (!region) notFound();

  const [product] = await listProducts(
    {
      regionId: region.id,
      queryParams: {
        handle,
        fields:
          "*variants.calculated_price,*variants.prices,+variants.inventory_quantity,+metadata,+tags,+categories.name,+categories.handle,+categories.id,-collection",
      },
    },
  ).then(({ response }) => response.products);

  if (!product || !product.id) notFound();
  console.log(product)
  const pages = product.categories?.map((c) => ({
    label: c.name,
    href: `/category/${c.handle}`,
  }));
  return (
    <Container size="2xl" className="py-8 md:py-10 lg:py-14">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className={`flex flex-col-reverse self-start md:flex-row lg:sticky top-20 gap-1 size-full col-span-full lg:col-span-7 xl:col-span-8`}>
          <ProductGallery images={product.images} title={product.title} />
        </div>
        <div className="col-span-full lg:col-span-5 xl:col-span-4">
          <ProductInfo
            crumbs={pages}
            title={product.title}
            hs_code={product.hs_code}
          />
          <ProductActions product={product} />
          <ProductAccordion product={product} />
        </div>
      </div>
      <ProductDesc />
      <RelatedProducts product={product} region={region} />
      <ProductReview />
    </Container>
  );
}

// export async function generateStaticParams() {
//   const products = await sdk.store.product.list({ fields: "handle" }).then(({ products }) => products);
//   return products.map((p) => ({ handle: p.handle }));
// }
