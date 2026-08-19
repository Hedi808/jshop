import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/product-form";
import { getCategories, getProductById } from "@/lib/data";

export const metadata: Metadata = { title: "Edit product", robots: { index: false, follow: false } };
export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; const [product, categories] = await Promise.all([getProductById(id), getCategories()]); if (!product) notFound(); return <div className="p-5 md:p-8 lg:p-10"><Link href="/admin/products" className="inline-flex items-center gap-1 text-xs font-black"><ChevronLeft className="size-4" /> PRODUCTS</Link><h1 className="mt-5 text-4xl font-black tracking-[-.05em]">Edit product</h1><p className="mt-2 text-sm text-muted-foreground">Update {product.name}.</p><ProductForm categories={categories} product={product} /></div>; }
