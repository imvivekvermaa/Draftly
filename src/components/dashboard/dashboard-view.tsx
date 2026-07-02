"use client";

import { useState } from "react";

import { Card, CardHeader } from "@/components/ui/card";
import { useContentGeneration } from "@/hooks/use-content-generation";
import { useContentHistory } from "@/hooks/use-content-history";
import type { GenerateContentInput } from "@/lib/validation/content-schemas";
import { GenerationForm } from "./generation-form";
import { HistoryList } from "./history-list";
import { ResultCard } from "./result-card";

/**
 * Client-side dashboard: coordinates generation, saving, and history. The
 * last submitted input is retained so a generated result can be saved with
 * the exact type/tone/topic that produced it.
 */
export function DashboardView() {
  const generation = useContentGeneration();
  const history = useContentHistory();
  const [lastInput, setLastInput] = useState<GenerateContentInput | null>(null);

  function handleGenerate(input: GenerateContentInput) {
    setLastInput(input);
    void generation.generate(input);
  }

  async function handleSave() {
    if (!lastInput) return;
    const saved = await generation.save(lastInput);
    if (saved) history.prependRecord(saved);
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader
          title="Create content"
          description="Choose a type and tone, describe your topic, and generate."
        />
        <GenerationForm
          isGenerating={generation.isGenerating}
          fieldErrors={generation.fieldErrors}
          onGenerate={handleGenerate}
        />
      </Card>

      {generation.generalError && (
        <p
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300"
          role="alert"
        >
          {generation.generalError}
        </p>
      )}

      {generation.result && lastInput && (
        <ResultCard
          result={generation.result}
          topic={lastInput.topic}
          isSaving={generation.isSaving}
          onSave={handleSave}
          onDiscard={generation.clearResult}
        />
      )}

      <HistoryList
        history={history.history}
        isLoading={history.isLoading}
        error={history.error}
        onDelete={history.deleteRecord}
      />
    </div>
  );
}
