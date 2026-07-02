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
