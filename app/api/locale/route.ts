import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { isLocale, localeCookie } from "@/lib/i18n-config";

function cookieOptions(request: Request) {
  const forwardedProtocol = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
  const protocol = forwardedProtocol ?? new URL(request.url).protocol.replace(":", "");
  return { httpOnly: true, maxAge: 60 * 60 * 24 * 365, path: "/", sameSite: "lax" as const, secure: protocol === "https" };
}

function returnUrl(request: Request) {
  const destination = new URL("/", request.url);
  const referer = request.headers.get("referer");
  if (!referer) return destination;
  try {
    const previous = new URL(referer);
    destination.pathname = previous.pathname;
    destination.search = previous.search;
    destination.hash = previous.hash;
  } catch {
    // Keep the safe homepage fallback for an invalid Referer header.
  }
  return destination;
}

export async function GET(request: Request) {
  const locale = new URL(request.url).searchParams.get("locale");
  if (!isLocale(locale)) return NextResponse.redirect(returnUrl(request), 303);
  const response = NextResponse.redirect(returnUrl(request), 303);
  response.cookies.set(localeCookie, locale, cookieOptions(request));
  response.headers.set("Cache-Control", "no-store");
  return response;
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { locale?: unknown } | null;
  if (!body || !isLocale(body.locale)) return Response.json({ error: "Unsupported locale" }, { status: 400 });
  (await cookies()).set(localeCookie, body.locale, cookieOptions(request));
  return Response.json({ locale: body.locale }, { headers: { "Cache-Control": "no-store" } });
}
