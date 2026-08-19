import "server-only";

import { createHash, randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { cache } from "react";
import { cookies } from "next/headers";
import { isDatabaseConfigured, prisma } from "@/lib/db";

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
  if (!isDatabaseConfigured) throw new Error("A database connection is required for customer accounts.");

  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_LENGTH_MS);
  await prisma.session.create({
    data: { userId, tokenHash: hashSessionToken(token), expiresAt },
  });

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

  if (token && isDatabaseConfigured) {
    try {
      await prisma.session.deleteMany({ where: { tokenHash: hashSessionToken(token) } });
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
  if (!isDatabaseConfigured) return null;

  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    const session = await prisma.session.findUnique({
      where: { tokenHash: hashSessionToken(token) },
      include: {
        user: {
          select: { id: true, name: true, email: true, phone: true },
        },
      },
    });

    if (!session || session.expiresAt <= new Date()) return null;

    return {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      phone: session.user.phone,
    };
  } catch (error) {
    console.error("Could not read the customer session", error);
    return null;
  }
});

export const getAccountUser = cache(async (): Promise<AccountUser | null> => {
  const user = await getCurrentUser();
  if (!user) return null;

  try {
    const addresses = await prisma.address.findMany({
      where: { userId: user.id },
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    });
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
