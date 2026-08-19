"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { useI18n } from "@/components/layout/locale-provider";

export function NewsletterForm({ dark = false }: { dark?: boolean }) {
  const { t } = useI18n();
  const [done, setDone] = useState(false);
  return done ? (
    <p className="flex items-center gap-2 text-sm font-bold text-emerald-500"><Check className="size-4" /> {t("newsletter.success")}</p>
  ) : (
    <form className="flex max-w-md border-b" onSubmit={(event) => { event.preventDefault(); setDone(true); }}>
      <label htmlFor={dark ? "footer-email" : "newsletter-email"} className="sr-only">{t("checkout.email")}</label>
      <input id={dark ? "footer-email" : "newsletter-email"} required type="email" placeholder={t("checkout.email")} className={`h-12 min-w-0 flex-1 bg-transparent px-1 text-sm outline-none ${dark ? "text-white placeholder:text-neutral-500" : "text-foreground placeholder:text-neutral-500"}`} />
      <button type="submit" className="grid size-12 place-items-center transition-colors hover:text-primary" aria-label={t("newsletter.subscribe")}><ArrowRight className="rtl:rotate-180" /></button>
    </form>
  );
}
