import { z } from "zod";

/** Validates the body of the account-existence check endpoint. */
export const accountExistsSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("A valid email is required"),
});

export type AccountExistsInput = z.infer<typeof accountExistsSchema>;

/**
 * Sign-in / sign-up credentials, validated on the client before we call
 * Supabase so bad input gets a clear per-field message instead of a generic
 * provider error. Mirrors Supabase's own minimum password length (6).
 */
export const credentialsSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type CredentialsInput = z.infer<typeof credentialsSchema>;
