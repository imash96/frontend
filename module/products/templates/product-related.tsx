import type {
  StoreProduct,
  StoreProductListParams,
  StoreRegion,
} from "@medusajs/types";
import { listProducts } from "@/lib/action/product";
import ProductCard from "@/ui/product-card";
import SectionHeader from "@/module/home/components/section-header";


export default async function RelatedProducts({
  product,
  region,
}: RelatedProductsProps) {
  const queryParams: StoreProductListParams = {};
  queryParams.region_id = region.id;
  queryParams.limit = 6;

  queryParams.fields = "id,handle,title,*images,*variants.calculated_price";
  if (product.collection_id) {
    queryParams.collection_id = [product.collection_id];
  }
  if (product.tags) {
    queryParams.tag_id = product.tags
      .map((t) => t.id)
      .filter(Boolean) as string[];
  }

  const products = await listProducts({
    queryParams,
    regionId: region.id,
  }).then(({ response }) => {
    return response.products.filter(
      (responseProduct) => responseProduct.id !== product.id,
    );
  });

  if (!products.length) return null;

  return (
    <SectionHeader
      sectionName="related-product"
      aria-labelledby="related-product"
      title="Related products"
      desc="You might also want to check out these products."
    >
      <ul className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 gap-y-5 lg:gap-y-6">
        {products.map((product) => (
          <li key={product.id}>
            <ProductCard product={product} />
          </li>
        ))}
      </ul>
    </SectionHeader>
  );
}

type RelatedProductsProps = {
  product: StoreProduct;
  region: StoreRegion;
};
