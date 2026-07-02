import type { NextRequest } from "next/server";

import { AiProviderError, generateContent } from "@/lib/ai/content-generator";
import {
  errorResponse,
  successResponse,
  validationErrorResponse,
} from "@/lib/api/api-response";
import { getAuthenticatedUser } from "@/lib/auth/require-user";
import { generateContentSchema } from "@/lib/validation/content-schemas";

/**
 * POST /api/generate
 * Generates content from the AI provider. Does not persist anything; saving is
 * an explicit follow-up call to POST /api/content.
 */
export async function POST(request: NextRequest) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return errorResponse("UNAUTHORIZED", "You must be signed in");
  }

  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return errorResponse("VALIDATION_ERROR", "Request body must be valid JSON");
  }

  const parsed = generateContentSchema.safeParse(rawBody);
  if (!parsed.success) {
    return validationErrorResponse(parsed.error);
  }

  try {
    const result = await generateContent(parsed.data);
    return successResponse(result);
  } catch (error) {
    if (error instanceof AiProviderError) {
      return errorResponse(
        "AI_PROVIDER_ERROR",
        "The AI provider is currently unavailable. Please try again.",
      );
    }
    return errorResponse("INTERNAL_ERROR", "Something went wrong");
  }
}
