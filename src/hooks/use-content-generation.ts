"use client";

import { useCallback, useState } from "react";

import { requestGeneration, saveContent } from "@/lib/api/content-client";
import { ApiRequestError, type GenerationResult } from "@/lib/types/content";
import type { GenerateContentInput } from "@/lib/validation/content-schemas";
import type { ContentRecord } from "@/lib/types/content";

interface UseContentGenerationResult {
  result: GenerationResult | null;
  fieldErrors: Record<string, string>;
  generalError: string | null;
  isGenerating: boolean;
  isSaving: boolean;
  generate: (input: GenerateContentInput) => Promise<void>;
  save: (input: GenerateContentInput) => Promise<ContentRecord | null>;
  clearResult: () => void;
}

/**
 * Owns the generate-then-save flow and its loading/error state, keeping the
 * dashboard component declarative. Validation errors from the API are exposed
 * per-field; everything else surfaces as a single general message.
 */
export function useContentGeneration(): UseContentGenerationResult {
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const applyError = useCallback((error: unknown) => {
    if (error instanceof ApiRequestError) {
      if (error.code === "VALIDATION_ERROR" && error.fields) {
        setFieldErrors(error.fields);
        return;
      }
      setGeneralError(error.message);
      return;
    }
    setGeneralError("Something went wrong. Please try again.");
  }, []);

  const generate = useCallback(
    async (input: GenerateContentInput) => {
      setIsGenerating(true);
      setFieldErrors({});
      setGeneralError(null);
      setResult(null);
      try {
        setResult(await requestGeneration(input));
      } catch (error) {
        applyError(error);
      } finally {
        setIsGenerating(false);
      }
    },
    [applyError],
  );

  const save = useCallback(
    async (input: GenerateContentInput): Promise<ContentRecord | null> => {
      if (!result) return null;
      setIsSaving(true);
      setGeneralError(null);
      try {
        const saved = await saveContent({ ...input, ...result });
        setResult(null);
        return saved;
      } catch (error) {
        // Save has no per-field UI, so surface everything as a general message
        // (rather than silently setting field errors that are never rendered).
        setGeneralError(
          error instanceof ApiRequestError
            ? error.message
            : "Something went wrong. Please try again.",
        );
        return null;
      } finally {
        setIsSaving(false);
      }
    },
    [result],
  );

  const clearResult = useCallback(() => setResult(null), []);

  return {
    result,
    fieldErrors,
    generalError,
    isGenerating,
    isSaving,
    generate,
    save,
    clearResult,
  };
}
