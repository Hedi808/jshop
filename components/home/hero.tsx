import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getI18n } from "@/lib/i18n";

export async function Hero() {
  const { t } = await getI18n();
  return <section className="relative min-h-[690px] overflow-hidden bg-[#0a0a0a] text-white md:min-h-[740px]">
    <Image src="/art/editorial/1.svg" alt={t("hero.title")} fill priority sizes="100vw" className="object-cover object-[62%_center] opacity-75 md:object-center md:opacity-85" />
    <div className="absolute inset-0 bg-gradient-to-r from-black via-black/65 to-transparent rtl:bg-gradient-to-l md:via-black/30" />
    <div className="absolute inset-0 fine-grid opacity-30" />
    <div className="shell relative flex min-h-[690px] items-center py-16 md:min-h-[740px]"><div className="max-w-3xl pt-14">
      <div className="mb-7 inline-flex items-center gap-2 border border-white/25 bg-black/30 px-3 py-2 text-[10px] font-black uppercase tracking-[.16em] backdrop-blur-sm"><Sparkles className="size-3.5 text-primary" /> {t("hero.eyebrow")}</div>
      <h1 className="display-title max-w-4xl text-[3.4rem] sm:text-[clamp(4.4rem,9vw,8.6rem)]">{t("hero.title")}</h1>
      <p className="mt-7 max-w-xl text-balance text-base leading-7 text-neutral-200 md:text-lg">{t("hero.copy")}</p>
      <div className="mt-8 flex flex-wrap gap-3"><Button asChild size="lg"><Link href="/category/trottinettes-electriques">{t("common.shopNow")} <ArrowRight className="rtl:rotate-180" /></Link></Button><Button asChild size="lg" variant="outline" className="border-white/50 text-white hover:bg-white hover:text-black"><Link href="/search?discount=true">{t("common.exploreDeals")}</Link></Button></div>
    </div></div>
    <div className="absolute bottom-0 end-0 hidden w-[36rem] grid-cols-3 border-s border-t border-white/20 bg-black/60 backdrop-blur-md lg:grid">{[["48", t("hero.products")], ["12", t("hero.categories")], ["24H", t("hero.support")]].map(([value, label]) => <div key={label} className="border-e border-white/20 p-6"><p className="text-2xl font-black text-primary">{value}</p><p className="mt-1 text-[10px] font-bold uppercase tracking-[.12em] text-neutral-300">{label}</p></div>)}</div>
  </section>;
}
