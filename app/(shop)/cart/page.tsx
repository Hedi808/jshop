import type { Metadata } from "next";
import { CartPageClient } from "@/components/cart/cart-page-client";
import { getI18n } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> { const { t } = await getI18n(); return { title: t("cart.title") }; }
export default function CartPage() { return <CartPageClient />; }
