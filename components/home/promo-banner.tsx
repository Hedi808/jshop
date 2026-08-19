import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getI18n } from "@/lib/i18n";

export async function PromoBanner() {
  const { t } = await getI18n();
  return <section className="shell overflow-hidden rounded-2xl bg-primary text-white"><div className="relative grid min-h-[350px] items-center overflow-hidden px-7 py-12 md:px-14 lg:grid-cols-[1.2fr_.8fr]">
    <div className="absolute -end-20 -top-48 size-[34rem] rounded-full border-[90px] border-black/10" /><div className="absolute bottom-0 end-[30%] h-full w-24 -skew-x-12 bg-black/10" />
    <div className="relative"><p className="text-xs font-black uppercase tracking-[.2em]">{t("home.promoEyebrow")}</p><h2 className="mt-4 text-[clamp(3.3rem,7vw,7rem)] font-black uppercase leading-[.84] tracking-[-.07em]">{t("home.promoTitle")}</h2></div>
    <div className="relative mt-8 max-w-md lg:mt-0"><p className="text-xl font-bold leading-8">{t("home.promoCopy")}</p><Button asChild variant="dark" size="lg" className="mt-7"><Link href="/search?discount=true">{t("common.exploreDeals")} <ArrowRight className="rtl:rotate-180" /></Link></Button></div>
  </div></section>;
}
