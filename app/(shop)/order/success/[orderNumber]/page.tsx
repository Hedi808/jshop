import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Check, MapPin, PackageCheck } from "lucide-react";
import { notFound } from "next/navigation";
import { OrderStatusBadge } from "@/components/account/order-status-badge";
import { Button } from "@/components/ui/button";
import { getOrder } from "@/lib/data";
import { getI18n } from "@/lib/i18n";
import { formatPrice } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t("order.confirmed"), robots: { index: false, follow: false } };
}

export default async function OrderSuccessPage({ params }: { params: Promise<{ orderNumber: string }> }) {
  const { orderNumber } = await params;
  const [order, { t }] = await Promise.all([getOrder(orderNumber), getI18n()]);
  if (!order) notFound();
  return <div className="shell py-12 md:py-20"><div className="mx-auto max-w-4xl">
    <div className="text-center"><span className="mx-auto grid size-16 place-items-center rounded-full bg-emerald-100 text-emerald-700"><Check className="size-8" /></span><p className="mt-6 text-xs font-black uppercase tracking-[.17em] text-primary">{t("order.received")}</p><h1 className="mt-3 text-5xl font-black uppercase tracking-[-.065em] md:text-7xl">{t("order.confirmed")}</h1><p className="mt-4 text-muted-foreground">{t("order.thanks", { name: order.customerName })}</p><p className="mt-3 font-black">#{order.orderNumber}</p></div>
    <div className="mt-10 grid gap-6 md:grid-cols-[1.2fr_.8fr]"><section className="rounded-xl border p-6"><div className="flex items-center justify-between"><h2 className="text-lg font-black uppercase">{t("order.items")}</h2><OrderStatusBadge status={order.status} /></div><div className="mt-6 divide-y">{order.items.map((item, index) => <article key={item.id ?? `${item.productId}-${index}`} className="grid grid-cols-[70px_1fr_auto] gap-4 py-4 first:pt-0"><div className="relative aspect-[4/5] overflow-hidden rounded-md bg-neutral-100"><Image src={item.image} alt={item.name ?? item.productName ?? t("common.products")} fill sizes="70px" className="object-cover" /></div><div><p className="text-sm font-bold">{item.name ?? item.productName}</p><p className="mt-1 text-xs text-muted-foreground">{t("common.quantity")} {item.quantity}{item.variant ? ` · ${item.variant}` : ""}</p></div><strong className="text-sm">{formatPrice((item.price ?? item.unitPrice ?? 0) * item.quantity)}</strong></article>)}</div><dl className="mt-5 space-y-3 border-t pt-5 text-sm"><div className="flex justify-between"><dt className="text-muted-foreground">{t("common.subtotal")}</dt><dd>{formatPrice(order.subtotal)}</dd></div><div className="flex justify-between"><dt className="text-muted-foreground">{t("common.shipping")}</dt><dd>{formatPrice(order.shipping)}</dd></div><div className="flex justify-between"><dt className="font-black">{t("common.total")}</dt><dd className="text-xl font-black text-primary">{formatPrice(order.total)}</dd></div></dl></section>
      <aside className="space-y-4"><div className="rounded-xl bg-[#151515] p-6 text-white"><PackageCheck className="size-6 text-primary" /><h2 className="mt-4 text-lg font-black uppercase">{t("order.next")}</h2><p className="mt-3 text-sm leading-6 text-neutral-400">{t("order.nextCopy")}</p></div><div className="rounded-xl border p-6"><MapPin className="size-5 text-primary" /><h2 className="mt-4 text-sm font-black uppercase">{t("order.deliveryTo")}</h2><address className="mt-3 text-sm not-italic leading-6 text-muted-foreground">{order.customerName}<br />{order.address}<br />{order.city}, {order.governorate} {order.postalCode}<br />{order.country}</address></div></aside>
    </div>
    <div className="mt-8 flex justify-center gap-3"><Button asChild variant="outline"><Link href="/account/orders">{t("order.track")}</Link></Button><Button asChild><Link href="/">{t("common.continueShopping")}</Link></Button></div>
  </div></div>;
}
