"use server";

import { Prisma } from "@prisma/client";
import { redirect } from "next/navigation";
import { createSession, destroySession, hashPassword, normalizeEmail, verifyPassword } from "@/lib/auth";
import { isDatabaseConfigured, prisma } from "@/lib/db";
import { getI18n } from "@/lib/i18n";
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
  if (!isDatabaseConfigured) return { error: t("auth.databaseRequired") };

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
    const existingUser = await prisma.user.findFirst({
      where: { email: { equals: email, mode: "insensitive" } },
      select: { id: true },
    });
    if (existingUser) return { error: t("auth.emailExists") };

    const passwordHash = await hashPassword(parsed.data.password);
    const user = await prisma.user.create({
      data: {
        name: parsed.data.fullName,
        email,
        phone: parsed.data.phone || null,
        passwordHash,
      },
    });

    await createSession(user.id);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { error: t("auth.emailExists") };
    }
    console.error("Customer registration failed", error);
    return { error: t("auth.registrationFailed") };
  }

  redirect(destination);
}

export async function loginAction(_previousState: AuthState, formData: FormData): Promise<AuthState> {
  const { t } = await getI18n();
  if (!isDatabaseConfigured) return { error: t("auth.databaseRequired") };

  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) return { error: t("auth.invalidCredentials") };

  const destination = safeDestination(formData.get("next"));

  try {
    const user = await prisma.user.findFirst({
      where: { email: { equals: normalizeEmail(parsed.data.email), mode: "insensitive" } },
      select: { id: true, passwordHash: true },
    });
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
