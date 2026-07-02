import { defineConfig } from "drizzle-kit";
import { config } from "dotenv";

// Load env so `drizzle-kit generate/migrate` can read DATABASE_URL. `.env.local`
// is loaded first (higher precedence); dotenv won't overwrite already-set vars.
config({ path: ".env.local" });
config({ path: ".env" });

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
});
