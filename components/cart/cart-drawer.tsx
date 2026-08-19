"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, X } from "lucide-react";
import { useEffect } from "react";
import { useShopStore } from "@/components/cart/store-provider";
import { useI18n } from "@/components/layout/locale-provider";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

export function CartDrawer() {
  const { locale, t } = useI18n();
  const { drawerOpen, setDrawerOpen, items, subtotal, removeItem, updateQuantity } = useShopStore();
  useEffect(() => {
    if (!drawerOpen) return;
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") setDrawerOpen(false); };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", onKeyDown); };
  }, [drawerOpen, setDrawerOpen]);

  return <div className={`fixed inset-0 z-[90] transition ${drawerOpen ? "pointer-events-auto" : "pointer-events-none"}`} aria-hidden={!drawerOpen}>
    <button type="button" aria-label={t("common.close")} className={`absolute inset-0 bg-black/50 transition-opacity ${drawerOpen ? "opacity-100" : "opacity-0"}`} onClick={() => setDrawerOpen(false)} />
    <aside role="dialog" aria-modal="true" aria-label={t("common.cart")} className={`absolute top-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300 ${locale === "ar" ? `left-0 ${drawerOpen ? "translate-x-0" : "-translate-x-full"}` : `right-0 ${drawerOpen ? "translate-x-0" : "translate-x-full"}`}`}>
      <div className="flex items-center justify-between border-b px-5 py-5"><div><p className="text-xs font-black uppercase tracking-[.16em] text-primary">{t("cart.selection")}</p><h2 className="mt-1 text-xl font-black">{t("cart.title")} <span className="text-muted-foreground">({items.length})</span></h2></div><Button variant="ghost" size="icon" onClick={() => setDrawerOpen(false)} aria-label={t("common.close")}><X /></Button></div>
      <div className="flex-1 overflow-y-auto px-5 py-4">{items.length ? <div className="space-y-5">
        <p className="rounded-md bg-orange-50 px-3 py-2 text-center text-xs font-extrabold tracking-wide text-[#b84300]">{t("cart.standardShippingDetail")}</p>
        {items.map((item) => <article key={item.key} className="grid grid-cols-[84px_1fr] gap-4 border-b pb-5"><Link href={`/product/${item.slug}`} onClick={() => setDrawerOpen(false)} className="relative aspect-[4/5] overflow-hidden rounded-lg bg-neutral-100"><Image src={item.image} alt={item.name} fill sizes="84px" className="object-cover" /></Link><div className="min-w-0"><div className="flex items-start justify-between gap-2"><div><Link href={`/product/${item.slug}`} onClick={() => setDrawerOpen(false)} className="line-clamp-2 text-sm font-bold hover:text-primary">{item.name}</Link><p className="mt-1 text-xs text-muted-foreground">{[item.optionValue, item.color].filter(Boolean).join(" · ") || t("common.option")}</p></div><button type="button" className="text-muted-foreground hover:text-foreground" onClick={() => removeItem(item.key)} aria-label={t("common.remove")}><X className="size-4" /></button></div><p className="mt-3 text-sm font-black text-primary">{formatPrice(item.price)}</p><div className="mt-3 flex w-fit items-center rounded-md border"><button type="button" className="grid size-8 place-items-center hover:bg-secondary" onClick={() => updateQuantity(item.key, item.quantity - 1)} aria-label="−"><Minus className="size-3" /></button><span className="w-8 text-center text-xs font-bold">{item.quantity}</span><button type="button" className="grid size-8 place-items-center hover:bg-secondary" onClick={() => updateQuantity(item.key, item.quantity + 1)} aria-label="+"><Plus className="size-3" /></button></div></div></article>)}
      </div> : <div className="grid h-full place-items-center text-center"><div><ShoppingBag className="mx-auto size-12 stroke-1 text-muted-foreground" /><h3 className="mt-4 text-lg font-black uppercase">{t("cart.emptyTitle")}</h3><p className="mt-2 text-sm text-muted-foreground">{t("cart.emptyCopy")}</p><Button asChild className="mt-5" onClick={() => setDrawerOpen(false)}><Link href="/search">{t("common.products")}</Link></Button></div></div>}</div>
      {items.length ? <div className="border-t bg-white p-5"><div className="mb-4 flex justify-between text-sm"><span className="font-bold">{t("common.subtotal")}</span><strong className="text-lg">{formatPrice(subtotal)}</strong></div><div className="grid grid-cols-2 gap-3"><Button asChild variant="outline" onClick={() => setDrawerOpen(false)}><Link href="/cart">{t("cart.viewCart")}</Link></Button><Button asChild onClick={() => setDrawerOpen(false)}><Link href="/checkout">{t("cart.checkout")}</Link></Button></div></div> : null}
    </aside>
  </div>;
}
