import { NextResponse } from "next/server";
import { deleteProduct, updateProduct } from "@/lib/data";
import { productInputSchema } from "@/lib/validations";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const [{ id }, body] = await Promise.all([params, request.json()]);
    const parsed = productInputSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid product data." }, { status: 400 });
    const product = await updateProduct(id, parsed.data);
    return NextResponse.json({ id: product.id });
  } catch (error) {
    console.error("Product update failed", error);
    return NextResponse.json({ error: "Product could not be updated. Check that the slug and SKU are unique." }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try { const { id } = await params; await deleteProduct(id); return NextResponse.json({ ok: true }); }
  catch (error) { console.error("Product deletion failed", error); return NextResponse.json({ error: "Product could not be deleted." }, { status: 500 }); }
}
