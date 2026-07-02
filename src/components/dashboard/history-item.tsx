"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
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

const DELETE_ERROR_MESSAGE = "Couldn't delete this draft. Please try again.";

const DELETE_BUTTON_STYLES =
  "text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950/50 dark:hover:text-red-300";

interface HistoryItemProps {
  record: ContentRecord;
  onDelete: (id: string) => Promise<void>;
}

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

/** Icon-only delete trigger, shown beside Copy/Export on the card and modal. */
function DeleteIconButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      variant="ghost"
      onClick={onClick}
      aria-label="Delete draft"
      title="Delete"
      className={DELETE_BUTTON_STYLES}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4"
        aria-hidden="true"
      >
        <path d="M3 6h18" />
        <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
        <path d="M10 11v6" />
        <path d="M14 11v6" />
      </svg>
    </Button>
  );
}

/** A single saved content record. Clicking it opens the full draft in a modal. */
export function HistoryItem({ record, onDelete }: HistoryItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const titleId = `history-${record.id}-title`;
  const confirmTitleId = `history-${record.id}-delete-title`;

  function openConfirm() {
    setDeleteError(null);
    setIsConfirmOpen(true);
  }

  // While the confirmation is stacked on top, Esc/backdrop should dismiss only
  // it — keep the draft open behind so Cancel returns the user right where they
  // were.
  function closeDraft() {
    if (!isConfirmOpen) setIsOpen(false);
  }

  function closeConfirm() {
    // Don't allow dismissing mid-delete so the loading state can't be orphaned.
    if (!isDeleting) setIsConfirmOpen(false);
  }

  async function handleConfirmDelete() {
    setIsDeleting(true);
    setDeleteError(null);
    try {
      // On success the parent drops this record and the item unmounts, so
      // there is no state left to reset here.
      await onDelete(record.id);
    } catch {
      setDeleteError(DELETE_ERROR_MESSAGE);
      setIsDeleting(false);
    }
  }

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
      <div className="relative z-10 mt-3 flex w-fit items-center gap-2">
        <ContentActionsBar text={record.output} topic={record.topic} />
        <DeleteIconButton onClick={openConfirm} />
      </div>

      {/* Full draft */}
      <Modal isOpen={isOpen} onClose={closeDraft} labelledBy={titleId}>
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

        <div className="flex shrink-0 items-center gap-2 border-t border-neutral-200 px-6 py-4 dark:border-neutral-800">
          <ContentActionsBar text={record.output} topic={record.topic} />
          <DeleteIconButton onClick={openConfirm} />
        </div>
      </Modal>

      {/* Delete confirmation */}
      <Modal
        isOpen={isConfirmOpen}
        onClose={closeConfirm}
        labelledBy={confirmTitleId}
        maxWidthClassName="max-w-md"
      >
        <div className="p-6">
          <h2
            id={confirmTitleId}
            className="pr-8 text-lg font-semibold text-neutral-900 dark:text-neutral-50"
          >
            Delete this draft?
          </h2>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
            &ldquo;{record.topic}&rdquo; will be permanently deleted. This can&rsquo;t
            be undone.
          </p>

          {deleteError && (
            <p className="mt-3 text-sm text-red-600 dark:text-red-400" role="alert">
              {deleteError}
            </p>
          )}

          <div className="mt-6 flex justify-end gap-2">
            <Button
              variant="ghost"
              onClick={closeConfirm}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleConfirmDelete}
              isLoading={isDeleting}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </li>
  );
}
