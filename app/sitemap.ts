import type { MetadataRoute } from "next";
import { getCategories, getProducts } from "@/lib/data";

const staticRoutes = ["", "/search", "/about", "/contact", "/delivery", "/returns", "/terms", "/privacy"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);
  const lastModified = new Date();
  return [...staticRoutes.map((route) => ({ url: `${base}${route}`, lastModified, priority: route ? .7 : 1 })), ...categories.map((category) => ({ url: `${base}/category/${category.slug}`, lastModified, priority: .8 })), ...products.map((product) => ({ url: `${base}/product/${product.slug}`, lastModified: new Date(product.updatedAt), priority: .7 }))];
}
