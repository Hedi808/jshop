import type { CatalogParams } from "@/components/product/filter-sidebar";
import { getI18n } from "@/lib/i18n";

export async function SortSelect({ params, action }: { params: CatalogParams; action: string }) {
  const { t } = await getI18n();
  return <form action={action} className="flex items-center gap-3">
    {Object.entries(params).filter(([key, value]) => key !== "sort" && value).map(([key, value]) => <input key={key} type="hidden" name={key} value={value} />)}
    <label htmlFor="sort" className="hidden text-xs font-bold text-muted-foreground sm:block">{t("product.sort")}</label>
    <select id="sort" name="sort" defaultValue={params.sort ?? "recommended"} className="h-11 rounded-md border bg-white px-3 text-xs font-bold" aria-label={t("product.sort")}>
      <option value="recommended">{t("common.recommended")}</option><option value="newest">{t("home.newTitle")}</option><option value="price-asc">{t("common.priceLow")}</option><option value="price-desc">{t("common.priceHigh")}</option><option value="best-selling">{t("home.bestTitle")}</option><option value="rating">{t("common.topRated")}</option>
    </select>
    <button type="submit" className="h-11 rounded-md bg-[#0a0a0a] px-4 text-xs font-black text-white hover:bg-primary">{t("product.sort")}</button>
  </form>;
}
