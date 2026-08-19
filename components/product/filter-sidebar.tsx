import Link from "next/link";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getI18n } from "@/lib/i18n";
import type { Category } from "@/types";

export type CatalogParams = {
  q?: string;
  brand?: string;
  color?: string;
  option?: string;
  minPrice?: string;
  maxPrice?: string;
  rating?: string;
  availability?: string;
  discount?: string;
  sort?: string;
  flash?: string;
  category?: string;
};

type Translate = (key: string, values?: Record<string, string | number>) => string;

function FilterFields({ params, categories, categorySlug, t }: { params: CatalogParams; categories: Category[]; categorySlug?: string; t: Translate }) {
  return (
    <>
      {params.q ? <input type="hidden" name="q" value={params.q} /> : null}
      <fieldset>
        <legend className="mb-3 text-xs font-black uppercase tracking-[.11em]">{t("product.category")}</legend>
        <div className="space-y-2.5">
          {categories.map((category) => <Link key={category.id} href={categorySlug ? `/category/${category.slug}` : `/search?category=${category.slug}`} className={`flex justify-between text-sm ${category.slug === categorySlug || category.slug === params.category ? "font-black text-primary" : "text-muted-foreground hover:text-foreground"}`}><span>{category.name}</span><span className="text-xs">{category.productCount}</span></Link>)}
        </div>
      </fieldset>
      <fieldset className="border-t pt-5">
        <legend className="mb-3 text-xs font-black uppercase tracking-[.11em]">{t("product.price")}</legend>
        <div className="grid grid-cols-2 gap-2"><Input name="minPrice" type="number" min="0" placeholder="Min TND" defaultValue={params.minPrice} /><Input name="maxPrice" type="number" min="0" placeholder="Max TND" defaultValue={params.maxPrice} /></div>
      </fieldset>
      <fieldset className="border-t pt-5">
        <legend className="mb-3 text-xs font-black uppercase tracking-[.11em]">{t("product.brand")}</legend>
        <Input name="brand" placeholder={t("product.anyBrand")} defaultValue={params.brand} list="brands" />
        <datalist id="brands"><option value="Sonicore" /><option value="Nexatek" /><option value="VoltMotion" /><option value="E-Ride" /><option value="Nexio" /></datalist>
      </fieldset>
      <div className="grid grid-cols-2 gap-3 border-t pt-5">
        <label className="text-xs font-black uppercase tracking-[.08em]">{t("common.option")}<select name="option" defaultValue={params.option ?? ""} className="mt-2 h-10 w-full rounded-md border bg-white px-2 text-sm font-normal normal-case tracking-normal"><option value="">{t("product.all")}</option>{["128 Go", "256 Go", "512 Go", "1 To", "35 km", "45 km", "Linéaires", "Tactiles"].map((option) => <option key={option}>{option}</option>)}</select></label>
        <label className="text-xs font-black uppercase tracking-[.08em]">{t("common.color")}<select name="color" defaultValue={params.color ?? ""} className="mt-2 h-10 w-full rounded-md border bg-white px-2 text-sm font-normal normal-case tracking-normal"><option value="">{t("product.all")}</option>{["Noir", "Blanc", "Gris", "Orange", "Bleu"].map((color) => <option key={color}>{color}</option>)}</select></label>
      </div>
      <fieldset className="border-t pt-5">
        <legend className="mb-3 text-xs font-black uppercase tracking-[.11em]">{t("product.rating")}</legend>
        <select name="rating" defaultValue={params.rating ?? ""} className="h-10 w-full rounded-md border bg-white px-3 text-sm"><option value="">{t("product.anyRating")}</option><option value="4">4★ & +</option><option value="4.5">4.5★ & +</option></select>
      </fieldset>
      <fieldset className="space-y-3 border-t pt-5 text-sm">
        <label className="flex items-center gap-3"><input type="checkbox" name="availability" value="true" defaultChecked={params.availability === "true"} className="size-4 accent-orange-500" /> {t("product.inStockOnly")}</label>
        <label className="flex items-center gap-3"><input type="checkbox" name="discount" value="true" defaultChecked={params.discount === "true"} className="size-4 accent-orange-500" /> {t("product.onlyDiscounted")}</label>
      </fieldset>
      <Button type="submit" className="w-full"><SlidersHorizontal /> {t("product.applyFilters")}</Button>
    </>
  );
}

export async function FilterSidebar(props: { params: CatalogParams; categories: Category[]; categorySlug?: string }) {
  const { t } = await getI18n();
  const action = props.categorySlug ? `/category/${props.categorySlug}` : "/search";
  return <>
    <aside className="hidden lg:block"><form action={action} className="sticky top-36 space-y-5 rounded-xl border p-5"><FilterFields {...props} t={t} /></form></aside>
    <details className="group lg:hidden"><summary className="flex h-11 cursor-pointer list-none items-center justify-center gap-2 rounded-md border text-sm font-black"><SlidersHorizontal className="size-4" /> {t("product.filters")}</summary><form action={action} className="mt-3 space-y-5 rounded-xl border p-5"><FilterFields {...props} t={t} /></form></details>
  </>;
}
