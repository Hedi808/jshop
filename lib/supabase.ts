import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

function isSafeSupabaseUrl(value: string | undefined) {
  if (!value) return false;
  try {
    const url = new URL(value);
    const isLoopback = url.hostname === "localhost" || url.hostname === "127.0.0.1" || url.hostname === "[::1]";
    return url.protocol === "https:" || (url.protocol === "http:" && isLoopback);
  } catch {
    return false;
  }
}

export const isSupabaseConfigured = Boolean(supabaseSecretKey && isSafeSupabaseUrl(supabaseUrl));

let supabaseAdmin: SupabaseClient | undefined;

export function getSupabaseAdmin() {
  if (!supabaseUrl || !supabaseSecretKey) {
    throw new Error("Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY.");
  }
  if (!isSafeSupabaseUrl(supabaseUrl)) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL must use HTTPS unless it points to a loopback development server.");
  }

  supabaseAdmin ??= createClient(supabaseUrl, supabaseSecretKey, {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
    },
  });

  return supabaseAdmin;
}
