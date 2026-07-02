import type { NextRequest } from "next/server";

import { checkEmailExists } from "@/db/queries/auth-queries";
import {
  errorResponse,
  successResponse,
  validationErrorResponse,
} from "@/lib/api/api-response";
import { accountExistsSchema } from "@/lib/validation/auth-schemas";

/**
 * POST /api/auth/account-exists
 * Public (pre-auth) endpoint that reports whether an email is registered, so
 * the login form can distinguish "no account" from "wrong password".
 */
export async function POST(request: NextRequest) {
  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return errorResponse("VALIDATION_ERROR", "Request body must be valid JSON");
  }

  const parsed = accountExistsSchema.safeParse(rawBody);
  if (!parsed.success) {
    return validationErrorResponse(parsed.error);
  }

  try {
    const exists = await checkEmailExists(parsed.data.email);
    return successResponse({ exists });
  } catch {
    return errorResponse("DATABASE_ERROR", "Could not verify the account");
  }
}
