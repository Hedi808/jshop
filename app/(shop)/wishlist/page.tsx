import type { Metadata } from "next";
import { WishlistClient } from "@/components/cart/wishlist-client";
import { getProducts } from "@/lib/data";
import { getI18n } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> { const { t } = await getI18n(); return { title: t("wishlist.title") }; }
export default async function WishlistPage() { return <WishlistClient products={await getProducts()} />; }
