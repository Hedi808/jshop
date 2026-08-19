"use client";

import { StoreProvider } from "@/components/cart/store-provider";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { LocaleProvider } from "@/components/layout/locale-provider";
import type { Locale, Messages } from "@/lib/i18n-config";

export function Providers({ children, locale, messages }: { children: React.ReactNode; locale: Locale; messages: Messages }) {
  return (
    <LocaleProvider locale={locale} messages={messages}>
      <StoreProvider>
        {children}
        <CartDrawer />
      </StoreProvider>
    </LocaleProvider>
  );
}
