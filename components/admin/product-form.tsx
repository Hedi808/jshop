"use client";

import { Loader2, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { slugify } from "@/lib/utils";
import type { Category, Product } from "@/types";

export function ProductForm({ categories, product }: { categories: Category[]; product?: Product }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState(product?.name ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    const values = Object.fromEntries(new FormData(event.currentTarget).entries());
    let specifications: unknown;
    try {
      specifications = JSON.parse(String(values.specifications ?? "{}"));
      if (!specifications || Array.isArray(specifications) || typeof specifications !== "object") throw new Error();
    } catch {
      setError("Specifications must be a valid JSON object with text values.");
      setPending(false);
      return;
    }
    const payload = {
      ...values,
      price: Number(values.price),
      compareAtPrice: values.compareAtPrice ? Number(values.compareAtPrice) : null,
      costPrice: values.costPrice ? Number(values.costPrice) : null,
      stock: Number(values.stock),
      featured: values.featured === "on",
      isNew: values.isNew === "on",
      isFlashDeal: values.isFlashDeal === "on",
      tags: String(values.tags ?? "").split(",").map((tag) => tag.trim()).filter(Boolean),
      specifications,
    };
    try {
      const response = await fetch(product ? `/api/admin/products/${product.id}` : "/api/admin/products", { method: product ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await response.json() as { error?: string };
      if (!response.ok) throw new Error(data.error ?? "Product could not be saved.");
      router.push("/admin/products");
      router.refresh();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Product could not be saved.");
      setPending(false);
    }
  }

  return <form onSubmit={submit} className="mt-8 grid gap-6 xl:grid-cols-[1fr_340px]">
    <div className="space-y-6">
      <section className="rounded-xl border bg-white p-6"><h2 className="text-lg font-black">Product information</h2><div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="text-xs font-bold sm:col-span-2">Product name<Input required name="name" value={name} onChange={(event) => { setName(event.target.value); if (!product) setSlug(slugify(event.target.value)); }} className="mt-2" /></label>
        <label className="text-xs font-bold sm:col-span-2">Slug<Input required name="slug" value={slug} onChange={(event) => setSlug(slugify(event.target.value))} className="mt-2" /></label>
        <label className="text-xs font-bold">SKU<Input required name="sku" defaultValue={product?.sku} className="mt-2" /></label><label className="text-xs font-bold">Brand<Input required name="brand" defaultValue={product?.brand} className="mt-2" /></label>
        <label className="text-xs font-bold sm:col-span-2">Short description<Input required name="shortDescription" defaultValue={product?.shortDescription} maxLength={220} className="mt-2" /></label>
        <label className="text-xs font-bold sm:col-span-2">Full description<textarea required name="description" defaultValue={product?.description} rows={7} className="mt-2 w-full rounded-md border bg-white p-3 text-sm" /></label>
      </div></section>
      <section className="rounded-xl border bg-white p-6"><h2 className="text-lg font-black">Technical specifications</h2><p className="mt-2 text-xs leading-5 text-muted-foreground">Enter a JSON object. Keys become specification labels and values must be text.</p><label className="mt-5 block text-xs font-bold">Specifications JSON<textarea required name="specifications" defaultValue={JSON.stringify(product?.specifications ?? { Puissance: "", Garantie: "12 mois" }, null, 2)} rows={12} spellCheck={false} className="mt-2 w-full rounded-md border bg-neutral-950 p-4 font-mono text-xs leading-6 text-neutral-100" /></label></section>
      <section className="rounded-xl border bg-white p-6"><h2 className="text-lg font-black">Pricing & inventory</h2><div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><label className="text-xs font-bold">Price (TND)<Input required name="price" type="number" min="0.1" step="0.1" defaultValue={product?.price} className="mt-2" /></label><label className="text-xs font-bold">Compare price<Input name="compareAtPrice" type="number" min="0" step="0.1" defaultValue={product?.compareAtPrice ?? ""} className="mt-2" /></label><label className="text-xs font-bold">Cost price<Input name="costPrice" type="number" min="0" step="0.1" defaultValue={product?.costPrice ?? ""} className="mt-2" /></label><label className="text-xs font-bold">Stock<Input required name="stock" type="number" min="0" step="1" defaultValue={product?.stock ?? 0} className="mt-2" /></label></div></section>
      <section className="rounded-xl border bg-white p-6"><h2 className="text-lg font-black">Media</h2><label className="mt-5 block text-xs font-bold">Primary image URL or local path<Input required name="image" type="text" defaultValue={product?.images[0]?.url} className="mt-2" /></label></section>
    </div>
    <aside className="space-y-6"><section className="rounded-xl border bg-white p-6"><h2 className="text-lg font-black">Organisation</h2><label className="mt-5 block text-xs font-bold">Category<select required name="categorySlug" defaultValue={product?.category.slug ?? ""} className="mt-2 h-11 w-full rounded-md border bg-white px-3 text-sm"><option value="" disabled>Choose category</option>{categories.map((category) => <option key={category.id} value={category.slug}>{category.name}</option>)}</select></label><label className="mt-4 block text-xs font-bold">Tags<Input name="tags" defaultValue={product?.tags.join(", ")} placeholder="technique, quotidien" className="mt-2" /></label></section>
      <section className="rounded-xl border bg-white p-6"><h2 className="text-lg font-black">Merchandising</h2><div className="mt-5 space-y-4 text-sm"><label className="flex items-center gap-3"><input type="checkbox" name="featured" defaultChecked={product?.featured} className="size-4 accent-orange-500" /> Featured product</label><label className="flex items-center gap-3"><input type="checkbox" name="isNew" defaultChecked={product?.isNew} className="size-4 accent-orange-500" /> New arrival</label><label className="flex items-center gap-3"><input type="checkbox" name="isFlashDeal" defaultChecked={product?.isFlashDeal} className="size-4 accent-orange-500" /> Flash deal</label></div></section>
      {error ? <p role="alert" className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p> : null}<Button disabled={pending} type="submit" size="lg" className="w-full">{pending ? <Loader2 className="animate-spin" /> : <Save />} {product ? "SAVE CHANGES" : "CREATE PRODUCT"}</Button>
    </aside>
  </form>;
}
