import { ApiRequestError } from "@/lib/types/content";

/**
 * Parses a fetch Response from our API, returning the `data` payload or
 * throwing a typed `ApiRequestError` built from the `{ error }` envelope.
 * Shared by every browser-side API client so error handling stays uniform.
 */
export async function parseApiResponse<T>(response: Response): Promise<T> {
  const body = await response.json().catch(() => null);

  if (!response.ok || !body || "error" in body) {
    const error = body?.error;
    throw new ApiRequestError(
      error?.code ?? "INTERNAL_ERROR",
      error?.message ?? "Unexpected error. Please try again.",
      error?.fields,
    );
  }

  return body.data as T;
}

export const JSON_HEADERS = { "Content-Type": "application/json" } as const;
