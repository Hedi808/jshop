"use client";

import Image from "next/image";
import { Expand } from "lucide-react";
import { useState } from "react";
import { useI18n } from "@/components/layout/locale-provider";
import type { ProductImage } from "@/types";

export function ProductGallery({ images, productName }: { images: ProductImage[]; productName: string }) {
  const { t } = useI18n();
  const [selected, setSelected] = useState(0);
  const [zoom, setZoom] = useState(false);
  const active = images[selected] ?? images[0];
  if (!active) return <div className="aspect-[4/5] rounded-xl bg-neutral-100" />;

  return (
    <div className="grid gap-3 md:grid-cols-[84px_1fr]">
      <div className="order-2 flex gap-2 overflow-x-auto md:order-1 md:flex-col">
        {images.map((image, index) => (
          <button type="button" key={image.id} onClick={() => setSelected(index)} className={`relative aspect-[4/5] w-20 shrink-0 overflow-hidden rounded-md border-2 bg-neutral-100 ${selected === index ? "border-primary" : "border-transparent"}`} aria-label={t("product.viewImage", { index: index + 1, product: productName })}>
            <Image src={image.url} alt="" fill sizes="80px" className="object-cover" />
          </button>
        ))}
      </div>
      <button type="button" onClick={() => setZoom(true)} className="group relative order-1 aspect-[4/5] overflow-hidden rounded-xl bg-neutral-100 md:order-2" aria-label={t("product.openImage")}>
        <Image src={active.url} alt={active.alt} fill priority sizes="(max-width: 768px) 100vw, 55vw" className="object-cover transition duration-700 group-hover:scale-[1.04]" />
        <span className="absolute bottom-4 right-4 grid size-11 place-items-center rounded-full bg-white shadow-lg"><Expand className="size-4" /></span>
      </button>
      {zoom ? (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-black/90 p-4" role="dialog" aria-modal="true" aria-label={t("product.openImage")} onClick={() => setZoom(false)}>
          <button type="button" className="absolute end-5 top-5 text-sm font-black text-white" onClick={() => setZoom(false)}>{t("common.close")} ×</button>
          <div className="relative h-[88vh] w-full max-w-5xl" onClick={(event) => event.stopPropagation()}><Image src={active.url} alt={active.alt} fill sizes="100vw" className="object-contain" /></div>
        </div>
      ) : null}
    </div>
  );
}
