import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getI18n } from "@/lib/i18n";

export async function Spotlight() {
  const { t } = await getI18n();
  return <section className="shell grid overflow-hidden rounded-2xl bg-[#151515] text-white lg:grid-cols-[1.1fr_.9fr]">
    <div className="relative min-h-[500px] lg:min-h-[650px]"><Image src="/art/trottinettes-electriques/2.svg" alt={t("home.mobilityTitle")} fill sizes="(max-width: 1024px) 100vw, 55vw" className="object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" /><div className="absolute bottom-6 start-6 rounded-md border border-white/25 bg-black/40 px-4 py-3 backdrop-blur"><p className="text-[10px] font-black tracking-[.16em] text-primary">URBANRIDE / SÉRIE 08</p><p className="mt-1 text-sm font-bold">{t("home.mobilityCopy")}</p></div></div>
    <div className="fine-grid flex flex-col justify-between p-8 md:p-14 lg:p-16"><div><p className="eyebrow text-neutral-400">{t("home.mobilityEyebrow")}</p><h2 className="mt-8 text-[clamp(3.8rem,7vw,6.5rem)] font-black uppercase leading-[.86] tracking-[-.07em]">{t("home.mobilityTitle")}</h2><p className="mt-8 max-w-md text-base leading-7 text-neutral-300">{t("home.mobilityCopy")}</p><Button asChild size="lg" className="mt-8"><Link href="/category/trottinettes-electriques">{t("common.discover")} <ArrowUpRight className="rtl:-rotate-90" /></Link></Button></div><p className="mt-16 border-t border-white/15 pt-5 text-xs font-bold uppercase tracking-[.14em] text-neutral-500">JSHOP / MOBILITÉ / 2026</p></div>
  </section>;
}
