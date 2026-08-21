"use client";

import { Loader2, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { formatPrice } from "@/lib/utils";
import type { Order } from "@/types";

const statuses: Order["status"][] = ["PENDING", "CONFIRMED", "PREPARING", "SHIPPED", "DELIVERED", "CANCELLED"];

export function OrdersTable({ orders }: { orders: Order[] }) {
  const router = useRouter(); const [updating, setUpdating] = useState<string>();
  async function update(orderNumber: string, status: Order["status"]) {
    setUpdating(orderNumber);
    try {
      const response = await fetch(`/api/admin/orders/${orderNumber}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
      if (!response.ok) throw new Error();
      router.refresh();
    } catch {
      window.alert("Order status could not be updated.");
    } finally {
      setUpdating(undefined);
    }
  }
  return <div className="overflow-x-auto rounded-xl border bg-white"><table className="w-full min-w-[1000px] text-left text-sm"><thead className="border-b bg-neutral-50 text-xs text-muted-foreground"><tr><th className="px-5 py-4">Order</th><th>Customer</th><th>Date</th><th>Amount</th><th>Payment</th><th>Delivery</th><th className="px-5">Status</th></tr></thead><tbody>{orders.map((order) => <tr key={order.id} className="border-b last:border-0"><td className="px-5 py-4 font-black">#{order.orderNumber}</td><td><p className="font-bold">{order.customerName}</p><p className="text-xs text-muted-foreground">{order.email}</p></td><td className="text-xs">{new Date(order.createdAt).toLocaleDateString("en-TN")}</td><td className="font-black">{formatPrice(order.total)}</td><td className="text-xs">{order.paymentMethod === "CASH_ON_DELIVERY" ? "Cash on delivery" : "Card"}</td><td><div className="flex max-w-56 gap-2 text-xs"><MapPin className="mt-0.5 size-3 shrink-0 text-primary" /><span>{order.address}, {order.city}, {order.governorate}</span></div></td><td className="px-5"><div className="flex items-center gap-2"><select value={order.status} onChange={(event) => update(order.orderNumber, event.target.value as Order["status"])} disabled={updating === order.orderNumber} className="h-9 rounded-md border bg-white px-2 text-xs font-bold">{statuses.map((status) => <option key={status}>{status}</option>)}</select>{updating === order.orderNumber ? <Loader2 className="size-4 animate-spin text-primary" /> : null}</div></td></tr>)}</tbody></table>{!orders.length ? <p className="py-16 text-center text-sm text-muted-foreground">No orders yet. Seed Supabase or place a storefront order.</p> : null}</div>;
}
