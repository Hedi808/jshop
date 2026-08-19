"use client";

import { createContext, useContext, useMemo } from "react";
import { dictionaries, interpolate, type Locale, type Messages } from "@/lib/i18n-config";

type LocaleContextValue = {
  locale: Locale;
  messages: Messages;
  t: (key: string, values?: Record<string, string | number>) => string;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children, locale, messages }: { children: React.ReactNode; locale: Locale; messages: Messages }) {
  const value = useMemo<LocaleContextValue>(() => ({
    locale,
    messages,
    t: (key, values) => interpolate(messages[key] ?? dictionaries.fr[key] ?? key, values),
  }), [locale, messages]);
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useI18n() {
  const context = useContext(LocaleContext);
  if (!context) throw new Error("useI18n must be used inside LocaleProvider");
  return context;
}
