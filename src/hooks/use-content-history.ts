"use client";

import { useCallback, useEffect, useState } from "react";

import { deleteContent, fetchHistory } from "@/lib/api/content-client";
import type { ContentRecord } from "@/lib/types/content";

const LOAD_ERROR_MESSAGE = "Could not load your history. Please refresh.";

interface UseContentHistoryResult {
  history: ContentRecord[];
  isLoading: boolean;
  error: string | null;
  reload: () => Promise<void>;
  prependRecord: (record: ContentRecord) => void;
  deleteRecord: (id: string) => Promise<void>;
}

/**
 * Loads and maintains the user's content history. `prependRecord` lets the
 * dashboard show a freshly saved item instantly without a full refetch.
 */
export function useContentHistory(): UseContentHistoryResult {
  const [history, setHistory] = useState<ContentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Manual reload (e.g. retry button): explicitly re-enters the loading state.
  const reload = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setHistory(await fetchHistory());
    } catch {
      setError(LOAD_ERROR_MESSAGE);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load on mount. State updates happen after the await (not
  // synchronously in the effect body) and are guarded against unmount.
  useEffect(() => {
    let isActive = true;
    fetchHistory()
      .then((records) => {
        if (isActive) setHistory(records);
      })
      .catch(() => {
        if (isActive) setError(LOAD_ERROR_MESSAGE);
      })
      .finally(() => {
        if (isActive) setIsLoading(false);
      });
    return () => {
      isActive = false;
    };
  }, []);

  const prependRecord = useCallback((record: ContentRecord) => {
    setHistory((current) => [record, ...current]);
  }, []);

  // Deletes on the server first, then drops the row locally. Throws on failure
  // so the caller can surface an error and keep the item in place.
  const deleteRecord = useCallback(async (id: string) => {
    await deleteContent(id);
    setHistory((current) => current.filter((record) => record.id !== id));
  }, []);

  return { history, isLoading, error, reload, prependRecord, deleteRecord };
}
