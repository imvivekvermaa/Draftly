import type { NextRequest } from "next/server";

import {
  createContent,
  listContentByUser,
} from "@/db/queries/content-queries";
import {
  errorResponse,
  successResponse,
  validationErrorResponse,
} from "@/lib/api/api-response";
import { getAuthenticatedUser } from "@/lib/auth/require-user";
import { saveContentSchema } from "@/lib/validation/content-schemas";

/**
 * POST /api/content
 * Persists a generated result owned by the authenticated user.
 */
export async function POST(request: NextRequest) {
  const user = await getAuthenticatedUser();
  if (!user?.email) {
    return errorResponse("UNAUTHORIZED", "You must be signed in");
  }

  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return errorResponse("VALIDATION_ERROR", "Request body must be valid JSON");
  }

  const parsed = saveContentSchema.safeParse(rawBody);
  if (!parsed.success) {
    return validationErrorResponse(parsed.error);
  }

  try {
    const saved = await createContent(
      { id: user.id, email: user.email },
      parsed.data,
    );
    return successResponse(saved, 201);
  } catch {
    return errorResponse("DATABASE_ERROR", "Failed to save the content");
  }
}

/**
 * GET /api/content
 * Returns the authenticated user's content history, newest first.
 */
export async function GET() {
  const user = await getAuthenticatedUser();
  if (!user) {
    return errorResponse("UNAUTHORIZED", "You must be signed in");
  }

  try {
    const history = await listContentByUser(user.id);
    return successResponse(history);
  } catch {
    return errorResponse("DATABASE_ERROR", "Failed to load history");
  }
}
