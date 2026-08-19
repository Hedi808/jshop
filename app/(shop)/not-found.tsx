import Link from "next/link";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getI18n } from "@/lib/i18n";

export default async function NotFound() {
  const { t } = await getI18n();
  return <div className="shell grid min-h-[38rem] place-items-center py-16 text-center"><div><p className="text-8xl font-black tracking-[-.08em] text-primary">404</p><Compass className="mx-auto mt-4 size-10 stroke-1" /><h1 className="mt-5 text-3xl font-black uppercase">{t("error.notFound")}</h1><p className="mt-3 text-sm text-muted-foreground">{t("error.notFoundCopy")}</p><div className="mt-6 flex justify-center gap-3"><Button asChild><Link href="/">{t("common.home")}</Link></Button><Button asChild variant="outline"><Link href="/search">{t("common.search")}</Link></Button></div></div></div>;
}
