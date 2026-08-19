"use client";

import { Heart } from "lucide-react";
import { useShopStore } from "@/components/cart/store-provider";
import { EmptyState } from "@/components/cart/empty-state";
import { ProductGrid } from "@/components/product/product-grid";
import { useI18n } from "@/components/layout/locale-provider";
import type { Product } from "@/types";

export function WishlistClient({ products }: { products: Product[] }) {
  const { t } = useI18n();
  const { wishlist } = useShopStore();
  const saved = products.filter((product) => wishlist.includes(product.id));
  if (!saved.length) return <EmptyState icon={Heart} title={t("wishlist.emptyTitle")} copy={t("wishlist.emptyCopy")} action={t("common.products")} href="/search" />;
  return <div className="shell py-10 md:py-16"><div className="border-b pb-7"><p className="eyebrow text-muted-foreground">{t("wishlist.eyebrow")}</p><h1 className="mt-4 text-5xl font-black uppercase tracking-[-.065em]">{t("wishlist.title")}</h1><p className="mt-3 text-sm text-muted-foreground">{saved.length} {t("wishlist.count")}</p></div><div className="mt-10"><ProductGrid products={saved} priorityCount={4} /></div></div>;
}
