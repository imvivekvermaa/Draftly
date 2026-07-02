import { NextResponse } from "next/server";
import { z } from "zod";

/**
 * Stable, machine-readable error codes returned by every API route so the
 * frontend can branch on `error.code` instead of parsing messages.
 */
export type ApiErrorCode =
  | "VALIDATION_ERROR"
  | "UNAUTHORIZED"
  | "NOT_FOUND"
  | "AI_PROVIDER_ERROR"
  | "DATABASE_ERROR"
  | "INTERNAL_ERROR";

interface ApiErrorBody {
  error: {
    code: ApiErrorCode;
    message: string;
    /** Field-level messages, present only for validation failures. */
    fields?: Record<string, string>;
  };
}

const STATUS_BY_CODE: Record<ApiErrorCode, number> = {
  VALIDATION_ERROR: 422,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  AI_PROVIDER_ERROR: 502,
  DATABASE_ERROR: 500,
  INTERNAL_ERROR: 500,
};

export function successResponse<T>(data: T, status = 200) {
  return NextResponse.json({ data }, { status });
}

export function errorResponse(
  code: ApiErrorCode,
  message: string,
  fields?: Record<string, string>,
) {
  const body: ApiErrorBody = { error: { code, message, fields } };
  return NextResponse.json(body, { status: STATUS_BY_CODE[code] });
}

/** Flattens a ZodError into a `{ field: message }` map for the client. */
export function validationErrorResponse(error: z.ZodError) {
  const fields: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "form";
    if (!fields[key]) fields[key] = issue.message;
  }
  return errorResponse(
    "VALIDATION_ERROR",
    "Please correct the highlighted fields",
    fields,
  );
}
