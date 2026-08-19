import type { MetadataRoute } from "next";
import { getCategories, getProducts } from "@/lib/data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);
  return [{ url: base, lastModified: new Date(), priority: 1 }, { url: `${base}/search`, lastModified: new Date(), priority: .7 }, ...categories.map((category) => ({ url: `${base}/category/${category.slug}`, lastModified: new Date(), priority: .8 })), ...products.map((product) => ({ url: `${base}/product/${product.slug}`, lastModified: new Date(product.updatedAt), priority: .7 }))];
}
