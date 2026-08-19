import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle, Boxes, CircleDollarSign, PackageCheck, Users } from "lucide-react";
import { OrderStatusBadge } from "@/components/account/order-status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getOrders, getProducts } from "@/lib/data";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = { title: "Admin overview", robots: { index: false, follow: false } };

export default async function AdminPage() {
  const [products, orders] = await Promise.all([getProducts(), getOrders()]);
  const revenue = orders.filter((order) => order.status !== "CANCELLED").reduce((sum, order) => sum + order.total, 0);
  const metrics = [{ label: "Total products", value: products.length.toString(), icon: Boxes }, { label: "Total orders", value: orders.length.toString(), icon: PackageCheck }, { label: "Revenue", value: formatPrice(revenue), icon: CircleDollarSign }, { label: "Customers", value: new Set(orders.map((order) => order.email)).size.toString(), icon: Users }];
  const lowStock = products.filter((product) => product.stock <= 10).slice(0, 5);
  return <div className="p-5 md:p-8 lg:p-10">
    <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-[.14em] text-primary">JoShop operations</p><h1 className="mt-2 text-4xl font-black tracking-[-.05em]">Good morning, Admin.</h1><p className="mt-2 text-sm text-muted-foreground">Here&apos;s what is happening across the marketplace.</p></div><Button asChild><Link href="/admin/products/new">ADD PRODUCT</Link></Button></div>
    <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{metrics.map(({ label, value, icon: Icon }) => <Card key={label}><CardHeader className="flex-row items-center justify-between"><p className="text-xs font-bold text-muted-foreground">{label}</p><span className="grid size-9 place-items-center rounded-full bg-orange-50 text-primary"><Icon className="size-4" /></span></CardHeader><CardContent><p className="text-3xl font-black tracking-[-.05em]">{value}</p></CardContent></Card>)}</div>
    <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_.6fr]"><Card><CardHeader><div className="flex items-center justify-between"><h2 className="text-lg font-black">Recent orders</h2><Link href="/admin/orders" className="text-xs font-black text-primary">VIEW ALL</Link></div></CardHeader><CardContent>{orders.length ? <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="border-b text-xs text-muted-foreground"><tr><th className="py-3">Order</th><th>Customer</th><th>Status</th><th className="text-right">Total</th></tr></thead><tbody>{orders.slice(0, 6).map((order) => <tr key={order.id} className="border-b last:border-0"><td className="py-4 font-bold">#{order.orderNumber}</td><td>{order.customerName}</td><td><OrderStatusBadge status={order.status} /></td><td className="text-right font-black">{formatPrice(order.total)}</td></tr>)}</tbody></table></div> : <p className="py-10 text-center text-sm text-muted-foreground">No orders yet. Seed PostgreSQL or place a storefront order.</p>}</CardContent></Card>
      <Card><CardHeader><div className="flex items-center gap-2"><AlertTriangle className="size-5 text-amber-600" /><h2 className="text-lg font-black">Low stock</h2></div></CardHeader><CardContent><div className="divide-y">{lowStock.length ? lowStock.map((product) => <div key={product.id} className="flex items-center justify-between py-4"><div><p className="text-sm font-bold">{product.name}</p><p className="mt-1 text-xs text-muted-foreground">{product.sku}</p></div><span className="text-sm font-black text-amber-700">{product.stock} left</span></div>) : <p className="py-8 text-center text-sm text-muted-foreground">Stock levels look healthy.</p>}</div></CardContent></Card>
    </div>
  </div>;
}
