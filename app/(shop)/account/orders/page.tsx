import type { Metadata } from "next";
import Link from "next/link";
import { PackageOpen } from "lucide-react";
import { redirect } from "next/navigation";
import { OrderStatusBadge } from "@/components/account/order-status-badge";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth";
import { getOrdersForUser } from "@/lib/data";
import { getI18n } from "@/lib/i18n";
import { formatPrice } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> { const { t } = await getI18n(); return { title: t("account.orders") }; }

export default async function OrdersPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/account/orders");
  const [orders, { locale, t }] = await Promise.all([getOrdersForUser(user.id), getI18n()]);
  const dateLocale = locale === "fr" ? "fr-TN" : locale === "ar" ? "ar-TN" : "en-TN";
  return <div className="shell py-10 md:py-16"><p className="eyebrow text-muted-foreground">{t("account.orderHistory")}</p><h1 className="mt-4 text-5xl font-black uppercase tracking-[-.065em]">{t("account.orders")}</h1>{orders.length ? <div className="mt-8 divide-y border-y">{orders.map((order) => <article key={order.id} className="grid gap-5 py-6 md:grid-cols-[1fr_auto_auto] md:items-center"><div><div className="flex flex-wrap items-center gap-3"><h2 className="font-black">#{order.orderNumber}</h2><OrderStatusBadge status={order.status} /></div><p className="mt-2 text-xs text-muted-foreground">{t("account.placed")} {new Date(order.createdAt).toLocaleDateString(dateLocale, { day: "numeric", month: "long", year: "numeric" })} · {order.items.length} {t("cart.items")}</p></div><strong className="text-lg">{formatPrice(order.total)}</strong><Button asChild variant="outline" size="sm"><Link href={`/order/success/${order.orderNumber}`}>{t("account.viewDetails")}</Link></Button></article>)}</div> : <div className="mt-10 grid min-h-96 place-items-center rounded-xl bg-neutral-50 text-center"><div><PackageOpen className="mx-auto size-12 stroke-1 text-muted-foreground" /><h2 className="mt-4 text-xl font-black">{t("account.noOrders")}</h2><p className="mt-2 text-sm text-muted-foreground">{t("account.noOrdersCopy")}</p><Button asChild className="mt-5"><Link href="/">{t("common.shopNow")}</Link></Button></div></div>}</div>;
}
