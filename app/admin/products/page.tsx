import type { Metadata } from "next";
import Link from "next/link";
import { Search } from "lucide-react";
import { ProductsTable } from "@/components/admin/products-table";
import { Button } from "@/components/ui/button";
import { getProducts } from "@/lib/data";

export const metadata: Metadata = { title: "Admin products", robots: { index: false, follow: false } };
export default async function AdminProductsPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams; const products = await getProducts({ query: q });
  return <div className="p-5 md:p-8 lg:p-10"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-[.14em] text-primary">Catalogue</p><h1 className="mt-2 text-4xl font-black tracking-[-.05em]">Products</h1><p className="mt-2 text-sm text-muted-foreground">Manage pricing, stock, merchandising and product details.</p></div><Button asChild><Link href="/admin/products/new">CREATE PRODUCT</Link></Button></div><form className="relative mt-8 max-w-md"><input name="q" defaultValue={q} placeholder="Search products, brand, category..." className="h-11 w-full rounded-md border bg-white pl-10 pr-4 text-sm" /><Search className="absolute left-3 top-3.5 size-4 text-muted-foreground" /></form><div className="mt-5"><ProductsTable products={products} /></div></div>;
}
