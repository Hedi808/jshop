import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { FilterSidebar, type CatalogParams } from "@/components/product/filter-sidebar";
import { ProductGrid } from "@/components/product/product-grid";
import { SortSelect } from "@/components/product/sort-select";
import { getCategories, getProducts } from "@/lib/data";
import { getI18n } from "@/lib/i18n";

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<CatalogParams> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = (await getCategories()).find((item) => item.slug === slug);
  return category ? { title: category.name, description: category.description } : { title: "Category not found" };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const [{ slug }, query, categories] = await Promise.all([params, searchParams, getCategories()]);
  const category = categories.find((item) => item.slug === slug);
  if (!category) notFound();
  const products = await getProducts({
    category: slug,
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
  const { t } = await getI18n();

  return (
    <div className="shell py-8 md:py-12">
      <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-xs text-muted-foreground"><Link href="/">{t("common.home")}</Link><ChevronRight className="size-3 rtl:rotate-180" /><span>{category.name}</span></nav>
      <div className="mt-8 grid gap-6 border-b pb-8 md:grid-cols-[1fr_auto] md:items-end">
        <div><p className="eyebrow text-muted-foreground">{t("catalog.collection")}</p><h1 className="mt-4 text-5xl font-black uppercase tracking-[-.065em] md:text-7xl">{category.name}</h1><p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground">{category.description}</p></div>
        <p className="text-sm font-bold">{products.length} {t("product.results")}</p>
      </div>
      <div className="mt-7 grid gap-7 lg:grid-cols-[260px_1fr]">
        <FilterSidebar params={query} categories={categories} categorySlug={slug} />
        <div>
          <div className="mb-7 flex items-center justify-between gap-3"><p className="hidden text-xs text-muted-foreground sm:block">{t("catalog.showing")}</p><SortSelect params={query} action={`/category/${slug}`} /></div>
          {products.length ? <ProductGrid products={products} priorityCount={4} /> : <div className="grid min-h-96 place-items-center rounded-xl bg-neutral-50 text-center"><div><h2 className="text-2xl font-black">{t("common.noResults")}</h2><p className="mt-2 text-sm text-muted-foreground">{t("catalog.tryFilters")}</p><Link href={`/category/${slug}`} className="mt-5 inline-block text-sm font-black text-primary underline">{t("common.clearFilters")}</Link></div></div>}
        </div>
      </div>
    </div>
  );
}
