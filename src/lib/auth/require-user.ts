import type { User } from "@supabase/supabase-js";

import { createSupabaseServerClient } from "@/lib/supabase/server-client";

/**
 * Resolves the authenticated Supabase user for the current request, or null.
 * `getUser()` (not `getSession()`) is used so the token is verified against
 * Supabase Auth rather than trusted from the cookie alone.
 */
export async function getAuthenticatedUser(): Promise<User | null> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
