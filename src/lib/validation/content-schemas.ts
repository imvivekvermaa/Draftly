import { z } from "zod";

import {
  CONTENT_TONE_VALUES,
  CONTENT_TYPE_VALUES,
} from "@/lib/constants/content-options";

/**
 * Input required to generate a piece of content. Shared by the generate
 * endpoint and (extended) by the save endpoint so both validate identically.
 */
export const generateContentSchema = z.object({
  contentType: z.enum(CONTENT_TYPE_VALUES, {
    message: "Please select a valid content type",
  }),
  tone: z.enum(CONTENT_TONE_VALUES, {
    message: "Please select a valid tone",
  }),
  topic: z
    .string()
    .trim()
    .min(3, "Topic must be at least 3 characters")
    .max(300, "Topic must be 300 characters or fewer"),
});

/**
 * Input required to persist a generated result. Extends the generation input
 * with the produced output and the exact prompt that was sent to the model.
 */
export const saveContentSchema = generateContentSchema.extend({
  prompt: z.string().trim().min(1, "Prompt is required"),
  output: z
    .string()
    .trim()
    .min(1, "Output is required")
    .max(20000, "Output is unexpectedly large"),
});

export type GenerateContentInput = z.infer<typeof generateContentSchema>;
export type SaveContentInput = z.infer<typeof saveContentSchema>;
