import { desc, eq } from "drizzle-orm";

import { db } from "@/db/client";
import { contents, profiles, type ContentRow } from "@/db/schema";
import type { SaveContentInput } from "@/lib/validation/content-schemas";

interface AuthenticatedUser {
  id: string;
  email: string;
}

/**
 * Guarantees a `profiles` row exists for the given user before we insert a
 * content record that references it. Idempotent: safe to call on every save,
 * which keeps the foreign key valid even if the sign-up trigger is skipped.
 */
async function ensureProfile(user: AuthenticatedUser): Promise<void> {
  await db
    .insert(profiles)
    .values({ id: user.id, email: user.email })
    .onConflictDoNothing({ target: profiles.id });
}

/** Persists a generated result owned by the given user and returns the row. */
export async function createContent(
  user: AuthenticatedUser,
  input: SaveContentInput,
): Promise<ContentRow> {
  await ensureProfile(user);

  const [row] = await db
    .insert(contents)
    .values({
      userId: user.id,
      contentType: input.contentType,
      tone: input.tone,
      topic: input.topic,
      prompt: input.prompt,
      output: input.output,
    })
    .returning();

  return row;
}

/** Returns the user's content history, newest first. */
export async function listContentByUser(
  userId: string,
): Promise<ContentRow[]> {
  return db
    .select()
    .from(contents)
    .where(eq(contents.userId, userId))
    .orderBy(desc(contents.createdAt));
}
