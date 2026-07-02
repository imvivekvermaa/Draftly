import type { NextRequest } from "next/server";

import { deleteContentForUser } from "@/db/queries/content-queries";
import { errorResponse, successResponse } from "@/lib/api/api-response";
import { getAuthenticatedUser } from "@/lib/auth/require-user";
import { contentIdSchema } from "@/lib/validation/content-schemas";

/**
 * DELETE /api/content/[id]
 * Removes a saved content record owned by the authenticated user.
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return errorResponse("UNAUTHORIZED", "You must be signed in");
  }

  const { id } = await params;
  const parsedId = contentIdSchema.safeParse(id);
  if (!parsedId.success) {
    return errorResponse("VALIDATION_ERROR", "Invalid content id");
  }

  try {
    const deleted = await deleteContentForUser(user.id, parsedId.data);
    if (!deleted) {
      return errorResponse("NOT_FOUND", "Content not found");
    }
    return successResponse({ id: parsedId.data });
  } catch {
    return errorResponse("DATABASE_ERROR", "Failed to delete the content");
  }
}
