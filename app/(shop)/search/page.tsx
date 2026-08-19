import type { Metadata } from "next";
import Link from "next/link";
import { SearchX } from "lucide-react";
import { FilterSidebar, type CatalogParams } from "@/components/product/filter-sidebar";
import { ProductGrid } from "@/components/product/product-grid";
import { SortSelect } from "@/components/product/sort-select";
import { getCategories, getProducts } from "@/lib/data";
import { getI18n } from "@/lib/i18n";

export const metadata: Metadata = { title: "Recherche", description: "Recherchez smartphones, informatique, maison et mobilité électrique chez JoShop." };

export default async function SearchPage({ searchParams }: { searchParams: Promise<CatalogParams & { category?: string }> }) {
  const [query, categories] = await Promise.all([searchParams, getCategories()]);
  let products = await getProducts({
    query: query.q,
    category: query.category,
    brand: query.brand,
    color: query.color,
    option: query.option,
    minPrice: query.minPrice ? Number(query.minPrice) : undefined,
    maxPrice: query.maxPrice ? Number(query.maxPrice) : undefined,
    rating: query.rating ? Number(query.rating) : undefined,
    availability: query.availability === "true",
    discount: query.discount === "true",
    sort: query.sort,
  });
  if (query.flash === "true") products = products.filter((product) => product.isFlashDeal);
  const { t } = await getI18n();

  const title = query.q ? t("catalog.resultsFor", { query: query.q }) : query.flash === "true" ? t("home.flashTitle") : query.discount === "true" ? t("nav.deals") : t("catalog.exploreAll");
  return (
    <div className="shell py-10 md:py-14">
      <div className="border-b pb-8"><p className="eyebrow text-muted-foreground">{t("catalog.searchDiscover")}</p><h1 className="mt-4 text-4xl font-black uppercase tracking-[-.055em] md:text-6xl">{title}</h1><p className="mt-3 text-sm text-muted-foreground">{products.length} {t("product.results")}</p></div>
      <div className="mt-7 grid gap-7 lg:grid-cols-[260px_1fr]">
        <FilterSidebar params={query} categories={categories} />
        <div>
          <div className="mb-7 flex justify-end"><SortSelect params={query} action="/search" /></div>
          {products.length ? <ProductGrid products={products} priorityCount={4} /> : (
            <div className="grid min-h-[30rem] place-items-center rounded-xl border bg-neutral-50 text-center"><div><SearchX className="mx-auto size-12 stroke-1 text-muted-foreground" /><h2 className="mt-5 text-2xl font-black">{t("common.noResults")}</h2><p className="mt-2 max-w-sm text-sm text-muted-foreground">{t("catalog.trySearch")}</p><Link href="/search" className="mt-5 inline-block text-sm font-black text-primary underline">{t("common.viewAll")}</Link></div></div>
          )}
        </div>
      </div>
    </div>
  );
}
