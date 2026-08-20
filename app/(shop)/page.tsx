import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CategoryGrid } from "@/components/home/category-grid";
import { CountdownTimer } from "@/components/home/countdown-timer";
import { Hero } from "@/components/home/hero";
import { PromoBanner } from "@/components/home/promo-banner";
import { SectionHeader } from "@/components/home/section-header";
import { Spotlight } from "@/components/home/spotlight";
import { TrustStrip } from "@/components/home/trust-strip";
import { NewsletterForm } from "@/components/layout/newsletter-form";
import { ProductGrid } from "@/components/product/product-grid";
import { Button } from "@/components/ui/button";
import { getCategories, getProducts } from "@/lib/data";
import { getI18n } from "@/lib/i18n";

export default async function HomePage() {
  const [categories, products, { t }] = await Promise.all([getCategories(), getProducts(), getI18n()]);
  const categoryOrder = ["audio", "objets-connectes", "accessoires", "gaming", "maison", "cuisine", "beaute-bien-etre", "sports-loisirs", "electronique", "mobilite-electrique", "trottinettes-electriques", "velos-electriques"];
  const orderedCategories = [...categories].sort((a, b) => categoryOrder.indexOf(a.slug) - categoryOrder.indexOf(b.slug));
  const flash = products.filter((product) => product.isFlashDeal).slice(0, 8);
  const trending = [...products].sort((a, b) => b.soldCount - a.soldCount).slice(0, 8);
  const arrivals = [...products].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 8);
  const best = [...products].sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount).slice(0, 8);

  return (
    <>
      <Hero />

      <section className="section-space shell">
        <SectionHeader eyebrow={t("home.categoriesEyebrow")} title={t("home.categoriesTitle")} href="/search" action={t("common.viewAll")} />
        <CategoryGrid categories={orderedCategories} />
      </section>

      <section className="section-space bg-[#151515] text-white">
        <div className="shell">
          <div className="mb-8 flex flex-col justify-between gap-6 md:mb-10 md:flex-row md:items-end">
            <SectionHeader eyebrow={t("home.flashEyebrow")} title={t("home.flashTitle")} href="/search?flash=true" action={t("common.viewAll")} light />
            <div className="pb-10"><CountdownTimer /></div>
          </div>
          <div className="rounded-xl bg-white p-3 text-foreground sm:p-5"><ProductGrid products={flash} /></div>
        </div>
      </section>

      <section className="section-space shell">
        <SectionHeader eyebrow={t("home.trendingEyebrow")} title={t("home.trendingTitle")} href="/search?sort=best-selling" action={t("common.viewAll")} />
        <ProductGrid products={trending} />
      </section>

      <PromoBanner />

      <section className="section-space shell">
        <SectionHeader eyebrow={t("home.newEyebrow")} title={t("home.newTitle")} href="/search?sort=newest" action={t("common.viewAll")} />
        <ProductGrid products={arrivals} />
      </section>

      <div className="pb-8 md:pb-14"><Spotlight /></div>

      <section className="section-space shell">
        <SectionHeader eyebrow={t("home.bestEyebrow")} title={t("home.bestTitle")} href="/search?sort=best-selling" action={t("common.viewAll")} />
        <ProductGrid products={best} />
      </section>

      <div className="pb-12 md:pb-20"><TrustStrip /></div>

      <section className="bg-[#f2f2f2]">
        <div className="shell grid gap-10 py-16 md:grid-cols-[1.2fr_.8fr] md:items-end md:py-24">
          <div>
            <p className="eyebrow text-muted-foreground">{t("home.newsletterEyebrow")}</p>
            <h2 className="mt-5 text-[clamp(3.25rem,7vw,6.5rem)] font-black uppercase leading-[.86] tracking-[-.07em]">{t("home.newsletterTitle")}</h2>
          </div>
          <div>
            <p className="max-w-md text-base leading-7 text-muted-foreground">{t("home.newsletterCopy")}</p>
            <div className="mt-5"><NewsletterForm /></div>
            <p className="mt-3 text-[10px] leading-5 text-muted-foreground">{t("home.newsletterLegal")}</p>
          </div>
        </div>
      </section>

      <div className="fixed bottom-4 end-4 z-40 hidden sm:block">
        <Button asChild size="sm" variant="dark" className="rounded-full shadow-xl"><Link href="/search?discount=true">{t("nav.deals")} <ArrowRight className="rtl:rotate-180" /></Link></Button>
      </div>
    </>
  );
}
