import { Headphones, PackageCheck, RotateCcw, ShieldCheck } from "lucide-react";
import { getI18n } from "@/lib/i18n";

export async function TrustStrip() {
  const { t } = await getI18n();
  const items = [{ icon: ShieldCheck, title: t("trust.secureTitle"), copy: t("trust.secureCopy") }, { icon: PackageCheck, title: t("trust.deliveryTitle"), copy: t("trust.deliveryCopy") }, { icon: RotateCcw, title: t("trust.returnsTitle"), copy: t("trust.returnsCopy") }, { icon: Headphones, title: t("trust.supportTitle"), copy: t("trust.supportCopy") }];
  return <section className="shell grid divide-y rounded-xl border md:grid-cols-2 md:divide-x md:divide-y-0 rtl:md:divide-x-reverse lg:grid-cols-4">{items.map(({ icon: Icon, title, copy }) => <div key={title} className="flex items-center gap-4 p-5 md:p-6"><Icon className="size-6 shrink-0 text-primary" strokeWidth={1.8} /><div><h3 className="text-sm font-black uppercase tracking-[-.02em]">{title}</h3><p className="mt-1 text-xs text-muted-foreground">{copy}</p></div></div>)}</section>;
}
