"use client";

import { useEffect, useState } from "react";
import { ProductGrid } from "@/components/product/product-grid";
import { useI18n } from "@/components/layout/locale-provider";
import type { Product } from "@/types";

const KEY = "joshop:recent:v2";

export function RecentlyViewed({ product }: { product: Product }) {
  const { t } = useI18n();
  const [recent, setRecent] = useState<Product[]>([]);
  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      try {
        const stored = JSON.parse(window.localStorage.getItem(KEY) ?? "[]") as Product[];
        setRecent(stored.filter((item) => item.id !== product.id).slice(0, 4));
        const next = [product, ...stored.filter((item) => item.id !== product.id)].slice(0, 5);
        window.localStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        window.localStorage.removeItem(KEY);
      }
    });
    return () => window.cancelAnimationFrame(frame);
  }, [product]);
  if (!recent.length) return null;
  return <section className="shell pb-16 md:pb-24"><h2 className="mb-8 text-3xl font-black uppercase tracking-[-.05em]">{t("product.recentlyViewed")}</h2><ProductGrid products={recent} /></section>;
}
