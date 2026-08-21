"use server";

import { randomUUID } from "node:crypto";
import { redirect } from "next/navigation";
import { createSession, destroySession, hashPassword, normalizeEmail, verifyPassword } from "@/lib/auth";
import { getI18n } from "@/lib/i18n";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import { loginSchema, registerSchema } from "@/lib/validations";

export type AuthState = { error?: string };

const DUMMY_PASSWORD_HASH = `scrypt$00000000000000000000000000000000$${"00".repeat(64)}`;

function safeDestination(value: FormDataEntryValue | null) {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//") || value.includes("\\")) return "/account";
  try {
    const destination = new URL(value, "https://joshop.local");
    return destination.origin === "https://joshop.local" ? `${destination.pathname}${destination.search}${destination.hash}` : "/account";
  } catch {
    return "/account";
  }
}

export async function registerAction(_previousState: AuthState, formData: FormData): Promise<AuthState> {
  const { t } = await getI18n();
  if (!isSupabaseConfigured) return { error: t("auth.databaseRequired") };

  const parsed = registerSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });
  if (!parsed.success) return { error: t("auth.invalidRegistration") };

  const destination = safeDestination(formData.get("next"));
  const email = normalizeEmail(parsed.data.email);

  try {
    const supabase = getSupabaseAdmin();
    const { data: existingUser, error: lookupError } = await supabase
      .from("User")
      .select("id")
      .eq("email", email)
      .limit(1)
      .maybeSingle();
    if (lookupError) throw lookupError;
    if (existingUser) return { error: t("auth.emailExists") };

    const passwordHash = await hashPassword(parsed.data.password);
    const now = new Date().toISOString();
    const { data: user, error: createError } = await supabase.from("User").insert({
      id: randomUUID(),
      name: parsed.data.fullName,
      email,
      phone: parsed.data.phone || null,
      passwordHash,
      createdAt: now,
      updatedAt: now,
    }).select("id").single();
    if (createError) throw createError;

    await createSession(user.id);
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === "23505") {
      return { error: t("auth.emailExists") };
    }
    console.error("Customer registration failed", error);
    return { error: t("auth.registrationFailed") };
  }

  redirect(destination);
}

export async function loginAction(_previousState: AuthState, formData: FormData): Promise<AuthState> {
  const { t } = await getI18n();
  if (!isSupabaseConfigured) return { error: t("auth.databaseRequired") };

  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) return { error: t("auth.invalidCredentials") };

  const destination = safeDestination(formData.get("next"));

  try {
    const { data: user, error } = await getSupabaseAdmin()
      .from("User")
      .select("id,passwordHash")
      .eq("email", normalizeEmail(parsed.data.email))
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    const passwordMatches = await verifyPassword(parsed.data.password, user?.passwordHash ?? DUMMY_PASSWORD_HASH);

    if (!user?.passwordHash || !passwordMatches) return { error: t("auth.invalidCredentials") };
    await createSession(user.id);
  } catch (error) {
    console.error("Customer sign-in failed", error);
    return { error: t("auth.loginFailed") };
  }

  redirect(destination);
}

export async function logoutAction() {
  await destroySession();
  redirect("/");
}
