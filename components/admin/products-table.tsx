"use client";

import Image from "next/image";
import Link from "next/link";
import { Edit3, Loader2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types";

export function ProductsTable({ products }: { products: Product[] }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState<string>();
  async function remove(product: Product) {
    if (!window.confirm(`Delete “${product.name}”? This cannot be undone.`)) return;
    setDeleting(product.id);
    try {
      const response = await fetch(`/api/admin/products/${product.id}`, { method: "DELETE" });
      if (!response.ok) throw new Error();
      router.refresh();
    } catch {
      window.alert("Product could not be deleted. It may be referenced by an existing order.");
    } finally {
      setDeleting(undefined);
    }
  }
  return <div className="overflow-x-auto rounded-xl border bg-white"><table className="w-full min-w-[880px] text-left text-sm"><thead className="border-b bg-neutral-50 text-xs text-muted-foreground"><tr><th className="px-5 py-4">Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Flags</th><th className="px-5 text-right">Actions</th></tr></thead><tbody>{products.map((product) => <tr key={product.id} className="border-b last:border-0"><td className="px-5 py-4"><div className="flex items-center gap-3"><div className="relative size-14 overflow-hidden rounded-md bg-neutral-100"><Image src={product.images[0]?.url ?? ""} alt="" fill sizes="56px" className="object-cover" /></div><div><p className="max-w-xs font-bold">{product.name}</p><p className="mt-1 text-xs text-muted-foreground">{product.sku} · {product.brand}</p></div></div></td><td>{product.category.name}</td><td><strong>{formatPrice(product.price)}</strong>{product.compareAtPrice ? <p className="text-xs text-muted-foreground line-through">{formatPrice(product.compareAtPrice)}</p> : null}</td><td><span className={product.stock <= 10 ? "font-black text-amber-700" : "font-bold"}>{product.stock}</span></td><td><div className="flex gap-1">{product.featured ? <Badge variant="dark">Featured</Badge> : null}{product.isFlashDeal ? <Badge>Flash</Badge> : null}</div></td><td className="px-5"><div className="flex justify-end gap-2"><Button asChild size="icon" variant="outline" aria-label={`Edit ${product.name}`}><Link href={`/admin/products/${product.id}/edit`}><Edit3 /></Link></Button><Button size="icon" variant="outline" onClick={() => remove(product)} disabled={deleting === product.id} aria-label={`Delete ${product.name}`}>{deleting === product.id ? <Loader2 className="animate-spin" /> : <Trash2 />}</Button></div></td></tr>)}</tbody></table>{!products.length ? <p className="py-16 text-center text-sm text-muted-foreground">No products match your search.</p> : null}</div>;
}
