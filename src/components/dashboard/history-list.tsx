import { Card, CardHeader } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import type { ContentRecord } from "@/lib/types/content";
import { HistoryItem } from "./history-item";

interface HistoryListProps {
  history: ContentRecord[];
  isLoading: boolean;
  error: string | null;
}

/** Renders the user's saved content history with loading/empty/error states. */
export function HistoryList({ history, isLoading, error }: HistoryListProps) {
  return (
    <Card>
      <CardHeader
        title="History"
        description="Your previously generated and saved content"
      />

      {isLoading ? (
        <div className="flex justify-center py-8 text-neutral-400">
          <Spinner className="h-6 w-6" />
        </div>
      ) : error ? (
        <p className="py-6 text-center text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      ) : history.length === 0 ? (
        <p className="py-6 text-center text-sm text-neutral-400">
          No content yet. Generate something to get started.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {history.map((record) => (
            <HistoryItem key={record.id} record={record} />
          ))}
        </ul>
      )}
    </Card>
  );
}
