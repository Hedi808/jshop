import { NextResponse } from "next/server";
import { updateOrderStatus } from "@/lib/data";
import { orderStatusSchema } from "@/lib/validations";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try { const [{ id }, body] = await Promise.all([params, request.json()]); const parsed = orderStatusSchema.safeParse(body.status); if (!parsed.success) return NextResponse.json({ error: "Invalid order status." }, { status: 400 }); const order = await updateOrderStatus(id, parsed.data); return NextResponse.json({ orderNumber: order.orderNumber, status: order.status }); }
  catch (error) { console.error("Order status update failed", error); return NextResponse.json({ error: "Order status could not be updated." }, { status: 500 }); }
}
