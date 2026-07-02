"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import type { GenerationResult } from "@/lib/types/content";
import { ContentActionsBar } from "./content-actions-bar";

interface ResultCardProps {
  result: GenerationResult;
  topic: string;
  isSaving: boolean;
  onSave: () => void;
  onDiscard: () => void;
}

/** Displays a freshly generated result with save / discard / copy / export. */
export function ResultCard({
  result,
  topic,
  isSaving,
  onSave,
  onDiscard,
}: ResultCardProps) {
  return (
    <Card>
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <CardHeader title="Generated content" />
        <ContentActionsBar text={result.output} topic={topic} />
      </div>

      <p className="whitespace-pre-wrap text-sm leading-relaxed text-neutral-800 dark:text-neutral-200">
        {result.output}
      </p>

      <div className="mt-6 flex gap-2">
        <Button onClick={onSave} isLoading={isSaving}>
          Save to history
        </Button>
        <Button variant="ghost" onClick={onDiscard} disabled={isSaving}>
          Discard
        </Button>
      </div>
    </Card>
  );
}
