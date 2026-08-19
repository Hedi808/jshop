import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/account/auth-form";
import { getCurrentUser } from "@/lib/auth";
import { getI18n } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t("auth.loginTitle"), robots: { index: false, follow: false } };
}

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const [user, { next }, { t }] = await Promise.all([getCurrentUser(), searchParams, getI18n()]);
  if (user) redirect("/account");

  return (
    <div className="shell py-10 md:py-16">
      <div className="mx-auto grid max-w-4xl overflow-hidden rounded-2xl border bg-white shadow-xl lg:grid-cols-[.9fr_1.1fr]">
        <section className="grid place-items-center bg-[#151515] p-8 text-center text-white md:p-12">
          <div>
            <span className="mx-auto grid size-16 place-items-center rounded-full bg-primary/15 text-primary"><ShieldCheck className="size-8" /></span>
            <p className="mt-6 eyebrow text-primary">{t("auth.memberEyebrow")}</p>
            <h1 className="mt-4 text-4xl font-black uppercase tracking-[-.055em]">{t("auth.loginTitle")}</h1>
            <p className="mt-4 max-w-sm text-sm leading-6 text-neutral-400">{t("auth.loginCopy")}</p>
          </div>
        </section>
        <section className="p-8 md:p-12">
          <h2 className="text-2xl font-black uppercase">{t("auth.signIn")}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{t("auth.signInCopy")}</p>
          <div className="mt-8"><AuthForm mode="login" next={next} /></div>
        </section>
      </div>
    </div>
  );
}
