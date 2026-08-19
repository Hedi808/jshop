import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { createOrder } from "@/lib/data";
import { checkoutSchema } from "@/lib/validations";

export async function POST(request: Request) {
  try {
    const parsed = checkoutSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Please check your information." }, { status: 400 });
    if (parsed.data.paymentMethod === "CARD") return NextResponse.json({ error: "Card payment is not available yet." }, { status: 400 });
    const user = await getCurrentUser();
    const order = await createOrder(parsed.data, user?.id);
    return NextResponse.json({ orderNumber: order.orderNumber }, { status: 201 });
  } catch (error) {
    console.error("Order creation failed", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "We could not place your order. Please try again." }, { status: 500 });
  }
}
