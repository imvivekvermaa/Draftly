import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { serverEnv } from "@/lib/env";
import * as schema from "./schema";

/**
 * A single pooled postgres connection reused across requests. In development
 * we cache it on `globalThis` to survive Next.js hot-reloads, which would
 * otherwise open a new pool on every file change and exhaust connections.
 */
const globalForDb = globalThis as unknown as {
  dbConnection?: ReturnType<typeof postgres>;
};

const connection =
  globalForDb.dbConnection ??
  postgres(serverEnv.DATABASE_URL, { prepare: false });

if (process.env.NODE_ENV !== "production") {
  globalForDb.dbConnection = connection;
}

export const db = drizzle(connection, { schema });
