"use client";

import { useState } from "react";

import { Card, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";
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
  const [isResultDismissing, setIsResultDismissing] = useState(false);

  function handleGenerate(input: GenerateContentInput) {
    setIsResultDismissing(false);
    setLastInput(input);
    void generation.generate(input);
  }

  async function handleSave() {
    if (!lastInput) return;
    setIsResultDismissing(true);
    await waitForResultExit();
    const saved = await generation.save(lastInput);
    if (saved) history.prependRecord(saved);
    else setIsResultDismissing(false);
  }

  async function handleDiscard() {
    setIsResultDismissing(true);
    await waitForResultExit();
    generation.clearResult();
    setIsResultDismissing(false);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(20rem,0.95fr)] lg:items-start">
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

      </div>

      <div className="flex flex-col gap-6 lg:sticky lg:top-6">
        {generation.result && lastInput && (
          <div
            className={cn(
              "dashboard-result-enter transition-all duration-200 ease-out",
              isResultDismissing
                ? "translate-y-2 opacity-0"
                : "translate-y-0 opacity-100",
            )}
          >
            <ResultCard
              result={generation.result}
              topic={lastInput.topic}
              isSaving={generation.isSaving || isResultDismissing}
              onSave={handleSave}
              onDiscard={handleDiscard}
            />
          </div>
        )}

        <HistoryList
          history={history.history}
          isLoading={history.isLoading}
          error={history.error}
          onDelete={history.deleteRecord}
        />
      </div>
    </div>
  );
}

function waitForResultExit() {
  return new Promise((resolve) => window.setTimeout(resolve, 180));
}
