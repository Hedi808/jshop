import { ProductCard } from "@/components/product/product-card";
import type { Product } from "@/types";

export function ProductGrid({ products, priorityCount = 0 }: { products: Product[]; priorityCount?: number }) {
  return <div className="product-grid">{products.map((product, index) => <ProductCard key={product.id} product={product} priority={index < priorityCount} />)}</div>;
}
