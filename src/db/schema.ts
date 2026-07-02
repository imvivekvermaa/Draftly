import { sql } from "drizzle-orm";
import {
  index,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

/**
 * `profiles` mirrors a Supabase Auth user (auth.users.id) so we can attach
 * application data without touching the managed auth schema. The id is the
 * same uuid Supabase Auth issues; a trigger keeps it in sync on sign-up.
 */
export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey(),
  email: text("email").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/**
 * `contents` stores every generated result together with the exact inputs
 * that produced it, so history is fully reproducible and auditable.
 */
export const contents = pgTable(
  "contents",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    contentType: text("content_type").notNull(),
    tone: text("tone").notNull(),
    topic: text("topic").notNull(),
    prompt: text("prompt").notNull(),
    output: text("output").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    // History is always queried per-user, newest first.
    index("contents_user_created_idx").on(
      table.userId,
      sql`${table.createdAt} DESC`,
    ),
  ],
);

export type ProfileRow = typeof profiles.$inferSelect;
export type ContentRow = typeof contents.$inferSelect;
export type NewContentRow = typeof contents.$inferInsert;
