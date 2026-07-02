"use client";

import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { SelectField } from "@/components/ui/select-field";
import { TextInput } from "@/components/ui/text-input";
import {
  CONTENT_TONES,
  CONTENT_TYPES,
  type ContentToneValue,
  type ContentTypeValue,
} from "@/lib/constants/content-options";
import type { GenerateContentInput } from "@/lib/validation/content-schemas";

interface GenerationFormProps {
  isGenerating: boolean;
  fieldErrors: Record<string, string>;
  onGenerate: (input: GenerateContentInput) => void;
}

/** The content-generation form: content type, topic, tone, and submit. */
export function GenerationForm({
  isGenerating,
  fieldErrors,
  onGenerate,
}: GenerationFormProps) {
  const [contentType, setContentType] = useState<ContentTypeValue>(
    CONTENT_TYPES[0].value,
  );
  const [tone, setTone] = useState<ContentToneValue>(CONTENT_TONES[0].value);
  const [topic, setTopic] = useState("");

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    onGenerate({ contentType, tone, topic });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Content Type" htmlFor="contentType">
          <SelectField
            id="contentType"
            options={CONTENT_TYPES}
            value={contentType}
            onChange={(event) =>
              setContentType(event.target.value as ContentTypeValue)
            }
          />
        </FormField>
        <FormField label="Tone" htmlFor="tone">
          <SelectField
            id="tone"
            options={CONTENT_TONES}
            value={tone}
            onChange={(event) => setTone(event.target.value as ContentToneValue)}
          />
        </FormField>
      </div>

      <FormField label="Topic / Keyword" htmlFor="topic" error={fieldErrors.topic}>
        <TextInput
          id="topic"
          value={topic}
          onChange={(event) => setTopic(event.target.value)}
          placeholder="e.g. Benefits of remote work for startups"
        />
      </FormField>

      <Button type="submit" isLoading={isGenerating} className="self-start">
        {isGenerating ? "Generating..." : "Generate"}
      </Button>
    </form>
  );
}
