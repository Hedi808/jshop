"use client";

import Link from "next/link";
import { Loader2, LockKeyhole } from "lucide-react";
import { useActionState } from "react";
import { loginAction, registerAction, type AuthState } from "@/app/(shop)/auth/actions";
import { useI18n } from "@/components/layout/locale-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const initialState: AuthState = {};

type AuthFormProps = {
  mode: "login" | "register";
  next?: string;
};

export function AuthForm({ mode, next }: AuthFormProps) {
  const { t } = useI18n();
  const action = mode === "register" ? registerAction : loginAction;
  const [state, formAction, pending] = useActionState(action, initialState);
  const isRegister = mode === "register";
  const alternateHref = `${isRegister ? "/login" : "/register"}${next ? `?next=${encodeURIComponent(next)}` : ""}`;

  return (
    <form action={formAction} className="space-y-5">
      {next ? <input type="hidden" name="next" value={next} /> : null}
      {isRegister ? (
        <label className="block text-xs font-bold">
          {t("auth.fullName")}
          <Input required name="fullName" autoComplete="name" className="mt-2" maxLength={100} />
        </label>
      ) : null}
      <label className="block text-xs font-bold">
        {t("auth.email")}
        <Input required name="email" type="email" autoComplete="email" className="mt-2" maxLength={254} />
      </label>
      {isRegister ? (
        <label className="block text-xs font-bold">
          {t("auth.phone")}
          <Input name="phone" type="tel" autoComplete="tel" className="mt-2" maxLength={20} placeholder="+216" />
        </label>
      ) : null}
      <label className="block text-xs font-bold">
        {t("auth.password")}
        <Input required name="password" type="password" autoComplete={isRegister ? "new-password" : "current-password"} className="mt-2" minLength={isRegister ? 8 : undefined} maxLength={128} />
      </label>
      {isRegister ? (
        <>
          <label className="block text-xs font-bold">
            {t("auth.confirmPassword")}
            <Input required name="confirmPassword" type="password" autoComplete="new-password" className="mt-2" minLength={8} maxLength={128} />
          </label>
          <p className="text-xs leading-5 text-muted-foreground">{t("auth.passwordRules")}</p>
        </>
      ) : null}
      {state.error ? <p role="alert" className="rounded-md bg-red-50 px-4 py-3 text-xs font-bold text-red-700">{state.error}</p> : null}
      <Button type="submit" size="lg" disabled={pending} className="w-full">
        {pending ? <Loader2 className="animate-spin" /> : <LockKeyhole />}
        {pending ? t(isRegister ? "auth.registering" : "auth.signingIn") : t(isRegister ? "auth.createAccount" : "auth.signIn")}
      </Button>
      <p className="text-center text-xs text-muted-foreground">
        {t(isRegister ? "auth.haveAccount" : "auth.noAccount")} {" "}
        <Link href={alternateHref} className="font-black text-foreground underline underline-offset-4 hover:text-primary">
          {t(isRegister ? "auth.signIn" : "auth.createAccount")}
        </Link>
      </p>
    </form>
  );
}
