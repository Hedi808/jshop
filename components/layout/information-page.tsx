import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getI18n } from "@/lib/i18n";
import { informationPages, type InformationPageKey } from "@/lib/information-pages";

export async function InformationPage({ page }: { page: InformationPageKey }) {
  const { locale, t } = await getI18n();
  const content = informationPages[page][locale];

  return (
    <div className="shell py-10 md:py-16">
      <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-xs text-muted-foreground">
        <Link href="/">{t("common.home")}</Link><ChevronRight className="size-3 rtl:rotate-180" /><span>{content.title}</span>
      </nav>
      <div className="mt-8 max-w-3xl">
        <p className="eyebrow text-primary">{content.eyebrow}</p>
        <h1 className="mt-4 text-5xl font-black uppercase tracking-[-.065em] md:text-7xl">{content.title}</h1>
        <p className="mt-6 text-base leading-7 text-muted-foreground md:text-lg">{content.intro}</p>
      </div>
      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {content.sections.map((section) => (
          <section key={section.title} className="rounded-xl border bg-neutral-50 p-6 md:p-8">
            <h2 className="text-lg font-black uppercase">{section.title}</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{section.copy}</p>
          </section>
        ))}
      </div>
      <div className="mt-10 flex flex-wrap gap-3">
        <Button asChild><Link href="/search">{t("common.products")}</Link></Button>
        <Button asChild variant="outline"><Link href="/account/orders">{t("account.orders")}</Link></Button>
      </div>
    </div>
  );
}
