import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "@/components/layout/providers";
import { getI18n } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"), title: { default: t("meta.title"), template: "%s | JoShop" }, description: t("meta.description"), openGraph: { title: t("meta.title"), description: t("meta.description"), type: "website" } };
}

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#0A0A0A" };

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { locale, messages } = await getI18n();
  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"} data-scroll-behavior="smooth">
      <body className="antialiased">
        <Providers locale={locale} messages={messages}>{children}</Providers>
      </body>
    </html>
  );
}
