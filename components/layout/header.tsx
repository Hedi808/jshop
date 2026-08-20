"use client";

import Link from "next/link";
import { Heart, Menu, Search, ShoppingBag, UserRound, X, Zap } from "lucide-react";
import { useState } from "react";
import { useShopStore } from "@/components/cart/store-provider";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { useI18n } from "@/components/layout/locale-provider";
import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";

const links = [
  { key: "nav.audio", href: "/category/audio" },
  { key: "nav.home", href: "/category/maison" },
  { key: "nav.gaming", href: "/category/gaming" },
  { key: "nav.connected", href: "/category/objets-connectes" },
  { key: "nav.accessories", href: "/category/accessoires" },
  { key: "nav.deals", href: "/search?discount=true" },
];

function CountBadge({ count }: { count: number }) {
  return count > 0 ? <span className="absolute -end-2 -top-2 grid size-5 place-items-center rounded-full bg-primary text-[10px] font-black text-white">{Math.min(count, 99)}</span> : null;
}

export function Header({ accountName }: { accountName?: string }) {
  const { cartCount, wishlist } = useShopStore();
  const { locale, t } = useI18n();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <div className="bg-[#0a0a0a] px-4 py-2 text-center text-[10px] font-black tracking-[.08em] text-white sm:text-xs">
        {t("cart.standardShippingDetail")} <span className="mx-2 text-primary">|</span> {t("trust.secureTitle")}
      </div>
      <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur-md">
        <div className="shell flex h-[72px] items-center gap-3 lg:h-[78px] lg:gap-8">
          <Button className="lg:hidden" variant="ghost" size="icon" onClick={() => setMobileOpen(true)} aria-label={t("common.menu")}><Menu className="size-5" /></Button>
          <Logo className="shrink-0" />
          <form action="/search" role="search" className="relative mx-auto hidden w-full max-w-2xl md:block">
            <label htmlFor="header-search" className="sr-only">{t("common.search")}</label>
            <input id="header-search" name="q" type="search" placeholder={t("common.searchPlaceholder")} className="h-11 w-full rounded-md border-2 border-[#0a0a0a] bg-white ps-4 pe-12 text-sm placeholder:text-neutral-500" />
            <button type="submit" className="absolute end-0 top-0 grid size-11 place-items-center rounded-e-sm bg-[#0a0a0a] text-white hover:bg-primary" aria-label={t("common.search")}><Search className="size-5" /></button>
          </form>
          <div className="ms-auto flex items-center gap-1 sm:gap-3">
            <LanguageSwitcher />
            <Link href="/account" className="hidden min-w-12 max-w-24 flex-col items-center gap-0.5 text-[10px] font-bold hover:text-primary sm:flex"><UserRound className="size-5" /><span className="max-w-full truncate">{accountName?.split(" ")[0] || t("common.account")}</span></Link>
            <Link href="/wishlist" className="relative hidden min-w-12 flex-col items-center gap-0.5 text-[10px] font-bold hover:text-primary sm:flex"><Heart className="size-5" /><span>{t("common.wishlist")}</span><CountBadge count={wishlist.length} /></Link>
            <Link href="/cart" className="relative flex min-w-12 flex-col items-center gap-0.5 text-[10px] font-bold hover:text-primary" aria-label={`${t("common.cart")} (${cartCount})`}><ShoppingBag className="size-5" /><span>{t("common.cart")}</span><CountBadge count={cartCount} /></Link>
          </div>
        </div>
        <div className="shell pb-3 md:hidden">
          <form action="/search" role="search" className="relative">
            <label htmlFor="mobile-search" className="sr-only">{t("common.search")}</label>
            <input id="mobile-search" name="q" type="search" placeholder={t("common.searchPlaceholder")} className="h-10 w-full rounded-md bg-neutral-100 ps-4 pe-11 text-sm" />
            <button type="submit" className="absolute end-0 top-0 grid size-10 place-items-center" aria-label={t("common.search")}><Search className="size-4" /></button>
          </form>
        </div>
        <nav aria-label="Navigation principale" className="hidden border-t lg:block">
          <div className="shell flex h-11 items-center justify-center gap-7">
            {links.map((link) => <Link key={link.href} href={link.href} className="text-[11px] font-black uppercase tracking-[.07em] transition-colors hover:text-primary">{t(link.key)}</Link>)}
            <Link href="/search?flash=true" className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-[.07em] text-primary"><Zap className="size-4 fill-current" /> {t("home.flashTitle")}</Link>
          </div>
        </nav>
      </header>
      <div className={`fixed inset-0 z-[80] lg:hidden ${mobileOpen ? "pointer-events-auto" : "pointer-events-none"}`} aria-hidden={!mobileOpen}>
        <button type="button" aria-label={t("common.close")} className={`absolute inset-0 bg-black/50 transition-opacity ${mobileOpen ? "opacity-100" : "opacity-0"}`} onClick={() => setMobileOpen(false)} />
        <nav aria-label="Navigation mobile" className={`absolute top-0 h-full w-[86%] max-w-sm bg-white p-6 transition-transform duration-300 ${locale === "ar" ? `right-0 ${mobileOpen ? "translate-x-0" : "translate-x-full"}` : `left-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}`}>
          <div className="flex items-center justify-between"><Logo /><Button variant="ghost" size="icon" onClick={() => setMobileOpen(false)} aria-label={t("common.close")}><X /></Button></div>
          <p className="mt-10 text-[10px] font-black uppercase tracking-[.18em] text-muted-foreground">{t("home.categoriesEyebrow")}</p>
          <div className="mt-4 divide-y">
            {links.map((link) => <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)} className="block py-4 text-lg font-black">{t(link.key)}</Link>)}
            <Link href="/search?flash=true" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 py-4 text-lg font-black text-primary"><Zap className="fill-current" /> {t("home.flashTitle")}</Link>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-3">
            <Button asChild variant="outline" onClick={() => setMobileOpen(false)}><Link href="/account"><UserRound /> {accountName?.split(" ")[0] || t("common.account")}</Link></Button>
            <Button asChild variant="outline" onClick={() => setMobileOpen(false)}><Link href="/wishlist"><Heart /> {t("common.wishlist")}</Link></Button>
          </div>
        </nav>
      </div>
    </>
  );
}
