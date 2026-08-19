"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Plus } from "lucide-react";
import { useShopStore } from "@/components/cart/store-provider";
import { useI18n } from "@/components/layout/locale-provider";
import { Badge } from "@/components/ui/badge";
import { PriceDisplay } from "@/components/product/price-display";
import { RatingStars } from "@/components/product/rating-stars";
import type { Product } from "@/types";

const colorMap: Record<string, string> = {
  Noir: "#111111", Blanc: "#f5f5f5", Gris: "#8b9298", Orange: "#ff6500", Bleu: "#365b8c", Sable: "#c9b28f",
};

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const { t } = useI18n();
  const { addItem, wishlist, toggleWishlist, notify } = useShopStore();
  const saved = wishlist.includes(product.id);
  const colors = [...new Set(product.variants.map((variant) => variant.color).filter((color): color is string => Boolean(color)))];

  return (
    <article className="group min-w-0">
      <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-neutral-100">
        <Link href={`/product/${product.slug}`} aria-label={`${t("common.discover")} ${product.name}`} className="relative block h-full w-full">
          {product.images[0] ? <Image src={product.images[0].url} alt={product.images[0].alt} fill priority={priority} sizes="(max-width: 720px) 50vw, (max-width: 1100px) 33vw, 25vw" className="object-cover transition duration-500 group-hover:scale-[1.03] group-hover:opacity-0" /> : null}
          {product.images[1] ? <Image src={product.images[1].url} alt={`${product.name} — 2`} fill sizes="(max-width: 720px) 50vw, (max-width: 1100px) 33vw, 25vw" className="object-cover opacity-0 transition duration-500 group-hover:scale-[1.03] group-hover:opacity-100" /> : null}
        </Link>
        <div className="absolute start-2 top-2 flex flex-col items-start gap-1.5">
          {product.compareAtPrice ? <Badge>{t("common.sale")}</Badge> : null}
          {product.isNew ? <Badge variant="dark">{t("common.new")}</Badge> : null}
        </div>
        <button
          type="button"
          onClick={() => { toggleWishlist(product.id); notify(t(saved ? "wishlist.removed" : "wishlist.saved")); }}
          className={`absolute end-2 top-2 grid size-9 place-items-center rounded-full bg-white shadow-sm transition hover:scale-105 ${saved ? "text-primary" : "text-[#0a0a0a]"}`}
          aria-label={t(saved ? "wishlist.removeAction" : "wishlist.addAction")}
          aria-pressed={saved}
          title={t(saved ? "wishlist.removeAction" : "wishlist.addAction")}
        >
          <Heart className={`size-4 ${saved ? "fill-current" : ""}`} />
        </button>
        <button
          type="button"
          onClick={() => addItem(product, { color: colors[0], optionName: product.variants[0]?.optionName ?? undefined, optionValue: product.variants[0]?.optionValue ?? undefined })}
          className="absolute bottom-2 end-2 grid size-10 place-items-center rounded-full bg-[#0a0a0a] text-white opacity-100 shadow-lg transition-all hover:bg-primary md:translate-y-3 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:focus:translate-y-0 md:focus:opacity-100"
          aria-label={`${t("product.addToCart")} ${product.name}`}
        ><Plus className="size-5" /></button>
      </div>
      <div className="pt-3">
        <p className="text-[10px] font-black uppercase tracking-[.13em] text-muted-foreground">{product.brand}</p>
        <Link href={`/product/${product.slug}`} className="mt-1 line-clamp-2 block min-h-10 text-sm font-bold leading-5 hover:text-primary">{product.name}</Link>
        <RatingStars rating={product.rating} count={product.reviewCount} className="mt-2" />
        <div className="mt-2"><PriceDisplay price={product.price} compareAtPrice={product.compareAtPrice} /></div>
        <div className="mt-2 flex flex-wrap gap-1.5">{Object.entries(product.specifications).slice(0, 2).map(([key, value]) => <span key={key} className="rounded bg-neutral-100 px-2 py-1 text-[9px] font-bold text-neutral-600">{value}</span>)}</div>
        {colors.length ? <div className="mt-2 flex items-center gap-1.5" aria-label={t("common.color")}>{colors.slice(0, 4).map((color) => <span key={color} title={color} className="size-3 rounded-full border border-black/10" style={{ backgroundColor: colorMap[color] ?? "#777" }} />)}</div> : null}
      </div>
    </article>
  );
}
