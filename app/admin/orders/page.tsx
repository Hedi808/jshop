import type { Metadata } from "next";
import { OrdersTable } from "@/components/admin/orders-table";
import { getOrders } from "@/lib/data";

export const metadata: Metadata = { title: "Admin orders", robots: { index: false, follow: false } };
export default async function AdminOrdersPage() { const orders = await getOrders(); return <div className="p-5 md:p-8 lg:p-10"><p className="text-xs font-black uppercase tracking-[.14em] text-primary">Fulfilment</p><h1 className="mt-2 text-4xl font-black tracking-[-.05em]">Orders</h1><p className="mt-2 text-sm text-muted-foreground">Review delivery details and move orders through fulfilment.</p><div className="mt-8"><OrdersTable orders={orders} /></div></div>; }
