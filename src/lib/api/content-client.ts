import type { GenerateContentInput } from "@/lib/validation/content-schemas";
import type { ContentRecord, GenerationResult } from "@/lib/types/content";
import { JSON_HEADERS, parseApiResponse } from "./parse-response";

export async function requestGeneration(
  input: GenerateContentInput,
): Promise<GenerationResult> {
  const response = await fetch("/api/generate", {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify(input),
  });
  return parseApiResponse<GenerationResult>(response);
}

export async function saveContent(
  input: GenerateContentInput & GenerationResult,
): Promise<ContentRecord> {
  const response = await fetch("/api/content", {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify(input),
  });
  return parseApiResponse<ContentRecord>(response);
}

export async function fetchHistory(): Promise<ContentRecord[]> {
  const response = await fetch("/api/content", { method: "GET" });
  return parseApiResponse<ContentRecord[]>(response);
}

export async function deleteContent(id: string): Promise<void> {
  const response = await fetch(`/api/content/${id}`, { method: "DELETE" });
  await parseApiResponse<{ id: string }>(response);
}
