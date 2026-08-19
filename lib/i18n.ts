import "server-only";
import { cookies } from "next/headers";
import { defaultLocale, dictionaries, interpolate, isLocale, localeCookie, type Locale } from "@/lib/i18n-config";

export async function getLocale(): Promise<Locale> {
  const value = (await cookies()).get(localeCookie)?.value;
  return isLocale(value) ? value : defaultLocale;
}

export async function getI18n() {
  const locale = await getLocale();
  const messages = dictionaries[locale];
  return {
    locale,
    messages,
    t: (key: string, values?: Record<string, string | number>) => interpolate(messages[key] ?? dictionaries.fr[key] ?? key, values),
  };
}
