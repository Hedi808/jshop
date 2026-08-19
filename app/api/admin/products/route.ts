import { NextResponse } from "next/server";
import { createProduct } from "@/lib/data";
import { productInputSchema } from "@/lib/validations";

export async function POST(request: Request) {
  try {
    const parsed = productInputSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid product data." }, { status: 400 });
    const product = await createProduct(parsed.data);
    return NextResponse.json({ id: product.id }, { status: 201 });
  } catch (error) {
    console.error("Product creation failed", error);
    return NextResponse.json({ error: "Product could not be created. Check that the slug and SKU are unique." }, { status: 500 });
  }
}
