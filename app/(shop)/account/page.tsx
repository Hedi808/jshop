import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Heart, LogIn, LogOut, MapPin, Package, UserPlus, UserRound } from "lucide-react";
import { logoutAction } from "@/app/(shop)/auth/actions";
import { Button } from "@/components/ui/button";
import { getAccountUser } from "@/lib/auth";
import { getI18n } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t("account.title"), robots: { index: false, follow: false } };
}

export default async function AccountPage() {
  const [user, { t }] = await Promise.all([getAccountUser(), getI18n()]);

  if (!user) {
    return (
      <div className="shell py-10 md:py-16">
        <div className="grid overflow-hidden rounded-2xl bg-[#151515] text-white lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="p-7 md:p-10">
            <p className="text-xs font-black uppercase tracking-[.16em] text-primary">{t("account.guest")}</p>
            <h1 className="mt-3 text-4xl font-black uppercase tracking-[-.055em] md:text-6xl">{t("account.guestTitle")}</h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-neutral-400">{t("account.guestRegistrationCopy")}</p>
          </div>
          <div className="flex flex-col gap-3 border-t border-white/10 p-7 sm:flex-row lg:w-80 lg:flex-col lg:border-s lg:border-t-0">
            <Button asChild size="lg"><Link href="/register"><UserPlus /> {t("auth.createAccount")}</Link></Button>
            <Button asChild size="lg" variant="outline" className="border-white/30 text-white hover:bg-white hover:text-black"><Link href="/login"><LogIn /> {t("auth.signIn")}</Link></Button>
          </div>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <Link href="/wishlist" className="group flex items-center gap-5 rounded-xl border p-6 transition hover:-translate-y-1 hover:border-primary hover:shadow-lg">
            <span className="grid size-12 shrink-0 place-items-center rounded-full bg-orange-50 text-primary"><Heart className="size-5" /></span>
            <span className="flex-1"><strong className="block text-sm font-black uppercase">{t("common.wishlist")}</strong><span className="mt-1 block text-xs leading-5 text-muted-foreground">{t("account.wishlistCopy")}</span></span>
            <ChevronRight className="size-4 transition group-hover:translate-x-1 group-hover:text-primary rtl:rotate-180 rtl:group-hover:-translate-x-1" />
          </Link>
          <Link href="/search" className="group flex items-center gap-5 rounded-xl border p-6 transition hover:-translate-y-1 hover:border-primary hover:shadow-lg">
            <span className="grid size-12 shrink-0 place-items-center rounded-full bg-orange-50 text-primary"><Package className="size-5" /></span>
            <span className="flex-1"><strong className="block text-sm font-black uppercase">{t("common.products")}</strong><span className="mt-1 block text-xs leading-5 text-muted-foreground">{t("account.guestCheckoutCopy")}</span></span>
            <ChevronRight className="size-4 transition group-hover:translate-x-1 group-hover:text-primary rtl:rotate-180 rtl:group-hover:-translate-x-1" />
          </Link>
        </div>
      </div>
    );
  }

  const sections = [
    { icon: Package, title: t("account.orders"), copy: t("account.ordersCopy"), href: "/account/orders" },
    { icon: Heart, title: t("common.wishlist"), copy: t("account.wishlistCopy"), href: "/wishlist" },
    { icon: MapPin, title: t("account.addresses"), copy: t("account.addressesCopy"), href: "#addresses" },
    { icon: UserRound, title: t("account.personal"), copy: t("account.personalCopy"), href: "#profile" },
  ];

  return (
    <div className="shell py-10 md:py-16">
      <div className="rounded-2xl bg-[#151515] p-7 text-white md:p-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[.16em] text-primary">{t("account.member")}</p>
            <h1 className="mt-3 text-4xl font-black uppercase tracking-[-.055em] md:text-6xl">{t("account.hello", { name: user.name })}</h1>
            <p className="mt-4 text-sm text-neutral-400">{t("account.signedInAs", { email: user.email })}</p>
          </div>
          <form action={logoutAction}><Button type="submit" variant="outline" className="border-white/30 text-white hover:bg-white hover:text-black"><LogOut /> {t("auth.signOut")}</Button></form>
        </div>
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {sections.map(({ icon: Icon, title, copy, href }) => (
          <Link key={title} href={href} className="group flex items-center gap-5 rounded-xl border p-6 transition hover:-translate-y-1 hover:border-primary hover:shadow-lg">
            <span className="grid size-12 shrink-0 place-items-center rounded-full bg-orange-50 text-primary"><Icon className="size-5" /></span>
            <span className="flex-1"><strong className="block text-sm font-black uppercase">{title}</strong><span className="mt-1 block text-xs leading-5 text-muted-foreground">{copy}</span></span>
            <ChevronRight className="size-4 transition group-hover:translate-x-1 group-hover:text-primary rtl:rotate-180 rtl:group-hover:-translate-x-1" />
          </Link>
        ))}
      </div>
      <section id="profile" className="mt-10 grid gap-6 md:grid-cols-2">
        <div className="rounded-xl bg-neutral-50 p-6">
          <h2 className="text-lg font-black uppercase">{t("account.personal")}</h2>
          <dl className="mt-5 space-y-3 text-sm">
            <div><dt className="text-xs text-muted-foreground">{t("auth.fullName")}</dt><dd className="font-bold">{user.name}</dd></div>
            <div><dt className="text-xs text-muted-foreground">{t("auth.email")}</dt><dd className="font-bold">{user.email}</dd></div>
            <div><dt className="text-xs text-muted-foreground">{t("auth.phone")}</dt><dd className="font-bold">{user.phone || t("account.notProvided")}</dd></div>
          </dl>
        </div>
        <div id="addresses" className="rounded-xl bg-neutral-50 p-6">
          <h2 className="text-lg font-black uppercase">{t("account.savedAddresses")}</h2>
          {user.addresses.length ? (
            <div className="mt-5 space-y-4">
              {user.addresses.map((address) => (
                <address key={address.id} className="rounded-lg border bg-white p-4 text-sm not-italic">
                  <strong className="block">{address.label}{address.isDefault ? ` · ${t("account.defaultAddress")}` : ""}</strong>
                  <span className="mt-2 block leading-6 text-muted-foreground">{address.address}<br />{address.postalCode} {address.city}, {address.governorate}<br />{address.country}</span>
                </address>
              ))}
            </div>
          ) : <p className="mt-5 text-sm leading-6 text-muted-foreground">{t("account.noSavedAddress")}</p>}
        </div>
      </section>
    </div>
  );
}
