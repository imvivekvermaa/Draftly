"use client";

import { useState } from "react";

import { Modal } from "@/components/ui/modal";
import {
  CONTENT_TONE_LABELS,
  CONTENT_TYPE_LABELS,
} from "@/lib/constants/content-options";
import type { ContentRecord } from "@/lib/types/content";
import { formatTimestamp } from "@/lib/utils/format-date";
import { ContentActionsBar } from "./content-actions-bar";

const CHIP_STYLES =
  "rounded-full bg-neutral-100 px-2 py-0.5 font-medium text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300";

/** Type / tone / timestamp row, shared by the card preview and the modal. */
function MetaRow({ record }: { record: ContentRecord }) {
  return (
    <div className="flex flex-wrap items-center gap-2 text-xs">
      <span className={CHIP_STYLES}>
        {CONTENT_TYPE_LABELS[record.contentType]}
      </span>
      <span className={CHIP_STYLES}>{CONTENT_TONE_LABELS[record.tone]}</span>
      <span className="text-neutral-400">
        {formatTimestamp(record.createdAt)}
      </span>
    </div>
  );
}

/** A single saved content record. Clicking it opens the full draft in a modal. */
export function HistoryItem({ record }: { record: ContentRecord }) {
  const [isOpen, setIsOpen] = useState(false);
  const titleId = `history-${record.id}-title`;

  return (
    <li className="relative rounded-lg border border-neutral-200 p-4 transition-colors hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-800/50">
      {/* Stretched button makes the whole card clickable and focusable without
          nesting the action buttons inside another button. */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-haspopup="dialog"
        aria-label={`Open draft: ${record.topic}`}
        className="absolute inset-0 z-0 cursor-pointer rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-500"
      />

      {/* Card content sits above the button visually but is click-through, so
          clicking anywhere over it still triggers the card. */}
      <div className="pointer-events-none relative z-10">
        <div className="mb-2">
          <MetaRow record={record} />
        </div>
        <p className="mb-1 text-sm font-medium text-neutral-900 dark:text-neutral-100">
          {record.topic}
        </p>
        <p className="line-clamp-4 whitespace-pre-wrap text-sm text-neutral-600 dark:text-neutral-400">
          {record.output}
        </p>
      </div>

      {/* Actions stay above the stretched button and keep their own clicks. */}
      <div className="relative z-10 mt-3 w-fit">
        <ContentActionsBar text={record.output} topic={record.topic} />
      </div>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        labelledBy={titleId}
      >
        <div className="shrink-0 border-b border-neutral-200 px-6 pb-4 pr-12 pt-6 dark:border-neutral-800">
          <div className="mb-2">
            <MetaRow record={record} />
          </div>
          <h2
            id={titleId}
            className="text-lg font-semibold text-neutral-900 dark:text-neutral-50"
          >
            {record.topic}
          </h2>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4">
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-neutral-800 dark:text-neutral-200">
            {record.output}
          </p>
        </div>

        <div className="shrink-0 border-t border-neutral-200 px-6 py-4 dark:border-neutral-800">
          <ContentActionsBar text={record.output} topic={record.topic} />
        </div>
      </Modal>
    </li>
  );
}
