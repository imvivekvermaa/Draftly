import {
  CONTENT_TONE_LABELS,
  CONTENT_TYPE_LABELS,
} from "@/lib/constants/content-options";
import type { ContentRecord } from "@/lib/types/content";
import { formatTimestamp } from "@/lib/utils/format-date";
import { ContentActionsBar } from "./content-actions-bar";

/** A single saved content record within the history list. */
export function HistoryItem({ record }: { record: ContentRecord }) {
  return (
    <li className="rounded-lg border border-neutral-200 p-4 dark:border-neutral-800">
      <div className="mb-2 flex flex-wrap items-center gap-2 text-xs">
        <span className="rounded-full bg-neutral-100 px-2 py-0.5 font-medium text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
          {CONTENT_TYPE_LABELS[record.contentType]}
        </span>
        <span className="rounded-full bg-neutral-100 px-2 py-0.5 font-medium text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
          {CONTENT_TONE_LABELS[record.tone]}
        </span>
        <span className="text-neutral-400">
          {formatTimestamp(record.createdAt)}
        </span>
      </div>

      <p className="mb-1 text-sm font-medium text-neutral-900 dark:text-neutral-100">
        {record.topic}
      </p>
      <p className="mb-3 line-clamp-4 whitespace-pre-wrap text-sm text-neutral-600 dark:text-neutral-400">
        {record.output}
      </p>

      <ContentActionsBar text={record.output} topic={record.topic} />
    </li>
  );
}
