import {
  CONTENT_TONE_LABELS,
  CONTENT_TYPE_LABELS,
} from "@/lib/constants/content-options";
import type { GenerateContentInput } from "@/lib/validation/content-schemas";

interface BuiltPrompt {
  systemPrompt: string;
  userPrompt: string;
}

/**
 * Turns validated form input into a system + user prompt pair. Kept separate
 * from the OpenAI call so prompt wording can evolve (and be unit-tested)
 * without touching provider/transport code.
 */
export function buildContentPrompt(input: GenerateContentInput): BuiltPrompt {
  const typeLabel = CONTENT_TYPE_LABELS[input.contentType];
  const toneLabel = CONTENT_TONE_LABELS[input.tone];

  const systemPrompt = [
    "You are an expert content assistant that writes clear, engaging,",
    "ready-to-publish copy. Return only the requested content with no",
    "preamble, explanations, or markdown code fences.",
  ].join(" ");

  const userPrompt = [
    `Write a ${toneLabel.toLowerCase()} ${typeLabel.toLowerCase()}`,
    `about the following topic: "${input.topic}".`,
    "Keep it concise, well-structured, and appropriate for the format.",
  ].join(" ");

  return { systemPrompt, userPrompt };
}
