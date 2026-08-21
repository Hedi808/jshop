import "server-only";

import { createHash, randomBytes, randomUUID, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { cache } from "react";
import { cookies } from "next/headers";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";

const scrypt = promisify(scryptCallback);
const SESSION_COOKIE = "joshop_session";
const SESSION_LENGTH_MS = 30 * 24 * 60 * 60 * 1000;
const PASSWORD_KEY_LENGTH = 64;

export type CurrentUser = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
};

export type AccountUser = CurrentUser & {
  addresses: Array<{
    id: string;
    label: string;
    address: string;
    city: string;
    governorate: string;
    postalCode: string;
    country: string;
    isDefault: boolean;
  }>;
};

function hashSessionToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function oneRelation<T>(value: T | T[] | null): T | null {
  return Array.isArray(value) ? value[0] ?? null : value;
}

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = await scrypt(password, salt, PASSWORD_KEY_LENGTH) as Buffer;
  return `scrypt$${salt}$${derivedKey.toString("hex")}`;
}

export async function verifyPassword(password: string, storedHash: string) {
  const [algorithm, salt, keyHex] = storedHash.split("$");
  if (algorithm !== "scrypt" || !salt || !keyHex || !/^[a-f\d]+$/i.test(keyHex)) return false;

  const storedKey = Buffer.from(keyHex, "hex");
  if (storedKey.length !== PASSWORD_KEY_LENGTH) return false;

  const derivedKey = await scrypt(password, salt, PASSWORD_KEY_LENGTH) as Buffer;
  return timingSafeEqual(storedKey, derivedKey);
}

export async function createSession(userId: string) {
  if (!isSupabaseConfigured) throw new Error("A Supabase connection is required for customer accounts.");

  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_LENGTH_MS);
  const { error } = await getSupabaseAdmin().from("Session").insert({
    id: randomUUID(),
    userId,
    tokenHash: hashSessionToken(token),
    expiresAt: expiresAt.toISOString(),
    createdAt: new Date().toISOString(),
  });
  if (error) throw new Error(`Could not create customer session: ${error.message}`);

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });
}

export async function destroySession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (token && isSupabaseConfigured) {
    try {
      const { error } = await getSupabaseAdmin().from("Session").delete().eq("tokenHash", hashSessionToken(token));
      if (error) throw error;
    } catch (error) {
      console.error("Could not remove the customer session", error);
    }
  }

  cookieStore.set(SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(0),
  });
}

export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  if (!isSupabaseConfigured) return null;

  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    const { data, error } = await getSupabaseAdmin()
      .from("Session")
      .select("expiresAt,user:User!Session_userId_fkey(id,name,email,phone)")
      .eq("tokenHash", hashSessionToken(token))
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    if (!data || new Date(data.expiresAt as string) <= new Date()) return null;

    const user = oneRelation(data.user as unknown as CurrentUser | CurrentUser[] | null);
    return user ? { id: user.id, name: user.name, email: user.email, phone: user.phone } : null;
  } catch (error) {
    console.error("Could not read the customer session", error);
    return null;
  }
});

export const getAccountUser = cache(async (): Promise<AccountUser | null> => {
  const user = await getCurrentUser();
  if (!user) return null;

  try {
    const { data, error } = await getSupabaseAdmin()
      .from("Address")
      .select("id,label,address,city,governorate,postalCode,country,isDefault,createdAt")
      .eq("userId", user.id)
      .order("isDefault", { ascending: false })
      .order("createdAt", { ascending: false });
    if (error) throw error;

    const addresses = data as unknown as Array<AccountUser["addresses"][number] & { createdAt: string }>;
    return {
      ...user,
      addresses: addresses.map(({ id, label, address, city, governorate, postalCode, country, isDefault }) => ({
        id,
        label,
        address,
        city,
        governorate,
        postalCode,
        country,
        isDefault,
      })),
    };
  } catch (error) {
    console.error("Could not read the customer address book", error);
    return { ...user, addresses: [] };
  }
});
