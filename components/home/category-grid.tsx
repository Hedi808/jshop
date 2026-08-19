import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getI18n } from "@/lib/i18n";
import type { Category } from "@/types";

export async function CategoryGrid({ categories }: { categories: Category[] }) {
  const { t } = await getI18n();
  return <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-7">{categories.map((category) => <Link key={category.id} href={`/category/${category.slug}`} className="group relative overflow-hidden rounded-xl bg-neutral-100">
    <div className="relative aspect-[4/5]">{category.image ? <Image src={category.image} alt={`${t("common.discover")} ${category.name}`} fill sizes="(max-width: 720px) 50vw, (max-width: 1100px) 33vw, 14vw" className="object-cover transition duration-500 group-hover:scale-105" /> : null}<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" /></div>
    <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-4 text-white"><div><h3 className="text-base font-black leading-tight tracking-[-.035em]">{category.name}</h3><p className="mt-1 text-[10px] font-bold text-neutral-300">{category.productCount} {t("product.results")}</p></div><span className="grid size-8 shrink-0 place-items-center rounded-full border border-white/40 transition group-hover:border-primary group-hover:bg-primary"><ArrowUpRight className="size-4 rtl:-rotate-90" /></span></div>
  </Link>)}</div>;
}
