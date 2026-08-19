import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { ProductForm } from "@/components/admin/product-form";
import { getCategories } from "@/lib/data";

export const metadata: Metadata = { title: "New product", robots: { index: false, follow: false } };
export default async function NewProductPage() { return <div className="p-5 md:p-8 lg:p-10"><Link href="/admin/products" className="inline-flex items-center gap-1 text-xs font-black"><ChevronLeft className="size-4" /> PRODUCTS</Link><h1 className="mt-5 text-4xl font-black tracking-[-.05em]">Create product</h1><p className="mt-2 text-sm text-muted-foreground">Add a new catalogue item with pricing, stock and merchandising details.</p><ProductForm categories={await getCategories()} /></div>; }
