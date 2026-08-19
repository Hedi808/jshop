"use client";

import { Check, ChevronDown, Globe2 } from "lucide-react";
import { locales, type Locale } from "@/lib/i18n-config";
import { useI18n } from "@/components/layout/locale-provider";

export function LanguageSwitcher() {
  const { locale, t } = useI18n();

  return (
    <details className="group relative">
      <summary aria-label={t("language.label")} className="inline-flex h-9 cursor-pointer list-none items-center gap-1.5 rounded-full border border-current/20 px-2.5 text-[11px] font-black uppercase tracking-[.08em] hover:border-primary hover:text-primary [&::-webkit-details-marker]:hidden">
        <Globe2 className="size-3.5" /> {locale}<ChevronDown className="size-3 transition-transform group-open:rotate-180" />
      </summary>
      <div className="absolute end-0 z-50 mt-2 min-w-40 overflow-hidden rounded-lg border bg-white p-1 text-foreground shadow-xl" role="menu">
        {locales.map((item: Locale) => (
          <a key={item} href={`/api/locale?locale=${item}`} className="flex w-full items-center justify-between rounded-md px-3 py-2 text-start text-xs font-bold hover:bg-neutral-100" role="menuitem" aria-current={item === locale ? "true" : undefined}>
            {t(`language.${item}`)} {item === locale ? <Check className="size-3.5 text-primary" /> : null}
          </a>
        ))}
      </div>
    </details>
  );
}
