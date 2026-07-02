import OpenAI from "openai";

import { serverEnv } from "@/lib/env";
import type { GenerateContentInput } from "@/lib/validation/content-schemas";
import { buildContentPrompt } from "./prompt-builder";

/** Raised when the model call fails, so the route can map it to a 502. */
export class AiProviderError extends Error {
  constructor(message: string, readonly cause?: unknown) {
    super(message);
    this.name = "AiProviderError";
  }
}

export interface GeneratedContent {
  output: string;
  prompt: string;
}

const openai = new OpenAI({ apiKey: serverEnv.OPENAI_API_KEY });

/**
 * Generates content for the given input and returns both the model output and
 * the exact user prompt used, so the caller can persist a reproducible record.
 */
export async function generateContent(
  input: GenerateContentInput,
): Promise<GeneratedContent> {
  const { systemPrompt, userPrompt } = buildContentPrompt(input);

  try {
    const completion = await openai.chat.completions.create({
      model: serverEnv.OPENAI_MODEL,
      temperature: 0.8,
      max_tokens: 800,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    });

    const output = completion.choices[0]?.message?.content?.trim();
    if (!output) {
      throw new AiProviderError("The model returned an empty response");
    }

    return { output, prompt: userPrompt };
  } catch (error) {
    if (error instanceof AiProviderError) throw error;
    throw new AiProviderError(
      "Failed to generate content from the AI provider",
      error,
    );
  }
}
