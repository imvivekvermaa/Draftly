import type {
  ContentToneValue,
  ContentTypeValue,
} from "@/lib/constants/content-options";
import type { ApiErrorCode } from "@/lib/api/api-response";

/** A content record as returned to the browser (dates serialized to strings). */
export interface ContentRecord {
  id: string;
  userId: string;
  contentType: ContentTypeValue;
  tone: ContentToneValue;
  topic: string;
  prompt: string;
  output: string;
  createdAt: string;
}

/** Result of a generate call before it is saved. */
export interface GenerationResult {
  output: string;
  prompt: string;
}

/** Shape of a failed API response, thrown as a typed error client-side. */
export class ApiRequestError extends Error {
  constructor(
    readonly code: ApiErrorCode,
    message: string,
    readonly fields?: Record<string, string>,
  ) {
    super(message);
    this.name = "ApiRequestError";
  }
}
