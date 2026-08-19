"use client";

import { useMemo, useState } from "react";
import { Heart, Minus, Plus, ShieldCheck, Truck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useShopStore } from "@/components/cart/store-provider";
import { useI18n } from "@/components/layout/locale-provider";
import { PriceDisplay } from "@/components/product/price-display";
import { RatingStars } from "@/components/product/rating-stars";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Product } from "@/types";

export function PurchasePanel({ product }: { product: Product }) {
  const router = useRouter();
  const { t } = useI18n();
  const { addItem, wishlist, toggleWishlist, notify } = useShopStore();
  const colors = useMemo(() => [...new Set(product.variants.map((variant) => variant.color).filter((value): value is string => Boolean(value)))], [product.variants]);
  const optionValues = useMemo(() => [...new Set(product.variants.map((variant) => variant.optionValue).filter((value): value is string => Boolean(value)))], [product.variants]);
  const optionName = product.variants.find((variant) => variant.optionName)?.optionName ?? t("common.option");
  const [color, setColor] = useState(colors[0]);
  const [optionValue, setOptionValue] = useState(optionValues[0]);
  const [quantity, setQuantity] = useState(1);
  const saved = wishlist.includes(product.id);

  const add = (checkout = false) => {
    addItem(product, { color, optionName, optionValue, quantity, openDrawer: !checkout });
    if (checkout) router.push("/checkout");
  };

  return (
    <div className="lg:sticky lg:top-36">
      <p className="text-xs font-black uppercase tracking-[.15em] text-muted-foreground">{product.brand}</p>
      <h1 className="mt-3 text-4xl font-black leading-[.96] tracking-[-.055em] md:text-5xl">{product.name}</h1>
      <div className="mt-4 flex flex-wrap items-center gap-3"><RatingStars rating={product.rating} count={product.reviewCount} size="md" /><span className="h-4 w-px bg-border" /><span className="text-xs font-bold text-muted-foreground">{product.soldCount} {t("product.sold")}</span>{product.isNew ? <Badge variant="dark">{t("common.new")}</Badge> : null}</div>
      <div className="mt-6"><PriceDisplay price={product.price} compareAtPrice={product.compareAtPrice} large /></div>
      <p className="mt-5 text-sm leading-6 text-muted-foreground">{product.shortDescription}</p>

      {optionValues.length ? <fieldset className="mt-7 border-t pt-6"><legend className="mb-3 text-xs font-black uppercase tracking-[.1em]">{optionName} <span className="ms-2 font-normal normal-case text-muted-foreground">{optionValue}</span></legend><div className="flex flex-wrap gap-2">{optionValues.map((item) => <button key={item} type="button" onClick={() => setOptionValue(item)} className={`min-h-10 rounded-md border px-4 text-xs font-bold ${optionValue === item ? "border-[#0a0a0a] bg-[#0a0a0a] text-white" : "hover:border-[#0a0a0a]"}`}>{item}</button>)}</div></fieldset> : null}
      {colors.length ? <fieldset className={`${optionValues.length ? "mt-6" : "mt-7 border-t pt-6"}`}><legend className="mb-3 text-xs font-black uppercase tracking-[.1em]">{t("common.color")} <span className="ms-2 font-normal normal-case text-muted-foreground">{color}</span></legend><div className="flex flex-wrap gap-2">{colors.map((item) => <button key={item} type="button" onClick={() => setColor(item)} className={`h-10 rounded-md border px-4 text-xs font-bold ${color === item ? "border-[#0a0a0a] bg-[#0a0a0a] text-white" : "hover:border-[#0a0a0a]"}`}>{item}</button>)}</div></fieldset> : null}

      <div className="mt-7 flex items-center justify-between border-y py-4">
        <span className="text-xs font-black uppercase tracking-[.1em]">{t("common.quantity")}</span>
        <div className="flex items-center rounded-md border"><button type="button" className="grid size-10 place-items-center" onClick={() => setQuantity((value) => Math.max(1, value - 1))} aria-label="−"><Minus className="size-4" /></button><span className="w-10 text-center text-sm font-black">{quantity}</span><button type="button" className="grid size-10 place-items-center" onClick={() => setQuantity((value) => Math.min(10, product.stock, value + 1))} aria-label="+"><Plus className="size-4" /></button></div>
      </div>
      {product.stock <= 10 ? <p className="mt-3 text-xs font-black text-primary">{t("product.onlyLeft", { count: product.stock })}</p> : <p className="mt-3 text-xs font-bold text-emerald-700">{t("product.ready")}</p>}

      <div className="mt-6 grid grid-cols-[1fr_auto] gap-3"><Button size="lg" onClick={() => add(false)}>{t("product.addToCart")}</Button><Button size="icon" variant="outline" className="size-13" onClick={() => { toggleWishlist(product.id); notify(t(saved ? "wishlist.removed" : "wishlist.saved")); }} aria-label={t(saved ? "wishlist.removeAction" : "wishlist.addAction")} aria-pressed={saved} title={t(saved ? "wishlist.removeAction" : "wishlist.addAction")}><Heart className={saved ? "fill-primary text-primary" : ""} /></Button></div>
      <Button size="lg" variant="dark" className="mt-3 w-full" onClick={() => add(true)}>{t("product.buyNow")}</Button>

      <div className="mt-7 grid gap-3 rounded-lg bg-neutral-50 p-4 text-xs">
        <p className="flex items-center gap-3 font-bold"><Truck className="size-4 shrink-0 text-primary" /> {t("product.deliveryCopy")}</p>
        <p className="flex items-center gap-3 font-bold"><ShieldCheck className="size-4 shrink-0 text-primary" /> {t("product.paymentCopy")}</p>
      </div>
    </div>
  );
}
