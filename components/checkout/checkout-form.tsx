"use client";

import Image from "next/image";
import Link from "next/link";
import { Check, ChevronLeft, CreditCard, Loader2, LockKeyhole, Truck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useShopStore } from "@/components/cart/store-provider";
import { EmptyState } from "@/components/cart/empty-state";
import { useI18n } from "@/components/layout/locale-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/lib/utils";

const governorates = ["Ariana", "Béja", "Ben Arous", "Bizerte", "Gabès", "Gafsa", "Jendouba", "Kairouan", "Kasserine", "Kébili", "Kef", "Mahdia", "Manouba", "Medenine", "Monastir", "Nabeul", "Sfax", "Sidi Bouzid", "Siliana", "Sousse", "Tataouine", "Tozeur", "Tunis", "Zaghouan"];

function StepTitle({ number, children }: { number: number; children: React.ReactNode }) {
  return <div className="mb-5 flex items-center gap-3"><span className="grid size-8 place-items-center rounded-full bg-[#0a0a0a] text-xs font-black text-white">{number}</span><h2 className="text-lg font-black uppercase">{children}</h2></div>;
}

export function CheckoutForm({ customer }: { customer?: { name: string; email: string; phone: string | null } }) {
  const router = useRouter();
  const { locale, t } = useI18n();
  const { items, subtotal, clearCart } = useShopStore();
  const [delivery, setDelivery] = useState<"standard" | "express">("standard");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  if (!items.length) return <EmptyState icon={CreditCard} title={t("checkout.emptyTitle")} copy={t("checkout.emptyCopy")} action={t("common.products")} href="/search" />;
  const shipping = delivery === "express" ? 15 : 7;
  const discount = subtotal >= 300 ? 20 : 0;
  const total = subtotal + shipping - discount;
  const country = locale === "fr" ? "Tunisie" : locale === "ar" ? "تونس" : "Tunisia";

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    const payload = Object.fromEntries(new FormData(event.currentTarget).entries());
    try {
      const response = await fetch("/api/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...payload, items: items.map((item) => ({ productId: item.productId, slug: item.slug, name: item.name, image: item.image, price: item.price, quantity: item.quantity, variant: [item.optionValue, item.color].filter(Boolean).join(" / ") || undefined })) }) });
      const data = await response.json() as { orderNumber?: string; error?: string };
      if (!response.ok || !data.orderNumber) throw new Error(data.error ?? t("checkout.error"));
      clearCart();
      router.push(`/order/success/${data.orderNumber}`);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : t("checkout.error"));
      setPending(false);
    }
  }

  return <form onSubmit={submit} className="shell py-10 md:py-14">
    <Link href="/cart" className="inline-flex items-center gap-1 text-xs font-black"><ChevronLeft className="size-4 rtl:rotate-180" /> {t("checkout.backToCart")}</Link>
    <div className="mt-7 grid gap-10 lg:grid-cols-[1fr_420px]"><div>
      <p className="eyebrow text-muted-foreground">{t("trust.secureTitle")}</p><h1 className="mt-4 text-5xl font-black uppercase tracking-[-.065em]">{t("checkout.title")}</h1>
      <section className="mt-10 border-t pt-8"><StepTitle number={1}>{t("checkout.contact")}</StepTitle><div className="grid gap-4 sm:grid-cols-2"><label className="text-xs font-bold">{t("checkout.fullName")}<Input required name="customerName" className="mt-2" autoComplete="name" defaultValue={customer?.name} /></label><label className="text-xs font-bold">{t("checkout.email")}<Input required name="email" type="email" className="mt-2" autoComplete="email" defaultValue={customer?.email} /></label><label className="text-xs font-bold sm:col-span-2">{t("checkout.phone")}<Input required name="phone" type="tel" className="mt-2" placeholder="+216" autoComplete="tel" defaultValue={customer?.phone ?? ""} /></label></div></section>
      <section className="mt-10 border-t pt-8"><StepTitle number={2}>{t("checkout.delivery")}</StepTitle><div className="grid gap-4 sm:grid-cols-2"><label className="text-xs font-bold sm:col-span-2">{t("checkout.address")}<Input required name="address" className="mt-2" autoComplete="street-address" /></label><label className="text-xs font-bold">{t("checkout.city")}<Input required name="city" className="mt-2" autoComplete="address-level2" /></label><label className="text-xs font-bold">{t("checkout.governorate")}<select required name="governorate" className="mt-2 h-11 w-full rounded-md border bg-white px-3 text-sm" defaultValue=""><option value="" disabled>{t("checkout.chooseGovernorate")}</option>{governorates.map((item) => <option key={item}>{item}</option>)}</select></label><label className="text-xs font-bold">{t("checkout.postalCode")}<Input required name="postalCode" pattern="[0-9]{4}" className="mt-2" autoComplete="postal-code" /></label><label className="text-xs font-bold">{t("checkout.country")}<Input readOnly name="country" value={country} className="mt-2 bg-neutral-50" /></label></div></section>
      <section className="mt-10 border-t pt-8"><StepTitle number={3}>{t("checkout.deliveryMethod")}</StepTitle><div className="grid gap-3">
        <label className={`flex cursor-pointer items-center gap-4 rounded-lg border-2 p-4 ${delivery === "standard" ? "border-primary" : "border-border"}`}><input type="radio" name="deliveryMethod" value="standard" checked={delivery === "standard"} onChange={() => setDelivery("standard")} className="accent-orange-500" /><Truck className="size-5" /><span className="flex-1"><strong className="block text-sm">{t("cart.standardShipping")}</strong><span className="text-xs text-muted-foreground">{t("checkout.standardTime")}</span></span><strong className="text-sm">7 TND</strong></label>
        <label className={`flex cursor-pointer items-center gap-4 rounded-lg border-2 p-4 ${delivery === "express" ? "border-primary" : "border-border"}`}><input type="radio" name="deliveryMethod" value="express" checked={delivery === "express"} onChange={() => setDelivery("express")} className="accent-orange-500" /><Truck className="size-5" /><span className="flex-1"><strong className="block text-sm">{t("checkout.expressLabel")}</strong><span className="text-xs text-muted-foreground">{t("checkout.expressTime")}</span></span><strong className="text-sm">15 TND</strong></label>
      </div></section>
      <section className="mt-10 border-t pt-8"><StepTitle number={4}>{t("checkout.payment")}</StepTitle><label className="flex cursor-pointer items-center gap-4 rounded-lg border-2 border-primary p-4"><input type="radio" name="paymentMethod" value="CASH_ON_DELIVERY" defaultChecked className="accent-orange-500" /><span className="grid size-9 place-items-center rounded-full bg-orange-50 text-primary"><Check className="size-4" /></span><span><strong className="block text-sm">{t("checkout.cash")}</strong><span className="text-xs text-muted-foreground">{t("checkout.cashCopy")}</span></span></label><div className="mt-3 flex items-center gap-4 rounded-lg border bg-neutral-50 p-4 opacity-55"><input type="radio" disabled /><CreditCard className="size-5" /><span><strong className="block text-sm">{t("checkout.card")}</strong><span className="text-xs text-muted-foreground">{t("checkout.comingSoon")}</span></span></div></section>
    </div>
      <aside className="h-fit rounded-xl bg-[#151515] p-6 text-white lg:sticky lg:top-36"><h2 className="text-lg font-black uppercase">{t("checkout.orderSummary")}</h2><div className="mt-6 max-h-80 space-y-4 overflow-y-auto pe-1">{items.map((item) => <div key={item.key} className="grid grid-cols-[58px_1fr_auto] gap-3"><div className="relative aspect-[4/5] overflow-hidden rounded-md bg-neutral-800"><Image src={item.image} alt={item.name} fill sizes="58px" className="object-cover" /></div><div><p className="line-clamp-2 text-xs font-bold">{item.name}</p><p className="mt-1 text-[10px] text-neutral-500">{t("common.quantity")} {item.quantity} · {[item.optionValue, item.color].filter(Boolean).join(" / ")}</p></div><p className="text-xs font-black">{formatPrice(item.price * item.quantity)}</p></div>)}</div><dl className="mt-6 space-y-3 border-t border-white/15 pt-5 text-sm"><div className="flex justify-between"><dt className="text-neutral-400">{t("common.subtotal")}</dt><dd>{formatPrice(subtotal)}</dd></div><div className="flex justify-between"><dt className="text-neutral-400">{t("common.shipping")}</dt><dd>{formatPrice(shipping)}</dd></div><div className="flex justify-between"><dt className="text-neutral-400">{t("cart.discount")}</dt><dd className="text-primary">{discount ? `-${formatPrice(discount)}` : "—"}</dd></div><div className="flex justify-between border-t border-white/15 pt-4"><dt className="font-black">{t("common.total")}</dt><dd className="text-2xl font-black text-primary">{formatPrice(total)}</dd></div></dl>{error ? <p role="alert" className="mt-4 rounded-md bg-red-950 px-3 py-2 text-xs text-red-200">{error}</p> : null}<Button disabled={pending} type="submit" size="lg" className="mt-6 w-full">{pending ? <><Loader2 className="animate-spin" /> {t("checkout.processing")}</> : t("checkout.placeOrder")}</Button><p className="mt-4 flex items-center justify-center gap-2 text-[10px] text-neutral-500"><LockKeyhole className="size-3" /> {t("checkout.secureCopy")}</p></aside>
    </div>
  </form>;
}
