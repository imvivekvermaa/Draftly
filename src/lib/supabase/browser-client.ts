import { createBrowserClient } from "@supabase/ssr";

/**
 * Supabase client for Client Components. Used for interactive auth flows
 * (sign in, sign up, sign out) that run in the browser.
 */
export function createSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
}
