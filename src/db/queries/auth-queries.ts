import { sql } from "drizzle-orm";

import { db } from "@/db/client";

/**
 * Returns whether a Supabase Auth account exists for the given email.
 *
 * Reads the managed `auth.users` table directly through our existing Postgres
 * connection, so no elevated "secret" key is needed. Emails are stored
 * lowercased by Supabase, so we normalise before comparing.
 *
 * NOTE: surfacing this on a public endpoint is an email-enumeration vector.
 * It is a deliberate trade-off for the sign-in UX — see ARCHITECTURE.md.
 */
export async function checkEmailExists(email: string): Promise<boolean> {
  const normalizedEmail = email.trim().toLowerCase();
  const rows = await db.execute(
    sql`select 1 from auth.users where email = ${normalizedEmail} limit 1`,
  );
  return rows.length > 0;
}
