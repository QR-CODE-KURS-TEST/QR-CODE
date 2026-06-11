import { createBrowserClient } from "@supabase/ssr";

/**
 * Supabase-Client für Client-Components ("use client").
 * Nutzt den öffentlichen Publishable/Anon-Key.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
