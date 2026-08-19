import Link from "next/link";
import { Logo } from "@/components/layout/logo";
import { NewsletterForm } from "@/components/layout/newsletter-form";
import { getI18n } from "@/lib/i18n";

export async function Footer() {
  const { t } = await getI18n();
  const columns = [
    { title: t("footer.shop"), links: [["Smartphones", "/category/smartphones"], ["Informatique", "/category/informatique"], [t("nav.mobility"), "/category/mobilite-electrique"], [t("nav.deals"), "/search?discount=true"]] },
    { title: t("footer.help"), links: [[t("footer.contact"), "/account"], [t("footer.delivery"), "/checkout"], [t("footer.returns"), "/account"]] },
    { title: t("footer.company"), links: [[t("footer.about"), "/account"], [t("footer.terms"), "/account"], [t("footer.privacy"), "/account"]] },
  ];
  return <footer className="bg-[#0a0a0a] text-white"><div className="shell grid gap-12 py-16 lg:grid-cols-[1.25fr_1fr_1fr_1fr_1.4fr] lg:py-20">
    <div><Logo light /><p className="mt-5 max-w-xs text-sm leading-6 text-neutral-400">{t("footer.tagline")}</p></div>
    {columns.map((column) => <div key={column.title}><h2 className="text-xs font-black uppercase tracking-[.16em]">{column.title}</h2><ul className="mt-5 space-y-3">{column.links.map(([label, href]) => <li key={label}><Link href={href} className="text-sm text-neutral-400 hover:text-white">{label}</Link></li>)}</ul></div>)}
    <div><h2 className="text-xs font-black uppercase tracking-[.16em]">{t("home.newsletterEyebrow")}</h2><p className="mt-5 text-sm leading-6 text-neutral-400">{t("home.newsletterCopy")}</p><div className="mt-3"><NewsletterForm dark /></div></div>
  </div><div className="border-t border-white/10"><div className="shell flex flex-col gap-2 py-5 text-[11px] text-neutral-500 sm:flex-row sm:justify-between"><p>© 2026 JoShop. {t("footer.rights")}</p><p>TUNISIE · TND · {t("checkout.cash")}</p></div></div></footer>;
}
