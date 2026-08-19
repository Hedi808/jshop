"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/components/layout/locale-provider";

export default function ShopError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const { t } = useI18n();
  return <div className="shell grid min-h-[34rem] place-items-center py-16 text-center"><div><AlertTriangle className="mx-auto size-14 stroke-1 text-primary" /><h1 className="mt-5 text-3xl font-black uppercase">{t("error.title")}</h1><p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">{t("error.copy")}</p><Button className="mt-6" onClick={reset}>{t("error.retry")}</Button></div></div>;
}
