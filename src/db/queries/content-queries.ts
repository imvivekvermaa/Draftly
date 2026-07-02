import { and, desc, eq } from "drizzle-orm";

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

/**
 * Deletes a single content record, scoped to its owner so a user can only ever
 * delete their own rows. Returns `true` when a row was removed, `false` when no
 * matching row exists (unknown id, or not owned by this user).
 */
export async function deleteContentForUser(
  userId: string,
  contentId: string,
): Promise<boolean> {
  const deleted = await db
    .delete(contents)
    .where(and(eq(contents.id, contentId), eq(contents.userId, userId)))
    .returning({ id: contents.id });

  return deleted.length > 0;
}
