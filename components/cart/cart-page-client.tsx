"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useShopStore } from "@/components/cart/store-provider";
import { EmptyState } from "@/components/cart/empty-state";
import { useI18n } from "@/components/layout/locale-provider";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

export function CartPageClient() {
  const { t } = useI18n();
  const { items, subtotal, removeItem, updateQuantity } = useShopStore();
  if (!items.length) return <EmptyState icon={ShoppingBag} title={t("cart.emptyTitle")} copy={t("cart.emptyCopy")} action={t("common.products")} href="/search" />;
  const shipping = 7;
  const discount = subtotal >= 300 ? 20 : 0;
  const total = subtotal + shipping - discount;

  return <div className="shell py-10 md:py-16">
    <div className="flex items-end justify-between border-b pb-7"><div><p className="eyebrow text-muted-foreground">{t("cart.selection")}</p><h1 className="mt-4 text-5xl font-black uppercase tracking-[-.065em]">{t("cart.title")}</h1></div><p className="text-sm font-bold">{items.length} {t("cart.items")}</p></div>
    <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_390px]"><div className="divide-y border-y">{items.map((item) => <article key={item.key} className="grid grid-cols-[110px_1fr] gap-4 py-6 sm:grid-cols-[150px_1fr_auto] sm:gap-6"><Link href={`/product/${item.slug}`} className="relative aspect-[4/5] overflow-hidden rounded-lg bg-neutral-100"><Image src={item.image} alt={item.name} fill sizes="150px" className="object-cover" /></Link><div><Link href={`/product/${item.slug}`} className="font-black hover:text-primary">{item.name}</Link><p className="mt-2 text-xs text-muted-foreground">{[item.optionValue, item.color].filter(Boolean).join(" · ") || t("common.option")}</p><p className="mt-4 font-black text-primary">{formatPrice(item.price)}</p><button type="button" className="mt-5 flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-destructive sm:hidden" onClick={() => removeItem(item.key)}><Trash2 className="size-3.5" /> {t("common.remove")}</button></div><div className="col-span-2 flex items-center justify-between sm:col-span-1 sm:flex-col sm:items-end"><button type="button" className="hidden items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-destructive sm:flex" onClick={() => removeItem(item.key)}><Trash2 className="size-3.5" /> {t("common.remove")}</button><div className="flex items-center rounded-md border"><button type="button" onClick={() => updateQuantity(item.key, item.quantity - 1)} className="grid size-10 place-items-center" aria-label="−"><Minus className="size-4" /></button><span className="w-10 text-center text-sm font-black">{item.quantity}</span><button type="button" onClick={() => updateQuantity(item.key, item.quantity + 1)} className="grid size-10 place-items-center" aria-label="+"><Plus className="size-4" /></button></div><p className="text-sm font-black">{formatPrice(item.price * item.quantity)}</p></div></article>)}</div>
      <aside className="h-fit rounded-xl bg-[#151515] p-6 text-white lg:sticky lg:top-36"><h2 className="text-xl font-black uppercase">{t("cart.summary")}</h2><dl className="mt-6 space-y-4 text-sm"><div className="flex justify-between"><dt className="text-neutral-400">{t("common.subtotal")}</dt><dd className="font-bold">{formatPrice(subtotal)}</dd></div><div className="flex justify-between"><dt className="text-neutral-400">{t("common.shipping")}</dt><dd className="font-bold">{formatPrice(shipping)}</dd></div><div className="flex justify-between"><dt className="text-neutral-400">{t("cart.discount")}</dt><dd className="font-bold text-primary">{discount ? `-${formatPrice(discount)}` : "—"}</dd></div><div className="flex justify-between border-t border-white/15 pt-5"><dt className="font-black">{t("common.total")}</dt><dd className="text-2xl font-black text-primary">{formatPrice(total)}</dd></div></dl><Button asChild size="lg" className="mt-6 w-full"><Link href="/checkout">{t("cart.checkout")}</Link></Button><p className="mt-4 text-center text-[10px] leading-5 text-neutral-500">{t("cart.taxNote")}</p></aside>
    </div>
  </div>;
}
