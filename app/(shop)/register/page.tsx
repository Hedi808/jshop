import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/account/auth-form";
import { getCurrentUser } from "@/lib/auth";
import { getI18n } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t("auth.registerTitle"), robots: { index: false, follow: false } };
}

export default async function RegisterPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const [user, { next }, { t }] = await Promise.all([getCurrentUser(), searchParams, getI18n()]);
  if (user) redirect("/account");

  return (
    <div className="shell py-10 md:py-16">
      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-2xl border bg-white shadow-xl lg:grid-cols-[1fr_1.05fr]">
        <section className="bg-[#151515] p-8 text-white md:p-12">
          <p className="eyebrow text-primary">{t("auth.memberEyebrow")}</p>
          <h1 className="mt-5 text-4xl font-black uppercase tracking-[-.055em] md:text-5xl">{t("auth.registerTitle")}</h1>
          <p className="mt-5 max-w-md text-sm leading-6 text-neutral-400">{t("auth.registerCopy")}</p>
          <ul className="mt-8 space-y-4 text-sm font-bold">
            {["auth.benefitOrders", "auth.benefitCheckout", "auth.benefitAddresses"].map((key) => (
              <li key={key} className="flex items-center gap-3"><CheckCircle2 className="size-5 text-primary" /> {t(key)}</li>
            ))}
          </ul>
        </section>
        <section className="p-8 md:p-12">
          <h2 className="text-2xl font-black uppercase">{t("auth.createAccount")}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{t("auth.secureAccountCopy")}</p>
          <div className="mt-8"><AuthForm mode="register" next={next} /></div>
        </section>
      </div>
    </div>
  );
}
